const masthead = document.querySelector('#masthead');
const introSection = document.querySelector('#about');
const cascade = document.querySelector('.cascade');
const movingImages = Array.from(cascade.querySelectorAll('img'), image => ({
  image,
  depth: Number(getComputedStyle(image).getPropertyValue('--depth')),
}));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let scrollFrame = 0;

function updateHeaderTheme() {
  const edge = masthead.getBoundingClientRect().bottom;
  const about = introSection.getBoundingClientRect();
  const onLightSection = about.top > edge || about.bottom <= edge;
  masthead.classList.toggle('is-light', onLightSection);
}

function updateScrollEffects() {
  scrollFrame = 0;
  updateHeaderTheme();
  if (reducedMotion.matches) return;

  const distance = Math.max(0, -cascade.getBoundingClientRect().top + masthead.offsetHeight);
  for (const { image, depth } of movingImages) {
    const shift = Math.min(distance, cascade.offsetHeight) * depth;
    image.style.setProperty('--shift', shift + 'px');
  }
}

function scheduleScrollEffects() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
}

updateScrollEffects();
window.addEventListener('scroll', scheduleScrollEffects, { passive: true });
window.addEventListener('resize', scheduleScrollEffects);
window.addEventListener('pageshow', scheduleScrollEffects);
reducedMotion.addEventListener('change', scheduleScrollEffects);

for (const image of document.querySelectorAll('.card-frame img')) {
  image.addEventListener('contextmenu', event => event.preventDefault());
}
