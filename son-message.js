/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — son-message.js   (chargé par accueil.html et discussion_v1.html)
   ══════════════════════════════════════════════════════════════════════
   Le son des messages, propre à ArtiRoyce, fabriqué directement par le
   téléphone (aucun fichier son à télécharger) :
     ArSonMessage.jouer('recu')    → message reçu : deux notes douces, claires
     ArSonMessage.jouer('envoye')  → message envoyé : un petit « pop » léger
   Réglages (gardés sur le téléphone) :
     ArSonMessage.reglages()             → { recu: true, envoye: true, muets: [convIds] }
     ArSonMessage.regler({ recu: false })
     ArSonMessage.estMuette(convId) / ArSonMessage.basculerMuette(convId)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArSonMessage) return;
  var CLE = 'arSonsMessages';
  var actx = null;

  function reglages() {
    var r = { recu: true, envoye: true, muets: [] };
    try {
      var v = JSON.parse(localStorage.getItem(CLE) || '{}');
      if (typeof v.recu === 'boolean') r.recu = v.recu;
      if (typeof v.envoye === 'boolean') r.envoye = v.envoye;
      if (Array.isArray(v.muets)) r.muets = v.muets.slice(0, 500);
    } catch (e) {}
    return r;
  }
  function regler(champs) {
    var r = reglages();
    for (var k in champs) r[k] = champs[k];
    try { localStorage.setItem(CLE, JSON.stringify(r)); } catch (e) {}
    return r;
  }
  function estMuette(convId) { return !!convId && reglages().muets.indexOf(convId) !== -1; }
  function basculerMuette(convId) {
    var r = reglages(), i = r.muets.indexOf(convId);
    if (i === -1) r.muets.push(convId); else r.muets.splice(i, 1);
    regler({ muets: r.muets });
    return i === -1;   // true = la discussion est maintenant muette
  }

  function contexte() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!actx) { try { actx = new AC(); } catch (e) { return null; } }
    if (actx.state === 'suspended' && actx.resume) actx.resume().catch(function () {});
    return actx;
  }
  // Le téléphone n'autorise le son qu'après un premier toucher : on prépare le son à ce moment-là.
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { contexte(); }, { capture: true, passive: true });
  });

  // Une note : un son pur, plus un léger harmonique, qui s'éteint en douceur.
  function note(ctx, freq, debut, duree, volume) {
    var t = ctx.currentTime + debut;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    g.connect(ctx.destination);
    [[freq, 1], [freq * 2, 0.18]].forEach(function (p) {
      var o = ctx.createOscillator(), go = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(p[0], t);
      go.gain.value = p[1];
      o.connect(go); go.connect(g);
      o.start(t); o.stop(t + duree + 0.05);
    });
  }
  function pop(ctx) {
    var t = ctx.currentTime;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(980, t + 0.09);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.16);
  }

  var dernier = { recu: 0, envoye: 0 };
  // force : jouer même si le réglage est coupé (bouton « Écouter » des réglages).
  function jouer(type, force) {
    type = type === 'envoye' ? 'envoye' : 'recu';
    if (!force && !reglages()[type]) return false;
    var maintenant = Date.now();
    if (!force && maintenant - dernier[type] < 1200) return false;   // jamais une rafale de sons
    dernier[type] = maintenant;
    var ctx = contexte();
    if (!ctx) return false;
    try {
      if (type === 'recu') { note(ctx, 880, 0, 0.32, 0.22); note(ctx, 1318.5, 0.11, 0.42, 0.18); }
      else pop(ctx);
      return true;
    } catch (e) { return false; }
  }

  window.ArSonMessage = { jouer: jouer, reglages: reglages, regler: regler, estMuette: estMuette, basculerMuette: basculerMuette };

  // Accueil : Discussion (chargée dans un cadre) demande de jouer le son ici, là où
  // la personne touche l'écran (le téléphone autorise le son dans cette page).
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'arSonMessage') window.ArSonMessage.jouer(e.data.son, false);
  });
})();
