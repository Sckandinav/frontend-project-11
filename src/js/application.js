
import * as yup from 'yup';
import i18n from 'i18next';
import watchedState from './watcher.js';
import ru from './ru.js';

const i18nInst = i18n.createInstance();
i18nInst.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
}, (err, t) => {
  if (err) return console.log('something went wrong loading', err);
  return t('key');
});

export default () => {
 const url = /https?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  const input = document.getElementById('url-input');
  const form = document.querySelector('form');
  const values = [];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = input.value;
    watchedState.feeds.push(inputValue);
    const urlsStr = JSON.stringify(watchedState.feeds);
    const urls = JSON.parse(urlsStr);
    const copies = values.flat();

    const schema = yup.object({
      feedUrl: yup.string()
        .required()
        .matches(url, i18nInst.t('errTexts.errUrl'))
        .notOneOf(
          copies,
          i18nInst.t('errTexts.errFeed'),
        )
    });
    schema.validate({ feedUrl: inputValue })
      .then((feed) => {
        copies.forEach((item) => {
          const { feedUrl } = feed;
          if (item === feedUrl) {
            watchedState.error = true;
            watchedState.status = false;
            return false;
          }
          return null;
        });
        watchedState.status = true;
      })
      .catch((err) => {
        watchedState.error = true;
        watchedState.status = false;
        watchedState.yupError = err;
      });
    values.push(urls);
  });

  input.addEventListener('input', () => {
    const inputValue = input.value;
    if (inputValue === '') {
      watchedState.error = false;
      watchedState.yupError = '';
    }
  });
};