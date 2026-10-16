// Fonction Vercel : /api/sfu
// Relais sécurisé vers Cloudflare Realtime SFU, pour les APPELS DE GROUPE (jusqu'à 50 personnes).
// Le secret de l'application SFU reste ici, côté serveur : il n'est jamais envoyé au navigateur.
// Seuls les utilisateurs CONNECTÉS à ArtiRoyce peuvent l'utiliser (jeton Firebase vérifié).
//
// Variables d'environnement requises (Vercel → Settings → Environment Variables) :
//   SFU_APP_ID      identifiant de l'application « Serverless SFU » Cloudflare (App ID)
//   SFU_APP_TOKEN   jeton secret de cette application (App Secret / API token)
//
// Le navigateur envoie : { action, sessionId, body }  avec l'en-tête Authorization: Bearer <jeton Firebase>
//   action = 'newSession' | 'tracksNew' | 'renegotiate' | 'close'

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyBS_6CJN7Fu50pMu98sjuRxQetUcLu9l9w';
const BASE = 'https://rtc.live.cloudflare.com/v1/apps/';

// Vérifie que le jeton Firebase est valide (sans aucune bibliothèque à installer).
async function utilisateurConnecte(req) {
  const h = req.headers['authorization'] || '';
  const jeton = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!jeton) return null;
  try {
    const rep = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: jeton })
    });
    if (!rep.ok) return null;
    const d = await rep.json();
    return (d.users && d.users[0] && d.users[0].localId) || null;
  } catch (e) { return null; }
}

function lireCorps(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  if (typeof req.body === 'string') { try { return Promise.resolve(JSON.parse(req.body)); } catch (e) { return Promise.resolve({}); } }
  return new Promise(function (resolve) {
    let s = '';
    req.on('data', function (c) { s += c; });
    req.on('end', function () { try { resolve(JSON.parse(s || '{}')); } catch (e) { resolve({}); } });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const appId = process.env.SFU_APP_ID;
  const token = process.env.SFU_APP_TOKEN;
  if (!appId || !token) return res.status(500).json({ error: 'not_configured' });

  const uid = await utilisateurConnecte(req);
  if (!uid) return res.status(401).json({ error: 'not_signed_in' });

  const corps = await lireCorps(req);
  const action = corps.action;
  const sessionId = String(corps.sessionId || '');
  if (action !== 'newSession' && !/^[A-Za-z0-9_-]{8,200}$/.test(sessionId)) {
    return res.status(400).json({ error: 'bad_session' });
  }

  let url, methode;
  if (action === 'newSession') { url = BASE + encodeURIComponent(appId) + '/sessions/new'; methode = 'POST'; }
  else if (action === 'tracksNew') { url = BASE + encodeURIComponent(appId) + '/sessions/' + sessionId + '/tracks/new'; methode = 'POST'; }
  else if (action === 'renegotiate') { url = BASE + encodeURIComponent(appId) + '/sessions/' + sessionId + '/renegotiate'; methode = 'PUT'; }
  else if (action === 'close') { url = BASE + encodeURIComponent(appId) + '/sessions/' + sessionId + '/tracks/close'; methode = 'PUT'; }
  else return res.status(400).json({ error: 'bad_action' });

  try {
    const options = { method: methode, headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } };
    if (corps.body && action !== 'newSession') options.body = JSON.stringify(corps.body);
    const rep = await fetch(url, options);
    const texte = await rep.text();
    let data; try { data = JSON.parse(texte); } catch (e) { data = { error: 'upstream_invalid' }; }
    return res.status(rep.ok ? 200 : 502).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'upstream_error' });
  }
};
