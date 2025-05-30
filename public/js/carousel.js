// carousel.js
export function initCarouselDrag(containerSelector, wrapperSelector) {
  const container = document.querySelector(containerSelector);
  const wrapper = document.querySelector(wrapperSelector);

  if (!container || !wrapper) return;

  let isDragging = false;
  let startX;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  container.addEventListener("mousedown", dragStart);
  container.addEventListener("touchstart", dragStart, { passive: true });

  container.addEventListener("mouseup", dragEnd);
  container.addEventListener("mouseleave", dragEnd);
  container.addEventListener("touchend", dragEnd);

  container.addEventListener("mousemove", dragMove);
  container.addEventListener("touchmove", dragMove, { passive: false });

  container.addEventListener("wheel", handleWheel, { passive: false });

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    animationID = requestAnimationFrame(animation);
    wrapper.style.cursor = "grabbing";
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const deltaX = currentX - startX;
    currentTranslate = prevTranslate + deltaX;

    if (currentTranslate > 0) currentTranslate = 0;
  }

  function dragEnd() {
    cancelAnimationFrame(animationID);
    isDragging = false;

    const wrapperWidth = wrapper.scrollWidth;
    const containerWidth = container.offsetWidth;
    const maxTranslate = 0;
    const minTranslate = Math.min(0, containerWidth - wrapperWidth);

    currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
    prevTranslate = currentTranslate;

    setWrapperPosition();
    wrapper.style.cursor = "grab";
  }

  function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    currentTranslate -= delta;

    const wrapperWidth = wrapper.scrollWidth;
    const containerWidth = container.offsetWidth;
    const maxTranslate = 0;
    const minTranslate = Math.min(0, containerWidth - wrapperWidth);

    currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
    prevTranslate = currentTranslate;

    setWrapperPosition();
  }

  function animation() {
    setWrapperPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setWrapperPosition() {
    wrapper.style.transform = `translateX(${currentTranslate}px)`;
  }

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }
}
