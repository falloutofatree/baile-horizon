import PaginatedList from '@theme/paginated-list';
import { sectionRenderer } from '@theme/section-renderer';
import { requestIdleCallback } from '@theme/utilities';

/**
 * A custom element that renders a paginated blog posts list.
 * Supports two pagination modes via the `pagination-type` attribute:
 * - "infinite_scroll": auto-loads pages as user scrolls (default)
 * - "button": shows a clickable "view more" button for manual pagination
 */
export default class BlogPostsList extends PaginatedList {
  #isLoading = false;

  connectedCallback() {
    super.connectedCallback();

    if (this.getAttribute('pagination-type') === 'button') {
      this.infinityScrollObserver?.disconnect();

      this.refs.viewMoreNext?.addEventListener('click', (e) => {
        e.preventDefault();
        this.#loadNextPage();
      });
    }
  }

  async #loadNextPage() {
    if (this.#isLoading) return;
    this.#isLoading = true;

    try {
      const { grid, cards } = this.refs;
      if (!grid || !Array.isArray(cards) || cards.length === 0) return;

      const lastCard = cards[cards.length - 1];
      const currentPage = Number(lastCard.dataset.page);
      const nextPage = currentPage + 1;
      const lastPage = Number(grid.dataset.lastPage);

      if (nextPage > lastPage) return;

      const url = new URL(window.location.href);
      url.searchParams.set('page', nextPage.toString());
      url.hash = '';

      let pageHTML = this.pages.get(nextPage);
      if (!pageHTML) {
        pageHTML = await sectionRenderer.getSectionHTML(this.sectionId, true, url);
        this.pages.set(nextPage, pageHTML);
      }

      const parsedPage = new DOMParser().parseFromString(pageHTML, 'text/html');
      const gridElement = parsedPage.querySelector('[ref="grid"]');
      if (!gridElement) return;
      const newItems = gridElement.querySelectorAll(':scope > [ref="cards[]"]');

      grid.append(...newItems);
      history.pushState('', '', url.toString());

      if (nextPage >= lastPage) {
        this.refs.viewMoreNext?.closest('.blog-posts-view-more')?.remove();
      }

      // Pre-fetch the following page
      if (nextPage < lastPage) {
        requestIdleCallback(() => {
          const prefetchPage = nextPage + 1;
          if (!this.pages.has(prefetchPage)) {
            const prefetchUrl = new URL(window.location.href);
            prefetchUrl.searchParams.set('page', prefetchPage.toString());
            prefetchUrl.hash = '';
            sectionRenderer.getSectionHTML(this.sectionId, true, prefetchUrl).then((html) => {
              this.pages.set(prefetchPage, html);
            });
          }
        });
      }
    } finally {
      this.#isLoading = false;
    }
  }
}

if (!customElements.get('blog-posts-list')) {
  customElements.define('blog-posts-list', BlogPostsList);
}
