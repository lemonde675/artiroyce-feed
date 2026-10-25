/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — photo-profil.js
   ══════════════════════════════════════════════════════════════════════
   Partagé par profil.html (professionnels) et profil_visiteur.html.
   1) Écran « Aperçu de la photo de profil » quand on change sa photo :
      commentaire facultatif, Public / Privé, choix des pages où publier
      (Actualités cochée par défaut, Offres, Fil Presse).
   2) Visionneuse plein écran : photo entière et bien cadrée, on glisse à
      gauche / à droite pour voir les anciennes photos de profil.

   Stockage :
   - utilisateurs/{uid}.photoAvatar     : petite version (rapide partout).
   - utilisateurs/{uid}.photoHistory[]  : petites versions + date, privé,
                                          commentaire, grandId.
   - utilisateurs/{uid}/photosProfil/{grandId} : grande version (visionneuse).
     Si cette écriture est refusée, tout continue avec la petite version.
   - Publications (si Public) : publications / offres / fil_presse.
   ══════════════════════════════════════════════════════════════════════ */
import { getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = () => getFirestore(getApp());
const MAX_HISTORIQUE = 8;
const LIBELLE_POST = '📷 a changé sa photo de profil';

/* ───────────── Styles (injectés une seule fois) ───────────── */
const css = `
.ppa-ov{position:fixed;inset:0;background:#fff;z-index:2000;display:none;flex-direction:column;max-width:480px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif}
.ppa-ov.open{display:flex}
.ppa-hd{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #eee}
.ppa-back{background:none;border:none;font-size:26px;line-height:1;cursor:pointer;color:#1a1a1a;padding:0 6px}
.ppa-titre{flex:1;text-align:center;font-size:16px;font-weight:800;margin-right:34px}
.ppa-body{flex:1;overflow-y:auto;padding:0 0 16px}
.ppa-fond{background:linear-gradient(#f4f4f6,#e9e9ee);padding:18px 0;display:flex;justify-content:center}
.ppa-rond{width:min(78vw,340px);height:min(78vw,340px);border-radius:50%;overflow:hidden;background:#ddd;box-shadow:0 4px 18px rgba(0,0,0,.15)}
.ppa-rond img{width:100%;height:100%;object-fit:cover;display:block}
.ppa-zone{padding:14px 16px 0}
.ppa-com{width:100%;min-height:80px;border:1.5px solid #ddd;border-radius:12px;padding:12px;font-size:14px;font-family:inherit;resize:none;box-sizing:border-box}
.ppa-com:focus{outline:none;border-color:#27a945}
.ppa-lbl{font-size:12px;font-weight:800;color:#555;margin:16px 0 8px;text-transform:uppercase;letter-spacing:.4px}
.ppa-vis{display:flex;gap:8px}
.ppa-vis button{flex:1;padding:11px 6px;border-radius:12px;border:1.5px solid #ddd;background:#f5f5f5;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;color:#333}
.ppa-vis button.on{background:#e8f5e9;border-color:#27a945;color:#1b7a33}
.ppa-ou{display:flex;flex-direction:column;gap:8px}
.ppa-ou label{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid #eee;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer}
.ppa-ou input{width:20px;height:20px;accent-color:#27a945}
.ppa-ou.off{opacity:.4;pointer-events:none}
.ppa-note{font-size:12px;color:#888;margin-top:8px;line-height:1.4}
.ppa-ft{padding:12px 16px calc(12px + env(safe-area-inset-bottom));border-top:1px solid #eee}
.ppa-ok{width:100%;padding:14px;border:none;border-radius:12px;background:#1877f2;color:#fff;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit}
.ppa-ok:disabled{opacity:.6}
.ppa-sous{text-align:center;font-size:12.5px;color:#666;margin-top:8px}

.ppv-ov{position:fixed;inset:0;background:#000;z-index:2100;display:none;flex-direction:column;touch-action:pan-y}
.ppv-ov.open{display:flex}
.ppv-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;color:#fff;font-family:'Segoe UI',Arial,sans-serif}
.ppv-x{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:20px;cursor:pointer}
.ppv-cpt{font-size:14px;font-weight:700;opacity:.85}
.ppv-scene{flex:1;position:relative;overflow:hidden}
.ppv-piste{position:absolute;inset:0;display:flex;transition:transform .28s ease}
.ppv-case{flex:0 0 100%;display:flex;align-items:center;justify-content:center}
.ppv-case img{width:100%;height:100%;object-fit:contain;display:block}
.ppv-fl{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.18);border:none;color:#fff;font-size:22px;cursor:pointer;display:none}
.ppv-fl.g{left:10px}.ppv-fl.d{right:10px}
@media (min-width:768px){.ppv-fl{display:block}}
.ppv-info{color:#fff;padding:12px 16px calc(16px + env(safe-area-inset-bottom));font-family:'Segoe UI',Arial,sans-serif}
.ppv-date{font-size:12.5px;opacity:.7}
.ppv-txt{font-size:14.5px;margin-top:4px;line-height:1.45;white-space:pre-wrap}
.ppv-prive{display:inline-block;font-size:11px;font-weight:700;background:rgba(255,255,255,.15);border-radius:10px;padding:2px 8px;margin-left:6px}
.history-thumb{cursor:pointer}
.history-actuelle{font-size:9.5px;font-weight:800;color:#27a945;margin-top:4px}
.history-prive{position:absolute;top:4px;left:4px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;border-radius:8px;padding:1px 5px}
`;
function injecterStyles(){
  if (document.getElementById('ppStyles')) return;
  const s = document.createElement('style'); s.id = 'ppStyles'; s.textContent = css;
  document.head.appendChild(s);
}

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function compresser(file, taille, qualite){
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(new Error('Lecture échouée'));
    r.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide'));
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h) { if (w > taille) { h = Math.round(h * taille / w); w = taille; } }
        else { if (h > taille) { w = Math.round(w * taille / h); h = taille; } }
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', qualite));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

function formatDate(iso){
  try { return new Date(iso).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }); }
  catch(e){ return ''; }
}

