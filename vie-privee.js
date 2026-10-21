/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — vie-privee.js   (chargé par profil.html et profil_visiteur.html)
   ══════════════════════════════════════════════════════════════════════
   Ce qui reste visible SEULEMENT par le propriétaire du profil :
     • l'e-mail ;
     • la monétisation (carte « Compte Professionnel » + barre de progression).
   Le numéro de téléphone : le propriétaire choisit, avec un petit bouton
   à côté du numéro : 🌐 Public (tout le monde) ou 🔒 Privé (lui seul).
   Champ enregistré : utilisateurs/{uid}.telephonePrive = true / false.

   Utilisation dans la page, une fois le profil chargé :
     ArViePrivee.appliquer({ estMoi, donnees, enregistrer })
       enregistrer(champs) → Promise : écrit dans la fiche du propriétaire.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArViePrivee) return;
  const TRx = (t) => (window.trApp ? window.trApp(t) : t);

  function css() {
    if (document.getElementById('arVpCss')) return;
    const s = document.createElement('style');
    s.id = 'arVpCss';
    s.textContent = '.vp-btn{position:absolute;top:-9px;right:6px;box-shadow:0 1px 4px rgba(0,0,0,.12);border:none;border-radius:12px;padding:3px 8px;font-size:10.5px;font-weight:800;cursor:pointer;font-family:inherit;line-height:1.3}'
      + '.vp-btn.public{background:#e8f5e9;color:#1b7a33}.vp-btn.prive{background:#fde4ef;color:#c2185b}'
      + '.vp-note{display:block;font-size:9.5px;color:#c2185b;font-weight:700;letter-spacing:0;text-transform:none;margin-top:1px}'
      + '.vp-cache{display:none!important}';
    document.head.appendChild(s);
  }
  const item = (id) => { const el = document.getElementById(id); return el ? el.closest('.coord-item') : null; };
  function note(id, texte) {
    const it = item(id); if (!it) return;
    const lab = it.querySelector('.coord-label'); if (!lab || lab.querySelector('.vp-note')) return;
    lab.insertAdjacentHTML('beforeend', '<span class="vp-note">' + texte + '</span>');
  }

  function appliquer(o) {
    css();
    const d = o.donnees || {};
    const estMoi = !!o.estMoi;
    const telPrive = d.telephonePrive === true;

    // 1) E-mail : visible par le propriétaire seulement.
    const itEmail = item('coordEmail');
    if (itEmail) {
      if (estMoi) note('coordEmail', '🔒 ' + TRx('Visible par vous seul'));
      else { itEmail.classList.add('vp-cache'); const v = document.getElementById('coordEmail'); if (v) v.textContent = ''; }
    }

    // 2) Monétisation : visible par le propriétaire seulement.
    document.querySelectorAll('.monetize-section').forEach(sec => {
      if (!estMoi) { sec.classList.add('vp-cache'); return; }
      const t = sec.querySelector('.section-title');
      if (t && !t.querySelector('.vp-note')) t.insertAdjacentHTML('beforeend', '<span class="vp-note" style="margin-left:6px">🔒 ' + TRx('Visible par vous seul') + '</span>');
    });

    // 3) Téléphone (et WhatsApp quand il reprend le même numéro).
    const tel = document.getElementById('coordTel'), wa = document.getElementById('coordWa');
    if (!estMoi) {
      if (telPrive) {
        if (tel) tel.textContent = '🔒 ' + TRx('Privé');
        if (wa && !d.whatsapp) wa.textContent = '🔒 ' + TRx('Privé');
      }
      return;
    }
    const itTel = item('coordTel'); if (!itTel) return;
    let b = itTel.querySelector('.vp-btn');
    if (!b) { b = document.createElement('button'); b.type = 'button'; itTel.appendChild(b); }
    const dessiner = (prive) => {
      b.className = 'vp-btn ' + (prive ? 'prive' : 'public');
      b.textContent = prive ? '🔒 ' + TRx('Privé') : '🌐 ' + TRx('Public');
      b.title = prive ? TRx('Votre numéro est visible par vous seul. Touchez pour le rendre public.') : TRx('Votre numéro est visible par tous. Touchez pour le rendre privé.');
    };
    dessiner(telPrive);
    b.onclick = async (e) => {
      e.stopPropagation();
      const nouveau = !(d.telephonePrive === true);
      dessiner(nouveau); b.disabled = true;
      try {
        await o.enregistrer({ telephonePrive: nouveau });
        d.telephonePrive = nouveau;
        if (typeof o.toast === 'function') o.toast(nouveau ? '🔒 ' + TRx('Numéro privé : visible par vous seul') : '🌐 ' + TRx('Numéro public : visible par tous'));
      } catch (err) {
        dessiner(!nouveau);
        if (typeof o.toast === 'function') o.toast('⚠ ' + TRx('Réglage non enregistré. Vérifiez votre connexion.'));
      }
      b.disabled = false;
    };
  }

  window.ArViePrivee = { appliquer };
})();
