import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation.min.css';
class RecommenedView {
  _parentElement = document.querySelector('.main');
  _data;
  render(data) {
    if (!data) return;
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    this._initializeSwiper();
  }

  _generateMarkup() {
    if (this._data.length === 0) {
      return `
      <section class="reccomended">
      <h2 class="heading-secondary reccomended__title">Recommened for you</h2>

      <p class ="reccomended__text">Currently, you don't have any recommended books yet. However, don't worry! You can start exploring interesting books right now and create your own list of recommendations. Immerse yourself in the fascinating world of literature and discover new amazing works!</p>
      </section">
      `;
    } else {
      return `
      <section class="reccomended">
      <h2 class="heading-secondary reccomended__title">Recommened for you</h2>
      <div class="swiper swiper-recommended">
      <div class="books__list swiper-wrapper">
      ${this._data.map(this._generateBook.bind(this)).join('')}
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
      </div>
      </section">
      `;
    }
  }
  _generateBook(book) {
    return `
    <div class="swiper-slide books__item">
      <figure class="books__book">
        <img
          class="books__img"
          src="${book.img}"
          alt="${book.title} book image"
        />
        <figcaption class="books__description">
          <h3 class="books__name">${book.title}</h3>
        </figcaption>
        <a class="books__link" href="#${book.id}"></a>
      </figure>
    </div>
    `;
  }

  _initializeSwiper() {
    const topBooksSwiper = new Swiper('.swiper-recommended', {
      modules: [Navigation],
      slidesPerView: '4',
      // loop: true,
      // spaceBetween: 10,
      spaceBetween: 30,
      keyboard: {
        enabled: true,
      },

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // Когда ширина экрана больше или равна 768px
        1700: {
          // slidesPerView: 2, // Показываем два слайда
          spaceBetween: 20, // Уменьшаем расстояние между слайдами
        },
        // Когда ширина экрана больше или равна 1024px

        864: {
          slidesPerView: 3, // Возвращаем три слайда
          spaceBetween: 30, // Возвращаем исходное расстояние между слайдами
        },
        750: {
          slidesPerView: 3, // Возвращаем три слайда
          spaceBetween: 30,
        },
        400: {
          slidesPerView: 2, // Возвращаем три слайда
          spaceBetween: 40, // Возвращаем исходное расстояние между слайдами
        },
        370: {
          slidesPerView: 1, // Возвращаем три слайда
          spaceBetween: 20, // Возвращаем исходное расстояние между слайдами
        },
        320: {
          slidesPerView: 1, // Возвращаем три слайда
          spaceBetween: 20, // Возвращаем исходное расстояние между слайдами
        },
      },
    });
  }
  addHanlderClick(hanlder) {
    this._parentElement.addEventListener('click', function (e) {
      const link = e.target.closest('.books__link');
      if (!link) return;
      const linkHref = link.href.split('#');
      // console.log(linkHref);
      const hash = decodeURIComponent(linkHref[1]);
      hanlder(hash);
    });
  }
}
export default new RecommenedView();
