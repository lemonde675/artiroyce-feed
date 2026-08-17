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
   ══════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════ PARTIE 1 — SIGNALISATION ════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — Signalisation des appels (audio/vidéo réels)
   ══════════════════════════════════════════════════════════════════════
   Ce fichier ne contient AUCUNE logique WebRTC (micro, caméra, flux
   audio/vidéo) : il ne fait que déposer et lire, dans Firestore, les
   informations nécessaires pour que deux téléphones se trouvent et se
   connectent DIRECTEMENT entre eux (offre, réponse, candidats réseau ICE).
   Une fois la connexion établie, l'audio/vidéo ne repasse plus jamais par
   Firebase — voir appel.js pour cette partie-là.

   Schéma Firestore utilisé (nouvelle collection, séparée de "conversations"
   pour ne rien perturber de la messagerie existante) :

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

  function refAppel(appelId){ return db.collection('appels').doc(appelId); }

  // Dépose une nouvelle demande d'appel et renvoie son identifiant.
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

  // Le destinataire dépose sa réponse (fait passer l'appel en "accepte").
  function envoyerReponse(appelId, reponse){
    return refAppel(appelId).update({ reponse: reponse, statut: 'accepte' });
  }

  function mettreAJourStatut(appelId, statut){
    return refAppel(appelId).set({ statut: statut }, { merge:true })
      .catch(function(e){ console.error('Statut appel non mis à jour :', e); });
  }

  // Écoute un appel précis (côté appelant : pour voir arriver la réponse ou un refus).
  function ecouterAppel(appelId, callback){
    return refAppel(appelId).onSnapshot(function(doc){
      if(doc.exists) callback(doc.data());
    }, function(err){ console.error('Écoute de l\'appel impossible :', err); });
  }

  // Écoute globale (démarrée une seule fois à la connexion) : détecte les appels qui me
  // sont destinés et qui sont encore en train de sonner, pour afficher l'écran entrant.
  function ecouterAppelsEntrants(monUid, callback){
    return db.collection('appels')
      .where('destinataireUid','==',monUid)
      .where('statut','==','sonne')
      .onSnapshot(function(snap){
        snap.docChanges().forEach(function(chg){
          if(chg.type==='added') callback(chg.doc.id, chg.doc.data());
        });
      }, function(err){ console.error('Écoute des appels entrants impossible :', err); });
  }

  // sousCollection vaut 'candidatsAppelant' ou 'candidatsDestinataire' selon qui envoie.
  function ajouterCandidat(appelId, sousCollection, candidat){
    return refAppel(appelId).collection(sousCollection).add({ candidat: JSON.stringify(candidat) })
      .catch(function(e){ console.error('Candidat réseau non envoyé :', e); });
  }

  function ecouterCandidats(appelId, sousCollection, callback){
    return refAppel(appelId).collection(sousCollection).onSnapshot(function(snap){
      snap.docChanges().forEach(function(chg){
        if(chg.type==='added'){
          try{ callback(JSON.parse(chg.doc.data().candidat)); }
          catch(e){ console.error('Candidat réseau illisible :', e); }
        }
      });
    }, function(err){ console.error('Écoute des candidats réseau impossible :', err); });
  }

  // Nettoyage complet une fois l'appel terminé (évite d'accumuler des documents inutiles).
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

/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — Appels audio/vidéo réels (WebRTC)
   ══════════════════════════════════════════════════════════════════════
   Gère la connexion DIRECTE entre deux téléphones, une fois que
   signalisation.js a permis aux deux appareils de se trouver via Firestore.

   Ce fichier réutilise volontairement les variables et fonctions déjà
   déclarées dans discussion_v1.html (db, currentUid, currentOtherUid,
   currentConvId, currentChatName/Ini/Bg, callStream, callType, callSeconds,
   callTimerInt, pushView, requestClose, viewStack, logCallBubble, fmtTime,
   ajouterEtape, obtenirMonInfo, prepareCallScreen) — accessibles ici car
   ce fichier est chargé en tout dernier, comme un script classique de plus
   sur la même page (pas de module, donc portée globale partagée).

   Serveurs réseau utilisés pour établir la connexion :
   - STUN (Google, gratuit) : suffit dans la majorité des cas.
   - TURN (Open Relay Project, gratuit/public) : relais de secours quand la
     connexion directe échoue (réseaux mobiles restrictifs, etc.). Service
     public partagé, correct pour démarrer/tester ; à remplacer par un TURN
     dédié si le volume d'utilisation le justifie plus tard.
   ══════════════════════════════════════════════════════════════════════ */

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
  { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' }
];

