// Fonction Vercel : /api/turn
// Demande à Cloudflare des identifiants TURN TEMPORAIRES pour un appel.
// La clé secrète (TURN_KEY_API_TOKEN) reste ici, côté serveur : elle n'est jamais
// envoyée au navigateur. Seuls des identifiants valables quelques heures le sont.
//
// Variables d'environnement requises (Vercel → Paramètres → Variables d'environnement) :
//   TURN_KEY_ID         identifiant de la clé TURN Cloudflare
//   TURN_KEY_API_TOKEN  jeton secret de la clé TURN Cloudflare

const DUREE_VALIDITE_SECONDES = 4 * 60 * 60; // 4 h : largement plus long qu'un appel

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const keyId = process.env.TURN_KEY_ID;
  const token = process.env.TURN_KEY_API_TOKEN;
  if (!keyId || !token) {
    return res.status(500).json({ error: 'not_configured' });
  }

  try {
    const rep = await fetch(
      'https://rtc.live.cloudflare.com/v1/turn/keys/' + encodeURIComponent(keyId) + '/credentials/generate-ice-servers',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ttl: DUREE_VALIDITE_SECONDES })
      }
    );
    if (!rep.ok) {
      return res.status(502).json({ error: 'upstream_' + rep.status });
    }
    const data = await rep.json();
    let liste = Array.isArray(data.iceServers) ? data.iceServers : (data.iceServers ? [data.iceServers] : []);

    // Les adresses sur le port 53 expirent souvent dans les navigateurs (doc Cloudflare) : on les retire.
    liste = liste
      .map(function (s) {
        const urls = (Array.isArray(s.urls) ? s.urls : [s.urls]).filter(function (u) {
          return typeof u === 'string' && !/:53(\?|$)/.test(u);
        });
        return Object.assign({}, s, { urls: urls });
      })
      .filter(function (s) { return s.urls.length > 0; });

    if (!liste.length) {
      return res.status(502).json({ error: 'empty' });
    }
    return res.status(200).json({ iceServers: liste });
  } catch (e) {
    return res.status(502).json({ error: 'upstream_error' });
  }
};
