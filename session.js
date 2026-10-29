/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — session.js   (chargé par index.html, connexion.html, accueil.html)
   ══════════════════════════════════════════════════════════════════════
   Rester connecté :
   - Quelqu'un qui ne s'est pas déconnecté entre directement dans ArtiRoyce,
     sans retaper son mot de passe.
   - Après une absence de plus de ABSENCE_MAX_HEURES heures sans utiliser
     l'application, il doit se reconnecter avec son mot de passe.
   La date de la dernière visite est gardée sur le téléphone (localStorage).
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArSession) return;
  var ABSENCE_MAX_HEURES = 8;
  var CLE = 'arDerniereActivite';
  var HEURE = 60 * 60 * 1000;

  function lire() { try { return parseInt(localStorage.getItem(CLE), 10) || 0; } catch (e) { return 0; } }
  function noterActivite() { try { localStorage.setItem(CLE, String(Date.now())); } catch (e) {} }
  function oublier() { try { localStorage.removeItem(CLE); } catch (e) {} }
  // true : la personne est restée absente trop longtemps → nouvelle connexion obligatoire.
  function expiree() { var d = lire(); return d > 0 && (Date.now() - d) > ABSENCE_MAX_HEURES * HEURE; }

  window.ArSession = { noterActivite: noterActivite, oublier: oublier, expiree: expiree, ABSENCE_MAX_HEURES: ABSENCE_MAX_HEURES };
})();
