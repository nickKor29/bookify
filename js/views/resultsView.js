import View from './View';

class ResultsView extends View {
  _parentElement = document.querySelector('.main');
  _data;
  _errorMessage =
    'Unfortunately, no books were found matching your search query. Please try adjusting your search parameters or try again later.';

  render(data) {
    if (!data) return;
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    return `
    <div class="search-results">
      <h2 class="search-results__title">The results of ${
        this._data.query
      } search</h2>
      ${this._data.resultsForOnePage.map(this._generateBookCard).join('')}
    </div>
    `;
  }

  _generateBookCard(book) {
    const authorEncoded = encodeURIComponent(book.author);
    return `
    <figure class="book-card">
      <div class="book-card__img-box">
        <img
          class="book-card__img"
          src="${book.img}"
          alt="${book.title} book image"
        />
        <span class="book-card__rating">
          <span class="book-card__star">&#9733;</span> ${book.rating}
        </span>
      </div>
      <h3 class="book-card__title">${book.title}</h3>
      <figcaption class="book-card__info">
        <p class="book-card__subtitle">${book.subtitle}</p>
        <p class="book-card__author">
          By <a class="book-card__auhtor-link" href="#${authorEncoded}">${
      book.author
    }</a>
        </p>
        <p class="book-card__description">
          ${book.description || ''}
        </p>
        <div class="book-card__subjects-box">
          ${
            book.categories
              ? book.categories
                  .map(
                    category =>
                      ` <span class="book-card__subject">${category}</span>`
                  )
                  .join('')
              : ''
          }
        </div>
        <a class="book-card__link" href="#${book.id}">Read more</a>
      </figcaption>
    </figure>
    `;
  }

  addHandlerClick(handler, linkType) {
    this._parentElement.addEventListener('click', function (e) {
      const link = e.target.closest(
        `${
          linkType === 'back' ? '.book-card__link' : '.book-card__auhtor-link'
        }`
      );
      console.log(link, linkType);
      if (!link) return;
      if (linkType === 'back') sessionStorage.setItem('previousPage', 'search');
      if (linkType !== 'back') sessionStorage.setItem('previousPage', 'global');
      const href = link.href.split('#');
      console.log(href);
      handler(decodeURIComponent(href[1]));
    });
  }
}

export default new ResultsView();