// ── État de l'appel en cours (au plus un à la fois) ──
let _pc=null, _appelId=null, _appelRole=null;
let _offDocAppel=null, _offCandidatsDistants=null, _offEntrants=null;
let _sonnerieTimeoutId=null;
let _appelEnCoursDestinataire=null; // {appelId, data, offAttente} pendant l'écran "appel entrant"

function creerPeerConnection(){
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  pc.ontrack = function(e){
    if(callType==='video'){
      const rv=document.getElementById('callRemoteVideo');
      if(rv){
        if(rv.srcObject!==e.streams[0]) rv.srcObject=e.streams[0];
        rv.style.display='block';
      }
      const av=document.getElementById('callAvatarBig');
      if(av) av.style.display='none';
    }
  };
  pc.onconnectionstatechange = function(){
    ajouterEtape('Appel — état de connexion : '+pc.connectionState);
    if(pc.connectionState==='connected'){
      demarrerChronoAppelReel();
    } else if(pc.connectionState==='failed' || pc.connectionState==='disconnected'){
      const st=document.getElementById('callStatus');
      if(st && !callTimerInt) st.textContent='Connexion impossible avec le correspondant';
    }
  };
  return pc;
}

function demarrerChronoAppelReel(){
  if(callTimerInt) return; // déjà démarré, ne pas dupliquer
  document.getElementById('callStatus').textContent='0:00 · Connecté';
  callTimerInt=setInterval(function(){
    callSeconds++;
    document.getElementById('callStatus').textContent=fmtTime(callSeconds)+' · Connecté';
  },1000);
}

// Referme proprement la connexion WebRTC et les écoutes Firestore liées, sans toucher
// à l'écran/aux boutons (géré côté discussion_v1.html) ni supprimer le document d'appel
// (fait séparément par l'appelant de la fonction, selon le contexte).
function nettoyerEtatAppel(){
  if(_offDocAppel){ _offDocAppel(); _offDocAppel=null; }
  if(_offCandidatsDistants){ _offCandidatsDistants(); _offCandidatsDistants=null; }
  if(_sonnerieTimeoutId){ clearTimeout(_sonnerieTimeoutId); _sonnerieTimeoutId=null; }
  if(_pc){ try{ _pc.close(); }catch(e){} _pc=null; }
  const rv=document.getElementById('callRemoteVideo');
  if(rv){ rv.srcObject=null; rv.style.display='none'; }
  _appelId=null; _appelRole=null;
}

/* ══════════════ APPEL SORTANT (je clique 📞/📹 dans une conversation réelle) ══════════════ */
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
    const moi = await obtenirMonInfo();
    _pc = creerPeerConnection();
    _appelRole = 'appelant';
    callStream.getTracks().forEach(function(t){ _pc.addTrack(t, callStream); });

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
    document.getElementById('callStatus').textContent='Ça sonne…';

    _pc.onicecandidate = function(e){
      if(e.candidate) window.Signalisation.ajouterCandidat(_appelId,'candidatsAppelant',e.candidate.toJSON());
    };
    _offCandidatsDistants = window.Signalisation.ecouterCandidats(_appelId,'candidatsDestinataire',function(cand){
      if(_pc) _pc.addIceCandidate(new RTCIceCandidate(cand)).catch(function(e){ console.error('Candidat distant refusé :',e); });
    });

    _offDocAppel = window.Signalisation.ecouterAppel(_appelId, function(data){
      if(data.statut==='accepte' && data.reponse && !reponseTraitee){
        reponseTraitee=true;
        if(_sonnerieTimeoutId){ clearTimeout(_sonnerieTimeoutId); _sonnerieTimeoutId=null; }
        document.getElementById('callStatus').textContent='Connexion…';
        _pc.setRemoteDescription(new RTCSessionDescription(data.reponse))
          .catch(function(e){ ajouterEtape('❌ Réponse distante invalide : '+e.message, true); });
      } else if(data.statut==='refuse' && !reponseTraitee){
        reponseTraitee=true;
        document.getElementById('callStatus').textContent='Appel refusé';
        logCallBubble(type,'Refusé');
        terminerSansRaccrocherManuel(1200);
      } else if(data.statut==='raccroche'){
        terminerSansRaccrocherManuel(0);
      }
    });

    // Personne ne répond après 35 secondes → appel manqué, comme un vrai appel.
    _sonnerieTimeoutId = setTimeout(function(){
      if(!reponseTraitee){
        reponseTraitee=true;
        window.Signalisation.mettreAJourStatut(_appelId,'manque');
        document.getElementById('callStatus').textContent='Sans réponse';
        logCallBubble(type,'Sans réponse');
        terminerSansRaccrocherManuel(1200);
      }
    },35000);

  }catch(err){
    ajouterEtape('❌ Échec appel sortant : '+(err&&err.message), true);
    document.getElementById('callStatus').textContent='Impossible de joindre le correspondant';
    logCallBubble(type,'Échec');
    terminerSansRaccrocherManuel(1600);
  }
}

