import { checkImageSize, getJSON, formatBookData, checkBook } from './helpers';
import {
  API_KEY,
  GOOGLE_API_URL,
  OPLIBR_API_URL,
  WIKI_API_URL,
  RES_PER_PAGE,
} from './config';
export const state = {
  book: {},
  default: {
    topAuthors: [],
    topBooks: [],
    recommendedBooks: [],
  },
  search: {
    query: '',
    results: [],
    resultsForOnePage: [],
    resultsPerPage: RES_PER_PAGE,
    startBook: 0,
    page: 1,
  },
  favorites: [],
};
const setRecommendation = function (num, arr) {
  const getRandomNumber = max => Math.floor(Math.random() * max);
  const books = [];
  let count = 0;

  while (count < num && arr.length > 0) {
    const randomIndex = getRandomNumber(arr.length);
    const randomBook = arr[randomIndex];
    if (!randomBook) return;
    books.push({
      author: randomBook.author,
      id: randomBook.id,
      img: randomBook.img,
      title: randomBook.title,
    });
    arr.splice(randomIndex, 1); // Удалить выбранную книгу из массива, чтобы избежать повторений
    count++;
  }

  return books;
};

const createRecommendedBooks = function () {
  let searchCount = localStorage.getItem('searchCount') || 0;
  searchCount = parseInt(searchCount);

  if (state.default.recommendedBooks.length === 0 && searchCount === 0) {
    const recommendedBooks = setRecommendation(10, state.search.results);
    localStorage.setItem('recommended', JSON.stringify(recommendedBooks));
    searchCount++;
  } else if (searchCount === 1) {
    const recommendedBooks = setRecommendation(5, state.search.results).concat(
      state.default.recommendedBooks
    );
    localStorage.setItem('recommended', JSON.stringify(recommendedBooks));
    searchCount++;
  } else if (searchCount === 2) {
    const recommendedBooks = setRecommendation(3, state.search.results).concat(
      state.default.recommendedBooks
    );
    localStorage.setItem('recommended', JSON.stringify(recommendedBooks));
    searchCount++;
  } else if (searchCount === 3) {
    const recommendedBooks = setRecommendation(2, state.search.results).concat(
      state.default.recommendedBooks
    );
    localStorage.setItem('recommended', JSON.stringify(recommendedBooks));
    searchCount++;
  } else if (searchCount > 3) {
    const recommendedBooks = setRecommendation(1, state.search.results).concat(
      state.default.recommendedBooks
    );
    localStorage.setItem('recommended', JSON.stringify(recommendedBooks));
  }

  localStorage.setItem('searchCount', searchCount.toString());
  const recommendedStorage = localStorage.getItem('recommended');
  if (recommendedStorage)
    state.default.recommendedBooks = JSON.parse(recommendedStorage);
};
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  state.search.resultsForOnePage = state.search.results.slice(start, end);
};

export const googleBooks = async function (
  searchOption,
  searchQuerry,
  langRestrict = 'en',
  totalResults = 100
) {
  const maxResultsPerQuery = 40;
  const fetchedBooks = [];
  const options = {
    author: 'q=inauthor',
    title: 'q=intitle',
    keywords: 'q=',
  };
  let startIndex = 0;
  const keys = Object.keys(sessionStorage);
  if (keys.includes(`${searchQuerry}/${searchOption}/${langRestrict}`)) {
    state.search.results = JSON.parse(
      sessionStorage.getItem(`${searchQuerry}/${searchOption}/${langRestrict}`)
    );
    createRecommendedBooks();
    return;
    // Если данные для данного автора уже есть в sessionStorage,
    // загружаем их и завершаем выполнение функции
  }
  try {
    while (startIndex < totalResults) {
      const data = await getJSON(
        `${GOOGLE_API_URL}?${options[searchOption]}:${fixedEncodeURIComponent(
          searchQuerry
        )}&key=${API_KEY}&startIndex=${startIndex}&langRestrict=${langRestrict}&maxResults=${Math.min(
          totalResults - startIndex,
          maxResultsPerQuery
        )}`
      );

      if (!data || !data.items || data.items.length === 0) {
        // Если нет больше результатов, выходим из цикла
        break;
      }

      const books = formatBookData(data);
      // Создаем массив промисов для получения рейтингов всех книг пакетом
      const ratingPromises = books.map(book => checkBook(book.title));
      const ratings = await Promise.all(ratingPromises);

      // Присваиваем полученные рейтинги книгам
      books.forEach((book, index) => {
        book.rating = ratings[index];
      });

      // Добавляем книги с рейтингами в итоговый массив
      fetchedBooks.push(...books);

      startIndex += maxResultsPerQuery;
    }
    if (fetchedBooks.length === 0)
      throw new Error(
        `Unfortunately, we couldn't find any books matching your search criteria. Please try adjusting your search parameters or come back later. 😢`
      );
    // Добавляем полученные книги в состояние (или куда-либо еще)
    state.search.results.push(...fetchedBooks);

    sessionStorage.setItem(
      `${searchQuerry}/${searchOption}/${langRestrict}`,
      JSON.stringify(state.search.results)
    );
    createRecommendedBooks();
  } catch (error) {
    console.error('Ошибка при получении книг:', error);
    throw error;
    // Продолжаем выполнение программы
  }
};

