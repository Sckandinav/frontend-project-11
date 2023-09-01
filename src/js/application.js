
import * as yup from 'yup';
import watchedState from './watcher.js';

export default () => {
  // eslint-disable-next-line
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
        .matches(url, 'Enter correct url!')
        .notOneOf(
          copies,
          'This feed is in the list',
        )
        .required('Please, enter url'),
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
        console.log(err);
      });
    values.push(urls);
  });

  input.addEventListener('input', () => {
    const inputValue = input.value;
    if (inputValue === '') watchedState.error = false;
  });
};