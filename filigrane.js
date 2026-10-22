/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — filigrane.js  (la marque sur tout ce qui est ENREGISTRÉ)
   ══════════════════════════════════════════════════════════════════════
   Comme TikTok : quand quelqu'un enregistre une photo ou une vidéo dans
   son téléphone, la marque est imprimée DANS le fichier, en bas à gauche :
       [logo] ArtiRoyce
       @pseudo de l'auteur
       Téléchargée sur ArtiRoyce
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
    // « ArtiRoyce » un peu plus grand ; « @pseudo » et « Téléchargée sur ArtiRoyce » plus petits.
    var hLigne1 = Math.round(b * 0.62), hLigne2 = Math.max(10, Math.round(b * 0.48)), hLigne3 = hLigne2;
    var bas = H - marge;
    var y3 = bas, y2 = y3 - hLigne3 - Math.round(b * 0.2), y1 = y2 - hLigne2 - Math.round(b * 0.2);
    var logoL = Math.round(hLigne1 * 1.45), logoH = Math.round(logoL * 76 / 140);

    ctx.save();
    // Cadre rose derrière la marque (comme les pastilles roses d'index)
    ctx.font = '800 ' + hLigne1 + 'px ' + police;
    var lg = Math.max(logoL + b * 0.3 + ctx.measureText('ArtiRoyce').width, (function(){ctx.font='700 '+hLigne2+'px '+police;return ctx.measureText(String(pseudo||'')).width;})(), (function(){ctx.font='italic 500 '+hLigne3+'px '+police;return ctx.measureText(T('Téléchargée sur ArtiRoyce')).width;})());
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

    // Ligne 3 : « Téléchargée sur ArtiRoyce »
    ctx.font = 'italic 500 ' + hLigne3 + 'px ' + police;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(T('Téléchargée sur ArtiRoyce'), marge, y3);
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
    if (e && e.cors) message(T('Enregistrement impossible pour le moment : le stockage bloque encore la marque (réglage à faire).'));
    else message(T('Enregistrement impossible, réessayez.'));
  }
  async function enregistrerPhoto(url, pseudo) {
    if (!url) { message(T('Aucune photo à enregistrer')); return false; }
    try {
      message(T('Préparation…'));
      var b = await photoMarquee(url, pseudo);
      var ok = await donnerAuTelephone(b, nomFichier(pseudo, 'jpg'));
      if (ok) message(T('Enregistré dans votre téléphone'));
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
      if (faites) message(T('{n} photos enregistrées', { n: faites }));
    } catch (e) { p.fermer(); expliquerErreur(e); }
  }

  /* ══════════════ VIDÉOS (rejouées avec la marque, son compris) ══════════════
     Méthode principale : on refabrique un VRAI fichier MP4 (comme un appareil photo),
     avec sa durée et sa « table des matières » → la galerie affiche la bonne durée
     et on peut avancer / reculer. (Le petit enregistreur rapide du téléphone, lui,
     produisait des fichiers sans durée.) Méthode de secours : l'ancien enregistreur,
     avec la durée réparée. */

  /* ── Petit fabricant de fichiers MP4 ── */
  function octets(n, taille) { var a = new Uint8Array(taille); for (var i = taille - 1; i >= 0; i--) { a[i] = n & 255; n = Math.floor(n / 256); } return a; }
  function u8(n) { return octets(n, 1); } function u16(n) { return octets(n, 2); } function u32(n) { return octets(n >>> 0, 4); }
  function texte4(s) { return new Uint8Array([s.charCodeAt(0), s.charCodeAt(1), s.charCodeAt(2), s.charCodeAt(3)]); }
  function joindre(liste) {
    var t = 0; liste.forEach(function (x) { t += x.length; });
    var r = new Uint8Array(t), o = 0;
    liste.forEach(function (x) { r.set(x, o); o += x.length; });
    return r;
  }
  function boite(type, contenu) { var c = joindre(contenu || []); return joindre([u32(8 + c.length), texte4(type), c]); }
  function boiteP(type, version, drapeaux, contenu) { return boite(type, [u8(version), octets(drapeaux, 3)].concat(contenu || [])); }
  var MATRICE = joindre([u32(0x00010000), u32(0), u32(0), u32(0), u32(0x00010000), u32(0), u32(0), u32(0), u32(0x40000000)]);
  function zeros(n) { return new Uint8Array(n); }

  function descripteur(tag, contenu) { var c = joindre(contenu); return joindre([u8(tag), u8(c.length), c]); }
  function entreeEchantillons(piste) {
    if (piste.type === 'video') {
      var visuel = [zeros(6), u16(1), zeros(16), u16(piste.largeur), u16(piste.hauteur), u32(0x00480000), u32(0x00480000), u32(0), u16(1), zeros(32), u16(0x0018), u16(0xFFFF)];
      if (piste.codec.indexOf('avc') === 0) return boite('avc1', visuel.concat([boite('avcC', [piste.description])]));
      var p = piste.codec.split('.'), profil = parseInt(p[1] || '0', 10), niveau = parseInt(p[2] || '31', 10), bits = parseInt(p[3] || '8', 10);
      return boite('vp09', visuel.concat([boiteP('vpcC', 1, 0, [u8(profil), u8(niveau), u8((bits << 4) | (1 << 1) | 0), u8(1), u8(1), u8(1), u16(0)])]));
    }
    var audio = [zeros(6), u16(1), zeros(8), u16(piste.canaux), u16(16), u16(0), u16(0), u32(piste.frequence * 65536)];
    if (piste.codec.indexOf('mp4a') === 0) {
      var es = descripteur(0x03, [u16(0), u8(0),
        descripteur(0x04, [u8(0x40), u8(0x15), octets(0, 3), u32(piste.debit || 128000), u32(piste.debit || 128000),
          descripteur(0x05, [piste.description])]),
        descripteur(0x06, [u8(0x02)])]);
      return boite('mp4a', audio.concat([boiteP('esds', 0, 0, [es])]));
    }
    // Opus
    return boite('Opus', [zeros(6), u16(1), zeros(8), u16(piste.canaux), u16(16), u16(0), u16(0), u32(48000 * 65536),
      boite('dOps', [u8(0), u8(piste.canaux), u16(piste.preskip || 312), u32(piste.frequence), u16(0), u8(0)])]);
  }
  function fabriquerMP4(pistes) {
    // pistes : [{ type, codec, description, largeur, hauteur | canaux, frequence, echelle, echantillons:[{donnees, pts, duree, cle}] }]
    var ftyp = boite('ftyp', [texte4('isom'), u32(0x200), texte4('isom'), texte4('iso2'), texte4('avc1'), texte4('mp41')]);
    var corps = [], tailleCorps = 0;
    pistes.forEach(function (pi) { pi.debutDansMdat = tailleCorps; pi.echantillons.forEach(function (e) { corps.push(e.donnees); tailleCorps += e.donnees.length; }); });
    var debutMdat = ftyp.length + 8;
    var dureeFilmMs = 0;
    var traks = pistes.map(function (pi, n) {
      var E = pi.echantillons, ech = pi.echelle;
      // Temps de décodage = temps d'affichage triés (gère aussi les images « B » éventuelles).
      var pts = E.map(function (e) { return Math.round(e.pts * ech / 1e6); });
      var dts = pts.slice().sort(function (a, b) { return a - b; });
      var deltas = [], i;
      for (i = 0; i < E.length; i++) {
        var d = i + 1 < E.length ? dts[i + 1] - dts[i] : Math.max(1, Math.round((E[i].duree || 0) * ech / 1e6) || (i ? deltas[i - 1] : Math.round(ech / 30)));
        deltas.push(Math.max(1, d));
      }
      var dureeTrack = dts.length ? dts[dts.length - 1] - dts[0] + deltas[deltas.length - 1] : 0;
      var dureeMs = Math.round(dureeTrack * 1000 / ech);
      if (dureeMs > dureeFilmMs) dureeFilmMs = dureeMs;
      var stts = [], k;
      for (i = 0; i < deltas.length; i++) { k = stts[stts.length - 1]; if (k && k[1] === deltas[i]) k[0]++; else stts.push([1, deltas[i]]); }
      var decal = pts.map(function (v, j) { return v - dts[j]; });
      var avecCtts = decal.some(function (v) { return v !== 0; });
      var tables = [
        boiteP('stsd', 0, 0, [u32(1), entreeEchantillons(pi)]),
        boiteP('stts', 0, 0, [u32(stts.length)].concat(stts.map(function (s) { return joindre([u32(s[0]), u32(s[1])]); })))
      ];
      if (avecCtts) tables.push(boiteP('ctts', 0, 0, [u32(decal.length)].concat(decal.map(function (v) { return joindre([u32(1), u32(v)]); }))));
      if (pi.type === 'video') {
        var cles = []; E.forEach(function (e, j) { if (e.cle) cles.push(j + 1); });
        tables.push(boiteP('stss', 0, 0, [u32(cles.length)].concat(cles.map(u32))));
      }
      tables.push(boiteP('stsc', 0, 0, [u32(1), u32(1), u32(E.length), u32(1)]));
      tables.push(boiteP('stsz', 0, 0, [u32(0), u32(E.length)].concat(E.map(function (e) { return u32(e.donnees.length); }))));
      tables.push(boiteP('stco', 0, 0, [u32(1), u32(debutMdat + pi.debutDansMdat)]));
      var video = pi.type === 'video';
      return boite('trak', [
        boiteP('tkhd', 0, 3, [u32(0), u32(0), u32(n + 1), u32(0), u32(dureeMs), zeros(8), u16(0), u16(0), u16(video ? 0 : 0x0100), u16(0), MATRICE,
          u32((video ? pi.largeur : 0) * 65536), u32((video ? pi.hauteur : 0) * 65536)]),
        boite('mdia', [
          boiteP('mdhd', 0, 0, [u32(0), u32(0), u32(ech), u32(dureeTrack), u16(0x55C4), u16(0)]),
          boiteP('hdlr', 0, 0, [u32(0), texte4(video ? 'vide' : 'soun'), zeros(12), new TextEncoder().encode(video ? 'VideoHandler\0' : 'SoundHandler\0')]),
          boite('minf', [
            video ? boiteP('vmhd', 0, 1, [zeros(8)]) : boiteP('smhd', 0, 0, [zeros(4)]),
            boite('dinf', [boiteP('dref', 0, 0, [u32(1), boiteP('url ', 0, 1, [])])]),
            boite('stbl', tables)
          ])
        ])
      ]);
    });
    var mvhd = boiteP('mvhd', 0, 0, [u32(0), u32(0), u32(1000), u32(dureeFilmMs), u32(0x00010000), u16(0x0100), zeros(10), MATRICE, zeros(24), u32(pistes.length + 1)]);
    var moov = boite('moov', [mvhd].concat(traks));
    return new Blob([ftyp, u32(8 + tailleCorps), texte4('mdat')].concat(corps).concat([moov]), { type: 'video/mp4' });
  }

  /* ── Choix des réglages que ce téléphone sait faire ── */
  async function reglageVideo(W, H) {
    if (!window.VideoEncoder || !window.VideoFrame) return null;
    var liste = ['avc1.42001f', 'avc1.4d001f', 'avc1.42002a', 'avc1.640028', 'vp09.00.31.08'];
    for (var i = 0; i < liste.length; i++) {
      var r = { codec: liste[i], width: W, height: H, bitrate: 3500000, framerate: 30 };
      if (liste[i].indexOf('avc') === 0) r.avc = { format: 'avc' };
      try { var s = await VideoEncoder.isConfigSupported(r); if (s && s.supported) return r; } catch (e) {}
    }
    return null;
  }
  async function reglageAudio(frequence, canaux) {
    if (!window.AudioEncoder || !window.AudioData) return null;
    var liste = ['mp4a.40.2', 'opus'];
    for (var i = 0; i < liste.length; i++) {
      var r = { codec: liste[i], sampleRate: frequence, numberOfChannels: canaux, bitrate: 128000 };
      try { var s = await AudioEncoder.isConfigSupported(r); if (s && s.supported) return r; } catch (e) {}
    }
    return null;
  }

  async function telechargerVideo(url) {
    var rep;
    try { rep = await fetch(url, { mode: 'cors' }); } catch (e) { throw erreurStockage(); }
    if (!rep.ok) throw new Error('HTTP ' + rep.status);
    return await rep.arrayBuffer();
  }

  /* ── Méthode principale : vrai MP4 ── */
  async function videoMP4(url, pseudo, p) {
    var tampon = await telechargerVideo(url);
    var lien = URL.createObjectURL(new Blob([tampon]));
    var video = document.createElement('video');
    video.muted = true; video.playsInline = true; video.setAttribute('playsinline', ''); video.preload = 'auto';
    video.src = lien;
    var arreter = false;
    try {
      await new Promise(function (ok, ko) {
        var t = setTimeout(function () { ko(new Error('délai')); }, 25000);
        video.onloadeddata = function () { clearTimeout(t); ok(); };
        video.onerror = function () { clearTimeout(t); ko(new Error('vidéo illisible')); };
      });
      var W = video.videoWidth || 720, H = video.videoHeight || 1280, max = 1280;
      if (Math.max(W, H) > max) { var k = max / Math.max(W, H); W = Math.round(W * k); H = Math.round(H * k); }
      W = Math.max(2, Math.round(W / 2) * 2); H = Math.max(2, Math.round(H / 2) * 2);
      var rv = await reglageVideo(W, H);
      if (!rv) return null;                                  // → méthode de secours

      // Le son : lu directement depuis le fichier (sans le jouer à voix haute).
      var sonBuf = null;
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        var actx = new AC();
        sonBuf = await new Promise(function (ok, ko) { var pr = actx.decodeAudioData(tampon.slice(0), ok, ko); if (pr && pr.then) pr.then(ok, ko); });
        try { actx.close(); } catch (e) {}
      } catch (e) { sonBuf = null; }
      var ra = sonBuf ? await reglageAudio(sonBuf.sampleRate, Math.min(2, sonBuf.numberOfChannels)) : null;

      var c = document.createElement('canvas'); c.width = W; c.height = H;
      var ctx = c.getContext('2d');

      var pisteV = { type: 'video', codec: rv.codec, largeur: W, hauteur: H, echelle: 90000, echantillons: [], description: null };
      var erreurEnc = null;
      var encV = new VideoEncoder({
        output: function (ch, meta) {
          if (meta && meta.decoderConfig && meta.decoderConfig.description && !pisteV.description) pisteV.description = new Uint8Array(meta.decoderConfig.description.buffer ? meta.decoderConfig.description.buffer.slice(meta.decoderConfig.description.byteOffset || 0, (meta.decoderConfig.description.byteOffset || 0) + meta.decoderConfig.description.byteLength) : meta.decoderConfig.description);
          var d = new Uint8Array(ch.byteLength); ch.copyTo(d);
          pisteV.echantillons.push({ donnees: d, pts: ch.timestamp, duree: ch.duration || 0, cle: ch.type === 'key' });
        },
        error: function (e) { erreurEnc = e; }
      });
      encV.configure(rv);

      var duree = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      var debut = null, dernier = -1, derniereCle = -1e9;
      function encoderImage(tempsSec) {
        if (erreurEnc) return;
        var ts = Math.round(tempsSec * 1e6);
        if (debut === null) debut = ts;
        ts -= debut;
        if (ts <= dernier) return;                             // jamais deux fois la même image
        dernier = ts;
        ctx.drawImage(video, 0, 0, W, H);
        dessinerMarque(ctx, W, H, pseudo);
        var img = new VideoFrame(c, { timestamp: ts });
        var cle = ts - derniereCle >= 2000000;                 // une image « clé » toutes les 2 s (pour avancer/reculer)
        if (cle) derniereCle = ts;
        encV.encode(img, { keyFrame: cle });
        img.close();
        if (duree) p.maj(tempsSec / duree * 100, T('🎬 Enregistrement avec la marque… {p}%', { p: Math.min(100, Math.floor(tempsSec / duree * 100)) }));
      }
      p.maj(0, T('🎬 Enregistrement avec la marque…'));
      await video.play();
      await new Promise(function (ok) {
        var fin = function () { if (!arreter) { arreter = true; ok(); } };
        video.onended = fin;
        if (video.requestVideoFrameCallback) {
          var suivant = function (now, info) {
            if (arreter) return;
            encoderImage(info && typeof info.mediaTime === 'number' ? info.mediaTime : video.currentTime);
            if (p.annule || erreurEnc) return fin();
            video.requestVideoFrameCallback(suivant);
          };
          video.requestVideoFrameCallback(suivant);
        } else {
          (function boucle() {
            if (arreter) return;
            encoderImage(video.currentTime);
            if (p.annule || video.ended || erreurEnc) return fin();
            requestAnimationFrame(boucle);
          })();
        }
      });
      video.pause();
      if (p.annule) { try { encV.close(); } catch (e) {} return 'annule'; }
      await encV.flush(); encV.close();
      if (erreurEnc || !pisteV.echantillons.length) throw erreurEnc || new Error('aucune image');
      if (rv.codec.indexOf('avc') === 0 && !pisteV.description) throw new Error('avcC manquant');

      var pistes = [pisteV];
      // Le son : codé morceau par morceau.
      if (ra && sonBuf) {
        p.maj(100, T('🎵 Ajout du son…'));
        var pisteA = { type: 'audio', codec: ra.codec, canaux: ra.numberOfChannels, frequence: ra.sampleRate, debit: 128000, echelle: ra.sampleRate, echantillons: [], description: null };
        var erreurA = null;
        var encA = new AudioEncoder({
          output: function (ch, meta) {
            if (meta && meta.decoderConfig && meta.decoderConfig.description && !pisteA.description) { var de = meta.decoderConfig.description; pisteA.description = new Uint8Array(de.buffer ? de.buffer.slice(de.byteOffset || 0, (de.byteOffset || 0) + de.byteLength) : de); }
            var d = new Uint8Array(ch.byteLength); ch.copyTo(d);
            pisteA.echantillons.push({ donnees: d, pts: ch.timestamp, duree: ch.duration || 0, cle: true });
          },
          error: function (e) { erreurA = e; }
        });
        encA.configure(ra);
        var nC = ra.numberOfChannels, total = sonBuf.length, pas = 4096, fr = sonBuf.sampleRate;
        var limite = Math.min(total, Math.ceil(((dernier + 40000) / 1e6) * fr));   // pas plus long que la vidéo
        for (var pos = 0; pos < limite && !erreurA; pos += pas) {
          var n = Math.min(pas, limite - pos), plan = new Float32Array(n * nC);
          for (var ch = 0; ch < nC; ch++) plan.set(sonBuf.getChannelData(ch).subarray(pos, pos + n), ch * n);
          var ad = new AudioData({ format: 'f32-planar', sampleRate: fr, numberOfFrames: n, numberOfChannels: nC, timestamp: Math.round(pos / fr * 1e6), data: plan });
          encA.encode(ad); ad.close();
          if (encA.encodeQueueSize > 20) await new Promise(function (r) { setTimeout(r, 5); });
        }
        await encA.flush(); encA.close();
        var aacSansConfig = ra.codec.indexOf('mp4a') === 0 && !pisteA.description;
        if (!erreurA && pisteA.echantillons.length && !aacSansConfig) pistes.push(pisteA);
      }
      return { blob: fabriquerMP4(pistes), avecSon: pistes.length > 1 };
    } finally {
      try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {}
      URL.revokeObjectURL(lien);
    }
  }

  /* ── Méthode de secours : ancien enregistreur + durée réparée ── */
  function formatVideo() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return null;
    var choix = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4;codecs=avc1,mp4a', 'video/mp4'];
    for (var i = 0; i < choix.length; i++) if (MediaRecorder.isTypeSupported(choix[i])) return choix[i];
    return null;
  }
  // Écrit la vraie durée dans un fichier WebM (sinon la galerie affiche n'importe quoi).
  async function reparerDureeWebm(blob, dureeMs) {
    try {
      var b = new Uint8Array(await blob.arrayBuffer());
      function lireTaille(o) { var x = b[o], l = 1, m = 0x80; while (l <= 8 && !(x & m)) { l++; m >>= 1; } var v = x & (m - 1); for (var i = 1; i < l; i++) v = v * 256 + b[o + i]; return { l: l, v: v, inconnue: v === Math.pow(2, 7 * l) - 1 }; }
      function lireId(o) { var x = b[o], l = 1, m = 0x80; while (l <= 4 && !(x & m)) { l++; m >>= 1; } var v = 0; for (var i = 0; i < l; i++) v = v * 256 + b[o + i]; return { l: l, v: v }; }
      var o = 0, id = lireId(o); o += id.l; var t = lireTaille(o); o += t.l + t.v;   // en-tête EBML
      id = lireId(o); if (id.v !== 0x18538067) return blob;                          // Segment
      o += id.l; t = lireTaille(o); o += t.l;
      while (o < b.length) {
        var e = lireId(o), ts = lireTaille(o + e.l), dc = o + e.l + ts.l;
        if (e.v === 0x1549A966) {                                                    // Info
          var fin = dc + ts.v, q = dc, echelle = 1000000, posDuree = -1, tailleDuree = 0;
          while (q < fin) {
            var ce = lireId(q), ct = lireTaille(q + ce.l), cd = q + ce.l + ct.l;
            if (ce.v === 0x2AD7B1) { echelle = 0; for (var i = 0; i < ct.v; i++) echelle = echelle * 256 + b[cd + i]; }
            if (ce.v === 0x4489) { posDuree = cd; tailleDuree = ct.v; }
            q = cd + ct.v;
          }
          var valeur = dureeMs * 1000000 / echelle;
          if (posDuree >= 0) {
            var dv = new DataView(b.buffer, b.byteOffset + posDuree, tailleDuree);
            if (tailleDuree === 8) dv.setFloat64(0, valeur); else dv.setFloat32(0, valeur);
            return new Blob([b], { type: blob.type });
          }
          var el = new Uint8Array(11); el[0] = 0x44; el[1] = 0x89; el[2] = 0x88; new DataView(el.buffer).setFloat64(3, valeur);
          var nouvelle = ts.v + 11, entete = joindre([b.subarray(o, o + e.l), new Uint8Array([0x08, 0, 0, 0]).map(function (x, i) { return i ? (nouvelle >>> (8 * (3 - i))) & 255 : 0x10 | ((nouvelle >>> 24) & 0x0F); })]);
          return new Blob([b.subarray(0, o), entete, b.subarray(dc, fin), el, b.subarray(fin)], { type: blob.type });
        }
        if (ts.inconnue) break;
        o = dc + ts.v;
      }
    } catch (e) { console.warn('Durée WebM non réparée :', e); }
    return blob;
  }
  async function videoAncienne(url, pseudo, p, actx) {
    var mime = formatVideo();
    var essai = document.createElement('canvas');
    if (!mime || !essai.captureStream) return null;
    var video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.playsInline = true; video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.src = url;
    var fini = false;
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
      try { ctx.getImageData(0, 0, 1, 1); } catch (e) { throw erreurStockage(); }
      var flux = c.captureStream(30);
      var avecSon = false;
      if (actx) {
        try {
          var source = actx.createMediaElementSource(video);
          var sortie = actx.createMediaStreamDestination();
          source.connect(sortie);
          sortie.stream.getAudioTracks().forEach(function (tr) { flux.addTrack(tr); });
          avecSon = sortie.stream.getAudioTracks().length > 0;
        } catch (e) { avecSon = false; }
      }
      var morceaux = [];
      var rec = new MediaRecorder(flux, { mimeType: mime, videoBitsPerSecond: 3500000 });
      rec.ondataavailable = function (e) { if (e.data && e.data.size) morceaux.push(e.data); };
      var termine = new Promise(function (ok) { rec.onstop = ok; });
      video.currentTime = 0;
      try { await video.play(); } catch (e) { video.muted = true; avecSon = false; await video.play(); }
      var t0 = performance.now();
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
      fini = true;
      if (p.annule) return 'annule';
      var type = mime.split(';')[0];
      var blob = new Blob(morceaux, { type: type });
      if (type === 'video/webm') blob = await reparerDureeWebm(blob, performance.now() - t0);
      return { blob: blob, avecSon: avecSon, ext: type === 'video/mp4' ? 'mp4' : 'webm' };
    } finally {
      fini = true;
      try { video.pause(); video.removeAttribute('src'); video.load(); } catch (e) {}
    }
  }

  async function enregistrerVideo(url, pseudo) {
    if (!url) { message(T('Aucune vidéo à enregistrer')); return; }
    // Préparé tout de suite : certains téléphones n'autorisent le son que juste après le toucher.
    var AC = window.AudioContext || window.webkitAudioContext, actx = null;
    try { actx = AC ? new AC() : null; if (actx && actx.resume) actx.resume(); } catch (e) { actx = null; }
    var p = progression(T('Préparation…'));
    try {
      var r = null;
      try { r = await videoMP4(url, pseudo, p); }
      catch (e) { if (e && e.cors) throw e; console.warn('MP4 impossible, méthode de secours :', e); r = null; }
      if (r === null && !p.annule) r = await videoAncienne(url, pseudo, p, actx);
      p.fermer();
      try { actx && actx.close(); } catch (e) {}
      if (r === 'annule' || p.annule) { message(T('Enregistrement arrêté')); return; }
      if (!r) { message(T('Votre téléphone ne permet pas d’enregistrer la vidéo avec la marque.')); return; }
      var ok = await donnerAuTelephone(r.blob, nomFichier(pseudo, r.ext || 'mp4'));
      if (ok) message(r.avecSon ? T('Enregistré dans votre téléphone') : T('Enregistré (sans le son)'));
    } catch (e) {
      p.fermer();
      try { actx && actx.close(); } catch (er) {}
      expliquerErreur(e);
    }
  }

  /* ── APPUI LONG : le menu du téléphone (« Télécharger l'image » SANS marque) est remplacé
        par notre menu (avec la marque). ──
     ArFiligrane.appuiLong(fonction) : fonction(element, evenement) est appelée lors d'un
     appui long sur une photo/vidéo ; si elle renvoie false, rien ne s'ouvre (mais le menu
     du téléphone reste bloqué quand même). */
  var _surAppuiLong = null, _dernierAppui = 0;
  function estMedia(el) { return el && (el.tagName === 'IMG' || el.tagName === 'VIDEO' || (el.closest && el.closest('[data-arfig]'))); }
  function declencher(el, e) {
    var maintenant = Date.now();
    if (maintenant - _dernierAppui < 800) return;   // pas deux fois pour le même appui
    _dernierAppui = maintenant;
    try { if (_surAppuiLong) _surAppuiLong(el, e); } catch (err) { console.error(err); }
  }
  function appuiLong(fonction) {
    _surAppuiLong = fonction;
    if (window.__arfigAppui) return;
    window.__arfigAppui = true;
    var st = document.createElement('style');
    st.textContent = 'img,video,[data-arfig]{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}';
    document.head.appendChild(st);
    // Android / ordinateur : l'appui long (ou clic droit) déclenche « contextmenu ».
    document.addEventListener('contextmenu', function (e) {
      var el = e.target;
      if (!estMedia(el)) return;
      e.preventDefault();
      declencher(el, e);
    }, true);
    // iPhone : pas de « contextmenu » → minuteur de 600 ms sans bouger le doigt.
    var minuteur = null, depart = null;
    document.addEventListener('touchstart', function (e) {
      var el = e.target;
      if (!estMedia(el) || !e.touches || e.touches.length !== 1) return;
      depart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      clearTimeout(minuteur);
      minuteur = setTimeout(function () { if (estIOS) declencher(el, e); }, 600);
    }, { passive: true, capture: true });
    var annuler = function () { clearTimeout(minuteur); };
    document.addEventListener('touchend', annuler, { passive: true, capture: true });
    document.addEventListener('touchcancel', annuler, { passive: true, capture: true });
    document.addEventListener('touchmove', function (e) {
      if (!depart || !e.touches || !e.touches[0]) return;
      if (Math.abs(e.touches[0].clientX - depart.x) > 10 || Math.abs(e.touches[0].clientY - depart.y) > 10) clearTimeout(minuteur);
    }, { passive: true, capture: true });
    // Empêche aussi de « glisser » une photo hors de la page pour la récupérer.
    document.addEventListener('dragstart', function (e) { if (estMedia(e.target)) e.preventDefault(); }, true);
  }

  window.ArFiligrane = {
    appuiLong: appuiLong,
    menu: menu,
    enregistrerPhoto: enregistrerPhoto,
    enregistrerPhotos: enregistrerPhotos,
    enregistrerVideo: enregistrerVideo,
    dessinerMarque: dessinerMarque,
    _fabriquerMP4: fabriquerMP4   // (utilisé pour les tests)
  };
})();