export const getFullBookGoogle = async function (bookId) {
  try {
    const data = await getJSON(`${GOOGLE_API_URL}/${bookId}?key=${API_KEY}`);
    console.log(data);
    // Проверяем, что данные получены и содержат информацию о книге
    if (data && data.volumeInfo) {
      const book = data;

      // Сохраняем информацию о книге в состояние
      state.book = {
        id: book.id,
        img: book.volumeInfo.imageLinks?.smallThumbnail,
        authors: book.volumeInfo.authors,
        categories: book.volumeInfo.categories,
        description:
          book.volumeInfo.description?.replace(
            /<\/?p>|<\/?i>|<\/?ul>|<\/?li>|<br\/?>/g,
            ''
          ) || '',
        language: book.volumeInfo.language,
        pageCount: book.volumeInfo.pageCount,
        publishedDate: book.volumeInfo.publishedDate,
        publisher: book.volumeInfo.publisher,
        title: book.volumeInfo.title,
        subtitle: book.volumeInfo.subtitle?.split('.')[0] || '',
      };
      if (
        state.favorites.some(favoriteBook => favoriteBook.id === state.book.id)
      )
        state.book.favorite = true;
    } else {
      console.error('Ошибка: Невозможно получить информацию о книге');
    }
  } catch (error) {
    console.error('Ошибка при получении информации о книге:', error);
    throw error;
  }
};
export const getFullBookOpenLibrary = async function (searchQuerry, limit = 1) {
  try {
    const data = await getJSON(
      `${OPLIBR_API_URL}q=${encodeURIComponent(searchQuerry)}&limit=${limit}`
    );
    console.log(data);
    // Проверяем, есть ли у нас данные и есть ли в них массив docs и он не пустой
    if (!data || !data.docs || data.docs.length === 0) {
      // Если нет данных или docs пуст, возвращаемся из функции
      state.book.isbn = 'unknown';
      state.book.subjects = null;
      state.book.editionCount = 0;
      state.book.ratingAverage = 0;
      state.book.ratingCount1 = 0;
      state.book.ratingCount2 = 0;
      state.book.ratingCount3 = 0;
      state.book.ratingCount4 = 0;
      state.book.ratingCount5 = 0;
      state.book.ratingCountTotal = 0;
      return;
    }

    // Если мы дошли до этой точки, значит у нас есть данные и docs не пуст
    state.book.isbn = data.docs[0]?.isbn?.[0] || 'unknown';
    state.book.subjects = data?.docs[0].subject || '';
    state.book.authorKey = data.docs[0].author_key?.[0] || '';
    state.book.coverKey = data.docs[0].cover_edition_key;
    state.book.editionCount = data.docs[0]?.edition_count;
    state.book.firstSentence = data.docs[0].first_sentence || '';
    state.book.ratingAverage = data.docs[0]?.ratings_average?.toFixed(1) || 0;
    state.book.ratingCount1 = data.docs[0].ratings_count_1 || 0;
    state.book.ratingCount2 = data.docs[0].ratings_count_2 || 0;
    state.book.ratingCount3 = data.docs[0].ratings_count_3 || 0;
    state.book.ratingCount4 = data.docs[0].ratings_count_4 || 0;
    state.book.ratingCount5 = data.docs[0].ratings_count_5 || 0;
    state.book.ratingCountTotal = data.docs[0].ratings_count || 0;
    // openCoversBook(state.book.coverKey);
  } catch (error) {
    console.error('Ошибка при получении данных с Open Library:', error);
    // В случае ошибки выбрасываем ошибку дальше
    throw error;
  }
};

