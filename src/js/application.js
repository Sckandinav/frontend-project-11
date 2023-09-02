
import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import watchedState from './watcher.js';
import ru from './ru.js';
import makeParsing from './parser.js';

const i18nInst = i18n.createInstance();
i18nInst.init({
  lng: 'ru',
  debug: false,
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
    watchedState.process = 'processing';
    watchedState.repetError = false;
    watchedState.buildStatus = false;
    watchedState.yupError = false;
    watchedState.final = false;
    watchedState.responseEmpty = false;
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
            watchedState.repetError = true;
            watchedState.buildStatus = false;
          }
          return null;
        });
        watchedState.buildStatus = true;
      })
      .catch((err) => {
        watchedState.repetError = true;
        watchedState.buildStatus = false;
        watchedState.yupError = err.message;
      });
      const routes = {
        rssPath: () => `https://allorigins.hexlet.app/get?disableCache=true&url=${inputValue}`,
      };
      axios.get(routes.rssPath())
        .then((responce) => {
          if (makeParsing(responce.data.contents) === false) {
            watchedState.responseFeeds.push(null);
            watchedState.responseEmpty = true;
            values.push(undefined);
          }
          const data = makeParsing(responce.data.contents);
          const [feed, posts] = data;
          watchedState.responseFeeds.push(feed);
          watchedState.responsePosts.push(posts);
          watchedState.responceStatus = responce.status;
          values.push(urls[urls.length - 1]);
        })
      .catch((err) => {
        watchedState.loadErr = err.message;
        watchedState.responceStatus = err.code;
      })
      .finally(() => {
        watchedState.final = true;
        watchedState.process = 'ready';
      });
   
  });

  input.addEventListener('input', () => {
    const inputValue = input.value;
    watchedState.input = 'ready';
    if (inputValue === '') {
      watchedState.repetError = false;
      watchedState.yupError = '';
      watchedState.input = '';
    }
  });
};