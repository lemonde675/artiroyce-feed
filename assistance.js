/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — assistance.js   (chargé par accueil.html)
   ══════════════════════════════════════════════════════════════════════
   - Le 💬 rond de l'en-tête ouvre l'ASSISTANCE (assistance.html) par-dessus
     l'Accueil, sans recharger la page : window.ouvrirAssistance(uid?)
   - Pastille rouge sur le 💬 :
       personne       → nombre de réponses de l'assistance non lues
       administrateur → nombre de demandes non lues
   - Administrateur : tant que l'Accueil est ouvert, il est « En ligne »
     pour les personnes qui écrivent à l'assistance.
   - Touche retour du téléphone : ferme l'assistance (on reste sur l'Accueil).
   Rien ne casse si ce fichier manque : le 💬 ne fait simplement rien.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ouvrirAssistance) return;
  var ADMIN_UID = 'JyUlOcQjf4Scaf43faUuj2zx6Gi1';
  var ov = null, ouvert = false, ignorerRetour = false, stopBadge = null, minuteur = null;

  function construire() {
    if (ov) return;
    var st = document.createElement('style');
    st.textContent = '.assist-ov{position:fixed;inset:0;z-index:3100;display:none;background:rgba(0,0,0,.35)}'
      + '.assist-ov.open{display:block}'
      + '.assist-ov iframe{display:block;width:100%;max-width:480px;height:100%;margin:0 auto;border:0;background:#f2f3f5}';
    document.head.appendChild(st);
    ov = document.createElement('div');
    ov.className = 'assist-ov'; ov.id = 'assistOv';
    document.body.appendChild(ov);
  }

  window.ouvrirAssistance = function (uid) {
    construire();
    ov.innerHTML = '<iframe title="Assistance" src="assistance.html' + (uid ? '?uid=' + encodeURIComponent(uid) : '') + '"></iframe>';
    ov.classList.add('open');
    if (!ouvert) { try { history.pushState({ assistance: 1 }, '', location.href); } catch (e) {} }
    ouvert = true;
  };
  function fermer(depuisRetour) {
    if (!ouvert) return;
    ouvert = false;
    if (ov) { ov.classList.remove('open'); ov.innerHTML = ''; }   // arrête aussi l'écoute des messages
    if (!depuisRetour) { ignorerRetour = true; try { history.back(); } catch (e) { ignorerRetour = false; } }
  }

  // Touche retour : on ferme l'assistance AVANT que l'Accueil ne change d'onglet.
  window.addEventListener('popstate', function (e) {
    if (ignorerRetour) { ignorerRetour = false; e.stopImmediatePropagation(); return; }
    if (ouvert) { e.stopImmediatePropagation(); fermer(true); }
  }, true);

  window.addEventListener('message', function (e) {
    if (!e.data || !e.data.type) return;
    if (e.data.type === 'fermerAssistance') fermer(false);
    if (e.data.type === 'profilDepuisAssistance' && e.data.uid) {
      fermer(false);
      setTimeout(function () { if (window.goUserProfile) window.goUserProfile(e.data.uid); }, 150);
    }
  });

  function pastille(n) {
    var b = document.getElementById('assistBadge');
    if (!b) return;
    b.textContent = n > 99 ? '99+' : String(n);
    b.style.display = n > 0 ? 'flex' : 'none';
  }
  function signeDeVie() {
    if (document.hidden) return;
    firebase.firestore().collection('assistance_meta').doc('admin')
      .set({ enLigneLe: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(function () {});
  }

  function demarrer() {
    if (!window.firebase || !firebase.auth) return;
    firebase.auth().onAuthStateChanged(function (u) {
      if (stopBadge) { stopBadge(); stopBadge = null; }
      clearInterval(minuteur); pastille(0);
      if (!u) return;
      var fs = firebase.firestore();
      if (u.uid === ADMIN_UID) {
        stopBadge = fs.collection('assistance').where('nonLuAdmin', '>', 0).onSnapshot(function (s) { pastille(s.size); }, function () {});
        signeDeVie(); minuteur = setInterval(signeDeVie, 45000);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) signeDeVie(); });
      } else {
        stopBadge = fs.collection('assistance').doc(u.uid).onSnapshot(function (s) {
          pastille(s.exists ? (s.data().nonLuUser || 0) : 0);
        }, function () {});
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