/* ═════════════════ 1) ÉCRAN D'APERÇU ═════════════════ */
let _apercu = null; // { file, petite, grande, ctx, prive }

function construireApercu(){
  if (document.getElementById('ppaOv')) return;
  const ov = document.createElement('div');
  ov.className = 'ppa-ov'; ov.id = 'ppaOv';
  ov.innerHTML = `
    <div class="ppa-hd"><button class="ppa-back" id="ppaBack">‹</button><div class="ppa-titre">Aperçu de la photo de profil</div></div>
    <div class="ppa-body">
      <div class="ppa-fond"><div class="ppa-rond"><img id="ppaImg" alt=""></div></div>
      <div class="ppa-zone">
        <textarea class="ppa-com" id="ppaCom" maxlength="500" placeholder="Commentez cette photo (facultatif)"></textarea>
        <div class="ppa-lbl">Qui peut la voir ?</div>
        <div class="ppa-vis">
          <button type="button" id="ppaPublic" class="on">🌍 Public</button>
          <button type="button" id="ppaPrive">🔒 Privé</button>
        </div>
        <div id="ppaOuBloc">
        <div class="ppa-lbl">Publier aussi dans</div>
        <div class="ppa-ou" id="ppaOu">
          <label><input type="checkbox" value="actualites" checked> 📰 Actualités</label>
          <label><input type="checkbox" value="offres"> 💼 Offres</label>
          <label><input type="checkbox" value="filPresse"> 🗞️ Fil Presse</label>
        </div>
        </div>
        <div class="ppa-note" id="ppaKyc" style="display:none;color:#b26a00">⏳ Votre compte est en cours de vérification : votre nouvelle photo s'affiche sur votre profil, mais elle sera publiée dans Actualités, Offres ou Fil Presse seulement une fois votre KYC validé.</div>
        <div class="ppa-note" id="ppaNote"></div>
      </div>
    </div>
    <div class="ppa-ft">
      <button class="ppa-ok" id="ppaOk">Mettre à jour</button>
      <div class="ppa-sous" id="ppaSous">Votre photo de profil est publique.</div>
    </div>`;
  document.body.appendChild(ov);
  document.getElementById('ppaBack').onclick = fermerApercu;
  document.getElementById('ppaPublic').onclick = () => choisirVisibilite(false);
  document.getElementById('ppaPrive').onclick = () => choisirVisibilite(true);
  document.getElementById('ppaOk').onclick = validerApercu;
}

