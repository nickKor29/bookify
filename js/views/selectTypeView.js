import SelectView from './selectView';
// import Choices from 'choices.js';
// import 'choices.js/public/assets/styles/choices.css';
class SelectTypeView extends SelectView {
  constructor() {
    super('.search-type');
    this.setDefaultSelectedOption('search');
  }
}
export default new SelectTypeView();
