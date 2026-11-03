// Placeholder links (project pages and "Learn More" don't exist yet). They are
// marked aria-disabled="true", so screen readers announce them as unavailable;
// this stops a click or Enter on them from following href="#" to the top of the page.

export function initPlaceholderLinks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[aria-disabled="true"]');
    if (link) event.preventDefault();
  });
}
