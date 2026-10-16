/* ══════════════════════════════════════════════════════════════════════
   appels-bascule.js — Passer d'un appel AUDIO à la VIDÉO (et l'inverse)
   pendant un appel à deux, comme sur WhatsApp.

   ⚠️ Ce fichier NE MODIFIE PAS appels.js. Il se branche à côté :
   - il lit l'appel en cours (_pc, _appelId, _appelRole, callStream) ;
   - il échange les informations de vidéo par le même document Firestore
     « appels/{id} » (champs : bascule, basculeReponse, video) ;
   - si on retire ce fichier, les appels redeviennent exactement comme avant.

   Fonctionnement :
   - Allumer ma caméra dans un appel audio → la vidéo est ajoutée à l'appel
     (petite renégociation automatique), l'autre voit ma vidéo.
   - Éteindre ma caméra → l'image s'arrête, l'autre revoit mon avatar,
     l'appel continue en audio.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
  let suiviAppelId=null, offDoc=null, pcSuivi=null;
  let maVideo=null;            // ma piste caméra en cours (ou null)
  let monNumeroOffre=0, derniereOffreTraitee=0, derniereReponseTraitee=0;
  let videoDistanteActive=false, fluxDistantVideo=null;

  function etape(t, err){ try{ if(window.ajouterEtape) ajouterEtape('📹 '+t, err); }catch(e){} }
  function pc(){ try{ return (typeof _pc!=='undefined') ? _pc : null; }catch(e){ return null; } }
  function appelId(){ try{ return (typeof _appelId!=='undefined') ? _appelId : null; }catch(e){ return null; } }
  function role(){ try{ return (typeof _appelRole!=='undefined') ? _appelRole : null; }catch(e){ return null; } }
  function typeAppel(){ try{ return (typeof callType!=='undefined') ? callType : 'audio'; }catch(e){ return 'audio'; } }
  function refDoc(){ return db.collection('appels').doc(appelId()); }
  function toastSur(m,t){ try{ if(window.toast) toast(m,t); }catch(e){} }

  // Transceiver vidéo de la connexion (créé par la caméra de l'un ou de l'autre).
  function transceiverVideo(p){
    return p.getTransceivers().find(function(t){
      return !t.stopped && t.receiver && t.receiver.track && t.receiver.track.kind==='video';
    }) || null;
  }

  /* ── Bouton caméra ── */
  function majBouton(){
    const b=document.getElementById('callCamBtn'); if(!b) return;
    const allumee=!!(maVideo && maVideo.readyState==='live');
    b.style.display='';
    b.textContent='📹';
    b.classList.toggle('cam-on', allumee);
    b.classList.toggle('active', !allumee);
    b.title = allumee ? 'Éteindre ma caméra (repasser en audio)' : 'Allumer ma caméra (passer en vidéo)';
  }
  function afficherMaVideo(track){
    const wrap=document.getElementById('callLocalWrap'), v=document.getElementById('callLocalVideo');
    if(!wrap || !v) return;
    if(track){ v.srcObject=new MediaStream([track]); wrap.classList.add('show'); }
    else { v.srcObject=null; wrap.classList.remove('show','agrandi'); }
  }
  function afficherVideoDistante(){
    const rv=document.getElementById('callRemoteVideo'), av=document.getElementById('callAvatarBig');
    if(!rv) return;
    const montrer = videoDistanteActive && fluxDistantVideo;
    if(montrer){
      if(rv.srcObject!==fluxDistantVideo) rv.srcObject=fluxDistantVideo;
      // Dans un appel commencé en audio, le son passe déjà par l'autre lecteur : pas de double son.
      if(typeAppel()!=='video') rv.muted=true;
      rv.style.display='block'; rv.play && rv.play().catch(function(){});
      if(av) av.style.display='none';
    } else if(typeAppel()!=='video' || videoDistanteActive===false){
      rv.style.display='none';
      if(av) av.style.display='flex';
    }
  }

  /* ── Renégociation (quand la vidéo est ajoutée à un appel qui n'en avait pas) ── */
  async function envoyerNouvelleOffre(){
    const p=pc(); if(!p) return;
    if(p.signalingState!=='stable'){ etape('Renégociation repoussée (état '+p.signalingState+')'); setTimeout(envoyerNouvelleOffre, 800); return; }
    const offre=await p.createOffer();
    await p.setLocalDescription(offre);
    monNumeroOffre=Date.now();
    await refDoc().set({ bascule:{ de:currentUid, n:monNumeroOffre, offre:{ type:offre.type, sdp:offre.sdp } } },{merge:true});
    etape('Nouvelle offre vidéo envoyée');
  }
  async function surDocAppel(d){
    const p=pc(); if(!p || !d) return;
    // 1) L'autre a ajouté sa vidéo : on applique son offre et on répond.
    const b=d.bascule;
    if(b && b.de!==currentUid && b.n>derniereOffreTraitee){
      derniereOffreTraitee=b.n;
      try{
        if(p.signalingState!=='stable'){
          // Les deux ont appuyé en même temps : celui qui a reçu l'appel laisse la priorité.
          if(role()==='appelant'){ etape('Offres croisées — priorité à la mienne'); return; }
          await p.setLocalDescription({type:'rollback'});
        }
        await p.setRemoteDescription(new RTCSessionDescription(b.offre));
        const rep=await p.createAnswer();
        await p.setLocalDescription(rep);
        await refDoc().set({ basculeReponse:{ de:currentUid, n:b.n, reponse:{ type:rep.type, sdp:rep.sdp } } },{merge:true});
        etape('Offre vidéo du correspondant acceptée');
      }catch(e){ etape('Échec application offre vidéo : '+(e&&e.message), true); }
    }
    // 2) Réponse à MON offre.
    const r=d.basculeReponse;
    if(r && r.de!==currentUid && r.n===monNumeroOffre && r.n>derniereReponseTraitee){
      derniereReponseTraitee=r.n;
      try{ await p.setRemoteDescription(new RTCSessionDescription(r.reponse)); etape('Vidéo ajoutée à l\'appel ✅'); }
      catch(e){ etape('Échec réponse vidéo : '+(e&&e.message), true); }
    }
    // 3) Caméra de l'autre allumée / éteinte.
    const v=d.video||{};
    const autres=Object.keys(v).filter(function(u){ return u!==currentUid; });
    if(autres.length){
      const etat=v[autres[0]]===true;
      if(etat!==videoDistanteActive){
        videoDistanteActive=etat;
        if(!etat) toastSur('📷 Votre correspondant a éteint sa caméra','');
        else if(typeAppel()!=='video') toastSur('📹 Votre correspondant a allumé sa caméra','g');
      }
      afficherVideoDistante();
    }
  }
  function surPiste(e){
    if(!e.track || e.track.kind!=='video') return;
    fluxDistantVideo = (e.streams && e.streams[0]) ? e.streams[0] : new MediaStream([e.track]);
    // Appel vidéo dès le départ : la vidéo de l'autre est active tant qu'il ne l'éteint pas.
    if(typeAppel()==='video' && videoDistanteActive===false && !(e.track.muted)) videoDistanteActive=true;
    afficherVideoDistante();
  }

  /* ── Suivi automatique de l'appel en cours ── */
  function attacher(id, p){
    detacher();
    suiviAppelId=id; pcSuivi=p;
    monNumeroOffre=0; derniereOffreTraitee=0; derniereReponseTraitee=0;
    fluxDistantVideo=null;
    videoDistanteActive = (typeAppel()==='video');
    const vt = (typeof callStream!=='undefined' && callStream) ? callStream.getVideoTracks()[0] : null;
    maVideo = (vt && vt.readyState==='live') ? vt : null;
    p.addEventListener('track', surPiste);
    offDoc=db.collection('appels').doc(id).onSnapshot(function(s){ surDocAppel(s.data()); }, function(){});
    majBouton();
  }
  function detacher(){
    if(offDoc){ try{ offDoc(); }catch(e){} offDoc=null; }
    if(pcSuivi){ try{ pcSuivi.removeEventListener('track', surPiste); }catch(e){} pcSuivi=null; }
    suiviAppelId=null; maVideo=null; fluxDistantVideo=null; videoDistanteActive=false;
  }
  setInterval(function(){
    const id=appelId(), p=pc();
    if(id && p && (id!==suiviAppelId || p!==pcSuivi)) attacher(id,p);
    else if((!id || !p) && suiviAppelId) detacher();
  }, 700);

  /* ── Le bouton 📹 ── */
  window.basculerVideoAppel = async function(){
    const p=pc(), id=appelId();
    if(!p || !id){ toastSur('⏳ Attendez que l\'appel soit en cours',''); return; }
    // ÉTEINDRE ma caméra
    if(maVideo && maVideo.readyState==='live'){
      const t=transceiverVideo(p);
      try{ if(t) await t.sender.replaceTrack(null); }catch(e){}
      try{ maVideo.stop(); if(typeof callStream!=='undefined' && callStream) callStream.removeTrack(maVideo); }catch(e){}
      maVideo=null;
      afficherMaVideo(null);
      majBouton();
      refDoc().set({ video:{ [currentUid]:false } },{merge:true}).catch(function(){});
      etape('Caméra éteinte — l\'appel continue en audio');
      return;
    }
    // ALLUMER ma caméra
    if(p.connectionState!=='connected'){ toastSur('⏳ Attendez que l\'appel soit connecté',''); return; }
    let track;
    try{
      const s=await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'user' } });
      track=s.getVideoTracks()[0];
    }catch(err){
      toastSur(err && err.name==='NotAllowedError' ? '📷 Caméra bloquée — autorisez-la dans les réglages du site' : '📷 Caméra indisponible','r');
      return;
    }
    maVideo=track;
    try{ if(typeof callStream!=='undefined' && callStream) callStream.addTrack(track); }catch(e){}
    afficherMaVideo(track);
    majBouton();
    try{
      const t=transceiverVideo(p);
      const peutEnvoyer = t && (t.currentDirection==='sendrecv' || t.currentDirection==='sendonly');
      if(t && peutEnvoyer){
        await t.sender.replaceTrack(track);                 // déjà prévu : aucune renégociation
      } else if(t){
        t.direction='sendrecv'; await t.sender.replaceTrack(track);
        await envoyerNouvelleOffre();
      } else {
        p.addTrack(track, (typeof callStream!=='undefined' && callStream) ? callStream : new MediaStream([track]));
        await envoyerNouvelleOffre();
      }
      await refDoc().set({ video:{ [currentUid]:true } },{merge:true});
      etape('Caméra allumée');
    }catch(e){
      etape('Passage en vidéo impossible : '+(e&&e.message), true);
      toastSur('⚠️ Passage en vidéo impossible','r');
    }
  };
})();