export const setDefault = async function () {
  try {
    const data = await getJSON(
      `${OPLIBR_API_URL}q=popular&limit=20&language=eng`
    );

    const authors = Array.from(
      new Set(data.docs.map(obj => obj.author_name[0]))
    );

    const authorInfoPromises = authors.map(async author => {
      try {
        const description = await getAuthorInfo(author);
        const authorKey = data.docs.find(obj => obj.author_name[0] === author)
          .author_key[0];
        const image = openCoversAuthor(authorKey);
        return {
          author: author,
          description: description,
          image: image,
        };
      } catch (error) {
        console.error('Ошибка при получении информации об авторе:', error);
        return null;
      }
    });

    const authorInfoList = await Promise.all(authorInfoPromises);

    authorInfoList.forEach(({ author, description, image }) => {
      if (author && description && image) {
        state.default.topAuthors.push({
          name: author,
          description: description,
          img: image,
        });
      }
    });

    // Удаление авторов с недействительными изображениями
    for (let i = state.default.topAuthors.length - 1; i >= 0; i--) {
      const author = state.default.topAuthors[i];
      const imageSize = await checkImageSize(author.img);
      if (imageSize.width === 1 && imageSize.width === 1) {
        state.default.topAuthors.splice(i, 1);
      }
    }

    // Запрос книг по жанру "Detective"
    await googleBooksByGenre('Detective', 15, true);
    // console.log(state.default.topAuthors);
  } catch (error) {
    console.error('Ошибка при установке данных по умолчанию:', error);
    // В случае ошибки выбрасываем ошибку дальше
    throw error;
  }
};

const getAuthorInfo = async function (article) {
  try {
    const data = await getJSON(
      `${WIKI_API_URL}&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(
        article
      )}`
    );

    if (
      !data ||
      !data.query ||
      !data.query.search ||
      data.query.search.length === 0
    ) {
      return null;
    }

    const description = Object.values(data.query.search)[0].snippet;
    const wordsToRemove = ['<span class="searchmatch">', '</span>'];
    const regex = new RegExp(wordsToRemove.join('|'), 'gi');
    const resultString = description.replace(regex, '');

    return resultString;
  } catch (error) {
    console.error('Ошибка при получении информации об авторе:', error);
    // В случае ошибки возвращаем пустую строку
    return '';
  }
};

const openCoversAuthor = function (coverKeyAuthor) {
  const authorImg = `https://covers.openlibrary.org/a/olid/${coverKeyAuthor}-M.jpg`;

  return authorImg;
};

export const googleBooksByGenre = async function (
  genre,
  maxResults = 5,
  byDefault = false
) {
  try {
    const startIndex = 0;

    const data = await getJSON(
      `${GOOGLE_API_URL}?q=subject:${encodeURIComponent(
        genre
      )}&key=${API_KEY}&startIndex=${startIndex}&maxResults=${maxResults}`
    );

    if (byDefault) {
      state.default.topBooks = data.items
        .filter(book => book.volumeInfo.imageLinks?.thumbnail)
        .map(book => {
          return {
            id: book.id,
            title: book.volumeInfo.title,
            img: book.volumeInfo.imageLinks.thumbnail,
          };
        });
    }
  } catch (error) {
    console.error('Ошибка при получении книг по жанру:', error);
    // В случае ошибки выбрасываем ошибку дальше
    throw error;
  }
};
const persistFavorite = function () {
  localStorage.setItem('favorite', JSON.stringify(state.favorites));
};
export const addFavorite = function (book) {
  state.favorites.push(book);

  state.book.favorite = true;
  persistFavorite();
};
export const deleteFavorite = function (id) {
  const index = state.favorites.findIndex(book => book.id === id);
  state.favorites.splice(index, 1);
  state.book.favorite = false;
  persistFavorite();
};

const init = function () {
  const favoriteStorage = localStorage.getItem('favorite');
  if (favoriteStorage) state.favorites = JSON.parse(favoriteStorage);
  const recommendedStorage = localStorage.getItem('recommended');
  if (recommendedStorage)
    state.default.recommendedBooks = JSON.parse(recommendedStorage);
};
init();
