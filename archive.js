/* ══════════════════════════════════════════════════════════════════
   ArtiRoyce — archive.js  (conservation légale des contenus supprimés)

   Quand quelqu'un supprime un message, une photo, une publication, un
   commentaire, un statut ou un CV :
     • pour lui et pour tout le monde, c'est supprimé tout de suite ;
     • une COPIE CACHÉE est gardée dans la collection « archives »,
       lisible UNIQUEMENT par l'administrateur, et non modifiable ;
     • elle s'efface automatiquement après 12 mois (champ expireLe).

   Utilisation dans les pages (toujours avec un repli : si ce fichier
   manque, la suppression se fait comme avant, rien ne casse) :
     window.ArArchive ? ArArchive.supprimer(ref, { type:'offre' }) : ref.delete()
     ArArchive.garderDoc(ref, { type:'message', raison:'supprime_pour_tous' })

   Si l'archivage échoue (pas de réseau, règle pas encore publiée…), la
   suppression continue quand même : l'application ne se bloque jamais.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArArchive) return;

  var JOURS_CONSERVATION = 365;          // 12 mois
  var TAILLE_MAX = 900000;               // une fiche Firestore ne dépasse pas 1 Mo

  function firestore() { return firebase.firestore(); }
  function moi() { try { return firebase.auth().currentUser; } catch (e) { return null; } }
  function taille(o) { try { return JSON.stringify(o).length; } catch (e) { return 0; } }

  // Une copie trop lourde (photo enregistrée dans la fiche) : on garde tout le
  // texte, et on remplace seulement les très gros morceaux par une mention.
  function alleger(valeur) {
    if (typeof valeur === 'string') return valeur.length > 50000 ? '[média retiré de l’archive : trop lourd · ' + Math.round(valeur.length / 1024) + ' Ko]' : valeur;
    if (Array.isArray(valeur)) return valeur.map(alleger);
    if (valeur && typeof valeur === 'object' && valeur.constructor === Object) {
      var copie = {};
      for (var k in valeur) copie[k] = alleger(valeur[k]);
      return copie;
    }
    return valeur;
  }

  // Liens des photos / vidéos / fichiers (pour les retrouver plus tard).
  function liensMedias(valeur, liste) {
    liste = liste || [];
    if (typeof valeur === 'string') { if (/^https?:\/\/.*(firebasestorage|googleapis)/.test(valeur)) liste.push(valeur); }
    else if (Array.isArray(valeur)) valeur.forEach(function (v) { liensMedias(v, liste); });
    else if (valeur && typeof valeur === 'object' && valeur.constructor === Object) for (var k in valeur) liensMedias(valeur[k], liste);
    return liste;
  }

  function devinerAuteur(d) {
    return (d && (d.auteurUid || d.emetteur || d.uid || d.auteur || d.from)) || '';
  }

  // Garde une copie de données déjà lues. Renvoie true si c'est archivé.
  async function garderDonnees(chemin, donnees, infos) {
    infos = infos || {};
    var u = moi();
    if (!u || !donnees) return false;
    try {
      var contenu = donnees, note = '';
      if (taille(contenu) > TAILLE_MAX) { contenu = alleger(contenu); note = 'media_trop_lourd_retire'; }
      if (taille(contenu) > TAILLE_MAX) { contenu = { apercu: JSON.stringify(contenu).slice(0, 200000) }; note = 'contenu_tronque'; }
      var parties = String(chemin || '').split('/');
      await firestore().collection('archives').add({
        type: infos.type || parties[0] || 'inconnu',
        raison: infos.raison || 'suppression',
        chemin: chemin || '',
        docId: parties[parties.length - 1] || '',
        auteurUid: infos.auteurUid || devinerAuteur(donnees),
        supprimePar: u.uid,
        supprimeLe: firebase.firestore.FieldValue.serverTimestamp(),
        expireLe: firebase.firestore.Timestamp.fromDate(new Date(Date.now() + JOURS_CONSERVATION * 86400000)),
        medias: liensMedias(donnees).slice(0, 50),
        note: note,
        contenu: contenu
      });
      return true;
    } catch (e) {
      console.warn('Archive impossible (la suppression continue) :', e);
      return false;
    }
  }

  // Lit la fiche puis en garde une copie.
  async function garderDoc(ref, infos) {
    try {
      var snap = await ref.get();
      if (!snap.exists) return false;
      return await garderDonnees(ref.path, snap.data(), infos);
    } catch (e) {
      console.warn('Archive impossible (la suppression continue) :', e);
      return false;
    }
  }

  // Garde une copie, puis supprime vraiment la fiche (comme avant).
  async function supprimer(ref, infos) {
    await garderDoc(ref, infos);
    return ref.delete();
  }

  window.ArArchive = {
    garderDonnees: garderDonnees,
    garderDoc: garderDoc,
    supprimer: supprimer,
    JOURS_CONSERVATION: JOURS_CONSERVATION
  };
})();
