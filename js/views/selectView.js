import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.css';

export default class SelectView {
  _parentElement;
  _parentBox = document.querySelector('.select-box');
  selectedOption = null;

  constructor(selector) {
    this._parentElement = document.querySelectorAll(selector);
    this._parentElement.forEach(select => {
      this.initializeSelect(select);
      this.getOption(select);
    });
  }

  getOption(select) {
    select.addEventListener(
      'change',
      function (e) {
        this.selectedOption = e.target.value;
      }.bind(this)
    );
  }
  initializeSelect(select) {
    const element = select;
    const choices = new Choices(element, {
      allowHTML: true,
      searchEnabled: false,
      itemSelectText: '',
    });
    // Установка выбранного значения для селекта
  }

  setDefaultSelectedOption(type) {
    const computedStyle = window.getComputedStyle(this._parentBox);
    if (computedStyle.display === 'none') {
      const mobileSelects = document.querySelectorAll('.mob');

      mobileSelects.forEach((select, i, arr) => {
        if (select.selectedOptions[0].selected) {
          this.selectedOption =
            arr[type === 'search' ? 0 : 1].selectedOptions[0].value;
        }
        select.addEventListener('change', () => {
          this.selectedOption = select.value;
        });
      });
    }
  }
}
