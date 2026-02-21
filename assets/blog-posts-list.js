import PaginatedList from '@theme/paginated-list';

/**
 * A custom element that renders a paginated blog posts list.
 * Supports two pagination modes via the `pagination-type` attribute:
 * - "infinite_scroll": auto-loads pages as user scrolls (default)
 * - "button": shows a clickable "view more" link for manual pagination
 */
export default class BlogPostsList extends PaginatedList {
  connectedCallback() {
    super.connectedCallback();

    if (this.getAttribute('pagination-type') === 'button') {
      this.infinityScrollObserver?.disconnect();
    }
  }
}

if (!customElements.get('blog-posts-list')) {
  customElements.define('blog-posts-list', BlogPostsList);
}
