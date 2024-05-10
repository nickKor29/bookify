import { GOOGLE_API_URL, API_KEY } from '../config';
import { getJSON } from '../helpers';
import autoComplete from '@tarekraafat/autocomplete.js';
import '@tarekraafat/autocomplete.js/dist/css/autoComplete.02.css';
class SearchView {
  _parentElement = document.querySelector('.search');
  _searchBtn = document.querySelector('.search__btn');
  input;
  constructor() {
    this._initializeInput();
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__input').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__input').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        handler();
        this.input.close();
      }.bind(this)
    );
    this._searchBtn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        handler();
        this.input.close();
      }.bind(this)
    );
  }

  _initializeInput() {
    this.input = new autoComplete({
      selector: '#search-book',
      placeHolder: 'Search for books...',
      data: {
        src: async query => {
          try {
            // Fetch Data from external Source
            const sourse = await getJSON(
              `${GOOGLE_API_URL}?q=intitle:${encodeURIComponent(
                query
              )}&key=${API_KEY}&startIndex=1&maxResults=10`
            );
            if (sourse.totalItems > 0) {
              const data = sourse.items.map(book => book.volumeInfo.title);
              // console.log(data);
              return data;
            } else {
              // Если нет результатов, вернуть пустой массив
              return [];
            }
          } catch (error) {
            return error;
          }
        },
      },
      threshold: 2,
      debounce: 500,

      resultsList: {
        element: (list, data) => {
          if (!data.results.length) {
            // Create "No Results" message list element
            const message = document.createElement('div');
            message.setAttribute('class', 'no_result');
            // Add message text content
            message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
            // Add message list element to the list
            list.appendChild(message);
          }
        },
        noResults: true,
      },

      resultItem: {
        element: (item, data) => {
          // Modify Results Item Style
          item.style = 'display: flex; justify-content: space-between;';
          // Modify Results Item Content without any tags
          item.innerHTML = `
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${data.match}
            </span>`;
          // Add event listener for click on result item
          item.addEventListener('click', () => {
            // Fill input field with selected result without <mark> tags
            document.querySelector('.search__input').value = data.match.replace(
              /<\/?mark>/g,
              ''
            );
          });
        },
        highlight: true,
      },
      submit: true,
    });
  }
}

export default new SearchView();
