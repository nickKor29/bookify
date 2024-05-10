import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation.min.css';
class TopAuthorsView {
  _parentElement = document.querySelector('.main');
  _data;
  render(data) {
    if (!data) return;
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    this._initializeSwiper();
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  _generateMarkup() {
    return `
    <section class="top-authors">
    <h2 class="heading-secondary">Top authors</h2>
  <!-- Список слайдов -->
  <div class="swiper swiper-top-authors">
  <div class="swiper-wrapper top-authors__list">
  ${this._data.map(this._generateAuthor.bind(this)).join('')}
  
  </div>
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
  </div>
  </section>
    `;
  }
  _generateAuthor(author) {
    return `
    <div class="swiper-slide top-authors__item">
    <figure class="top-authors__author">
      <img
        class="top-authors__img"
        src="${author.img}"
        alt = "${author.name} photo"
      />
      <figcaption class="top-authors__description">
        <h3 class="top-authors__name">${author.name}</h3>
        <p class="top-authors__text">
          ${author.description}
        </p>
      </figcaption>
      <a class="top-authors__link" href="#${encodeURIComponent(
        author.name
      )}"></a>
    </figure>
  </div>
    `;
  }

  _initializeSwiper() {
    const topAuthorsSwiper = new Swiper('.swiper-top-authors', {
      modules: [Navigation],

      slidesPerView: '4',
      // loop: true,
      // spaceBetween: 10,
      // spaceBetween: 3,
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
          slidesPerView: 4, // Показываем два слайда
          // spaceBetween: 20, // Уменьшаем расстояние между слайдами
        },
        // Когда ширина экрана больше или равна 1024px
        1024: {
          slidesPerView: 3, // Возвращаем три слайда
          // spaceBetween: 30, // Возвращаем исходное расстояние между слайдами
        },
        864: {
          slidesPerView: 3, // Возвращаем три слайда
          // spaceBetween: 20, // Возвращаем исходное расстояние между слайдами
        },
        600: {
          slidesPerView: 3, // Возвращаем три слайда
          // spaceBetween: 20, // Возвращаем исходное расстояние между слайдами
        },
        500: {
          slidesPerView: 2, // Возвращаем три слайда
          // spaceBetween: 20, // Возвращаем исходное расстояние между слайдами
        },
        370: {
          slidesPerView: 2, // Возвращаем три слайда
          // spaceBetween: 0, // Возвращаем исходное расстояние между слайдами
        },
        320: {
          slidesPerView: 1, // Возвращаем три слайда
          // spaceBetween: 0, // Возвращаем исходное расстояние между слайдами
        },
      },
    });
  }
  addHanlderClick(hanlder) {
    this._parentElement.addEventListener('click', function (e) {
      const link = e.target.closest('.top-authors__link');
      if (!link) return;
      const linkHref = link.href.split('#');
      // console.log(linkHref);
      const hash = decodeURIComponent(linkHref[1]);
      hanlder(hash);
    });
  }
}
export default new TopAuthorsView();
