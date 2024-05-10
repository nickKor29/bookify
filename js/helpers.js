import {
  TIMEOUT_SECONDS,
  OPLIBR_API_URL,
  GOOGLE_API_URL,
  API_KEY,
} from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};
export const iso6391 = require('iso-639-1');

export const convertLanguageCode = function (shortCode) {
  const fullLanguage = iso6391.getName(shortCode);

  return fullLanguage || shortCode; // Вернуть полное название или оставить исходное, если соответствие не найдено
};

// Пример использования
// const shortLanguageCode = "en";
// const fullLanguageName = convertLanguageCode(shortLanguageCode);

export const checkImageSize = imageUrl => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = imageUrl;
  });
};

export const getJSON = async function (url) {
  const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
  const data = await res.json();
  return data;
};
export const formatBookData = function (data) {
  if (!data || !data.items) {
    return [];
  }

  return data.items
    .map(book => {
      return {
        id: book.id,
        author: book.volumeInfo.authors?.[0]
          .split(' ')
          .map(w => w[0] + w.slice(1).toLowerCase())
          .join(' '),
        rating: book.volumeInfo.averageRating,
        img: book.volumeInfo.imageLinks?.smallThumbnail,
        description: book.volumeInfo.description,
        categories: book.volumeInfo.categories,
        title: book.volumeInfo.title,
        subtitle: book.volumeInfo.subtitle?.split('.')?.[0] || '',
      };
    })
    .filter(book => book.img && book.author);
};
export const addRating = async function (arr, start, end) {
  await Promise.all(
    arr.slice(start, end).map(async book => {
      const data = await getJSON(
        `${OPLIBR_API_URL}q=${encodeURIComponent(book.title)}&limit=1`
      );
      book.rating = data.docs[0]?.ratings_average?.toFixed(1) || 0;
    })
  );
};

export const checkBook = async function (bookTitle) {
  try {
    const data = await getJSON(
      `${OPLIBR_API_URL}q=${encodeURIComponent(bookTitle)}&limit=1`
    );

    // Проверяем, что данные получены и содержат рейтинги
    if (data.docs.length > 0 && data.docs[0].ratings_average) {
      return data.docs[0].ratings_average.toFixed(1);
    } else {
      return 0; // Возвращаем значение по умолчанию, если нет рейтинга
    }
  } catch (error) {
    console.error('Ошибка при получении рейтинга книги:', error);
    return 0; // Возвращаем значение по умолчанию в случае ошибки
  }
};