function choisirVisibilite(prive){
  if (!_apercu) return;
  _apercu.prive = prive;
  document.getElementById('ppaPublic').classList.toggle('on', !prive);
  document.getElementById('ppaPrive').classList.toggle('on', prive);
  document.getElementById('ppaOu').classList.toggle('off', prive);
  document.getElementById('ppaNote').textContent = prive
    ? 'Privé : votre photo change, elle reste visible seulement par vous dans votre historique, et rien n\'est publié.'
    : '';
  document.getElementById('ppaSous').textContent = prive
    ? 'Seul vous verrez cette photo dans votre historique.'
    : 'Votre photo de profil est publique.';
}

// Compte professionnel dont le KYC n'est pas encore validé par l'administrateur.
function proEnAttente(u){
  u = u || {};
  return u.role !== 'visiteur' && u.statut !== 'verifie';
}

function fermerApercu(){
  document.getElementById('ppaOv').classList.remove('open');
  _apercu = null;
}

async function ouvrirApercu(file, ctx){
  injecterStyles(); construireApercu();
  const toast = ctx.toast || (() => {});
  try {
    toast('⏳ Préparation de la photo…');
    const [petite, grande] = await Promise.all([compresser(file, 250, 0.5), compresser(file, 900, 0.72)]);
    _apercu = { petite, grande, ctx, prive: false };
    document.getElementById('ppaImg').src = grande;
    document.getElementById('ppaCom').value = '';
    document.querySelectorAll('#ppaOu input').forEach(i => i.checked = (i.value === 'actualites'));
    choisirVisibilite(false);
    // Professionnel pas encore validé (KYC) : la photo change, mais rien n'est publié
    // dans Actualités / Offres / Fil Presse tant que le compte n'est pas vérifié.
    const attente = proEnAttente(ctx.userData);
    _apercu.attente = attente;
    document.getElementById('ppaOuBloc').style.display = attente ? 'none' : '';
    document.getElementById('ppaKyc').style.display = attente ? 'block' : 'none';
    const b = document.getElementById('ppaOk'); b.disabled = false; b.textContent = 'Mettre à jour';
    document.getElementById('ppaOv').classList.add('open');
  } catch(e) { toast('⚠ Erreur : ' + e.message, 'err'); }
}

