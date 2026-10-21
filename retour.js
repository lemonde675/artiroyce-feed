/* ══════════════════════════════════════════════════════════════════════
   ArtiRoyce — retour.js   (touche « retour » du téléphone dans un onglet)
   ══════════════════════════════════════════════════════════════════════
   Dans un onglet de l'Accueil (Statuts, Élites…), la touche retour fermait
   tout l'onglet et renvoyait à l'Accueil, même quand un statut, une photo
   ou un menu était ouvert. Avec ce fichier :
     • chaque écran ouvert (lecteur, éditeur, menu, visionneuse…) prend une
       entrée d'historique : la touche retour le ferme, on reste sur la page ;
     • fermé par son bouton ✕ / Annuler, le retour suivant n'appuie pas
       « dans le vide » : il continue normalement (Accueil, puis sortie).
   Utilisation, en bas de la page :
     ArRetour.surveiller([{ id:'viewer', classe:'open', fermer:'closeViewer' }, …]);
   (fermer = nom de la fonction de la page qui ferme proprement cet écran)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.ArRetour) return;
  const pile = [];          // écrans ouverts, du plus ancien au plus récent
  let compteur = 0;
  let etatCourant = history.state || {};
  try { history.replaceState(Object.assign({}, etatCourant, { arR: 0 }), ''); etatCourant = history.state; } catch (e) {}

  function ouvert(nom, fermer) {
    if (pile.some(v => v.nom === nom)) return;
    const id = ++compteur;
    pile.push({ nom, fermer, id });
    etatCourant = { arR: id };
    try { history.pushState(etatCourant, ''); } catch (e) {}
  }
  // Fermé par un bouton : l'entrée devient « fantôme » (sautée au prochain retour).
  function ferme(nom) {
    const i = pile.findIndex(v => v.nom === nom);
    if (i < 0) return;
    const v = pile.splice(i, 1)[0];
    const st = history.state || {};
    if (typeof st.arR === 'number' && st.arR >= v.id && !st.fantome) {
      etatCourant = Object.assign({}, st, { fantome: true });
      try { history.replaceState(etatCourant, ''); } catch (e) {}
    }
  }
  window.addEventListener('popstate', function (e) {
    const st = e.state || {};
    const depuisFantome = !!(etatCourant && etatCourant.fantome);
    etatCourant = st;
    const cible = typeof st.arR === 'number' ? st.arR : 0;
    let fermes = 0;
    while (pile.length && pile[pile.length - 1].id > cible) {
      const v = pile.pop(); fermes++;
      try { v.fermer(); } catch (err) {}
    }
    // Ce retour n'a rien fermé (on quittait une entrée fantôme) : on continue d'un cran.
    if (depuisFantome && !fermes) { try { history.back(); } catch (err) {} }
  });

  function surveiller(liste) {
    liste.forEach(function (o) {
      const el = document.getElementById(o.id);
      if (!el) return;
      const classe = o.classe || 'open';
      const fermer = function () {
        const f = typeof o.fermer === 'function' ? o.fermer : window[o.fermer];
        if (typeof f === 'function') f(); else el.classList.remove(classe);
      };
      let etaitOuvert = el.classList.contains(classe);
      new MutationObserver(function () {
        const estOuvert = el.classList.contains(classe);
        if (estOuvert === etaitOuvert) return;
        etaitOuvert = estOuvert;
        if (estOuvert) ouvert(o.id, fermer); else ferme(o.id);
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
    });
  }

  window.ArRetour = { surveiller, ouvert, ferme };
})();
