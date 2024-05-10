export default class View {
  _parentElement = document.querySelector('.main');
  _data;
  render(data) {
    if (!data) return;
    this._data = data;
    this._clear();
    if (this._parentElement.classList.contains('hidden')) {
      this._parentElement.classList.remove('hidden');
    }
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
    <div class="spinner-secondary">
    <div class="spinner-secondary__spinner"></div>
    <div class="spinner-secondary__message">
		<p class="spinner-secondary__message__line">Assembling the book piece by piece...</p>
		<p class="spinner-secondary__message__line">Please wait while we locate the required pages...</p>
		<p class="spinner-secondary__message__line">Verifying the data...</p>
		<p class="spinner-secondary__message__line">Creating the magic of reading...</p>
		<p class="spinner-secondary__message__line">Preparing for an exciting journey...</p>
		<p class="spinner-secondary__message__line">Crafting the book just for you...</p>
		<p class="spinner-secondary__message__line">Loading stories from the world of fantasy...</p>
		<p class="spinner-secondary__message__line">Hold on tight, we're almost ready for reading...</p>
	</div>
    </div>
 
    `;
    // console.log('spinner');
    // this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
      
        <p>💥💥💥 ${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
