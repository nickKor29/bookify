import SelectView from './selectView';
// import Choices from 'choices.js';
// import 'choices.js/public/assets/styles/choices.css';
class SelectLangView extends SelectView {
  constructor() {
    super('.lang-type');
    this.setDefaultSelectedOption('lang');
  }
}
export default new SelectLangView();
