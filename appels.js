/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — appels.js
   ══════════════════════════════════════════════════════════════════════
   Fichier unique regroupant les deux parties du système d'appel réel :
   PARTIE 1 — SIGNALISATION (juste en dessous) : échanges Firestore purs.
   PARTIE 2 — APPEL (plus bas) : connexion WebRTC réelle.
   Chargé en tout dernier dans discussion_v1.html, il réutilise les
   variables et fonctions déjà déclarées sur cette même page (db,
   currentUid, currentOtherUid, currentConvId, callStream, pushView,
   requestClose, logCallBubble, obtenirMonInfo, prepareCallScreen, etc.).

   Version DIAGNOSTIC (13/10/2026) : toutes les étapes clés et toutes les
   erreurs (envoi/réception des candidats réseau, erreurs du relais TURN)
   sont maintenant affichées dans le panneau 🛠️, pour trouver pourquoi
   l'appel reste bloqué sur « Connexion… ».
   ══════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════ PARTIE 1 — SIGNALISATION ════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — Signalisation des appels (audio/vidéo réels)
   ══════════════════════════════════════════════════════════════════════
   Ce fichier ne contient AUCUNE logique WebRTC (micro, caméra, flux
   audio/vidéo) : il ne fait que déposer et lire, dans Firestore, les
   informations nécessaires pour que deux téléphones se trouvent et se
   connectent DIRECTEMENT entre eux (offre, réponse, candidats réseau ICE).

   Schéma Firestore utilisé :

   appels/{appelId}
     appelantUid, appelantNom, appelantIni, appelantBg   → qui appelle
     destinataireUid                                     → qui est appelé
     convId      : l'id de conversation entre les deux (pour référence)
     type        : 'audio' | 'video'
     statut      : 'sonne' | 'accepte' | 'refuse' | 'raccroche' | 'manque'
     offre       : { type, sdp }   → description de session de l'appelant
     reponse     : { type, sdp }   → description de session du destinataire
     creeLe      : horodatage serveur

   appels/{appelId}/candidatsAppelant/{auto}      candidats réseau de l'appelant
   appels/{appelId}/candidatsDestinataire/{auto}  candidats réseau du destinataire
   ══════════════════════════════════════════════════════════════════════ */
