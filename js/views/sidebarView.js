import Swiper from 'swiper';
import { Navigation, Grid, Pagination } from 'swiper/modules';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation.min.css';
import 'swiper/modules/grid.min.css';
import 'swiper/modules/pagination.min.css';
class SidebarView {
  _data;
  _modalFavorite = document.querySelector('.modal-favorite');
  _modalSettings = document.querySelector('.modal-settings');
  _swiperFavorite = document.querySelector('.favotite-swiper');
  _overlay = document.querySelector('.overlay');
  _parentElement = document.querySelector('.sidebar');
  _header = document.querySelector('.header');
  _searchInput = document.querySelector('.search__input');
  _menu = document.querySelector('.menu');
  _themeCheckBox = document.querySelector('.checkbox__inp');

  constructor() {
    this.activateFocus();
    this.setModal();
    this.closeModalAfterClick();
    this._toggleTheme();
    this._checkTheme();
  }
  render(data) {
    if (!data) return;
    this._data = data;
    const markup = this._geretateFavotiteModal();
    this._modalFavorite.innerHTML = '';
    this._modalFavorite.insertAdjacentHTML('afterbegin', markup);
    this._initializeSwiper();
  }
  addHanlderClickBackToMain(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const logo = e.target.closest('.logo');
      const homeBtn = e.target.closest('.nav-home');
      const mobileLogo = e.target.closest('.mobile-logo');
      console.log(logo);
      console.log(homeBtn);
      console.log(mobileLogo);
      if (logo || homeBtn || mobileLogo) handler();
      history.replaceState(null, null, ' ');
      sessionStorage.removeItem('previousPage');
    });
  }
  addHandlerOpenBook(handler) {
    this._modalFavorite.addEventListener('click', function (e) {
      const link = e.target.closest('.books__link');
      const id = link?.href.split('#')[1];
      if (!id) return;
      handler(id, true);
      sessionStorage.setItem('previousPage', 'favorite');
    });
  }

  activateFocus() {
    this._parentElement.addEventListener('click', e => {
      const searchBtn = e.target.closest('.nav-search');
      if (searchBtn) {
        this._searchInput.focus();
      }
    });
  }

  setModal() {
    this._parentElement.addEventListener('click', e => {
      const favoriteBtn = e.target.closest('.nav-favorite');
      const settingsBtn = e.target.closest('.nav-settings');
      if (favoriteBtn) {
        this.toggleModal('favorite');
      }
      if (settingsBtn) {
        this.toggleModal('settings');
      }
    });

    document.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        !this._modalFavorite.classList.contains('hidden')
      ) {
        this.toggleModal('favorite');
      }
      if (
        e.key === 'Escape' &&
        !this._modalSettings.classList.contains('hidden')
      ) {
        this.toggleModal('settings');
      }
    });

    this._overlay.addEventListener('click', () => {
      if (!this._modalSettings.classList.contains('hidden')) {
        this.toggleModal('settings');
      }
      if (!this._modalFavorite.classList.contains('hidden')) {
        this.toggleModal('favorite');
      }
    });

    this._modalFavorite.addEventListener('click', e => {
      const btnCloseModal = e.target.closest('.close-modal');
      if (!btnCloseModal) return;
      this.toggleModal('favorite');
    });
    this._modalSettings.addEventListener('click', e => {
      const btnCloseModal = e.target.closest('.close-modal');
      if (!btnCloseModal) return;
      this.toggleModal('settings');
    });
  }

  toggleModal(modal) {
    if (modal === 'favorite') {
      this._modalFavorite.classList.toggle('hidden');
    } else {
      this._modalSettings.classList.toggle('hidden');
    }

    // Проверяем, открыты ли оба модальных окна
    const isFavoriteModalVisible =
      !this._modalFavorite.classList.contains('hidden');
    const isSettingsModalVisible =
      !this._modalSettings.classList.contains('hidden');

    // Если хотя бы одно модальное окно открыто, отображаем оверлэй, иначе скрываем его
    if (isFavoriteModalVisible || isSettingsModalVisible) {
      this._overlay.classList.remove('hidden');
    } else {
      this._overlay.classList.add('hidden');
    }
  }

  _geretateFavotiteModal() {
    return `
    <button class="close-modal">&times;</button>
      <div class="swiper favorite-swiper">
        <div class="favorite-wrapper swiper-wrapper">
        ${this._data.map(book => this._generateBooks(book)).join('')}

        </div>
        </div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-next favorite-button-next"></div>
        <div class="swiper-button-prev favorite-button-prev"></div>

    `;
  }
  _generateBooks(book) {
    return `
    <div class="swiper-slide books__item favorite-slide">
    <button class='favorite-delete'>&mdash;</button>
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
  addHandlerDeleteFavorite(handler) {
    this._modalFavorite.addEventListener('click', function (e) {
      const btn = e.target.closest('.favotite-delete');
      const book = e.target.closest('.books__item');
      if (!book || !btn) return;
      const id = book.querySelector('.books__link')?.href.split('#')[1];

      handler(id);
    });
  }
  closeModalAfterClick() {
    this._menu.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.nav__btn');
        const footerLink = e.target.closest('.footer__link');

        if (!btn && !footerLink) return;

        this._parentElement.classList.remove('open');
        this._header.classList.remove('open');
        this._overlay.classList.add('hidden');
      }.bind(this)
    );
  }
  _initializeSwiper() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1700) {
      const swiper = new Swiper('.favorite-swiper', {
        modules: [Navigation, Pagination],
        slidesPerView: 3,

        spaceBetween: 70,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.favorite-button-next',
          prevEl: '.favorite-button-prev',
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
        },
      });
    } else {
      const swiper = new Swiper('.favorite-swiper', {
        modules: [Navigation, Pagination, Grid],
        slidesPerView: 4,
        grid: {
          fill: 'row',
          rows: 2,
        },
        spaceBetween: 70,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.favorite-button-next',
          prevEl: '.favorite-button-prev',
        },
      });
    }
  }
  _toggleTheme() {
    this._themeCheckBox.addEventListener('change', function () {
      const htmlElement = document.documentElement;
      console.log('sada231231s21w1s2');
      const imagesLight = document.querySelectorAll('.logo__img--light');
      const imagesDark = document.querySelectorAll('.logo__img--dark');
      if (this.checked) {
        imagesLight.forEach(img => img.classList.add('hidden'));
        imagesDark.forEach(img => img.classList.remove('hidden'));
        htmlElement.classList.add('dark-theme');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        imagesLight.forEach(img => img.classList.remove('hidden'));
        imagesDark.forEach(img => img.classList.add('hidden'));
        htmlElement.classList.remove('dark-theme');
        // Сохраняем состояние темы в localStorage или sessionStorage
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  }
  _checkTheme() {
    document.addEventListener(
      'DOMContentLoaded',
      function () {
        const darkModeState = localStorage.getItem('darkMode');
        const imagesLight = document.querySelectorAll('.logo__img--light');
        const imagesDark = document.querySelectorAll('.logo__img--dark');
        console.log(darkModeState);
        if (darkModeState === 'enabled') {
          console.log(darkModeState);
          this._themeCheckBox.checked = true;
          const htmlElement = document.documentElement;
          htmlElement.classList.add('dark-theme');
          imagesLight.forEach(img => img.classList.add('hidden'));
          imagesDark.forEach(img => img.classList.remove('hidden'));
        }
      }.bind(this)
    );
  }
}

export default new SidebarView();