async function validerApercu(){
  if (!_apercu) return;
  const { petite, grande, ctx, prive } = _apercu;
  const toast = ctx.toast || (() => {});
  const uid = ctx.uid, u = ctx.userData || {};
  const commentaire = document.getElementById('ppaCom').value.trim();
  const cibles = (prive || _apercu.attente || proEnAttente(ctx.userData)) ? [] : Array.from(document.querySelectorAll('#ppaOu input:checked')).map(i => i.value);
  const btn = document.getElementById('ppaOk');
  btn.disabled = true; btn.textContent = 'Mise à jour…';
  const dateIso = new Date().toISOString();

  try {
    // 1. Grande version, à part (ne ralentit pas le reste de l'application).
    let grandId = null;
    try {
      const ref = await addDoc(collection(db(), 'utilisateurs', uid, 'photosProfil'),
        { url: grande, date: dateIso, prive, commentaire, createdAt: serverTimestamp() });
      grandId = ref.id;
    } catch(e) { console.warn('Grande version non enregistrée (petite version utilisée) :', e); }

    // 2. Historique : la nouvelle photo en tête ; l'ancienne y est ajoutée si elle n'y était pas.
    const ancien = Array.isArray(u.photoHistory) ? u.photoHistory.slice() : [];
    const histo = [{ url: petite, date: dateIso, prive, commentaire, grandId }];
    if (u.photoAvatar && !ancien.some(h => h.url === u.photoAvatar)) {
      histo.push({ url: u.photoAvatar, date: dateIso });
    }
    const nouvelHisto = histo.concat(ancien).slice(0, MAX_HISTORIQUE);
    await updateDoc(doc(db(), 'utilisateurs', uid), { photoAvatar: petite, photoHistory: nouvelHisto });

    // 3. Publications dans les pages choisies (seulement si Public).
    const nom = ((u.prenom || '') + ' ' + (u.nom || '')).trim() || u.nom || u.prenom || 'Membre ArtiRoyce';
    const estPro = u.role && u.role !== 'visiteur';
    // Indicatif du pays, avec ou sans +229 (même règle que les pages Actualités / Offres / Fil Presse).
    const pays = (function(t){
      const brut = String(t || '').trim(); if (!brut) return '';
      const c = brut.replace(/\D/g, '');
      if (brut.startsWith('+')) return c.slice(0, 3);
      if (c.startsWith('00')) return c.slice(2, 5);
      if (c.startsWith('0') || c.length <= 10) return '229';
      return c.slice(0, 3);
    })(u.telephone);
    const texte = commentaire ? (LIBELLE_POST + ' · ' + commentaire) : LIBELLE_POST;
    const echecs = [];
    let pubRef = null; // publication créée : sert de grande version de secours pour la visionneuse
    for (const c of cibles) {
      try {
        if (c === 'actualites') {
          const r = await addDoc(collection(db(), 'publications'), {
            type: 'galerie', photoProfil: true, categorie: '', texte, images: [grande],
            auteurNom: nom, auteurUid: uid, auteurVerifie: !!estPro,
            ville: u.ville || '', paysPrefixe: pays,
            createdAt: serverTimestamp(), likes: 0, partages: 0
          });
          if (!pubRef) pubRef = { col: 'publications', id: r.id, champ: 'images' };
        } else if (c === 'offres') {
          const r = await addDoc(collection(db(), 'offres'), {
            type: 'texte', photoProfil: true, titre: LIBELLE_POST, texte, imageUrl: grande, dureeDays: 30,
            auteurNom: nom, auteurUid: uid, auteurVerifie: !!estPro,
            ville: u.ville || '', paysPrefixe: pays,
            createdAt: serverTimestamp(), likes: 0, partages: 0
          });
          if (!pubRef) pubRef = { col: 'offres', id: r.id, champ: 'imageUrl' };
        } else if (c === 'filPresse') {
          const r = await addDoc(collection(db(), 'fil_presse'), {
            uid, prenom: u.prenom || nom, metier: u.metier || '', photoAvatar: petite,
            roleLbl: estPro ? 'Professionnel' : 'Visiteur', journalNom: '', ville: u.ville || '',
            paysPrefixe: pays, official: false, verifie: true, type: 'actu', photoProfil: true,
            texte, images: [grande], videoUrl: '', likes: 0, comments: 0, deletedAt: null,
            createdAt: serverTimestamp()
          });
          if (!pubRef) pubRef = { col: 'fil_presse', id: r.id, champ: 'images' };
        }
      } catch(e) { console.error('Publication ' + c + ' impossible :', e); echecs.push(c); }
    }

    // On note la publication dans l'historique (secours si la grande version n'a pas pu être lue).
    if (pubRef) {
      nouvelHisto[0].pubRef = pubRef;
      try { await updateDoc(doc(db(), 'utilisateurs', uid), { photoHistory: nouvelHisto }); } catch(e) {}
    }
    u.photoAvatar = petite; u.photoHistory = nouvelHisto;
    fermerApercu();
    if (ctx.onFait) ctx.onFait(petite, nouvelHisto);
    if (echecs.length) toast('✅ Photo mise à jour (publication impossible dans : ' + echecs.join(', ') + ')', 'err');
    else toast(prive ? '✅ Photo mise à jour (privée)' : (cibles.length ? '✅ Photo mise à jour et publiée !' : '✅ Photo mise à jour !'), 'ok');
  } catch(e) {
    btn.disabled = false; btn.textContent = 'Mettre à jour';
    toast('⚠ Erreur : ' + e.message, 'err');
  }
}