window.Signalisation = (function(){

  // Log une erreur en console ET dans le panneau 🛠️ visible à l'écran.
  function _logErreur(texte, err){
    console.error(texte, err);
    if(window.ajouterEtape) ajouterEtape('❌ '+texte+(err&&err.message?' — '+err.message:''), true);
  }

  function refAppel(appelId){ return db.collection('appels').doc(appelId); }

  async function creerAppel(donnees){
    const doc = await db.collection('appels').add({
      appelantUid: donnees.appelantUid,
      appelantNom: donnees.appelantNom || 'Utilisateur',
      appelantIni: donnees.appelantIni || '?',
      appelantBg: donnees.appelantBg || '#999',
      destinataireUid: donnees.destinataireUid,
      convId: donnees.convId || null,
      type: donnees.type,
      statut: 'sonne',
      offre: donnees.offre,
      creeLe: firebase.firestore.FieldValue.serverTimestamp()
    });
    return doc.id;
  }

  function envoyerReponse(appelId, reponse){
    return refAppel(appelId).update({ reponse: reponse, statut: 'accepte' });
  }

  function mettreAJourStatut(appelId, statut){
    return refAppel(appelId).set({ statut: statut }, { merge:true })
      .catch(function(e){ _logErreur('Statut appel non mis à jour', e); });
  }

  function ecouterAppel(appelId, callback){
    return refAppel(appelId).onSnapshot(function(doc){
      if(doc.exists) callback(doc.data());
    }, function(err){ _logErreur('Écoute de l\'appel impossible', err); });
  }

  function ecouterAppelsEntrants(monUid, callback){
    if(window.ajouterEtape) ajouterEtape('📞 Écoute des appels entrants démarrée (uid : '+monUid+')');
    return db.collection('appels')
      .where('destinataireUid','==',monUid)
      .where('statut','==','sonne')
      .onSnapshot(function(snap){
        snap.docChanges().forEach(function(chg){
          if(chg.type==='added') callback(chg.doc.id, chg.doc.data());
        });
      }, function(err){ _logErreur('Écoute des appels entrants impossible', err); });
  }

  // DIAGNOSTIC : une erreur d'envoi est maintenant visible dans le panneau 🛠️
  // (avant, elle n'allait que dans la console, invisible sur téléphone).
  let _erreursEnvoiCandidat=0;
  function ajouterCandidat(appelId, sousCollection, candidat){
    return refAppel(appelId).collection(sousCollection).add({ candidat: JSON.stringify(candidat) })
      .catch(function(e){
        _erreursEnvoiCandidat++;
        if(_erreursEnvoiCandidat<=3) _logErreur('Candidat réseau NON envoyé ('+sousCollection+')', e);
      });
  }

  function ecouterCandidats(appelId, sousCollection, callback){
    return refAppel(appelId).collection(sousCollection).onSnapshot(function(snap){
      snap.docChanges().forEach(function(chg){
        if(chg.type==='added'){
          try{ callback(JSON.parse(chg.doc.data().candidat)); }
          catch(e){ _logErreur('Candidat réseau illisible', e); }
        }
      });
    }, function(err){ _logErreur('Écoute des candidats réseau impossible ('+sousCollection+')', err); });
  }

  async function supprimerAppel(appelId){
    try{
      const sousCols=['candidatsAppelant','candidatsDestinataire'];
      for(const nom of sousCols){
        const snap=await refAppel(appelId).collection(nom).get();
        if(snap.size>0){
          const lot=db.batch();
          snap.docs.forEach(function(d){ lot.delete(d.ref); });
          await lot.commit();
        }
      }
      await refAppel(appelId).delete();
    }catch(e){ console.error('Nettoyage de l\'appel impossible :', e); }
  }

  return {
    creerAppel: creerAppel,
    envoyerReponse: envoyerReponse,
    mettreAJourStatut: mettreAJourStatut,
    ecouterAppel: ecouterAppel,
    ecouterAppelsEntrants: ecouterAppelsEntrants,
    ajouterCandidat: ajouterCandidat,
    ecouterCandidats: ecouterCandidats,
    supprimerAppel: supprimerAppel
  };
})();

/* ════════════════════════════ PARTIE 2 — APPEL ════════════════════════════ */

/* Serveurs réseau utilisés pour établir la connexion :
   - TURN (Cloudflare Realtime) via /api/turn (identifiants temporaires).
   - Liste de SECOURS (ancien TURN public Open Relay) si /api/turn ne répond pas. */

const ICE_SERVERS_SECOURS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' }
];

let ICE_SERVERS = ICE_SERVERS_SECOURS;
let _iceChargeLe = 0;

async function chargerIceServers(){
  if(Date.now() - _iceChargeLe < 30*60*1000){
    ajouterEtape('Serveurs réseau : relais Cloudflare déjà chargé (réutilisé)');
    return;
  }
  try{
    const ctrl = new AbortController();
    const to = setTimeout(function(){ ctrl.abort(); }, 4000);
    const rep = await fetch('/api/turn', { cache:'no-store', signal: ctrl.signal });
    clearTimeout(to);
    if(!rep.ok) throw new Error('HTTP '+rep.status);
    const data = await rep.json();
    if(Array.isArray(data.iceServers) && data.iceServers.length){
      ICE_SERVERS = data.iceServers;
      _iceChargeLe = Date.now();
      let nbAdresses=0;
      data.iceServers.forEach(function(s){ nbAdresses += Array.isArray(s.urls) ? s.urls.length : 1; });
      ajouterEtape('Serveurs réseau : relais Cloudflare chargé ('+nbAdresses+' adresses)');
    } else {
      throw new Error('réponse vide');
    }
  }catch(e){
    ICE_SERVERS = ICE_SERVERS_SECOURS;
    ajouterEtape('Serveurs réseau : relais Cloudflare indisponible, liste de secours utilisée ('+(e && e.message || e)+')');
  }
}

let _pc=null, _appelId=null, _appelRole=null;
let _offDocAppel=null, _offCandidatsDistants=null, _offEntrants=null;