// Ferme l'écran d'appel après un délai, en ayant déjà géré Firestore avant (donc sans
// laisser hideView('call') → appelRaccrocher() réécrire un statut différent par-dessus).
function terminerSansRaccrocherManuel(delaiMs){
  const appelIdCourant=_appelId;
  setTimeout(function(){
    nettoyerEtatAppel();
    if(appelIdCourant) window.Signalisation.supprimerAppel(appelIdCourant);
    requestClose();
  }, delaiMs);
}

/* ══════════════ ÉCOUTE GLOBALE DES APPELS ENTRANTS ══════════════
   Démarrée une seule fois (voir discussion_v1.html, juste après l'authentification). */
window.appelEcouteEntrants = function(){
  if(_offEntrants || !currentUid) return;
  _offEntrants = window.Signalisation.ecouterAppelsEntrants(currentUid, function(appelId, data){
    // Ignore un nouvel appel si un autre est déjà affiché ou en cours.
    if(_appelEnCoursDestinataire || _appelId) return;
    afficherEcranAppelEntrant(appelId, data);
  });
}

function afficherEcranAppelEntrant(appelId, data){
  _appelEnCoursDestinataire = { appelId: appelId, data: data, offAttente: null };
  document.getElementById('icName').textContent = data.appelantNom || 'Utilisateur';
  document.getElementById('icSub').textContent = data.type==='video' ? 'Appel vidéo entrant…' : 'Appel vocal entrant…';
  document.getElementById('icAvatar').textContent = data.appelantIni || '?';
  document.getElementById('icAvatar').style.background = data.appelantBg || '#999';
  document.getElementById('incomingCallScreen').classList.add('open');
  pushView('incall');

  // Si l'appelant raccroche/annule avant que je réponde, l'écran se ferme tout seul.
  _appelEnCoursDestinataire.offAttente = window.Signalisation.ecouterAppel(appelId, function(d){
    if(d.statut!=='sonne' && _appelEnCoursDestinataire && _appelEnCoursDestinataire.appelId===appelId){
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
  requestClose(); // ferme l'écran "appel entrant" (pop de la vue 'incall')

  const stream = await prepareCallScreen(data.type, data.appelantNom, data.appelantIni, data.appelantBg);
  if(!stream) return;

  try{
    _pc = creerPeerConnection();
    _appelRole = 'destinataire';
    _appelId = appelId;
    stream.getTracks().forEach(function(t){ _pc.addTrack(t, stream); });

    _pc.onicecandidate = function(e){
      if(e.candidate) window.Signalisation.ajouterCandidat(appelId,'candidatsDestinataire',e.candidate.toJSON());
    };
    _offCandidatsDistants = window.Signalisation.ecouterCandidats(appelId,'candidatsAppelant',function(cand){
      if(_pc) _pc.addIceCandidate(new RTCIceCandidate(cand)).catch(function(e){ console.error('Candidat distant refusé :',e); });
    });

    await _pc.setRemoteDescription(new RTCSessionDescription(data.offre));
    const reponse = await _pc.createAnswer();
    await _pc.setLocalDescription(reponse);
    await window.Signalisation.envoyerReponse(appelId, { type: reponse.type, sdp: reponse.sdp });
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

/* Nettoyage Firestore pur (sans navigation) quand un appel entrant n'aboutit pas —
   utilisé à la fois par le bouton "Refuser" et par hideView('incall') (retour arrière). */
window.appelAnnulerSiSonne = function(){
  if(!_appelEnCoursDestinataire) return;
  const appelId=_appelEnCoursDestinataire.appelId;
  if(_appelEnCoursDestinataire.offAttente) _appelEnCoursDestinataire.offAttente();
  _appelEnCoursDestinataire=null;
  window.Signalisation.mettreAJourStatut(appelId,'refuse');
  window.Signalisation.supprimerAppel(appelId);
}

/* Bouton "Refuser" sur l'écran d'appel entrant. */
window.appelRefuser = function(){
  if(!_appelEnCoursDestinataire) return;
  window.appelAnnulerSiSonne();
  requestClose();
}

/* ══════════════ RACCROCHER ══════════════
   Appelé automatiquement par hideView('call') dans discussion_v1.html (bouton rouge,
   ou fermeture de l'écran par tout autre moyen). Sans effet si aucun appel réel n'était
   en cours (mode démo/conférence, ou déjà nettoyé par un timeout/refus géré ailleurs). */
window.appelRaccrocher = function(){
  if(_appelId){
    window.Signalisation.mettreAJourStatut(_appelId,'raccroche');
    window.Signalisation.supprimerAppel(_appelId);
  }
  nettoyerEtatAppel();
}
