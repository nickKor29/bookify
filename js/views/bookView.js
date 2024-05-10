import { convertLanguageCode, iso6391 } from '../helpers';
import Swiper from 'swiper';
import { Scrollbar } from 'swiper/modules';
import 'swiper/swiper.min.css';
import 'swiper/modules/scrollbar.min.css';
import { Navigation } from 'swiper/modules';
import 'swiper/modules/navigation.min.css';
import View from './View';
class BookView extends View {
  _parentElement = document.querySelector('.main');
  _data;
  _swiper; // Свойство для хранения экземпляра Swiper
  _errorMessage = `Oops! We couldn't open this book. It seems there's a problem with accessing this book at the moment. Please try again later or contact support if the issue persists.`;
  _tabIndex = 1;

  render(data) {
    if (!data) return;
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    this.addHanlderTabs();
    this._makeSameHeight();
    this.initializeSwiper();
    this.initializeScroll();
    this._tabIndex = 1;
  }

  _generateMarkup() {
    return `
    <div class="book">
    <div class="book__img-box">
      <img
        class="book__img"
        src="${this._data.img}"
        alt="${this._data.title} book image"
      />
    </div>
    <div class="book__details">
    
    <h2 class="book__title">
      ${this._data.title}
    </h2>
    <button class="book__btn-back">
    <span class="material-symbols-outlined book__icon-back">
keyboard_return
</span>
    </button>
  
      <h3 class="book__subtitle">${this._data.subtitle || ''}</h3>

      <ul class="book__details-list">
        <p class="book__author book__by">
          <span class="book__pretext">By:</span>${this._data.authors.join('')}
        </p>
        <p class="book__publisher book__edition book__by">
          <span class="book__pretext">Publisher:</span>${this._data.publisher}
        </p>
        <p class="book__edition book__by">
          <span class="book__pretext">Edition:</span>${this._data.editionCount}
        </p>
        <p class="book__date book__by">
          <span class="book__pretext">Publication Date:</span>${
            this._data.publishedDate
          }
        </p>
      </ul>
      </div>
      <div class="book__details-buttons">
      ${
        this._data.favorite
          ? `<button class="book__details-btn btn--favorite book__details-btn--favorite">Delete from Favorites</button>`
          : `<button class="book__details-btn btn--favorite ">Add to Favorites</button>`
      }
       
        <button class="book__details-btn">Share</button>
      </div>
    <div class="book__tabs">
    ${
      window.innerWidth <= 600
        ? `
        
         <div class="swiper book__tabs-buttons">
    <div class="swiper-wrapper">
    <button data-tab="1" class="swiper-slide book__tabs-btn ${
      this._tabIndex === 1 ? 'active-tab' : ''
    }">
      Technical Details
    </button>
    <button data-tab="2" class="swiper-slide book__tabs-btn ${
      this._tabIndex === 2 ? 'active-tab' : ''
    }">Book Overview</button>
    <button data-tab="3" class="swiper-slide book__tabs-btn ${
      this._tabIndex === 3 ? 'active-tab' : ''
    }">Rating</button>
    
     </div>
      </div>`
        : ` <div class="book__tabs-buttons">
      
      <button data-tab="1" class="book__tabs-btn ${
        this._tabIndex === 1 ? 'active-tab' : ''
      }">
        Technical Details
      </button>
      <button data-tab="2" class="book__tabs-btn ${
        this._tabIndex === 2 ? 'active-tab' : ''
      }">Book Overview</button>
      <button data-tab="3" class="book__tabs-btn ${
        this._tabIndex === 3 ? 'active-tab' : ''
      }">Rating</button>
      
       
        </div>`
    }
     
      <div class="book__tabs-content-box">
        <div class="book__tabs-content book__tabs-content--1 ${
          this._tabIndex === 1 ? '' : 'hidden'
        }">
          <h3 class="book__tabs-content-title">Technical Details</h3>
          <table class="book__table">
            <tr>
              <td class="book__table-text ">
                Number of Pages
              </td>
              <td class="book__table-text book__table-text--dark-main">${
                this._data.pageCount
              }</td>
            </tr>
            <tr>
              <td class="book__table-text ">
                ISBN
              </td>
              <td class="book__table-text book__table-text--dark-main">
                ${this._data.isbn}
              </td>
            </tr>
            <tr>
              <td class="book__table-text ">
                Languages
              </td>
              <td class="book__table-text book__table-text--dark-main">
                ${convertLanguageCode(this._data.language)}
              </td>
            </tr>
            <tr>
              <td class="book__table-text ">
                Publication
              </td>
              <td class="book__table-text book__table-text--dark-main">
               ${this._data.publisher} ${this._data.publishedDate}
              </td>
            </tr>
          </table>
        </div>
        <div class="swiper book-swiper book__tabs-content book__tabs-content--2 ${
          this._tabIndex === 2 ? '' : 'hidden'
        }">
        <div class="swiper-wrapper">
          <div class="swiper-slide book-slide">
            <h3 class="book__tabs-content-title">Book Overview</h3>
            <p class="book__text">${this._data.description}</p>
            </div>
            <div class="swiper-slide book-slide">
            <p class="book__text">
              ${
                this._data.subjects
                  ? ` This book includes lot's of subjects such
              as:
              <span class="book__text-subject"
                >${this._data.subjects.join(', ')}</span
              >`
                  : ''
              }
            </p>
            </div>
        </div>
        <div class="swiper-scrollbar"></div>
      </div>
        
        
        <div class="book__tabs-content book__tabs-content--3 ${
          this._tabIndex === 3 ? '' : 'hidden'
        }">
          <h3 class="book__tabs-content-title">Rating</h3>
          <div class="book__rating-box">
            <div class="book__rating-average">
              <p class="book__rating-number">${this._data.ratingAverage}</p>
              <div class="star-outer">
              <div class="book__rating-stars" style ="width: ${
                (this._data.ratingAverage / 5) * 100
              }%">
               
              </div>
              </div>
              <p class="book__rating-total-number">${
                this._data.ratingCountTotal
              }</p>
            </div>
            <div class="book__rating-progress">
              <div class="book__rating-progress-inner">
                <p class="book__rating-value">
                  5 <span class="book__star">&#9733;</span>
                </p>
                <div class="book__progress">
                  <div class="book__bar" style = "width: ${
                    (this._data.ratingCount5 / this._data.ratingCountTotal) *
                    100
                  }%"></div>
                </div>
                <p class="book__rating-value-number">${
                  this._data.ratingCount5
                }</p>
              </div>
              <div class="book__rating-progress-inner">
                <p class="book__rating-value">
                  4 <span class="book__star">&#9733;</span>
                </p>
                <div class="book__progress">
                <div class="book__bar" style = "width: ${
                  (this._data.ratingCount4 / this._data.ratingCountTotal) * 100
                }%"></div>
                </div>
                <p class="book__rating-value-number">${
                  this._data.ratingCount4
                }</p>
              </div>
              <div class="book__rating-progress-inner">
                <p class="book__rating-value">
                  3 <span class="book__star">&#9733;</span>
                </p>
                <div class="book__progress">
                <div class="book__bar" style = "width: ${
                  (this._data.ratingCount3 / this._data.ratingCountTotal) * 100
                }%"></div>
                </div>
                <p class="book__rating-value-number">${
                  this._data.ratingCount3
                }</p>
              </div>
              <div class="book__rating-progress-inner">
                <p class="book__rating-value">
                  2 <span class="book__star">&#9733;</span>
                </p>
                <div class="book__progress">
                <div class="book__bar" style = "width: ${
                  (this._data.ratingCount2 / this._data.ratingCountTotal) * 100
                }%"></div>
                </div>
                <p class="book__rating-value-number">${
                  this._data.ratingCount2
                }</p>
              </div>
              <div class="book__rating-progress-inner">
                <p class="book__rating-value">
                  1 <span class="book__star">&#9733;</span>
                </p>
                <div class="book__progress">
                <div class="book__bar" style = "width: ${
                  (this._data.ratingCount1 / this._data.ratingCountTotal) * 100
                }%"></div>
                </div>
                <p class="book__rating-value-number">${
                  this._data.ratingCount1
                }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
  }
  addHanlderTabs() {
    const tabs = document.querySelectorAll('.book__tabs-content');
    const tabsContainer = document.querySelector('.book__tabs');
    const tabsBtns = document.querySelectorAll('.book__tabs-btn');

    tabsContainer.addEventListener('click', e => {
      const btn = e.target.closest('.book__tabs-btn');
      if (!btn) return;
      btn.blur();
      tabsBtns.forEach(btn => btn.classList.remove('active-tab'));
      tabs.forEach(t => t.classList.add('hidden'));
      btn.classList.add('active-tab');
      this._tabIndex = +btn.dataset.tab;
      document
        .querySelector(`.book__tabs-content--${this._tabIndex}`)
        .classList.remove('hidden');

      // Обновление Swiper после изменения табов
      this._swiper.update();

      // Проверяем, инициализирован ли SwiperTabs
      if (this._swiperTabs) {
        this._swiperTabs.update();
      }
    });
  }

  addHanlderClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.book__btn-back');
      if (!btn) return;
      handler();
      history.replaceState(null, null, ' ');
    });
  }
  _makeSameHeight() {
    const tabs = document.querySelectorAll('.book__tabs-content');

    // Инициализируем переменную для хранения самой большой высоты
    let maxHeight = 0;

    // Проходим по всем элементам и находим самую большую высоту
    tabs.forEach(tab => {
      const height = tab.clientHeight; // Высота текущего элемента
      if (height > maxHeight) {
        maxHeight = height; // Обновляем самую большую высоту, если находим более высокий элемент
      }
    });

    // Устанавливаем найденную высоту для всех элементов
    tabs.forEach(tab => {
      tab.style.height = `${maxHeight}px`;
    });
  }
  addHanlderFavorite(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--favorite');
      if (!btn) return;
      handler();
    });
  }
  initializeSwiper() {
    this._swiper = new Swiper('.book-swiper', {
      modules: [Scrollbar],
      direction: 'vertical',
      slidesPerView: 'auto',
      freeMode: true,
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
        dragClass: 'custom-scrollbar-drag',
      },
      mousewheel: true,
      nested: true,
    });

    const swiperContainer = document.querySelector('.book-swiper');
    swiperContainer.addEventListener('wheel', event => {
      event.preventDefault();
      if (event.deltaY < 0) {
        this._swiper.slidePrev();
      } else {
        this._swiper.slideNext();
      }
    });
  }
  initializeScroll() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      this._swiperTabs = new Swiper('.book__tabs-buttons', {
        keyboard: {
          enabled: true,
        },
      });
    }
  }

  resetTabIndex() {
    this._tabIndex = 1;
  }
}
export default new BookView();
