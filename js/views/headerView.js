class HeaderView {
  _parentElement = document.querySelector('.header');
  _overlay = document.querySelector('.overlay');
  _sidebar = document.querySelector('.sidebar');
  constructor() {
    this._toggleBurger();
    this._closeByOverlay();
  }
  _toggleBurger() {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const burgetBtn = e.target.closest('.header__burger-btn');
        if (!burgetBtn) return;
        this._parentElement.classList.toggle('open');
        this._sidebar.classList.toggle('open');
        this._overlay.classList.toggle('hidden');
      }.bind(this)
    );
  }
  _closeByOverlay() {
    this._overlay.addEventListener(
      'click',
      function () {
        if (
          !this._overlay.classList.contains('hidden') &&
          this._parentElement.classList.contains('open') &&
          this._sidebar.classList.contains('open')
        ) {
          this._parentElement.classList.remove('open');
          this._sidebar.classList.remove('open');
          this._overlay.classList.add('hidden');
        }
      }.bind(this)
    );
  }
}
export default new HeaderView();
