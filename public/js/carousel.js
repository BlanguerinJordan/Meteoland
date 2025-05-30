// Fonction principale pour activer le glissement (drag) horizontal et le scroll à la molette
export function initCarouselDrag(containerSelector, wrapperSelector) {
  const container = document.querySelector(containerSelector);
  const wrapper = document.querySelector(wrapperSelector);

  // Vérifie que les éléments existent avant de continuer
  if (!container || !wrapper) return;

  // Variables d'état
  let isDragging = false;
  let startX; // Position initiale de la souris/toucher
  let currentTranslate = 0; // Position actuelle du wrapper (en px)
  let prevTranslate = 0;    // Position précédente pour calcul des déplacements
  let animationID;          // ID de la boucle d'animation

  // Événements pour le glisser à la souris ou au doigt
  container.addEventListener("mousedown", dragStart);
  container.addEventListener("touchstart", dragStart, { passive: true });

  container.addEventListener("mouseup", dragEnd);
  container.addEventListener("mouseleave", dragEnd);
  container.addEventListener("touchend", dragEnd);

  container.addEventListener("mousemove", dragMove);
  container.addEventListener("touchmove", dragMove, { passive: false });

  // Événement pour le scroll à la molette
  container.addEventListener("wheel", handleWheel, { passive: false });

  // --- Fonctions internes ---

  // Au début du drag
  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    animationID = requestAnimationFrame(animation); // démarre l'animation
    wrapper.style.cursor = "grabbing";
  }

  // Pendant le drag
  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const deltaX = currentX - startX;
    currentTranslate = prevTranslate + deltaX;

    // Empêche de glisser trop à gauche (hors limites)
    if (currentTranslate > 0) currentTranslate = 0;
  }

  // Fin du drag
  function dragEnd() {
    cancelAnimationFrame(animationID);
    isDragging = false;

    const wrapperWidth = wrapper.scrollWidth;
    const containerWidth = container.offsetWidth;
    const maxTranslate = 0;
    const minTranslate = Math.min(0, containerWidth - wrapperWidth); // Limite droite

    // Verrouille le déplacement dans les limites
    currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
    prevTranslate = currentTranslate;

    setWrapperPosition();
    wrapper.style.cursor = "grab";
  }

  // Gestion du scroll avec molette
  function handleWheel(e) {
    e.preventDefault(); // Empêche le scroll vertical
    const delta = e.deltaY || e.deltaX; // Molette ou trackpad

    currentTranslate -= delta;

    const wrapperWidth = wrapper.scrollWidth;
    const containerWidth = container.offsetWidth;
    const maxTranslate = 0;
    const minTranslate = Math.min(0, containerWidth - wrapperWidth);

    // Contrainte dans les limites du carrousel
    currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
    prevTranslate = currentTranslate;

    setWrapperPosition();
  }

  // Rafraîchit la position du wrapper pendant le drag
  function animation() {
    setWrapperPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  // Applique la transformation CSS pour déplacer le carrousel
  function setWrapperPosition() {
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Récupère la position horizontale (selon type d'input)
  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }
}