// Candidats du correspondant reçus AVANT la description distante : mis en attente.
let _candidatsDistantsTampon=[], _descDistantePrete=false;
function _typeCandidat(cand){
  const m=/ typ (\w+)/.exec((cand && cand.candidate)||'');
  return m?m[1]:'?';
}
function recevoirCandidatDistant(cand){
  if(!_pc) return;
  if(!_descDistantePrete){
    _candidatsDistantsTampon.push(cand);
    ajouterEtape('Candidat réseau DISTANT reçu (en attente) : '+_typeCandidat(cand));
    return;
  }
  ajouterEtape('Candidat réseau DISTANT reçu : '+_typeCandidat(cand));
  _pc.addIceCandidate(new RTCIceCandidate(cand)).catch(function(e){
    if(window.ajouterEtape) ajouterEtape('⚠️ Candidat distant refusé : '+(e&&e.message||e), true);
  });
}
function descriptionDistantePrete(){
  _descDistantePrete=true;
  const liste=_candidatsDistantsTampon; _candidatsDistantsTampon=[];
  if(liste.length) ajouterEtape('Application de '+liste.length+' candidat(s) distant(s) mis en attente');
  liste.forEach(recevoirCandidatDistant);
}
function reinitialiserCandidats(){
  _candidatsDistantsTampon=[]; _descDistantePrete=false;
}
function noterCandidatLocal(c){
  if(!window.ajouterEtape || !c) return;
  ajouterEtape('Candidat réseau local : '+_typeCandidat(c));
}
let _sonnerieTimeoutId=null;
let _appelEnCoursDestinataire=null;

/* ══════════════ SONNERIE (tonalité sonore) ══════════════ */
let _sonnerieCtx=null, _sonnerieTimers=[];

function _obtenirContexteAudio(){
  if(!_sonnerieCtx){
    try{ _sonnerieCtx = new (window.AudioContext||window.webkitAudioContext)(); }
    catch(e){ return null; }
  }
  if(_sonnerieCtx.state==='suspended') _sonnerieCtx.resume().catch(function(){});
  return _sonnerieCtx;
}
['click','touchstart'].forEach(function(evt){
  document.addEventListener(evt, function(){ _obtenirContexteAudio(); }, { once:true, passive:true });
});

function _bip(ctx, freq, debut, duree){
  const osc=ctx.createOscillator(), gain=ctx.createGain();
  osc.frequency.value=freq; osc.type='sine';
  gain.gain.setValueAtTime(0, ctx.currentTime+debut);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime+debut+0.02);
  gain.gain.setValueAtTime(0.18, ctx.currentTime+debut+duree-0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime+debut+duree);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(ctx.currentTime+debut); osc.stop(ctx.currentTime+debut+duree);
}

function demarrerSonnerie(motif){
  arreterSonnerie();
  const ctx=_obtenirContexteAudio();
  if(!ctx) return;
  const cycle = motif==='entrant' ? 1800 : 3000;
  function jouerCycle(){
    if(motif==='entrant'){ _bip(ctx,880,0,0.35); _bip(ctx,880,0.45,0.35); }
    else { _bip(ctx,440,0,1.2); }
    _sonnerieTimers.push(setTimeout(jouerCycle, cycle));
  }
  jouerCycle();
}
function arreterSonnerie(){
  _sonnerieTimers.forEach(function(t){ clearTimeout(t); });
  _sonnerieTimers=[];
}

