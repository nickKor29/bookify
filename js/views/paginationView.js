import View from './View';
class PaginationView {
  _parentElement = document.querySelector('.main');
  render(data) {
    if (!data) return;
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;
    // console.log(curPage);
    // console.log(numPages);

    if (curPage === 1 && numPages > 1) {
      return `
      <div class="pagination">
      <button data-goto="${
        curPage + 1
      }" class="pagination__btn pagination__btn--next">
      <span class="pagination__number">Page ${curPage + 1}</span>
      <span class="pagination__arrow">&rarr;</span>
      </button>
      </div>
    `;
    }
    if (curPage === numPages && numPages > 1) {
      return `
      <div class="pagination ">
      <button data-goto="${
        curPage - 1
      }"  class="pagination__btn pagination__btn--prev">
      <span class="pagination__arrow">&larr;</span>
      <span class="pagination__number">Page ${curPage - 1}</span>
      </button>
      
      </div>
        `;
    }
    if (curPage < numPages) {
      return `
      <div class="pagination">
      <button data-goto="${
        curPage - 1
      }"  class="pagination__btn pagination__btn--prev">
      <span class="pagination__arrow">&larr;</span>
      <span class="pagination__number">Page ${curPage - 1}</span>
      </button>
      <button data-goto="${
        curPage + 1
      }"  class="pagination__btn pagination__btn--next">
      <span class="pagination__number">Page ${curPage + 1}</span>
      <span class="pagination__arrow">&rarr;</span>
      </button>
      </div>
      `;
    }

    return '';
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination__btn');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}
export default new PaginationView();
