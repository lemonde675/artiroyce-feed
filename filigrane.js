/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — filigrane.js  (la marque sur tout ce qui est ENREGISTRÉ)
   ══════════════════════════════════════════════════════════════════════
   Comme TikTok : quand quelqu'un enregistre une photo ou une vidéo dans
   son téléphone, la marque est imprimée DANS le fichier, en bas à gauche :
       [logo] ArtiRoyce
       @pseudo de l'auteur
       Téléchargé sur ArtiRoyce
   Tout se fait dans le téléphone : gratuit, aucun serveur.

   Utilisation dans une page :
     ArFiligrane.menu('Titre', [ { texte:'…', action:function(){…} }, … ])
     ArFiligrane.enregistrerPhoto(url, '@pseudo')       → une photo
     ArFiligrane.enregistrerPhotos([url,…], '@pseudo')  → plusieurs photos
     ArFiligrane.enregistrerVideo(url, '@pseudo')       → une vidéo (son compris)

   Limite honnête : une marque peut être recadrée, et une capture d'écran
   ne peut pas être empêchée (TikTok a la même limite).
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArFiligrane) return;

  var T = function (t, v) { return (window.trApp ? window.trApp(t, v) : (function () { if (v) for (var k in v) t = t.split('{' + k + '}').join(v[k]); return t; })()); };
  function message(t) { try { if (typeof window.toast === 'function') return window.toast(t, ''); } catch (e) {} try { alert(t); } catch (e) {} }

  /* ── Le logo ArtiRoyce (mêmes formes que l'icône de l'application) ── */
  var ROUGE = '#e02010', VERT = '#27a945';
  var FORMES = [
    [ROUGE, [[90,55],[68,17],[24,17],[2,55],[24,93],[68,93]], [[71,55],[59,34],[33,34],[21,55],[33,76],[59,76]]],
    [VERT,  [[142,55],[120,17],[76,17],[54,55],[76,93],[120,93]], [[123,55],[111,34],[87,34],[75,55],[87,76],[111,76]]],
    ['#ffffff', [[68,17],[90,55],[75,55],[87,34]], null],
    [ROUGE, [[68,17],[90,55],[71,55],[59,34]], null],
    ['#ffffff', [[76,93],[54,55],[75,55],[87,76]], null],
    [VERT,  [[76,93],[54,55],[75,55],[87,76]], null]
  ];
  function dessinerLogo(ctx, x, y, largeur) {
    var e = largeur / 140;               // le logo occupe x = 2…142, y = 17…93
    ctx.save();
    ctx.translate(x - 2 * e, y - 17 * e);
    FORMES.forEach(function (f) {
      ctx.beginPath();
      [f[1], f[2]].forEach(function (pts) {
        if (!pts) return;
        pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0] * e, p[1] * e); else ctx.moveTo(p[0] * e, p[1] * e); });
        ctx.closePath();
      });
      ctx.fillStyle = f[0];
      ctx.fill('evenodd');
    });
    ctx.restore();
  }

  /* ── La marque complète, en bas à gauche, taille adaptée à l'image ── */
  function dessinerMarque(ctx, W, H, pseudo) {
    var b = Math.max(14, Math.round(Math.min(W, H) * 0.045));   // taille de base
    var marge = Math.round(b * 0.8);
    var police = "-apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
    // « ArtiRoyce » un peu plus grand ; « @pseudo » et « Téléchargé sur ArtiRoyce » plus petits.
    var hLigne1 = Math.round(b * 0.62), hLigne2 = Math.max(10, Math.round(b * 0.48)), hLigne3 = hLigne2;
    var bas = H - marge;
    var y3 = bas, y2 = y3 - hLigne3 - Math.round(b * 0.2), y1 = y2 - hLigne2 - Math.round(b * 0.2);
    var logoL = Math.round(hLigne1 * 1.45), logoH = Math.round(logoL * 76 / 140);

    ctx.save();
    // Cadre rose derrière la marque (comme les pastilles roses d'index)
    ctx.font = '800 ' + hLigne1 + 'px ' + police;
    var lg = Math.max(logoL + b * 0.3 + ctx.measureText('ArtiRoyce').width, (function(){ctx.font='700 '+hLigne2+'px '+police;return ctx.measureText(String(pseudo||'')).width;})(), (function(){ctx.font='italic 500 '+hLigne3+'px '+police;return ctx.measureText(T('Téléchargé sur ArtiRoyce')).width;})());
    var px = Math.round(b * 0.45), cx = marge - px, cy = y1 - hLigne1 - px * 0.6, cw = lg + px * 2, ch = (bas - cy) + px * 0.8, r = b * 0.5;
    ctx.beginPath(); ctx.moveTo(cx + r, cy); ctx.arcTo(cx + cw, cy, cx + cw, cy + ch, r); ctx.arcTo(cx + cw, cy + ch, cx, cy + ch, r); ctx.arcTo(cx, cy + ch, cx, cy, r); ctx.arcTo(cx, cy, cx + cw, cy, r); ctx.closePath();
    ctx.fillStyle = 'rgba(236,72,153,0.22)'; ctx.fill();
    ctx.lineWidth = Math.max(1.5, b * 0.08); ctx.strokeStyle = 'rgba(236,72,153,0.75)'; ctx.stroke();
    ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = Math.max(2, Math.round(b * 0.3));
    ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;

    // Ligne 1 : logo + « Arti » rouge + « Royce » vert
    dessinerLogo(ctx, marge, y1 - logoH + Math.round(b * 0.05), logoL);
    ctx.font = '800 ' + hLigne1 + 'px ' + police;
    var xTexte = marge + logoL + Math.round(b * 0.3);
    ctx.fillStyle = '#e63224'; ctx.fillText('Arti', xTexte, y1);
    ctx.fillStyle = VERT; ctx.fillText('Royce', xTexte + ctx.measureText('Arti').width, y1);

    // Ligne 2 : @pseudo de l'auteur
    ctx.font = '700 ' + hLigne2 + 'px ' + police;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(String(pseudo || '@artiroyce').slice(0, 40), marge, y2);

    // Ligne 3 : « Téléchargé sur ArtiRoyce »
    ctx.font = 'italic 500 ' + hLigne3 + 'px ' + police;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(T('Téléchargé sur ArtiRoyce'), marge, y3);
    ctx.restore();
  }

  /* ── Donner le fichier au téléphone ── */
  var estIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function nomFichier(pseudo, ext) {
    var p = String(pseudo || '').replace(/[^A-Za-z0-9_-]/g, '') || 'artiroyce';
    return 'ArtiRoyce_' + p + '_' + Date.now() + '.' + ext;
  }
  async function donnerAuTelephone(blob, nom) {
    // iPhone : la feuille de partage permet « Enregistrer l'image / la vidéo » dans Photos.
    try {
      if (estIOS && window.File && navigator.canShare) {
        var f = new File([blob], nom, { type: blob.type });
        if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return true; }
      }
    } catch (e) { if (e && e.name === 'AbortError') return false; }
    // Android / ordinateur : téléchargement direct (dossier Téléchargements / Galerie).
    var a = document.createElement('a');
    var u = URL.createObjectURL(blob);
    a.href = u; a.download = nom; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(u); }, 4000);
    return true;
  }

  /* ── Petit menu en bas de l'écran (réutilisable par toutes les pages) ── */
  function injecterStyle() {
    if (document.getElementById('arFigStyle')) return;
    var st = document.createElement('style');
    st.id = 'arFigStyle';
    st.textContent =
      '.arfig-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99999;display:flex;align-items:flex-end;justify-content:center;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}'
      + '.arfig-sh{background:#fff;width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:14px 16px 22px;box-sizing:border-box}'
      + '.arfig-hd{width:36px;height:4px;background:#ddd;border-radius:4px;margin:0 auto 12px}'
      + '.arfig-ti{font-weight:800;font-size:15px;color:#111;text-align:center;margin-bottom:12px}'
      + '.arfig-bt{display:block;width:100%;padding:14px;border-radius:14px;border:1.5px solid #eee;background:#fff;color:#111;font-weight:700;font-size:15px;margin-bottom:10px;text-align:left;cursor:pointer;font-family:inherit}'
      + '.arfig-bt:active{background:#f5f5f5}'
      + '.arfig-bt.annuler{text-align:center;color:#888;border:none;margin:4px 0 0}'
      + '.arfig-pr{background:#fff;width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:20px 18px 26px;box-sizing:border-box;text-align:center}'
      + '.arfig-barre{height:8px;background:#fde4ef;border-radius:8px;overflow:hidden;margin:14px 0 8px}'
      + '.arfig-rempli{height:100%;width:0;background:#ec4899;transition:width .3s}'
      + '.arfig-pt{font-size:12px;color:#888}';
    document.head.appendChild(st);
  }
  function menu(titre, options) {
    injecterStyle();
    var ov = document.createElement('div');
    ov.className = 'arfig-ov';
    var sh = document.createElement('div');
    sh.className = 'arfig-sh';
    sh.innerHTML = '<div class="arfig-hd"></div>' + (titre ? '<div class="arfig-ti"></div>' : '');
    if (titre) sh.querySelector('.arfig-ti').textContent = titre;
    var fermer = function () { if (ov.parentNode) ov.parentNode.removeChild(ov); };
    (options || []).forEach(function (o) {
      if (!o) return;
      var b = document.createElement('button');
      b.className = 'arfig-bt';
      b.textContent = o.texte;
      b.onclick = function () { fermer(); try { o.action && o.action(); } catch (e) { console.error(e); } };
      sh.appendChild(b);
    });
    var an = document.createElement('button');
    an.className = 'arfig-bt annuler';
    an.textContent = T('Annuler');
    an.onclick = fermer;
    sh.appendChild(an);
    ov.appendChild(sh);
    ov.addEventListener('click', function (e) { if (e.target === ov) fermer(); });
    document.body.appendChild(ov);
  }

  /* ── Fenêtre de progression ── */
  function progression(titre) {
    injecterStyle();
    var ov = document.createElement('div');
    ov.className = 'arfig-ov';
    ov.innerHTML = '<div class="arfig-pr"><div class="arfig-ti"></div><div class="arfig-barre"><div class="arfig-rempli"></div></div>'
      + '<div class="arfig-pt"></div><button class="arfig-bt annuler"></button></div>';
    ov.querySelector('.arfig-ti').textContent = titre;
    ov.querySelector('.arfig-pt').textContent = T('Ne quittez pas cet écran');
    var bouton = ov.querySelector('button');
    bouton.textContent = T('Arrêter');
    document.body.appendChild(ov);
    var api = {
      annule: false,
      maj: function (pct, texte) {
        ov.querySelector('.arfig-rempli').style.width = Math.max(0, Math.min(100, pct)) + '%';
        if (texte) ov.querySelector('.arfig-ti').textContent = texte;
      },
      fermer: function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }
    };
    bouton.onclick = function () { api.annule = true; };
    return api;
  }

  /* ── PHOTOS ── */
  function erreurStockage() { var e = new Error('CORS'); e.cors = true; return e; }
  async function chargerImage(url) {
    var src = url, temporaire = null;
    if (!/^(data:|blob:)/.test(url)) {
      var rep;
      try { rep = await fetch(url, { mode: 'cors' }); } catch (e) { throw erreurStockage(); }
      if (!rep.ok) throw new Error('HTTP ' + rep.status);
      temporaire = URL.createObjectURL(await rep.blob());
      src = temporaire;
    }
    return new Promise(function (ok, ko) {
      var im = new Image();
      im.onload = function () { ok({ im: im, liberer: function () { if (temporaire) URL.revokeObjectURL(temporaire); } }); };
      im.onerror = function () { if (temporaire) URL.revokeObjectURL(temporaire); ko(new Error('image illisible')); };
      im.src = src;
    });
  }
  async function photoMarquee(url, pseudo) {
    var r = await chargerImage(url);
    var W = r.im.naturalWidth, H = r.im.naturalHeight, max = 2560;
    if (Math.max(W, H) > max) { var k = max / Math.max(W, H); W = Math.round(W * k); H = Math.round(H * k); }
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var ctx = c.getContext('2d');
    ctx.drawImage(r.im, 0, 0, W, H);
    r.liberer();
    dessinerMarque(ctx, W, H, pseudo);
    return new Promise(function (ok, ko) {
      try { c.toBlob(function (b) { b ? ok(b) : ko(erreurStockage()); }, 'image/jpeg', 0.92); }
      catch (e) { ko(erreurStockage()); }
    });
  }
  function expliquerErreur(e) {
    console.warn('Filigrane :', e);
    if (e && e.cors) message(T('⚠️ Enregistrement impossible pour le moment : le stockage bloque encore la marque (réglage à faire).'));
    else message(T('⚠️ Enregistrement impossible, réessayez.'));
  }
  async function enregistrerPhoto(url, pseudo) {
    if (!url) { message(T('Aucune photo à enregistrer')); return false; }
    try {
      message(T('Préparation…'));
      var b = await photoMarquee(url, pseudo);
      var ok = await donnerAuTelephone(b, nomFichier(pseudo, 'jpg'));
      if (ok) message(T('✅ Enregistré dans votre téléphone'));
      return ok;
    } catch (e) { expliquerErreur(e); return false; }
  }
  async function enregistrerPhotos(urls, pseudo) {
    urls = (urls || []).filter(Boolean);
    if (!urls.length) { message(T('Aucune photo à enregistrer')); return; }
    if (urls.length === 1) return enregistrerPhoto(urls[0], pseudo);
    var p = progression(T('Préparation…'));
    var faites = 0;
    try {
      for (var i = 0; i < urls.length; i++) {
        if (p.annule) break;
        p.maj(i / urls.length * 100, T('📥 Photo {n} sur {t}…', { n: i + 1, t: urls.length }));
        var b = await photoMarquee(urls[i], pseudo);
        await donnerAuTelephone(b, nomFichier(pseudo + '_' + (i + 1), 'jpg'));
        faites++;
        await new Promise(function (r) { setTimeout(r, 400); }); // laisse le téléphone respirer entre deux fichiers
      }
      p.fermer();
      if (faites) message(T('✅ {n} photos enregistrées', { n: faites }));
    } catch (e) { p.fermer(); expliquerErreur(e); }
  }

  /* ── VIDÉOS (rejouées avec la marque, son compris) ── */
  function formatVideo() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return null;
    var choix = ['video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    for (var i = 0; i < choix.length; i++) if (MediaRecorder.isTypeSupported(choix[i])) return choix[i];
    return null;
  }
  async function enregistrerVideo(url, pseudo) {
    if (!url) { message(T('Aucune vidéo à enregistrer')); return; }
    var mime = formatVideo();
    var essai = document.createElement('canvas');
    if (!mime || !essai.captureStream) { message(T('⚠️ Votre téléphone ne permet pas d’enregistrer la vidéo avec la marque.')); return; }

    // Le son : préparé tout de suite (le téléphone l'autorise seulement juste après le toucher).
    var AC = window.AudioContext || window.webkitAudioContext, actx = null;
    try { actx = AC ? new AC() : null; if (actx && actx.resume) actx.resume(); } catch (e) { actx = null; }

    var p = progression(T('Préparation…'));
    var video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.playsInline = true; video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.src = url;
    var fini = false;
    function nettoyer() { fini = true; try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {} try { actx && actx.close(); } catch (e) {} p.fermer(); }

    try {
      await new Promise(function (ok, ko) {
        var t = setTimeout(function () { ko(new Error('délai')); }, 25000);
        video.onloadeddata = function () { clearTimeout(t); ok(); };
        video.onerror = function () { clearTimeout(t); ko(erreurStockage()); };
      });
      var W = video.videoWidth || 720, H = video.videoHeight || 1280, max = 1280;
      if (Math.max(W, H) > max) { var k = max / Math.max(W, H); W = Math.round(W * k / 2) * 2; H = Math.round(H * k / 2) * 2; }
      var c = document.createElement('canvas');
      c.width = W; c.height = H;
      var ctx = c.getContext('2d');
      ctx.drawImage(video, 0, 0, W, H);
      try { ctx.getImageData(0, 0, 1, 1); } catch (e) { throw erreurStockage(); } // stockage bloqué ?

      var flux = c.captureStream(30);
      var avecSon = false;
      if (actx) {
        try {
          var source = actx.createMediaElementSource(video);
          var sortie = actx.createMediaStreamDestination();
          source.connect(sortie);                 // enregistré, mais pas joué à voix haute
          sortie.stream.getAudioTracks().forEach(function (tr) { flux.addTrack(tr); });
          avecSon = sortie.stream.getAudioTracks().length > 0;
        } catch (e) { avecSon = false; }
      }
      var morceaux = [];
      var rec = new MediaRecorder(flux, { mimeType: mime, videoBitsPerSecond: 3500000 });
      rec.ondataavailable = function (e) { if (e.data && e.data.size) morceaux.push(e.data); };
      var termine = new Promise(function (ok) { rec.onstop = ok; });

      video.currentTime = 0;
      try { await video.play(); }
      catch (e) { video.muted = true; avecSon = false; await video.play(); }
      rec.start(1000);

      var duree = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      p.maj(0, T('🎬 Enregistrement avec la marque…'));
      (function image() {
        if (fini) return;
        ctx.drawImage(video, 0, 0, W, H);
        dessinerMarque(ctx, W, H, pseudo);
        if (duree) p.maj(video.currentTime / duree * 100, T('🎬 Enregistrement avec la marque… {p}%', { p: Math.floor(video.currentTime / duree * 100) }));
        if (p.annule || video.ended) { if (rec.state !== 'inactive') rec.stop(); return; }
        requestAnimationFrame(image);
      })();
      video.onended = function () { if (rec.state !== 'inactive') rec.stop(); };

      await termine;
      var annule = p.annule;
      nettoyer();
      if (annule) { message(T('Enregistrement arrêté')); return; }
      var type = mime.split(';')[0];
      var blob = new Blob(morceaux, { type: type });
      var ok = await donnerAuTelephone(blob, nomFichier(pseudo, type === 'video/mp4' ? 'mp4' : 'webm'));
      if (ok) message(avecSon ? T('✅ Enregistré dans votre téléphone') : T('✅ Enregistré (sans le son)'));
    } catch (e) {
      nettoyer();
      expliquerErreur(e);
    }
  }

  window.ArFiligrane = {
    menu: menu,
    enregistrerPhoto: enregistrerPhoto,
    enregistrerPhotos: enregistrerPhotos,
    enregistrerVideo: enregistrerVideo,
    dessinerMarque: dessinerMarque
  };
})();
