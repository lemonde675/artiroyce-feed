/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — notifications.js
   ══════════════════════════════════════════════════════════════════════
   Chargé par accueil.html, actualite_v1.html, offre_v1.html et fil-presse.html
   (après les scripts Firebase "compat").

   1) ENVOYER : ArNotif.envoyer({ dest, type, page, cibleId, extrait, unique })
      Enregistre une notification pour la personne "dest" (jamais pour soi-même) :
        utilisateurs/{dest}/notifications/{id}
      types : reaction | commentaire | reponse | abonne | candidature | partage
      pages : actualites | offres | filPresse | profil | statuts
      unique:true → une seule notification par personne et par publication
      (ex. J'aime retiré puis remis : pas de doublon).

   2) CLOCHE (seulement sur accueil.html, là où existe #notifBadge) :
      vrai nombre de non-lues sur la pastille rouge, liste façon
      Répert-Discussion, et un toucher amène directement à l'action.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArNotif) return;
  const fs = () => firebase.firestore();

  /* ───────── Mes infos (nom + mini-photo), lues une seule fois ───────── */
  let _moi = null;
  function miniPhoto(src) {
    // Réduit la photo de profil à 80 px pour que chaque notification reste légère.
    return new Promise(resolve => {
      if (!src) return resolve('');
      const img = new Image();
      img.onload = () => {
        try {
          const t = 80, c = document.createElement('canvas');
          const r = Math.max(t / img.width, t / img.height);
          c.width = t; c.height = t;
          const w = img.width * r, h = img.height * r;
          c.getContext('2d').drawImage(img, (t - w) / 2, (t - h) / 2, w, h);
          resolve(c.toDataURL('image/jpeg', 0.7));
        } catch (e) { resolve(''); }
      };
      img.onerror = () => resolve('');
      img.src = src;
    });
  }
  async function moi() {
    const u = firebase.auth().currentUser;
    if (!u) return null;
    if (_moi && _moi.uid === u.uid) return _moi;
    let nom = '', photo = '';
    try {
      const s = await fs().collection('utilisateurs').doc(u.uid).get();
      const d = s.data() || {};
      nom = ((d.prenom || '') + ' ' + (d.nom || '')).trim();
      photo = await miniPhoto(d.photoAvatar || '');
    } catch (e) {}
    _moi = { uid: u.uid, nom: nom || (u.email ? u.email.split('@')[0] : 'Quelqu’un'), photo };
    return _moi;
  }

  async function envoyer(o) {
    try {
      if (!o || !o.dest || o.dest === 'artiroyce_presse') return;
      const m = await moi();
      if (!m || o.dest === m.uid) return;
      const data = {
        type: o.type, page: o.page || '', cibleId: o.cibleId || '',
        extrait: String(o.extrait || '').slice(0, 120),
        auteurUid: m.uid, auteurNom: m.nom, auteurPhoto: m.photo,
        lu: false, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      const col = fs().collection('utilisateurs').doc(o.dest).collection('notifications');
      if (o.unique) await col.doc([o.type, o.page, o.cibleId || 'x', m.uid].join('_')).set(data);
      else await col.add(data);
    } catch (e) { console.warn('Notification non envoyée :', e); }
  }

  /* ═════════════════ CLOCHE (accueil.html) ═════════════════ */
  const PAGES = {
    actualites: { panel: 1, frame: 'actuFrame', nom: '📰 Actualités' },
    offres:     { panel: 4, frame: 'offreFrame', nom: '💼 Offres' },
    filPresse:  { panel: 7, frame: 'presseFrame', nom: '🗞️ Fil Presse' },
    statuts:    { panel: 2, frame: 'statutFrame', nom: '📢 Statuts' },
    profil:     { nom: '👤 Profil' }
  };
  const PHRASES = {
    reaction:    n => 'a réagi ' + (n.extrait || '👍') + ' à votre publication',
    commentaire: n => 'a commenté votre publication' + (n.extrait ? ' : « ' + n.extrait + ' »' : ''),
    reponse:     n => 'a répondu à votre commentaire' + (n.extrait ? ' : « ' + n.extrait + ' »' : ''),
    abonne:      () => 's’est abonné(e) à vous',
    candidature: () => 'a postulé à votre offre',
    partage:     () => 'a partagé votre publication'
  };
  // Statuts : même types, phrases adaptées (« votre statut »).
  const PHRASES_STATUT = {
    reaction:    n => 'a réagi ' + (n.extrait || '❤️') + ' à votre statut',
    commentaire: n => 'a répondu à votre statut' + (n.extrait ? ' : « ' + n.extrait + ' »' : '')
  };
  const COULEURS = ['#1a5c3a', '#0d3b66', '#5a2a6a', '#7a4a2a', '#2a6a5a', '#8b1e1e'];

  const css = `
  .ntf-ov{position:fixed;inset:0;z-index:3000;background:#f2f3f5;display:none;flex-direction:column;max-width:480px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif}
  .ntf-ov.open{display:flex}
  .ntf-hd{display:flex;align-items:center;gap:8px;padding:12px 14px;background:#fff;border-bottom:1px solid #e8e8e8}
  .ntf-back{background:none;border:none;font-size:26px;line-height:1;cursor:pointer;color:#1a1a1a;padding:0 6px}
  .ntf-titre{flex:1;font-size:17px;font-weight:800;color:#1a1a2e}
  .ntf-tout{background:none;border:none;color:#e63224;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}
  .ntf-liste{flex:1;overflow-y:auto;padding:12px 14px 30px}
  .ntf-sec{font-size:12px;font-weight:800;color:#a0a4b0;letter-spacing:.6px;margin:4px 6px 10px;text-transform:uppercase}
  .ntf-item{display:flex;align-items:center;gap:14px;background:#fff;border-radius:22px;padding:14px 16px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,.05);cursor:pointer;position:relative}
  .ntf-item.nonlu{background:#fff5f4;box-shadow:0 0 0 1.5px #ffd6d2 inset}
  .ntf-av{width:52px;height:52px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:800;overflow:hidden}
  .ntf-av img{width:100%;height:100%;object-fit:cover;display:block}
  .ntf-txt{flex:1;min-width:0}
  .ntf-nom{font-size:15.5px;font-weight:800;color:#1a1a2e}
  .ntf-act{font-size:14px;color:#555;line-height:1.35;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .ntf-meta{font-size:12px;color:#a0a4b0;margin-top:4px}
  .ntf-pt{width:11px;height:11px;border-radius:50%;background:#e63224;flex-shrink:0}
  .ntf-vide{text-align:center;color:#a0a4b0;font-size:14px;padding:60px 20px}
  .ntf-vide b{display:block;font-size:40px;margin-bottom:10px}
  `;
  function styles() {
    if (document.getElementById('ntfStyles')) return;
    const s = document.createElement('style'); s.id = 'ntfStyles'; s.textContent = css;
    document.head.appendChild(s);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function depuis(ts) {
    const ms = ts && ts.toMillis ? ts.toMillis() : Date.now();
    const s = Math.max(0, (Date.now() - ms) / 1000);
    if (s < 60) return 'à l’instant';
    if (s < 3600) return 'il y a ' + Math.floor(s / 60) + ' min';
    if (s < 86400) return 'il y a ' + Math.floor(s / 3600) + ' h';
    if (s < 7 * 86400) return 'il y a ' + Math.floor(s / 86400) + ' j';
    return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  let _uid = null, _liste = [], _stop = null;

  function majPastille() {
    const b = document.getElementById('notifBadge');
    if (!b) return;
    const n = _liste.filter(x => !x.lu).length;
    b.textContent = n > 9 ? '9+' : String(n);
    b.style.display = n ? 'flex' : 'none';
  }

  function construire() {
    if (document.getElementById('ntfOv')) return;
    styles();
    const ov = document.createElement('div');
    ov.className = 'ntf-ov'; ov.id = 'ntfOv';
    ov.innerHTML = '<div class="ntf-hd"><button class="ntf-back" id="ntfBack">‹</button>'
      + '<div class="ntf-titre">🔔 Notifications</div><button class="ntf-tout" id="ntfTout">Tout marquer comme lu</button></div>'
      + '<div class="ntf-liste" id="ntfListe"></div>';
    document.body.appendChild(ov);
    document.getElementById('ntfBack').onclick = fermer;
    document.getElementById('ntfTout').onclick = toutLu;
  }

  function rendre() {
    const el = document.getElementById('ntfListe');
    if (!el) return;
    if (!_liste.length) {
      el.innerHTML = '<div class="ntf-vide"><b>🔔</b>Aucune notification pour le moment.</div>';
      return;
    }
    el.innerHTML = '<div class="ntf-sec">Récentes</div>' + _liste.map((n, i) => {
      const nom = n.auteurNom || 'Quelqu’un';
      const ini = esc(nom[0].toUpperCase());
      const coul = COULEURS[nom.charCodeAt(0) % COULEURS.length];
      const av = n.auteurPhoto ? '<img src="' + esc(n.auteurPhoto) + '" alt="">' : ini;
      const phrase = ((n.page === 'statuts' && PHRASES_STATUT[n.type]) || PHRASES[n.type] || (() => 'a interagi avec vous'))(n);
      const page = PAGES[n.page] ? PAGES[n.page].nom : '';
      return '<div class="ntf-item' + (n.lu ? '' : ' nonlu') + '" data-i="' + i + '">'
        + '<div class="ntf-av" style="background:linear-gradient(135deg,' + coul + ',#0a0a2e)">' + av + '</div>'
        + '<div class="ntf-txt"><div class="ntf-nom">' + esc(nom) + '</div>'
        + '<div class="ntf-act">' + esc(phrase) + '</div>'
        + '<div class="ntf-meta">' + (page ? page + ' · ' : '') + depuis(n.createdAt) + '</div></div>'
        + (n.lu ? '' : '<span class="ntf-pt"></span>')
        + '</div>';
    }).join('');
    el.querySelectorAll('.ntf-item').forEach(it => it.onclick = () => ouvrirNotif(_liste[+it.dataset.i]));
  }

  function ouvrirListe() {
    construire(); rendre();
    document.getElementById('ntfOv').classList.add('open');
  }
  function fermer() { const o = document.getElementById('ntfOv'); if (o) o.classList.remove('open'); }

  function marquerLu(n) {
    if (!n || n.lu || !_uid) return;
    n.lu = true; majPastille();
    fs().collection('utilisateurs').doc(_uid).collection('notifications').doc(n.id).update({ lu: true }).catch(() => {});
  }
  function toutLu() {
    if (!_uid) return;
    const nonLues = _liste.filter(n => !n.lu);
    if (!nonLues.length) return;
    const lot = fs().batch();
    nonLues.forEach(n => { n.lu = true; lot.update(fs().collection('utilisateurs').doc(_uid).collection('notifications').doc(n.id), { lu: true }); });
    lot.commit().catch(() => {});
    majPastille(); rendre();
  }

  // Amène directement à l'action : bon onglet, bonne publication, commentaires ouverts.
  function ouvrirNotif(n) {
    if (!n) return;
    marquerLu(n);
    fermer();
    if (n.type === 'abonne' || !PAGES[n.page] || !PAGES[n.page].frame) {
      if (n.auteurUid && window.goUserProfile) window.goUserProfile(n.auteurUid);
      return;
    }
    const p = PAGES[n.page];
    if (window.goToPanel) window.goToPanel(p.panel);
    const msg = { type: 'ouvrirPublication', id: n.cibleId, commentaires: ['commentaire', 'reponse', 'candidature'].indexOf(n.type) !== -1 };
    // La page peut encore être en train de se charger : on renvoie la demande
    // jusqu'à ce qu'elle confirme (au plus ~12 secondes).
    let essais = 0;
    clearInterval(window.__ntfRelance);
    window.__ntfRelance = setInterval(() => {
      essais++;
      const f = document.getElementById(p.frame);
      try { if (f && f.contentWindow) f.contentWindow.postMessage(msg, '*'); } catch (e) {}
      if (essais > 24) clearInterval(window.__ntfRelance);
    }, 500);
  }
  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'publicationOuverte') clearInterval(window.__ntfRelance);
  });

  function demarrerCloche(uid) {
    if (_stop) { _stop(); _stop = null; }
    _uid = uid; _liste = []; majPastille();
    if (!uid) return;
    _stop = fs().collection('utilisateurs').doc(uid).collection('notifications')
      .orderBy('createdAt', 'desc').limit(40)
      .onSnapshot(snap => {
        _liste = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
        majPastille();
        if (document.getElementById('ntfOv') && document.getElementById('ntfOv').classList.contains('open')) rendre();
      }, err => console.warn('Notifications indisponibles :', err));
  }

  // La cloche ne démarre que sur la page qui l'affiche (accueil.html).
  function initCloche() {
    if (!document.getElementById('notifBadge')) return;
    firebase.auth().onAuthStateChanged(u => demarrerCloche(u ? u.uid : null));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCloche);
  else initCloche();

  window.ArNotif = { envoyer, ouvrirListe, fermer };
})();