/* ═════════════════ 2) VISIONNEUSE PLEIN ÉCRAN ═════════════════ */
let _vis = { liste: [], i: 0, uid: null };
const _grandes = {}; // grandId -> url grande version (mémoire)

function construireVisionneuse(){
  if (document.getElementById('ppvOv')) return;
  const ov = document.createElement('div');
  ov.className = 'ppv-ov'; ov.id = 'ppvOv';
  ov.innerHTML = `
    <div class="ppv-hd"><span class="ppv-cpt" id="ppvCpt"></span><button class="ppv-x" id="ppvX">✕</button></div>
    <div class="ppv-scene" id="ppvScene">
      <div class="ppv-piste" id="ppvPiste"></div>
      <button class="ppv-fl g" id="ppvG">‹</button><button class="ppv-fl d" id="ppvD">›</button>
    </div>
    <div class="ppv-info"><div class="ppv-date" id="ppvDate"></div><div class="ppv-txt" id="ppvTxt"></div></div>`;
  document.body.appendChild(ov);
  document.getElementById('ppvX').onclick = fermerVisionneuse;
  document.getElementById('ppvG').onclick = () => allerA(_vis.i - 1);
  document.getElementById('ppvD').onclick = () => allerA(_vis.i + 1);

  // Glisser à gauche / à droite
  const scene = document.getElementById('ppvScene'), piste = document.getElementById('ppvPiste');
  let x0 = null, y0 = null, dx = 0, horizontal = null;
  scene.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; horizontal = null; piste.style.transition = 'none'; }, { passive: true });
  scene.addEventListener('touchmove', e => {
    if (x0 === null) return;
    dx = e.touches[0].clientX - x0;
    const dy = e.touches[0].clientY - y0;
    if (horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) horizontal = Math.abs(dx) > Math.abs(dy);
    if (horizontal) piste.style.transform = 'translateX(calc(' + (-_vis.i * 100) + '% + ' + dx + 'px))';
  }, { passive: true });
  const fin = () => {
    if (x0 === null) return;
    piste.style.transition = '';
    const seuil = scene.offsetWidth * 0.18;
    if (horizontal && dx < -seuil) allerA(_vis.i + 1);
    else if (horizontal && dx > seuil) allerA(_vis.i - 1);
    else allerA(_vis.i);
    x0 = null;
  };
  scene.addEventListener('touchend', fin, { passive: true });
  scene.addEventListener('touchcancel', fin, { passive: true });
  document.addEventListener('keydown', e => {
    if (!document.getElementById('ppvOv').classList.contains('open')) return;
    if (e.key === 'ArrowLeft') allerA(_vis.i - 1);
    if (e.key === 'ArrowRight') allerA(_vis.i + 1);
    if (e.key === 'Escape') fermerVisionneuse();
  });
}

