import View from './View';
class MainView extends View {
  mainElement = document.querySelector('.main');
  clear() {
    this.mainElement.innerHTML = '';
  }
  hideMainSpinner() {
    document.querySelector('.main-spinner').classList.add('active');
    document.querySelector('.main-spinner__spinner').classList.add('active');
  }
  // renderSpinner() {
  // }
  gridMain2Rows() {
    this.mainElement.classList.add('main-search');
  }
  gridMain3Rows() {
    this.mainElement.classList.remove('main-search');
  }
  renderErrorMain() {
    const markup = `
      <div class="error">
      
        <p>💥💥💥Oops! Something went wrong and we couldn't open the application. It appears there's an issue preventing the application from loading. Please try refreshing the page or check back later. If the problem persists, please contact support for assistance.</p>
      </div>
    `;
    this.hideMainSpinner();
    document.body.innerHTML = '';
    document.body.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new MainView();
