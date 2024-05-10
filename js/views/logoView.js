class LogoView {
  _parentElement = document.querySelector(".logo");
  addHanlderClick(hanlder) {
    this._parentElement.addEventListener("click", function (e) {
      hanlder();
    });
  }
}
export default new LogoView();
