/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — visionneuse.js
   ══════════════════════════════════════════════════════════════════════
   Visionneuse d'UNE publication (photo ou vidéo), utilisée par profil.html
   et elite_v1.html. Comme sur l'Accueil, à droite de la publication :
   J'aime, Je n'aime pas, commentaires, partager, vues.
   Les chiffres sont LES MÊMES que sur l'Accueil (mêmes emplacements) :
     utilisateurs/{uid}/portfolio/{id}            → likes, dislikes, comments, shares, vues
     utilisateurs/{uid}                           → totaux (likesAccueil…) pour les étoiles
     utilisateurs/{moi}/mesReactionsPubs/{uid__id} → ma réaction
     utilisateurs/{uid}/portfolio/{id}/commentaires → les commentaires
   La plus ancienne publication d'une personne garde aussi les anciens compteurs
   (« heritage »), exactement comme sur l'Accueil.

   ✕, la touche retour du téléphone, ou quitter l'onglet : la vidéo S'ARRÊTE.

   Utilisation :
     ArVisionneuse.ouvrir({
       api,        // accès à la base (voir plus bas, fourni par la page)
       uid,        // propriétaire de la publication
       pseudo,     // « @prenom »
       item,       // { id, type:'video'|'photo', url, likes, dislikes, comments, shares, vues, heritage }
       haut,       // (facultatif) place à laisser en haut, en px
       enregistrer // (facultatif) fonction du bouton « Enregistrer »
     });
   api = { uid(), get(chemin), set(chemin, data), del(chemin), inc(chemin, {champ: n}),
           add(chemin, data) → id, listen(chemin, cb, err) → arrêt, ts() }
   (chemin = tableau : ['utilisateurs', uid, 'portfolio', id])
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArVisionneuse) return;

  function TR(t, v) {
    if (window.trApp) return window.trApp(t, v);
    if (v) for (const k in v) t = t.split('{' + k + '}').join(v[k]);
    return t;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function court(n) {
    n = Number(n) || 0;
    if (n < 1000) return String(n);
    if (n < 1000000) return (Math.floor(n / 100) / 10).toFixed(1).replace('.', ',').replace(',0', '') + 'k';
    return (Math.floor(n / 100000) / 10).toFixed(1).replace('.', ',').replace(',0', '') + 'M';
  }
  function depuis(ts) {
    const ms = ts && ts.toMillis ? ts.toMillis() : Date.now();
    const min = Math.floor(Math.max(0, Date.now() - ms) / 60000);
    if (min < 1) return TR("à l'instant");
    if (min < 60) return TR('il y a {n}min', { n: min });
    const h = Math.floor(min / 60);
    if (h < 24) return TR('il y a {n}h', { n: h });
    return TR('il y a {n}j', { n: Math.floor(h / 24) });
  }
  function toast(msg) {
    let t = document.getElementById('arVisToast');
    if (!t) { t = document.createElement('div'); t.id = 'arVisToast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._f); t._f = setTimeout(() => t.classList.remove('on'), 2400);
  }

  const ICO = {
    like: '<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>',
    dislike: '<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>',
    comm: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    vue: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    dl: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    play: '<polygon points="7,4 20,12 7,20" fill="#fff"/>'
  };
  const svg = (k) => '<svg class="arv-ico" viewBox="0 0 24 24">' + ICO[k] + '</svg>';

  const css = `
  .arv-ov{position:fixed;inset:0;z-index:4000;background:#000;display:none;overflow:hidden;font-family:'Segoe UI',Arial,sans-serif}
  .arv-ov.open{display:block}
  .arv-media{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center}
  .arv-media video,.arv-media img{width:100%;height:100%;object-fit:contain;display:block;background:#000}
  .arv-pause{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;pointer-events:none}
  .arv-pause svg{width:28px;height:28px;margin-left:4px}
  .arv-ov.en-pause .arv-pause{display:flex}
  .arv-fermer{position:absolute;right:14px;width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,.2);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3}
  .arv-pseudo{position:absolute;left:14px;color:#fff;font-weight:800;font-size:15px;text-shadow:0 1px 4px rgba(0,0,0,.9);z-index:3;max-width:60%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .arv-actions{position:absolute;right:10px;bottom:90px;display:flex;flex-direction:column;align-items:center;gap:14px;z-index:3}
  .arv-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .arv-rond{width:40px;height:40px;border-radius:50%;background:rgba(8,15,55,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 3px 10px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .2s}
  .arv-btn:active .arv-rond{transform:scale(1.2)}
  .arv-rond.on{background:rgba(230,50,36,.92);box-shadow:0 3px 12px rgba(230,50,36,.5)}
  .arv-rond.on .arv-ico{fill:#fff}
  .arv-btn.fixe{cursor:default}
  .arv-ico{width:19px;height:19px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .arv-n{font-size:11.5px;font-weight:800;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.9);line-height:1}
  .arv-fond{position:absolute;inset:0;background:rgba(0,0,0,.45);display:none;align-items:flex-end;justify-content:center;z-index:5}
  .arv-fond.open{display:flex}
  .arv-feuille{background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;max-height:72%;display:flex;flex-direction:column;animation:arvMonte .22s ease}
  @keyframes arvMonte{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .arv-poignee{width:40px;height:4px;border-radius:2px;background:#ddd;margin:10px auto 4px}
  .arv-titre{font-size:15px;font-weight:800;color:#1a1a2e;text-align:center;padding:4px 16px 10px;border-bottom:1px solid #f0f0f0}
  .arv-liste{flex:1;overflow-y:auto;padding:12px 16px}
  .arv-c{display:flex;gap:10px;margin-bottom:16px;align-items:flex-start}
  .arv-c-av{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff}
  .arv-c-corps{flex:1;min-width:0}
  .arv-c-nom{font-size:13px;font-weight:700;color:#555}
  .arv-c-nom i{font-style:normal;font-size:11px;color:#1a5276;margin-left:4px}
  .arv-c-txt{font-size:14px;color:#222;line-height:1.45;margin:2px 0 5px;word-break:break-word}
  .arv-c-bas{display:flex;align-items:center;gap:14px;font-size:12px;color:#8e8e8e;flex-wrap:wrap}
  .arv-c-bas b{cursor:pointer}
  .arv-c-bas b.aime{color:#e63224}
  .arv-rep{margin-left:30px;padding-left:12px;border-left:2px solid #eceef1;margin-bottom:10px}
  .arv-voir{font-size:12px;font-weight:700;color:#65676b;cursor:pointer;margin-bottom:10px}
  .arv-vide{text-align:center;color:#999;font-size:12.5px;padding:24px}
  .arv-indic{display:none;align-items:center;justify-content:space-between;background:#f0f2f5;border-radius:10px;padding:6px 10px;margin:0 16px 8px;font-size:12px;color:#555}
  .arv-indic.on{display:flex}
  .arv-indic span:last-child{cursor:pointer;font-weight:800;padding:0 4px}
  .arv-saisie{display:flex;gap:8px;padding:10px 16px 14px;border-top:1px solid #eee}
  .arv-saisie input{flex:1;min-width:0;border:1px solid #e8ecf0;border-radius:20px;padding:9px 14px;font-size:14px;outline:none;font-family:inherit}
  .arv-saisie button{background:#e63224;color:#fff;border:none;border-radius:20px;padding:9px 16px;font-size:14px;font-weight:700;cursor:pointer}
  #arVisToast{position:fixed;left:50%;bottom:40px;transform:translateX(-50%);background:rgba(20,20,30,.92);color:#fff;font-size:13px;font-weight:600;padding:10px 16px;border-radius:20px;z-index:4100;opacity:0;pointer-events:none;transition:opacity .2s;max-width:86vw;text-align:center}
  #arVisToast.on{opacity:1}
  `;
  const PALETTE = ['#e63224', '#27a945', '#1a5276', '#8e44ad', '#d35400', '#16a085', '#c0392b', '#2980b9'];

  let O = null;          // ouverture en cours
  let ov = null;         // l'écran
  let entreeHisto = false;
  const vuesSession = new Set();
  const commAimes = {};

  function construire() {
    if (ov) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    ov = document.createElement('div');
    ov.className = 'arv-ov'; ov.id = 'arVisOv';
    ov.setAttribute('translate', 'no');
    ov.innerHTML =
      '<div class="arv-media" id="arvMedia"></div>'
      + '<div class="arv-pause">' + '<svg viewBox="0 0 24 24">' + ICO.play + '</svg></div>'
      + '<div class="arv-pseudo" id="arvPseudo"></div>'
      + '<button class="arv-fermer" id="arvFermer" aria-label="Fermer">✕</button>'
      + '<div class="arv-actions" id="arvActions"></div>'
      + '<div class="arv-fond" id="arvFond"><div class="arv-feuille">'
      +   '<div class="arv-poignee"></div><div class="arv-titre" id="arvTitre"></div>'
      +   '<div class="arv-liste" id="arvListe"></div>'
      +   '<div class="arv-indic" id="arvIndic"><span id="arvIndicTxt"></span><span id="arvIndicX">✕</span></div>'
      +   '<div class="arv-saisie"><input id="arvInput" autocomplete="off"><button id="arvEnvoyer">➤</button></div>'
      + '</div></div>';
    document.body.appendChild(ov);
    document.getElementById('arvFermer').onclick = () => fermerParBouton();
    document.getElementById('arvFond').onclick = (e) => { if (e.target.id === 'arvFond') fermerCommentaires(); };
    document.getElementById('arvIndicX').onclick = annulerReponse;
    document.getElementById('arvEnvoyer').onclick = envoyerCommentaire;
    document.getElementById('arvInput').addEventListener('keydown', e => { if (e.key === 'Enter') envoyerCommentaire(); });
  }

  /* ───────── Ouvrir / fermer ───────── */
  function ouvrir(o) {
    if (!o || !o.item || !o.api) return;
    construire();
    if (O) arreter();
    const it = o.item, her = it.heritage || null;
    const nb = (c) => (Number(it[c]) || 0) + (her ? (Number(her[c]) || 0) : 0);
    O = {
      api: o.api, uid: o.uid, pseudo: o.pseudo || '', item: it, enregistrer: o.enregistrer || null,
      cle: o.uid + '__' + it.id,
      n: { likes: nb('likes'), dislikes: nb('dislikes'), comments: nb('comments'), shares: nb('shares'), vues: Number(it.vues) || 0 },
      reaction: null, arrets: []
    };
    const haut = Math.max(0, Number(o.haut) || 0);
    document.getElementById('arvMedia').style.top = haut + 'px';
    document.getElementById('arvFermer').style.top = (haut + 14) + 'px';
    const ps = document.getElementById('arvPseudo');
    ps.style.top = (haut + 22) + 'px'; ps.textContent = O.pseudo;

    const zone = document.getElementById('arvMedia');
    if (it.type === 'video') {
      zone.innerHTML = '<video src="' + esc(it.url) + '" autoplay loop playsinline></video>';
      const v = zone.querySelector('video');
      v.addEventListener('click', () => { if (v.paused) v.play().catch(() => {}); else v.pause(); });
      v.addEventListener('pause', () => ov.classList.add('en-pause'));
      v.addEventListener('play', () => ov.classList.remove('en-pause'));
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
    } else {
      zone.innerHTML = '<img src="' + esc(it.url) + '" alt="">';
    }
    ov.classList.remove('en-pause');
    dessinerBoutons();
    ov.classList.add('open');
    if (!entreeHisto) { try { history.pushState({ arVis: 1 }, ''); entreeHisto = true; } catch (e) {} }
    chargerMaReaction();
    compterVue();
  }

  // Coupe tout : vidéo, écoute des commentaires.
  function arreter() {
    if (!ov) return;
    const v = ov.querySelector('.arv-media video');
    if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {} }
    document.getElementById('arvMedia').innerHTML = '';
    if (O) { O.arrets.forEach(f => { try { f(); } catch (e) {} }); O.arrets = []; }
    document.getElementById('arvFond').classList.remove('open');
  }
  function fermer() {
    if (!ov || !ov.classList.contains('open')) return;
    arreter();
    ov.classList.remove('open');
    O = null;
  }
  // ✕ : on ferme et on retire notre entrée d'historique (le retour suivant reste normal).
  function fermerParBouton() {
    fermer();
    if (entreeHisto) { entreeHisto = false; try { history.back(); } catch (e) {} }
  }
  // Touche retour du téléphone : d'abord les commentaires, puis la visionneuse.
  window.addEventListener('popstate', function () {
    if (!entreeHisto) return;
    if (ov && document.getElementById('arvFond').classList.contains('open')) {
      fermerCommentaires(true);
      try { history.pushState({ arVis: 1 }, ''); } catch (e) {}
      return;
    }
    entreeHisto = false;
    fermer();
  });
  // Téléphone verrouillé / application en arrière-plan : la vidéo se met en pause.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' || !ov) return;
    const v = ov.querySelector('.arv-media video'); if (v && !v.paused) v.pause();
  });
  // Onglet quitté (page dans l'Accueil) : on ferme.
  window.addEventListener('message', e => { if (e.data && e.data.type === 'panelCache') fermerParBouton(); });
  window.addEventListener('pagehide', fermer);

  /* ───────── Boutons ───────── */
  function dessinerBoutons() {
    const r = O.reaction;
    const b = (cle, ico, n, on, fixe) => '<div class="arv-btn' + (fixe ? ' fixe' : '') + '" data-b="' + cle + '">'
      + '<div class="arv-rond' + (on ? ' on' : '') + '">' + svg(ico) + '</div>'
      + (n === null ? '' : '<span class="arv-n">' + court(n) + '</span>') + '</div>';
    const a = document.getElementById('arvActions');
    a.innerHTML = b('like', 'like', O.n.likes, r && r.type === 'like')
      + b('dislike', 'dislike', O.n.dislikes, r && r.type === 'dislike')
      + b('comm', 'comm', O.n.comments)
      + b('share', 'share', O.n.shares)
      + b('vue', 'vue', O.n.vues, false, true)
      + (O.enregistrer ? b('dl', 'dl', null) : '');
    a.querySelectorAll('.arv-btn').forEach(el => el.onclick = (e) => {
      e.stopPropagation();
      const k = el.dataset.b;
      if (k === 'like' || k === 'dislike') reagir(k);
      else if (k === 'comm') ouvrirCommentaires();
      else if (k === 'share') partager();
      else if (k === 'dl' && O.enregistrer) O.enregistrer();
    });
  }

  const CHAMP_TOTAL = { likes: 'likesAccueil', dislikes: 'dislikesAccueil', comments: 'commentsAccueil', shares: 'partagesAccueil', vues: 'vuesAccueil' };
  // surPub false : seulement le total de la personne (anciens compteurs).
  function majCompteurs(deltas, surPub) {
    const pub = {}, tot = {};
    Object.keys(deltas).forEach(c => {
      if (!deltas[c]) return;
      if (surPub !== false) pub[c] = deltas[c];
      tot[CHAMP_TOTAL[c]] = deltas[c];
    });
    const p = [];
    if (Object.keys(pub).length) p.push(O.api.inc(['utilisateurs', O.uid, 'portfolio', O.item.id], pub).catch(e => console.warn('Compteur publication', e)));
    if (Object.keys(tot).length) p.push(O.api.inc(['utilisateurs', O.uid], tot).catch(e => console.warn('Compteur total', e)));
    return Promise.all(p);
  }

  async function chargerMaReaction() {
    const moi = O.api.uid(), ouvert = O;
    if (!moi || moi === O.uid) return;
    try {
      const d = await O.api.get(['utilisateurs', moi, 'mesReactionsPubs', O.cle]);
      let r = d && d.type ? { type: d.type, ancienne: false } : null;
      if (!r && O.item.heritage) {
        const a = await O.api.get(['utilisateurs', O.uid, 'reactionsAccueil', moi]);
        if (a && a.type) r = { type: a.type, ancienne: true };
      }
      if (O !== ouvert) return;
      O.reaction = r; dessinerBoutons();
    } catch (e) {}
  }

  let occupe = false;
  async function reagir(type) {
    const moi = O.api.uid();
    if (!moi) { toast(TR('Connecte-toi pour réagir')); return; }
    if (moi === O.uid) { toast(TR('Tu ne peux pas réagir à ta propre publication')); return; }
    if (occupe) return; occupe = true;
    const champ = (t) => t === 'like' ? 'likes' : 'dislikes';
    const ancien = O.reaction, ouvert = O;
    try {
      if (ancien) {
        if (ancien.ancienne) {
          await O.api.del(['utilisateurs', O.uid, 'reactionsAccueil', moi]).catch(() => {});
          await majCompteurs({ [champ(ancien.type)]: -1 }, false);
        } else {
          await O.api.del(['utilisateurs', moi, 'mesReactionsPubs', O.cle]).catch(() => {});
          await majCompteurs({ [champ(ancien.type)]: -1 });
        }
        O.n[champ(ancien.type)] = Math.max(0, O.n[champ(ancien.type)] - 1);
        O.reaction = null;
      }
      if (!ancien || ancien.type !== type) {
        await O.api.set(['utilisateurs', moi, 'mesReactionsPubs', O.cle], { cible: O.uid, pub: O.item.id, type: type, createdAt: O.api.ts() });
        await majCompteurs({ [champ(type)]: 1 });
        O.n[champ(type)]++;
        O.reaction = { type: type, ancienne: false };
        if (type === 'like') notifier({ type: 'reaction', extrait: '👍', unique: true });
      }
      if (O === ouvert) dessinerBoutons();
    } catch (e) { console.error(e); toast(TR('Erreur')); }
    occupe = false;
  }

  async function partager() {
    const base = location.origin + location.pathname.replace(/[^/]*$/, '');
    const url = base + 'accueil.html?pub=' + encodeURIComponent(O.item.id) + '&uid=' + encodeURIComponent(O.uid);
    const moi = O.api.uid(), ouvert = O;
    const compter = () => {
      if (!moi || moi === ouvert.uid) return;
      majCompteurs({ shares: 1 }); ouvert.n.shares++; if (O === ouvert) dessinerBoutons();
    };
    if (navigator.share) {
      try { await navigator.share({ title: 'ArtiRoyce · ' + O.pseudo, url: url }); compter(); } catch (e) {}
    } else {
      try { await navigator.clipboard.writeText(url); toast(TR('Lien copié !')); compter(); } catch (e) { toast(url); }
    }
  }

  // Une vue par publication et par visite, jamais pour soi-même (comme l'Accueil).
  function compterVue() {
    const moi = O.api.uid();
    if (!moi || moi === O.uid) return;
    let deja = vuesSession.has(O.cle);
    try { deja = deja || sessionStorage.getItem('arVue_' + O.cle) === '1'; sessionStorage.setItem('arVue_' + O.cle, '1'); } catch (e) {}
    vuesSession.add(O.cle);
    if (deja) return;
    majCompteurs({ vues: 1 });
    O.n.vues++; dessinerBoutons();
  }

  // Notification 🔔 au propriétaire (même format que l'Accueil : elle ouvre la publication).
  function notifier(o) {
    const N = window.ArNotif || (function () { try { return window.parent !== window && window.parent.ArNotif; } catch (e) { return null; } })();
    const data = Object.assign({ dest: O.uid, page: 'profil', cibleId: O.cle }, o);
    if (N && N.envoyer) { N.envoyer(data); return; }
    // Page sans notifications.js (ex. profil.html) : on écrit la notification nous-mêmes.
    (async () => {
      try {
        const moi = O.api.uid();
        if (!moi || moi === O.uid) return;
        const m = (await O.api.get(['utilisateurs', moi])) || {};
        const doc = {
          type: o.type, page: 'profil', cibleId: data.cibleId, extrait: String(o.extrait || '').slice(0, 120),
          commentId: o.commentId || '', auteurUid: moi,
          auteurNom: ((m.prenom || '') + ' ' + (m.nom || '')).trim() || 'Quelqu’un', auteurPhoto: '',
          lu: false, createdAt: O.api.ts()
        };
        if (o.unique) await O.api.set(['utilisateurs', O.uid, 'notifications', [o.type, 'profil', data.cibleId, moi].join('_')], doc);
        else await O.api.add(['utilisateurs', O.uid, 'notifications'], doc);
      } catch (e) { console.warn('Notification non envoyée', e); }
    })();
  }

  /* ───────── Commentaires ───────── */
  let reponseA = null;
  function annulerReponse() { reponseA = null; document.getElementById('arvIndic').classList.remove('on'); }
  function fermerCommentaires(depuisRetour) {
    document.getElementById('arvFond').classList.remove('open');
    if (O) { O.arrets.forEach(f => { try { f(); } catch (e) {} }); O.arrets = []; }
  }
  function ouvrirCommentaires() {
    const ouvert = O;
    annulerReponse();
    document.getElementById('arvTitre').textContent = TR('Commentaires · {p}', { p: O.pseudo });
    document.getElementById('arvInput').placeholder = TR('Ajouter un commentaire…');
    const liste = document.getElementById('arvListe');
    liste.innerHTML = '<div class="arv-vide">' + TR('Chargement…') + '</div>';
    document.getElementById('arvFond').classList.add('open');
    O.arrets.forEach(f => { try { f(); } catch (e) {} }); O.arrets = [];
    let pub = [], anc = [];
    const prets = { pub: false, anc: !O.item.heritage };
    const dessiner = () => {
      if (O !== ouvert || !prets.pub || !prets.anc) return;
      O.n.comments = pub.length + anc.length; dessinerBoutons();
      rendreListe(pub.concat(anc));
    };
    const erreur = (e) => { console.error(e); liste.innerHTML = '<div class="arv-vide" style="color:#e63224">' + TR('Impossible de charger les commentaires.') + '</div>'; };
    O.arrets.push(O.api.listen(['utilisateurs', O.uid, 'portfolio', O.item.id, 'commentaires'], docs => {
      pub = docs.map(d => Object.assign(d, { _col: 'pub' })); prets.pub = true; dessiner();
    }, erreur));
    if (O.item.heritage) O.arrets.push(O.api.listen(['utilisateurs', O.uid, 'commentairesAccueil'], docs => {
      anc = docs.map(d => Object.assign(d, { _col: 'anc' })); prets.anc = true; dessiner();
    }, erreur));
  }

  function rendreListe(tous) {
    const liste = document.getElementById('arvListe');
    const ms = (c) => (c.createdAt && c.createdAt.toMillis) ? c.createdAt.toMillis() : Date.now();
    const parent = {}; tous.forEach(c => { parent[c.id] = c.parentId || null; });
    const racine = (id) => { let x = id, g = 0; while (parent[x] && g++ < 20) x = parent[x]; return x; };
    const principaux = tous.filter(c => !c.parentId).sort((a, b) => ms(b) - ms(a));
    const reps = {};
    tous.filter(c => c.parentId).sort((a, b) => ms(a) - ms(b)).forEach(c => { (reps[racine(c.id)] = reps[racine(c.id)] || []).push(c); });
    if (!principaux.length) { liste.innerHTML = '<div class="arv-vide">' + TR("Aucun commentaire pour l'instant.") + '</div>'; return; }
    // On garde les réponses déjà dépliées ouvertes quand la liste se met à jour.
    const deplies = new Set(Array.from(liste.querySelectorAll('.arv-rep[data-ouvert]')).map(z => z.dataset.r));
    const html = (c, rac) => {
      const ini = (c.nom || '?')[0].toUpperCase();
      const statut = c.uid === O.uid ? TR('Créateur') : (c.verifie ? TR('Professionnel') : TR('Visiteur'));
      const ville = String(c.ville || '').split(',')[0].split('/')[0].trim();
      return '<div class="arv-c" data-cid="' + esc(c.id) + '">'
        + '<div class="arv-c-av" style="background:' + PALETTE[ini.charCodeAt(0) % PALETTE.length] + '">' + esc(ini) + '</div>'
        + '<div class="arv-c-corps"><div class="arv-c-nom">' + esc(c.nom || TR('Anonyme')) + '<i>· ' + statut + '</i></div>'
        + '<div class="arv-c-txt">' + esc(c.texte) + '</div>'
        + '<div class="arv-c-bas"><span>' + (ville ? esc(ville) + ' · ' : '') + depuis(c.createdAt) + '</span>'
        + '<b class="' + (commAimes[c.id] ? 'aime' : '') + '" data-aime="' + esc(c.id) + '" data-col="' + c._col + '">' + (commAimes[c.id] ? TR('Aimé') : TR("J'aime")) + '</b>'
        + '<b data-rep="' + esc(rac) + '" data-nom="' + esc(c.nom || '') + '">' + TR('Répondre') + '</b>'
        + (c.likes ? '<span style="margin-left:auto">' + c.likes + ' ❤️</span>' : '')
        + '</div></div></div>';
    };
    liste.innerHTML = principaux.map(c => {
      const r = reps[c.id] || [];
      if (!r.length) return html(c, c.id);
      const ouvert = deplies.has(c.id);
      return html(c, c.id) + '<div class="arv-rep" data-r="' + esc(c.id) + '"' + (ouvert ? ' data-ouvert="1"' : '') + '>'
        + (ouvert ? r.map(x => html(x, c.id)).join('')
                  : '<div class="arv-voir">' + TR(r.length > 1 ? 'Afficher {n} réponses ▾' : 'Afficher {n} réponse ▾', { n: r.length }) + '</div>')
        + '</div>';
    }).join('');
    liste.querySelectorAll('.arv-voir').forEach(v => v.onclick = () => {
      const z = v.parentNode; z.dataset.ouvert = '1';
      z.innerHTML = (reps[z.dataset.r] || []).map(x => html(x, z.dataset.r)).join('');
      brancher(z);
    });
    brancher(liste);
  }
  function brancher(zone) {
    zone.querySelectorAll('[data-aime]').forEach(b => b.onclick = () => aimerCommentaire(b.dataset.aime, b.dataset.col, b));
    zone.querySelectorAll('[data-rep]').forEach(b => b.onclick = () => {
      reponseA = b.dataset.rep;
      document.getElementById('arvIndicTxt').textContent = TR('Réponse à {nom}', { nom: b.dataset.nom });
      document.getElementById('arvIndic').classList.add('on');
      document.getElementById('arvInput').focus();
    });
  }
  async function aimerCommentaire(id, col, bouton) {
    if (!O.api.uid()) { toast(TR('Connecte-toi pour réagir')); return; }
    const chemin = col === 'anc'
      ? ['utilisateurs', O.uid, 'commentairesAccueil', id]
      : ['utilisateurs', O.uid, 'portfolio', O.item.id, 'commentaires', id];
    const d = commAimes[id] ? -1 : 1;
    if (d < 0) delete commAimes[id]; else commAimes[id] = true;
    if (bouton) { bouton.classList.toggle('aime', d > 0); bouton.textContent = d > 0 ? TR('Aimé') : TR("J'aime"); }
    try { await O.api.inc(chemin, { likes: d }); } catch (e) { console.error(e); }
  }
  async function envoyerCommentaire() {
    const moi = O && O.api.uid();
    if (!moi) { toast(TR('Connecte-toi pour commenter')); return; }
    const input = document.getElementById('arvInput');
    const texte = input.value.trim();
    if (!texte) return;
    input.value = '';
    const parentId = reponseA;
    const ouvert = O;
    try {
      const m = (await O.api.get(['utilisateurs', moi])) || {};
      const id = await O.api.add(['utilisateurs', O.uid, 'portfolio', O.item.id, 'commentaires'], {
        uid: moi, nom: m.prenom || 'Anonyme', texte: texte,
        verifie: m.statut === 'verifie', ville: m.ville || m.adresse || '',
        parentId: parentId || null, createdAt: O.api.ts(), likes: 0
      });
      annulerReponse();
      if (O !== ouvert) return;
      notifier({ type: 'commentaire', extrait: texte, commentId: id || '' });
      await majCompteurs({ comments: 1 });
    } catch (e) { console.error(e); toast(TR('Erreur envoi commentaire')); }
  }

  window.ArVisionneuse = { ouvrir, fermer: fermerParBouton, estOuverte: () => !!(ov && ov.classList.contains('open')) };
})();
