import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import axios from 'axios';

import resources from './locales/index.js';
import locale from './locales/yupLocale.js';
import render from './render.js';
import parse from './parser.js';

const updateTimeout = 5000;
const requestTimeout = 10000;
const defaultLanguage = 'ru';

const validate = (url, urls) => {
  const schema = yup.string().required().url().notOneOf(urls);
  return schema.validate(url);
};

const generatePostsWithId = (posts, feedId) => {
  const postsWithId = posts.map((post) => ({
    ...post,
    feedId,
    id: Number(uniqueId()),
  }));
  return postsWithId;
};

const getProxiUrl = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');
  proxy.searchParams.set('url', url);
  proxy.searchParams.set('disableCache', true);
  return proxy.toString();
};

const getErrorMessage = (error) => {
  if (error.isParserError) {
    return 'noRSS';
  }

  if (error.isAxiosError && error.code === 'ERR_NETWORK') {
    return 'netWorkError';
  }

  if (error.isAxiosError && error.code === 'ECONNABORTED') {
    return 'timeoutError';
  }

  return 'unknownError';
};

const loadRSS = (url, watchedState) => {
  watchedState.loadingProcess = { status: 'loading', error: null };

  return axios
    .get(getProxiUrl(url), { timeout: requestTimeout })
    .then((response) => response.data.contents)
    .then((contents) => {
      const { feed, posts } = parse(contents);
      feed.url = url;
      feed.id = Number(uniqueId());
      const postsWithId = generatePostsWithId(posts, feed.id);

      watchedState.loadingProcess = { status: 'finished', error: null };
      watchedState.feeds.unshift(feed);
      watchedState.posts.unshift(...postsWithId);
    })
    .catch((error) => {
      watchedState.loadingProcess = { status: 'failed', error: getErrorMessage(error) };
    });
};

const getUpdates = (watchedState) => {
  const promises = watchedState.feeds.map(({ id, url }) => {
    const request = axios.get(getProxiUrl(url), { timeout: requestTimeout });

    return request
      .then((response) => {
        const { posts } = parse(response.data.contents);
        const curPostsLinks = watchedState.posts.map((post) => post.link);

        const newPosts = posts.filter((item) => !curPostsLinks.includes(item.link));
        const newPostsWithId = generatePostsWithId(newPosts, id);
        watchedState.posts.unshift(...newPostsWithId);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  return Promise.all(promises).then(setTimeout(() => getUpdates(watchedState), updateTimeout));
};

export default () => {
  const initialState = {
    form: {
      isValidate: null,
      error: null,
    },
    loadingProcess: {
      status: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    viewedPosts: new Set(),
    modal: {
      postId: null,
    },
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    submit: document.querySelector('.submit'),
    containerFeeds: document.querySelector('.feeds'),
    containerPosts: document.querySelector('.posts'),
    modal: {
      title: document.querySelector('.modal-title'),
      text: document.querySelector('.modal-body'),
      link: document.querySelector('.modal-link'),
    },
  };

  const i18nInstance = i18next.createInstance();

  i18nInstance
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    })
    .then(() => {
      yup.setLocale(locale);

      const watchedState = onChange(initialState, render(elements, initialState, i18nInstance));

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        watchedState.loadingProcess.status = 'sending';
        const formData = new FormData(e.target);
        const rssUrl = formData.get('url').trim();
        const urls = initialState.feeds.map(({ url }) => url);

        validate(rssUrl, urls)
          .then(() => {
            watchedState.form = { isValidate: 'true', error: null };
            loadRSS(rssUrl, watchedState);
          })
          .catch((error) => {
            watchedState.form = { isValidate: 'false', error: error.message };
          });
      });

      elements.containerPosts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (!id) {
          return;
        }
        watchedState.modal.postId = Number(id);
        watchedState.viewedPosts.add(Number(id));
      });
      setTimeout(() => getUpdates(watchedState), updateTimeout);
    });
};