function creerPeerConnection(){
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  pc.ontrack = function(e){
    ajouterEtape('Flux '+(e.track && e.track.kind || '?')+' du correspondant reçu');
    if(callType==='video'){
      const rv=document.getElementById('callRemoteVideo');
      if(rv){
        if(rv.srcObject!==e.streams[0]) rv.srcObject=e.streams[0];
        rv.style.display='block';
      }
      const av=document.getElementById('callAvatarBig');
      if(av) av.style.display='none';
    } else {
      const ra=document.getElementById('callRemoteAudio');
      if(ra && ra.srcObject!==e.streams[0]) ra.srcObject=e.streams[0];
    }
  };
  pc.onicegatheringstatechange = function(){
    ajouterEtape('Appel — collecte réseau : '+pc.iceGatheringState);
  };
  // DIAGNOSTIC : erreurs du relais TURN / STUN (identifiants refusés, port bloqué…).
  // Limité à 6 messages pour ne pas noyer le panneau. Aucun mot de passe n'est affiché.
  let nbErreursIce=0;
  pc.onicecandidateerror = function(e){
    nbErreursIce++;
    if(nbErreursIce>6) return;
    const adresse=(e.url||'').split('?')[0];
    ajouterEtape('⚠️ Erreur serveur réseau '+(e.errorCode||'?')+' '+(e.errorText||'')+' ('+adresse+')', true);
  };
  pc.onsignalingstatechange = function(){
    ajouterEtape('Appel — signalisation : '+pc.signalingState);
  };
  pc.oniceconnectionstatechange = function(){
    ajouterEtape('Appel — état ICE : '+pc.iceConnectionState);
  };
  pc.onconnectionstatechange = function(){
    ajouterEtape('Appel — état de connexion : '+pc.connectionState);
    if(pc.connectionState==='connected'){
      demarrerChronoAppelReel();
    } else if(pc.connectionState==='disconnected'){
      const st=document.getElementById('callStatus');
      if(st && !callTimerInt) st.textContent='Connexion impossible avec le correspondant';
    } else if(pc.connectionState==='failed'){
      const st=document.getElementById('callStatus');
      if(st) st.textContent='Connexion perdue avec le correspondant';
      ajouterEtape('⚠️ Connexion définitivement perdue — fermeture automatique de l\'appel', true);
      const appelIdAuMomentEchec=_appelId;
      setTimeout(function(){
        if(_appelId===appelIdAuMomentEchec && window.requestClose) requestClose();
      }, 1500);
    }
  };
  return pc;
}

function demarrerChronoAppelReel(){
  if(callTimerInt) return;
  document.getElementById('callStatus').textContent='0:00 · Connecté';
  callTimerInt=setInterval(function(){
    callSeconds++;
    document.getElementById('callStatus').textContent=fmtTime(callSeconds)+' · Connecté';
  },1000);
}

function nettoyerEtatAppel(){
  arreterSonnerie();
  if(_offDocAppel){ _offDocAppel(); _offDocAppel=null; }
  if(_offCandidatsDistants){ _offCandidatsDistants(); _offCandidatsDistants=null; }
  if(_sonnerieTimeoutId){ clearTimeout(_sonnerieTimeoutId); _sonnerieTimeoutId=null; }
  if(_pc){ try{ _pc.close(); }catch(e){} _pc=null; }
  reinitialiserCandidats();
  const rv=document.getElementById('callRemoteVideo');
  if(rv){ rv.srcObject=null; rv.style.display='none'; }
  const ra=document.getElementById('callRemoteAudio');
  if(ra){ ra.srcObject=null; }
  _appelId=null; _appelRole=null;
}

