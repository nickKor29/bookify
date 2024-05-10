import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from '../js/model';

import topAuthorsView from './views/topAuthorsView';
import topBooksView from './views/topBooksView';
import recommendedView from './views/recommendedView';
import selectTypeView from './views/selectTypeView';
import selectLangView from './views/selectLangView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import mainView from './views/mainView';
import logoView from './views/logoView';
import bookView from './views/bookView';
import headerView from './views/headerView';
import sidebarView from './views/sidebarView';
import { googleBooks } from './helpers';

const controlMain = async function () {
  try {
    await model.setDefault();
    mainView.hideMainSpinner();
    mainView.clear();
    topAuthorsView.render(model.state.default.topAuthors);
    topBooksView.render(model.state.default.topBooks);
    recommendedView.render(model.state.default.recommendedBooks);
    sidebarView.render(model.state.favorites);
  } catch (error) {
    mainView.renderErrorMain();
  }
};

const controlBackToMain = function () {
  mainView.clear();
  mainView.gridMain3Rows();
  topAuthorsView.render(model.state.default.topAuthors);
  topBooksView.render(model.state.default.topBooks);
  recommendedView.render(model.state.default.recommendedBooks);
};

const controlSearchResults = async function () {
  try {
    model.state.search.results = [];
    model.state.search.resultsForOnePage = [];
    model.state.search.page = 1;
    model.state.search.query = searchView.getQuery();
    const option = selectTypeView.selectedOption;
    const lang = selectLangView.selectedOption;

    if (!model.state.search.query || !option)
      return (searchView.input.options.submit = false);

    mainView.clear();
    if (option === 'author' || option === 'title' || option === 'keywords') {
      resultsView.renderSpinner();
      await model.googleBooks(option, model.state.search.query, lang);
    }
    mainView.clear();
    mainView.gridMain2Rows();
    model.getSearchResultsPage();

    resultsView.render(model.state.search);
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error.message);
  }
};
const controlPagination = function (page) {
  model.getSearchResultsPage(page);
  mainView.clear();
  resultsView.render(model.state.search);
  paginationView.render(model.state.search);
};

const cotrolAuthors = async function (hash) {
  model.state.search.page = 1;
  model.state.search.results = [];
  model.state.search.resultsForOnePage = [];
  mainView.clear();
  resultsView.renderSpinner();

  try {
    await model.googleBooks('author', hash);
    model.state.search.query = hash;
    mainView.gridMain2Rows();
    model.getSearchResultsPage();
    mainView.clear();
    resultsView.render(model.state.search);
    paginationView.render(model.state.search);
  } catch (error) {
    console.error('Ошибка при получении книг:', error);
    if (resultsView.renderError) {
      resultsView.renderError();
    }
  }
};

const controlFullBook = async function (id, isFavorite = false) {
  try {
    if (isFavorite) sidebarView.toggleModal('favorite');
    mainView.clear();
    bookView.renderSpinner();
    model.state.book = {};
    await model.getFullBookGoogle(id);
    // console.log(model.state.book);
    await model.getFullBookOpenLibrary(model.state.book.title);
    mainView.clear();
    mainView.gridMain3Rows();
    bookView.render(model.state.book);
    bookView.addHanlderTabs();
    // console.log(id);
  } catch (error) {
    console.error('Ошибка при открытии полной книги:', error);
    bookView.renderError();
  }
};
const controlBackFromFullBook = function () {
  mainView.clear();
  const previousPage = sessionStorage.getItem('previousPage');
  if (previousPage === 'search') {
    mainView.gridMain2Rows();
    model.getSearchResultsPage(model.state.search.page);
    resultsView.render(model.state.search);
    paginationView.render(model.state.search);
  } else {
    controlBackToMain();
  }
  model.state.book = {};
  bookView.resetTabIndex();
  sessionStorage.removeItem('previousPage');
};
const controlAddFavorite = function () {
  if (!model.state.book.favorite) model.addFavorite(model.state.book);
  else model.deleteFavorite(model.state.book.id);
  mainView.clear();
  bookView.render(model.state.book);
  sidebarView.render(model.state.favorites);
};
const controlDeleteFavorite = function (id) {
  model.deleteFavorite(id);
  sidebarView.render(model.state.favorites);
  if (!mainView.mainElement.querySelector('.book')) return;
  mainView.clear();
  bookView.render(model.state.book);
};

const init = async function () {
  await controlMain();
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  topAuthorsView.addHanlderClick(cotrolAuthors);
  sidebarView.addHanlderClickBackToMain(controlBackToMain);
  resultsView.addHandlerClick(controlFullBook, 'back');
  resultsView.addHandlerClick(cotrolAuthors);
  topBooksView.addHanlderClick(controlFullBook);
  bookView.addHanlderClick(controlBackFromFullBook);
  bookView.addHanlderFavorite(controlAddFavorite);
  sidebarView.addHandlerDeleteFavorite(controlDeleteFavorite);
  sidebarView.addHandlerOpenBook(controlFullBook);
  sessionStorage.removeItem('previousPage');
  history.replaceState(null, null, ' ');
};
init();
