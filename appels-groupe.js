/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — appels-groupe.js
   ══════════════════════════════════════════════════════════════════════
   APPELS AUDIO / VIDÉO DE GROUPE (jusqu'à 50 personnes), via Cloudflare
   Realtime SFU. Chaque participant envoie UNE fois son micro/sa caméra au
   serveur Cloudflare, qui redistribue à tout le monde (au lieu de 49
   connexions directes par téléphone, impossible au-delà de 4-5 personnes).

   Chargé APRÈS appels.js dans discussion_v1.html. appels.js (appels à deux)
   n'est PAS modifié : ce fichier n'agit que pendant un appel de groupe.

   Serveur : /api/sfu (fonction Vercel, secret Cloudflare jamais exposé).
   Firestore :
     appelsGroupe/{appelId}
       convId, nomGroupe, type ('audio'|'video'), lancePar, lanceParNom,
       invites[] (membres du groupe), statut ('actif'|'termine'), creeLe
     appelsGroupe/{appelId}/membres/{uid}
       sessionId, nom, ini, bg, photo, actif, micCoupe, camCoupee, vu, rejointLe
   ══════════════════════════════════════════════════════════════════════ */
window.GroupeAppel = (function(){

  const MAX_PARTICIPANTS = 50;
  const MAX_VIDEOS_RECUES = 9;           // au-delà : son seulement + photo (économise la connexion)
  const BATTEMENT_MS = 20000;
  const SEUIL_ACTIF_MS = 60000;
  const DEBIT_VIDEO_MAX = 450000;        // 450 kbit/s par caméra : net sur téléphone, coût maîtrisé

  function etape(t, err){ try{ if(window.ajouterEtape) ajouterEtape('👥 '+t, !!err); }catch(e){} }
  function fv(){ return firebase.firestore.FieldValue; }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function msDe(ts){ return ts && ts.toDate ? ts.toDate().getTime() : 0; }
  function fmt(s){ return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }

  /* ───────── Appels au serveur /api/sfu ───────── */
  async function api(action, sessionId, body){
    const u = firebase.auth().currentUser;
    if(!u) throw new Error('non connecté');
    const jeton = await u.getIdToken();
    const rep = await fetch('/api/sfu', {
      method:'POST', cache:'no-store',
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+jeton },
      body: JSON.stringify({ action:action, sessionId:sessionId||'', body:body||null })
    });
    let data={}; try{ data=await rep.json(); }catch(e){}
    if(!rep.ok || data.errorCode){
      const code = data.error || data.errorCode || ('HTTP '+rep.status);
      const err = new Error(code + (data.errorDescription ? ' — '+data.errorDescription : ''));
      err.code = code;
      throw err;
    }
    return data;
  }

  async function serveursIce(){
    const liste=[{ urls:'stun:stun.cloudflare.com:3478' }];
    try{
      const r=await fetch('/api/turn',{cache:'no-store'});
      if(r.ok){ const d=await r.json(); if(Array.isArray(d.iceServers)) return liste.concat(d.iceServers); }
    }catch(e){}
    return liste;
  }

  /* ───────── État ───────── */
  let A=null;                 // appel en cours
  let offInvitations=null, offBandeau=null;
  let entrant=null;           // appel de groupe qui sonne chez moi
  const ignores=new Set();    // appels déjà refusés / ignorés dans cette session

  /* ───────── Styles + écran d'appel de groupe ───────── */
  const css = `
  .gc-screen{position:fixed;inset:0;left:50%;transform:translateX(100%);width:100%;max-width:480px;z-index:640;background:#14161c;color:#fff;display:flex;flex-direction:column;transition:transform .3s cubic-bezier(.4,0,.2,1);font-family:'Segoe UI',Arial,sans-serif}
  .gc-screen.open{transform:translateX(-50%)}
  .gc-top{padding:14px 16px 8px;text-align:center;flex-shrink:0}
  .gc-titre{font-size:17px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .gc-sous{font-size:12.5px;color:#a9adb8;margin-top:3px}
  .gc-grille{flex:1;min-height:0;overflow-y:auto;display:grid;gap:6px;padding:6px;align-content:start}
  .gc-tuile{position:relative;border-radius:14px;overflow:hidden;background:#262a33;display:flex;align-items:center;justify-content:center;min-height:110px}
  .gc-tuile video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}
  .gc-tuile.moi video{transform:scaleX(-1)}
  .gc-tuile .gc-av{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;overflow:hidden}
  .gc-tuile .gc-av img{width:100%;height:100%;object-fit:cover}
  .gc-tuile.avec-video .gc-av{display:none}
  .gc-nom{position:absolute;left:8px;bottom:7px;font-size:12px;font-weight:700;background:rgba(0,0,0,.5);padding:3px 8px;border-radius:10px;max-width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .gc-micoff{position:absolute;right:8px;top:8px;font-size:13px;background:rgba(0,0,0,.55);border-radius:50%;width:26px;height:26px;display:none;align-items:center;justify-content:center}
  .gc-tuile.mic-coupe .gc-micoff{display:flex}
  .gc-tuile.parle{box-shadow:0 0 0 3px #27a945 inset}
  .gc-ctrls{display:flex;justify-content:center;gap:14px;padding:12px 16px calc(18px + env(safe-area-inset-bottom,0px));flex-shrink:0}
  .gc-btn{width:54px;height:54px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:21px;display:flex;align-items:center;justify-content:center;cursor:pointer}
  .gc-btn.actif{background:#fff;color:#111}
  .gc-btn.fin{background:#e63224;width:62px;height:62px;font-size:24px}
  .gc-bandeau{display:none;align-items:center;gap:10px;background:#e8f5e9;border-bottom:1px solid #cfe9d6;padding:9px 14px;flex-shrink:0;font-size:13px;color:#1b5e20;font-weight:700}
  .gc-bandeau.show{display:flex}
  .gc-bandeau span{flex:1;min-width:0}
  .gc-bandeau button{background:#27a945;color:#fff;border:none;border-radius:16px;padding:7px 14px;font-size:12.5px;font-weight:800;cursor:pointer;flex-shrink:0}
  `;
  function preparerInterface(){
    if(document.getElementById('gcScreen')) return;
    const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    const sc=document.createElement('div');
    sc.className='gc-screen'; sc.id='gcScreen';
    sc.innerHTML='<div class="gc-top"><div class="gc-titre" id="gcTitre">Appel de groupe</div><div class="gc-sous" id="gcSous">Connexion…</div></div>'
      +'<div class="gc-grille" id="gcGrille"></div>'
      +'<div class="gc-ctrls">'
      +'<button class="gc-btn" id="gcMic" title="Micro">🎙️</button>'
      +'<button class="gc-btn" id="gcCam" title="Caméra">📷</button>'
      +'<button class="gc-btn" id="gcHp" title="Son">🔊</button>'
      +'<button class="gc-btn fin" id="gcFin" title="Quitter">📵</button>'
      +'</div>';
    document.body.appendChild(sc);
    document.getElementById('gcMic').onclick=basculerMicro;
    document.getElementById('gcCam').onclick=basculerCamera;
    document.getElementById('gcHp').onclick=basculerSon;
    document.getElementById('gcFin').onclick=function(){ fermerVue(); };
    // Bandeau « Appel en cours — Rejoindre » dans la discussion de groupe
    const msgs=document.getElementById('msgsArea');
    if(msgs && !document.getElementById('gcBandeau')){
      const b=document.createElement('div');
      b.className='gc-bandeau'; b.id='gcBandeau';
      b.innerHTML='<span id="gcBandeauTxt">📞 Appel de groupe en cours</span><button id="gcBandeauBtn">Rejoindre</button>';
      msgs.parentNode.insertBefore(b, msgs);
    }
  }
  function fermerVue(){
    // Passe par la pile de vues de la page (hideView('gcall') appelle quitter()).
    if(typeof viewStack!=='undefined' && viewStack[viewStack.length-1]==='gcall' && typeof fermerVueLocale==='function') fermerVueLocale('gcall');
    else quitter();
  }

  /* ───────── Grille des participants ───────── */
  function tuile(uid){ return document.querySelector('#gcGrille .gc-tuile[data-uid="'+uid+'"]'); }
  function creerTuile(uid, info, estMoi){
    let t=tuile(uid);
    if(t) return t;
    t=document.createElement('div');
    t.className='gc-tuile'+(estMoi?' moi':'');
    t.dataset.uid=uid;
    const av=info.photo ? '<img src="'+info.photo+'" alt="" onerror="this.remove()">' : esc(info.ini||'?');
    t.innerHTML='<div class="gc-av" style="background:'+(info.bg||'#555')+'">'+av+'</div>'
      +'<video autoplay playsinline'+(estMoi?' muted':'')+'></video>'
      +'<div class="gc-nom">'+(estMoi?'Vous':esc(info.nom||'Membre'))+'</div>'
      +'<div class="gc-micoff">🔇</div>';
    t.querySelector('video').style.display='none';
    document.getElementById('gcGrille').appendChild(t);
    ajusterGrille();
    return t;
  }
  function supprimerTuile(uid){ const t=tuile(uid); if(t){ t.remove(); ajusterGrille(); } }
  function ajusterGrille(){
    const g=document.getElementById('gcGrille'); if(!g) return;
    const n=g.children.length || 1;
    const cols = n<=1 ? 1 : (n<=4 ? 2 : 3);
    const rangs = Math.ceil(n/cols);
    g.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';
    const h=g.clientHeight-12;
    const hauteur = n<=6 ? Math.max(110, Math.floor((h-(rangs-1)*6)/rangs)) : 150;
    g.style.gridAutoRows=hauteur+'px';
    majSousTitre();
  }
  function majSousTitre(){
    if(!A) return;
    const n=document.querySelectorAll('#gcGrille .gc-tuile').length;
    const el=document.getElementById('gcSous');
    if(el) el.textContent=(A.connecte ? fmt(A.secondes)+' · ' : 'Connexion… · ')+n+' participant'+(n>1?'s':'');
  }
  window.addEventListener('resize', ajusterGrille);

  /* ───────── Négociations (une à la fois) ───────── */
  function enFile(tache){
    A.file = A.file.then(tache).catch(function(e){ etape('Négociation échouée : '+(e&&e.message), true); });
    return A.file;
  }

  async function publierMesFlux(){
    const pc=A.pc;
    const trs=A.stream.getTracks().map(function(t){ return pc.addTransceiver(t,{direction:'sendonly'}); });
    await pc.setLocalDescription(await pc.createOffer());
    const r=await api('tracksNew', A.sessionId, {
      sessionDescription:{ type:'offer', sdp:pc.localDescription.sdp },
      tracks: trs.map(function(tr){ return { location:'local', mid:tr.mid, trackName:tr.sender.track.kind }; })
    });
    await pc.setRemoteDescription(new RTCSessionDescription(r.sessionDescription));
    // Débit vidéo limité : image nette sur téléphone, consommation maîtrisée.
    trs.forEach(function(tr){
      if(tr.sender.track && tr.sender.track.kind==='video'){
        try{
          const p=tr.sender.getParameters();
          if(!p.encodings || !p.encodings.length) p.encodings=[{}];
          p.encodings[0].maxBitrate=DEBIT_VIDEO_MAX;
          p.encodings[0].maxFramerate=20;
          tr.sender.setParameters(p).catch(function(){});
        }catch(e){}
      }
    });
    etape('Mon micro'+(A.type==='video'?' et ma caméra':'')+' envoyés au serveur ✅');
  }

  // Le serveur demande parfois de mettre à jour la connexion (nouveaux flux à recevoir, flux retirés).
  async function renegocierSiDemande(r){
    if(!A || !r || !r.requiresImmediateRenegotiation || !r.sessionDescription) return;
    const pc=A.pc;
    await pc.setRemoteDescription(new RTCSessionDescription(r.sessionDescription));
    const rep=await pc.createAnswer();
    await pc.setLocalDescription(rep);
    await api('renegotiate', A.sessionId, { sessionDescription:{ type:'answer', sdp:rep.sdp } });
  }

  async function recevoirFlux(uid, m, essai){
    if(!A || A.recus[uid] || !m.sessionId) return;
    const pc=A.pc;
    const veutVideo = A.type==='video' && Object.keys(A.recus).filter(function(k){ return A.recus[k].video; }).length < MAX_VIDEOS_RECUES;
    const demandes=[{ location:'remote', sessionId:m.sessionId, trackName:'audio' }];
    if(veutVideo) demandes.push({ location:'remote', sessionId:m.sessionId, trackName:'video' });
    let r;
    try{ r=await api('tracksNew', A.sessionId, { tracks:demandes }); }
    catch(e){
      if((essai||0)<2){ setTimeout(function(){ if(A) enFile(function(){ return recevoirFlux(uid, m, (essai||0)+1); }); }, 1500); return; }
      throw e;
    }
    const mids=[];
    (r.tracks||[]).forEach(function(t){
      if(t.errorCode || !t.mid) return;
      A.mids[t.mid]={ uid:uid, kind:t.trackName };
      mids.push(t.mid);
    });
    A.recus[uid]={ mids:mids, video:veutVideo && mids.length>1 };
    await renegocierSiDemande(r);
    etape('Flux reçus de '+(m.nom||uid)+' ('+(A.recus[uid].video?'son + vidéo':'son')+')');
  }

  async function arreterReception(uid){
    if(!A || !A.recus[uid]) return;
    const mids=A.recus[uid].mids;
    delete A.recus[uid];
    mids.forEach(function(mid){ delete A.mids[mid]; });
    const a=document.getElementById('gcAudio-'+uid); if(a){ a.srcObject=null; a.remove(); }
    if(mids.length){
      try{
        const r=await api('close', A.sessionId, { tracks:mids.map(function(mid){ return {mid:mid}; }), force:true });
        await renegocierSiDemande(r);
      }catch(e){}
    }
  }

  function surFluxRecu(e){
    if(!A) return;
    const mid=e.transceiver && e.transceiver.mid;
    const info=A.mids[mid];
    if(!info) return;
    const flux=new MediaStream([e.track]);
    if(e.track.kind==='audio'){
      let a=document.getElementById('gcAudio-'+info.uid);
      if(!a){ a=document.createElement('audio'); a.id='gcAudio-'+info.uid; a.autoplay=true; a.playsInline=true; document.getElementById('gcScreen').appendChild(a); }
      a.srcObject=flux; a.muted=A.sonCoupe;
      a.play().catch(function(){});
    } else {
      const t=tuile(info.uid) || creerTuile(info.uid, A.membres[info.uid]||{}, false);
      const v=t.querySelector('video');
      v.srcObject=flux; v.style.display='block';
      t.classList.add('avec-video');
      v.play().catch(function(){});
      appliquerEtatMembre(info.uid);
    }
  }

  function appliquerEtatMembre(uid){
    const m=A && A.membres[uid]; const t=tuile(uid);
    if(!m || !t) return;
    t.classList.toggle('mic-coupe', !!m.micCoupe);
    const v=t.querySelector('video');
    const aVideo=!!(v && v.srcObject) && !m.camCoupee;
    t.classList.toggle('avec-video', aVideo);
    if(v) v.style.display = aVideo ? 'block' : 'none';
  }

  /* ───────── Suivi des participants (Firestore) ───────── */
  function ecouterMembres(){
    const ref=db.collection('appelsGroupe').doc(A.appelId).collection('membres');
    A.offMembres=ref.onSnapshot(function(snap){
      if(!A) return;
      const maintenant=Date.now();
      const presents={};
      snap.forEach(function(d){
        const m=d.data();
        const vu=msDe(m.vu) || maintenant;
        if(m.actif && (maintenant-vu)<SEUIL_ACTIF_MS) presents[d.id]=m;
      });
      // Nouveaux arrivants
      Object.keys(presents).forEach(function(uid){
        A.membres[uid]=presents[uid];
        if(uid===currentUid) return;
        creerTuile(uid, presents[uid], false);
        appliquerEtatMembre(uid);
        if(!A.recus[uid] && presents[uid].sessionId) enFile(function(){ return recevoirFlux(uid, presents[uid]); });
      });
      // Départs
      Object.keys(A.membres).forEach(function(uid){
        if(uid===currentUid || presents[uid]) return;
        delete A.membres[uid];
        supprimerTuile(uid);
        enFile(function(){ return arreterReception(uid); });
      });
      majSousTitre();
    }, function(err){ etape('Écoute des participants impossible : '+(err&&err.message), true); });
  }

  /* ───────── Rejoindre / lancer ───────── */
  async function monInfo(){
    const mi = (typeof obtenirMonInfo==='function') ? await obtenirMonInfo() : {nom:'Moi',ini:'?',bg:'#555'};
    const ph = (typeof photoDe==='function') ? photoDe(currentUid) : '';
    return { nom:mi.nom||'Moi', ini:mi.ini||'?', bg:mi.bg||'#555', photo:ph||'' };
  }

  async function rejoindre(appelId, infosAppel){
    if(A){ toast('Un appel de groupe est déjà en cours','r'); return; }
    if(!window.RTCPeerConnection){ toast('Appels non pris en charge par ce navigateur','r'); return; }
    preparerInterface();
    const type=infosAppel.type==='video'?'video':'audio';
    // Limite de 50 participants
    try{
      const s=await db.collection('appelsGroupe').doc(appelId).collection('membres').where('actif','==',true).get();
      let n=0; const now=Date.now();
      s.forEach(function(d){ const vu=msDe(d.data().vu)||now; if(now-vu<SEUIL_ACTIF_MS && d.id!==currentUid) n++; });
      if(n>=MAX_PARTICIPANTS){ toast('Appel complet ('+MAX_PARTICIPANTS+' participants maximum)','r'); return; }
    }catch(e){}

    let stream;
    try{
      stream=await navigator.mediaDevices.getUserMedia({
        audio:{ echoCancellation:true, noiseSuppression:true, autoGainControl:true },
        video: type==='video' ? { width:{ideal:640}, height:{ideal:480}, facingMode:'user' } : false
      });
    }catch(err){
      toast(err && err.name==='NotAllowedError' ? 'Micro/caméra bloqués — autorisez-les dans les réglages du site' : 'Micro/caméra indisponibles','r',4000);
      return;
    }

    const moi=await monInfo();
    A={ appelId:appelId, convId:infosAppel.convId, type:type, stream:stream, pc:null, sessionId:null,
        file:Promise.resolve(), mids:{}, recus:{}, membres:{}, offMembres:null, battement:null,
        micCoupe:false, camCoupee:false, sonCoupe:false, connecte:false, secondes:0, chrono:null };

    document.getElementById('gcTitre').textContent=(type==='video'?'📹 ':'📞 ')+(infosAppel.nomGroupe||'Appel de groupe');
    document.getElementById('gcCam').style.display = type==='video' ? '' : 'none';
    ['gcMic','gcCam','gcHp'].forEach(function(id){ document.getElementById(id).classList.remove('actif'); });
    document.getElementById('gcMic').textContent='🎙️'; document.getElementById('gcCam').textContent='📷'; document.getElementById('gcHp').textContent='🔊';
    document.getElementById('gcGrille').innerHTML='';
    const t=creerTuile(currentUid, moi, true);
    if(type==='video'){ const v=t.querySelector('video'); v.srcObject=stream; v.style.display='block'; t.classList.add('avec-video'); }
    const ecran=document.getElementById('gcScreen');
    try{ ecran.style.paddingTop=(typeof getEmbedTopOffsetPx==='function'?getEmbedTopOffsetPx():0)+'px'; }catch(e){}
    ecran.classList.add('open');
    if(typeof pushView==='function') pushView('gcall');
    try{ if(window.parent && window.parent!==window) window.parent.postMessage({type:'appelDecroche'},'*'); }catch(e){}
    setTimeout(ajusterGrille, 350);

    try{
      etape('— Appel de groupe ('+type+') : connexion au serveur… —');
      const ice=await serveursIce();
      A.pc=new RTCPeerConnection({ iceServers:ice, bundlePolicy:'max-bundle' });
      A.pc.ontrack=surFluxRecu;
      A.pc.onconnectionstatechange=function(){
        if(!A) return;
        etape('Connexion au serveur : '+A.pc.connectionState);
        if(A.pc.connectionState==='connected' && !A.connecte){
          A.connecte=true;
          A.chrono=setInterval(function(){ if(A){ A.secondes++; majSousTitre(); } },1000);
        }
        if(A.pc.connectionState==='failed'){ toast('Connexion perdue','r'); setTimeout(fermerVue, 1200); }
      };
      const s=await api('newSession');
      A.sessionId=s.sessionId;
      await enFile(publierMesFlux);
      const refMoi=db.collection('appelsGroupe').doc(appelId).collection('membres').doc(currentUid);
      await refMoi.set({ sessionId:A.sessionId, nom:moi.nom, ini:moi.ini, bg:moi.bg, photo:moi.photo,
        actif:true, micCoupe:false, camCoupee:false, vu:fv().serverTimestamp(), rejointLe:fv().serverTimestamp() });
      A.battement=setInterval(function(){ refMoi.set({ vu:fv().serverTimestamp() },{merge:true}).catch(function(){}); }, BATTEMENT_MS);
      ecouterMembres();
    }catch(err){
      etape('Échec de l\'appel de groupe : '+(err&&err.message), true);
      const msg = err && err.code==='not_configured' ? 'Appels de groupe pas encore activés (configuration Cloudflare à faire)'
        : err && err.code==='not_signed_in' ? 'Reconnectez-vous puis réessayez'
        : 'Connexion à l\'appel impossible — réessayez';
      toast(msg,'r',4500);
      setTimeout(fermerVue, 600);
    }
  }

  async function lancer(type){
    if(!currentEstGroupe || !currentConvId){ return; }
    if(A){ toast('Un appel de groupe est déjà en cours','r'); return; }
    // Un appel est déjà en cours dans ce groupe : on le rejoint au lieu d'en créer un autre.
    const existant=await appelActifDuGroupe(currentConvId);
    if(existant){ return rejoindre(existant.id, existant.data); }
    const moi=await monInfo();
    const donnees={ convId:currentConvId, nomGroupe:currentChatName||'Groupe', type:type==='video'?'video':'audio',
      lancePar:currentUid, lanceParNom:moi.nom, invites:(currentGroupParticipants||[]).slice(0,200),
      statut:'actif', creeLe:fv().serverTimestamp() };
    try{
      const ref=await db.collection('appelsGroupe').add(donnees);
      if(typeof messageSystemeGroupe==='function') messageSystemeGroupe(currentConvId, 'a lancé un appel '+(type==='video'?'vidéo':'audio')+' de groupe');
      rejoindre(ref.id, donnees);
    }catch(err){
      etape('Création de l\'appel de groupe impossible : '+(err&&err.message), true);
      toast('⚠️ Impossible de lancer l\'appel (autorisation ou connexion)','r',4000);
    }
  }

  async function appelActifDuGroupe(convId){
    try{
      const s=await db.collection('appelsGroupe').where('convId','==',convId).get();
      let trouve=null;
      for(const d of s.docs){
        const x=d.data();
        if(x.statut!=='actif') continue;
        if(Date.now()-msDe(x.creeLe) > 6*3600*1000) continue;
        if(await nbPresents(d.id) > 0){ trouve={id:d.id, data:x}; break; }
      }
      return trouve;
    }catch(e){ return null; }
  }
  async function nbPresents(appelId){
    try{
      const s=await db.collection('appelsGroupe').doc(appelId).collection('membres').where('actif','==',true).get();
      let n=0; const now=Date.now();
      s.forEach(function(d){ const vu=msDe(d.data().vu)||now; if(now-vu<SEUIL_ACTIF_MS) n++; });
      return n;
    }catch(e){ return 0; }
  }

  /* ───────── Quitter ───────── */
  function quitter(){
    if(!A) return;
    const a=A; A=null;
    clearInterval(a.battement); clearInterval(a.chrono);
    if(a.offMembres) a.offMembres();
    try{ a.stream.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
    try{ if(a.pc) a.pc.close(); }catch(e){}
    document.querySelectorAll('#gcScreen audio').forEach(function(el){ el.srcObject=null; el.remove(); });
    const ecran=document.getElementById('gcScreen'); if(ecran) ecran.classList.remove('open');
    const g=document.getElementById('gcGrille'); if(g) g.innerHTML='';
    const ref=db.collection('appelsGroupe').doc(a.appelId);
    ref.collection('membres').doc(currentUid).set({ actif:false },{merge:true}).then(async function(){
      // Dernière personne à partir : l'appel est terminé.
      if(await nbPresents(a.appelId)===0) ref.set({ statut:'termine', termineLe:fv().serverTimestamp() },{merge:true}).catch(function(){});
    }).catch(function(){});
    try{ if(window.parent && window.parent!==window) window.parent.postMessage({type:'appelFin'},'*'); }catch(e){}
    etape('Appel de groupe quitté');
  }

  /* ───────── Contrôles ───────── */
  function majMonEtat(champs){
    if(!A) return;
    db.collection('appelsGroupe').doc(A.appelId).collection('membres').doc(currentUid).set(champs,{merge:true}).catch(function(){});
  }
  function basculerMicro(){
    if(!A) return;
    A.micCoupe=!A.micCoupe;
    A.stream.getAudioTracks().forEach(function(t){ t.enabled=!A.micCoupe; });
    const b=document.getElementById('gcMic'); b.classList.toggle('actif',A.micCoupe); b.textContent=A.micCoupe?'🔇':'🎙️';
    const t=tuile(currentUid); if(t) t.classList.toggle('mic-coupe',A.micCoupe);
    majMonEtat({ micCoupe:A.micCoupe });
  }
  function basculerCamera(){
    if(!A || A.type!=='video') return;
    A.camCoupee=!A.camCoupee;
    A.stream.getVideoTracks().forEach(function(t){ t.enabled=!A.camCoupee; });
    const b=document.getElementById('gcCam'); b.classList.toggle('actif',A.camCoupee); b.textContent=A.camCoupee?'🚫':'📷';
    const t=tuile(currentUid);
    if(t){ t.classList.toggle('avec-video',!A.camCoupee); t.querySelector('video').style.display=A.camCoupee?'none':'block'; }
    majMonEtat({ camCoupee:A.camCoupee });
  }
  function basculerSon(){
    if(!A) return;
    A.sonCoupe=!A.sonCoupe;
    document.querySelectorAll('#gcScreen audio').forEach(function(a){ a.muted=A.sonCoupe; });
    const b=document.getElementById('gcHp'); b.classList.toggle('actif',A.sonCoupe); b.textContent=A.sonCoupe?'🔈':'🔊';
  }

  /* ───────── Appel de groupe qui sonne chez moi ───────── */
  function ecouterInvitations(monUid){
    if(offInvitations || !monUid) return;
    offInvitations=db.collection('appelsGroupe').where('invites','array-contains',monUid).onSnapshot(function(snap){
      snap.docChanges().forEach(function(chg){
        if(chg.type==='removed') return;
        const d=chg.doc.data(), id=chg.doc.id;
        if(d.statut!=='actif' || d.lancePar===monUid || ignores.has(id)) return;
        const cree=msDe(d.creeLe);
        if(!cree || Date.now()-cree > 90000) return;          // sonnerie seulement à l'ouverture de l'appel
        if(A || entrant || (typeof viewStack!=='undefined' && (viewStack.indexOf('call')!==-1 || viewStack.indexOf('incall')!==-1))) return;
        afficherEntrant(id, d);
      });
    }, function(err){ etape('Écoute des appels de groupe impossible : '+(err&&err.message), true); });
  }
  function afficherEntrant(id, d){
    entrant={ id:id, data:d };
    document.getElementById('icName').textContent=d.nomGroupe||'Groupe';
    document.getElementById('icSub').textContent=(d.type==='video'?'Appel vidéo de groupe':'Appel audio de groupe')+' · lancé par '+(d.lanceParNom||'un membre');
    const av=document.getElementById('icAvatar');
    av.textContent='👥'; av.style.background=(typeof gradientPourId==='function')?gradientPourId(d.convId||id):'#555';
    document.getElementById('incomingCallScreen').classList.add('open');
    if(typeof pushView==='function') pushView('incall');
    if(typeof demarrerSonnerie==='function') demarrerSonnerie('entrant');
    // Sonne au plus 35 s
    entrant.minuteur=setTimeout(function(){ if(entrant && entrant.id===id){ ignorerEntrant(); fermerIncall(); } },35000);
  }
  function fermerIncall(){
    if(typeof viewStack!=='undefined' && viewStack[viewStack.length-1]==='incall' && typeof fermerVueLocale==='function') fermerVueLocale('incall');
  }
  function ignorerEntrant(){
    if(!entrant) return;
    ignores.add(entrant.id);
    clearTimeout(entrant.minuteur);
    if(typeof arreterSonnerie==='function') arreterSonnerie();
    document.getElementById('incomingCallScreen').classList.remove('open');
    entrant=null;
  }

  /* Les boutons « Accepter / Refuser » de l'écran d'appel servent aux deux sortes
     d'appel : on n'intercepte QUE lorsqu'un appel de groupe sonne. */
  const accepterOrigine=window.appelAccepter, refuserOrigine=window.appelRefuser, annulerOrigine=window.appelAnnulerSiSonne;
  window.appelAccepter=function(){
    if(!entrant) return accepterOrigine && accepterOrigine.apply(this, arguments);
    const e=entrant;
    clearTimeout(e.minuteur); ignores.add(e.id);
    if(typeof arreterSonnerie==='function') arreterSonnerie();
    document.getElementById('incomingCallScreen').classList.remove('open');
    entrant=null;
    if(typeof viewStack!=='undefined' && viewStack[viewStack.length-1]==='incall'){ viewStack.pop(); history.replaceState({depth:viewStack.length},'',location.href); }
    rejoindre(e.id, e.data);
  };
  window.appelRefuser=function(){
    if(!entrant) return refuserOrigine && refuserOrigine.apply(this, arguments);
    ignorerEntrant();
    fermerIncall();
  };
  window.appelAnnulerSiSonne=function(){
    if(!entrant) return annulerOrigine && annulerOrigine.apply(this, arguments);
    ignorerEntrant();
  };

  /* ───────── Bandeau « Appel en cours » dans la discussion de groupe ───────── */
  function surOuvertureGroupe(convId){
    preparerInterface();
    surFermetureGroupe();
    offBandeau=db.collection('appelsGroupe').where('convId','==',convId).onSnapshot(async function(snap){
      const b=document.getElementById('gcBandeau'); if(!b) return;
      if(typeof currentConvId!=='undefined' && currentConvId!==convId) return;
      let actif=null;
      for(const d of snap.docs){
        const x=d.data();
        if(x.statut==='actif' && Date.now()-msDe(x.creeLe) < 6*3600*1000){ actif={id:d.id,data:x}; break; }
      }
      const n = actif ? await nbPresents(actif.id) : 0;
      if(!actif || n===0 || (A && A.appelId===actif.id)){ b.classList.remove('show'); return; }
      document.getElementById('gcBandeauTxt').textContent=(actif.data.type==='video'?'📹 Appel vidéo':'📞 Appel audio')+' en cours · '+n+' participant'+(n>1?'s':'');
      document.getElementById('gcBandeauBtn').onclick=function(){ rejoindre(actif.id, actif.data); };
      b.classList.add('show');
    }, function(){});
  }
  function surFermetureGroupe(){
    if(offBandeau){ offBandeau(); offBandeau=null; }
    const b=document.getElementById('gcBandeau'); if(b) b.classList.remove('show');
  }

  /* Démarrage : écoute des invitations dès que la personne est connectée. */
  try{
    firebase.auth().onAuthStateChanged(function(u){
      if(offInvitations){ offInvitations(); offInvitations=null; }
      if(u) setTimeout(function(){ ecouterInvitations(u.uid); }, 1500);
    });
  }catch(e){}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', preparerInterface); else preparerInterface();

  return { lancer:lancer, rejoindre:rejoindre, quitter:quitter, enCours:function(){ return !!A; },
           surOuvertureGroupe:surOuvertureGroupe, surFermetureGroupe:surFermetureGroupe };
})();