/* ══════════════ APPEL SORTANT ══════════════ */
window.appelSortant = async function(type){
  if(!window.RTCPeerConnection){
    ajouterEtape('❌ WebRTC non supporté par ce navigateur', true);
    document.getElementById('callStatus').textContent='Appels non pris en charge par ce navigateur';
    setTimeout(requestClose,1600);
    return;
  }
  if(!currentOtherUid || !currentConvId || !callStream) return;
  let reponseTraitee=false;
  try{
    ajouterEtape('— Appel SORTANT ('+type+') —');
    const moi = await obtenirMonInfo();
    await chargerIceServers();
    _pc = creerPeerConnection();
    _appelRole = 'appelant';
    reinitialiserCandidats();
    callStream.getTracks().forEach(function(t){ _pc.addTrack(t, callStream); });

    let idAppelLocal=null;
    const candidatsLocauxEnAttente=[];
    _pc.onicecandidate = function(e){
      if(!e.candidate) return;
      noterCandidatLocal(e.candidate);
      const c=e.candidate.toJSON();
      if(idAppelLocal) window.Signalisation.ajouterCandidat(idAppelLocal,'candidatsAppelant',c);
      else candidatsLocauxEnAttente.push(c);
    };

    const offre = await _pc.createOffer();
    await _pc.setLocalDescription(offre);

    _appelId = await window.Signalisation.creerAppel({
      appelantUid: currentUid,
      appelantNom: moi.nom,
      appelantIni: moi.ini,
      appelantBg: moi.bg,
      destinataireUid: currentOtherUid,
      convId: currentConvId,
      type: type,
      offre: { type: offre.type, sdp: offre.sdp }
    });
    ajouterEtape('Offre envoyée (appel '+_appelId+')');
    document.getElementById('callStatus').textContent='Ça sonne…';
    demarrerSonnerie('sortant');

    idAppelLocal=_appelId;
    const enAttente=candidatsLocauxEnAttente.splice(0);
    if(enAttente.length) ajouterEtape('Envoi de '+enAttente.length+' candidat(s) local(aux) mis en attente');
    enAttente.forEach(function(c){
      window.Signalisation.ajouterCandidat(idAppelLocal,'candidatsAppelant',c);
    });
    _offCandidatsDistants = window.Signalisation.ecouterCandidats(_appelId,'candidatsDestinataire',recevoirCandidatDistant);

    _offDocAppel = window.Signalisation.ecouterAppel(_appelId, function(data){
      if(data.statut==='accepte' && data.reponse && !reponseTraitee){
        reponseTraitee=true;
        arreterSonnerie();
        if(_sonnerieTimeoutId){ clearTimeout(_sonnerieTimeoutId); _sonnerieTimeoutId=null; }
        ajouterEtape('Réponse du correspondant reçue');
        document.getElementById('callStatus').textContent='Connexion…';
        _pc.setRemoteDescription(new RTCSessionDescription(data.reponse))
          .then(function(){ ajouterEtape('Réponse appliquée'); descriptionDistantePrete(); })
          .catch(function(e){ ajouterEtape('❌ Réponse distante invalide : '+e.message, true); });
      } else if(data.statut==='refuse' && !reponseTraitee){
        reponseTraitee=true;
        arreterSonnerie();
        document.getElementById('callStatus').textContent='Appel refusé';
        logCallBubble(type,'Refusé');
        terminerSansRaccrocherManuel(1200);
      } else if(data.statut==='raccroche'){
        arreterSonnerie();
        terminerSansRaccrocherManuel(0);
      }
    });

    _sonnerieTimeoutId = setTimeout(function(){
      if(!reponseTraitee){
        reponseTraitee=true;
        arreterSonnerie();
        window.Signalisation.mettreAJourStatut(_appelId,'manque');
        document.getElementById('callStatus').textContent='Sans réponse';
        logCallBubble(type,'Sans réponse');
        terminerSansRaccrocherManuel(1200);
      }
    },35000);

  }catch(err){
    arreterSonnerie();
    ajouterEtape('❌ Échec appel sortant : '+(err&&err.message), true);
    document.getElementById('callStatus').textContent='Impossible de joindre le correspondant';
    logCallBubble(type,'Échec');
    terminerSansRaccrocherManuel(1600);
  }
}

function terminerSansRaccrocherManuel(delaiMs){
  const appelIdCourant=_appelId;
  setTimeout(function(){
    nettoyerEtatAppel();
    if(appelIdCourant) window.Signalisation.supprimerAppel(appelIdCourant);
    requestClose();
  }, delaiMs);
}

/* ══════════════ ÉCOUTE GLOBALE DES APPELS ENTRANTS ══════════════ */
window.appelEcouteEntrants = function(){
  if(_offEntrants || !currentUid) return;
  _offEntrants = window.Signalisation.ecouterAppelsEntrants(currentUid, function(appelId, data){
    if(_appelEnCoursDestinataire || _appelId){
      if(window.ajouterEtape) ajouterEtape('⚠️ Appel entrant ignoré — un autre appel semble déjà en cours ('+(appelId)+')', true);
      return;
    }
    afficherEcranAppelEntrant(appelId, data);
  });
}