async function chargerGrande(k){
  const it = _vis.liste[k];
  if (!it || !_vis.uid) return;
  const cle = it.grandId || (it.pubRef && it.pubRef.id);
  if (!cle) return;
  if (!_grandes[cle]) {
    // 1) grande version enregistrée à part
    if (it.grandId) {
      try {
        const s = await getDoc(doc(db(), 'utilisateurs', _vis.uid, 'photosProfil', it.grandId));
        if (s.exists() && s.data().url) _grandes[cle] = s.data().url;
      } catch(e) {}
    }
    // 2) secours : l'image de la publication faite au même moment
    if (!_grandes[cle] && it.pubRef) {
      try {
        const s = await getDoc(doc(db(), it.pubRef.col, it.pubRef.id));
        if (s.exists()) {
          const v = s.data()[it.pubRef.champ];
          const url = Array.isArray(v) ? v[0] : v;
          if (url) _grandes[cle] = url;
        }
      } catch(e) {}
    }
  }
  const img = document.querySelector('#ppvPiste .ppv-case[data-k="' + k + '"] img');
  if (img && _grandes[cle]) img.src = _grandes[cle];
}

function allerA(k){
  const n = _vis.liste.length;
  if (!n) return;
  _vis.i = Math.max(0, Math.min(n - 1, k));
  document.getElementById('ppvPiste').style.transform = 'translateX(' + (-_vis.i * 100) + '%)';
  const it = _vis.liste[_vis.i];
  document.getElementById('ppvCpt').textContent = n > 1 ? (_vis.i + 1) + ' / ' + n : '';
  document.getElementById('ppvDate').innerHTML = (it.actuelle ? 'Photo de profil actuelle' : (it.date ? 'Photo de profil · ' + esc(formatDate(it.date)) : 'Photo de profil'))
    + (it.prive ? '<span class="ppv-prive">🔒 Privé</span>' : '');
  document.getElementById('ppvTxt').textContent = it.commentaire || '';
  document.getElementById('ppvG').style.visibility = _vis.i > 0 ? 'visible' : 'hidden';
  document.getElementById('ppvD').style.visibility = _vis.i < n - 1 ? 'visible' : 'hidden';
  [_vis.i, _vis.i + 1, _vis.i - 1].forEach(chargerGrande);
}

function ouvrirVisionneuse(liste, index, uid){
  if (!liste || !liste.length) return;
  injecterStyles(); construireVisionneuse();
  _vis = { liste, i: 0, uid };
  document.getElementById('ppvPiste').innerHTML = liste.map((it, k) =>
    '<div class="ppv-case" data-k="' + k + '"><img src="' + esc(_grandes[it.grandId || (it.pubRef && it.pubRef.id)] || it.url) + '" alt=""></div>').join('');
  document.getElementById('ppvOv').classList.add('open');
  document.getElementById('ppvPiste').style.transition = 'none';
  allerA(index || 0);
  requestAnimationFrame(() => { document.getElementById('ppvPiste').style.transition = ''; });
}

function fermerVisionneuse(){ const o = document.getElementById('ppvOv'); if (o) o.classList.remove('open'); }

/* ═════════════ Liste visible de l'historique (même règle sur les deux pages) ═════════════
   - La photo actuelle d'abord (même si elle date d'avant ce système).
   - Les visiteurs d'un profil ne voient jamais les photos privées ni supprimées. */
function listeVisible(userData, estProprio){
  const h = Array.isArray(userData && userData.photoHistory) ? userData.photoHistory : [];
  const avatar = userData && userData.photoAvatar;
  const items = h.map((e, idx) => Object.assign({}, e, { idx, actuelle: !!avatar && e.url === avatar }))
    .filter(e => !e.deletedAt && (estProprio || !e.prive));
  if (avatar && !items.some(e => e.actuelle)) items.unshift({ url: avatar, actuelle: true, idx: -1 });
  items.sort((a, b) => (b.actuelle ? 1 : 0) - (a.actuelle ? 1 : 0));
  return items;
}

window.PhotoProfil = { ouvrirApercu, ouvrirVisionneuse, fermerVisionneuse, listeVisible };