function afficherEcranAppelEntrant(appelId, data){
  if(window.ajouterEtape) ajouterEtape('📞 Appel entrant détecté de '+(data.appelantNom||'?')+' ('+data.type+')');
  _appelEnCoursDestinataire = { appelId: appelId, data: data, offAttente: null };
  document.getElementById('icName').textContent = data.appelantNom || 'Utilisateur';
  document.getElementById('icSub').textContent = data.type==='video' ? 'Appel vidéo entrant…' : 'Appel vocal entrant…';
  document.getElementById('icAvatar').textContent = data.appelantIni || '?';
  document.getElementById('icAvatar').style.background = data.appelantBg || '#999';
  document.getElementById('incomingCallScreen').classList.add('open');
  pushView('incall');
  demarrerSonnerie('entrant');

  _appelEnCoursDestinataire.offAttente = window.Signalisation.ecouterAppel(appelId, function(d){
    if(d.statut!=='sonne' && _appelEnCoursDestinataire && _appelEnCoursDestinataire.appelId===appelId){
      arreterSonnerie();
      if(_appelEnCoursDestinataire.offAttente){ _appelEnCoursDestinataire.offAttente(); }
      _appelEnCoursDestinataire=null;
      if(viewStack[viewStack.length-1]==='incall') requestClose();
    }
  });
}

/* Bouton "Accepter" sur l'écran d'appel entrant. */
window.appelAccepter = async function(){
  if(!_appelEnCoursDestinataire) return;
  const appelId=_appelEnCoursDestinataire.appelId, data=_appelEnCoursDestinataire.data;
  if(_appelEnCoursDestinataire.offAttente) _appelEnCoursDestinataire.offAttente();
  _appelEnCoursDestinataire=null;
  arreterSonnerie();
  document.getElementById('incomingCallScreen').classList.remove('open');
  if(viewStack.length && viewStack[viewStack.length-1]==='incall'){
    viewStack.pop();
    history.replaceState({depth:viewStack.length},'',location.href);
  }

  const stream = await prepareCallScreen(data.type, data.appelantNom, data.appelantIni, data.appelantBg);
  if(!stream){ ajouterEtape('❌ Micro/caméra non obtenus — appel non accepté', true); return; }

  try{
    ajouterEtape('— Appel ENTRANT accepté ('+data.type+') —');
    await chargerIceServers();
    _pc = creerPeerConnection();
    _appelRole = 'destinataire';
    _appelId = appelId;
    stream.getTracks().forEach(function(t){ _pc.addTrack(t, stream); });

    reinitialiserCandidats();
    _pc.onicecandidate = function(e){
      if(!e.candidate) return;
      noterCandidatLocal(e.candidate);
      window.Signalisation.ajouterCandidat(appelId,'candidatsDestinataire',e.candidate.toJSON());
    };
    _offCandidatsDistants = window.Signalisation.ecouterCandidats(appelId,'candidatsAppelant',recevoirCandidatDistant);

    await _pc.setRemoteDescription(new RTCSessionDescription(data.offre));
    ajouterEtape('Offre de l\'appelant appliquée');
    descriptionDistantePrete();
    const reponse = await _pc.createAnswer();
    await _pc.setLocalDescription(reponse);
    await window.Signalisation.envoyerReponse(appelId, { type: reponse.type, sdp: reponse.sdp });
    ajouterEtape('Réponse envoyée à l\'appelant');
    document.getElementById('callStatus').textContent='Connexion…';

    _offDocAppel = window.Signalisation.ecouterAppel(appelId, function(d){
      if(d.statut==='raccroche'){ requestClose(); }
    });
  }catch(err){
    ajouterEtape('❌ Échec acceptation appel : '+(err&&err.message), true);
    document.getElementById('callStatus').textContent='Connexion impossible';
    setTimeout(requestClose,1600);
  }
}

window.appelAnnulerSiSonne = function(){
  if(!_appelEnCoursDestinataire) return;
  const appelId=_appelEnCoursDestinataire.appelId;
  if(_appelEnCoursDestinataire.offAttente) _appelEnCoursDestinataire.offAttente();
  _appelEnCoursDestinataire=null;
  arreterSonnerie();
  window.Signalisation.mettreAJourStatut(appelId,'refuse').then(function(){
    window.Signalisation.supprimerAppel(appelId);
  });
}

window.appelRefuser = function(){
  if(!_appelEnCoursDestinataire) return;
  window.appelAnnulerSiSonne();
  requestClose();
}

/* ══════════════ RACCROCHER ══════════════ */
window.appelRaccrocher = function(){
  if(_appelId){
    const idAppel=_appelId;
    window.Signalisation.mettreAJourStatut(idAppel,'raccroche').then(function(){
      window.Signalisation.supprimerAppel(idAppel);
    });
  }
  nettoyerEtatAppel();
}
