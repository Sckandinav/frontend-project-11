import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import _ from 'lodash';
import ru from './locales/ru.js';
import parse from './parsers.js';
import { addProxy, getFeedId, updatePosts } from './utils.js';
import mainRender from './renders/mainRender.js';

const timeoutPostsUpdating = 5000;

const getErrorCode = (err) => {
  if (axios.isAxiosError(err)) {
    return 'errTexts.networkErr';
  }
  return 'errTexts.invalid';
};

export default () => {
  const i18nInst = i18n.createInstance();
  i18nInst.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  })
    .then(() => {
      const elements = {
        lead: document.querySelector('.lead'),
        form: document.querySelector('form'),
        input: document.getElementById('url-input'),
        h1: document.querySelector('.display-3'),
        exampleP: document.querySelector('.mt-2'),
        btn: document.querySelector('button[type="submit"]'),
        feedback: document.querySelector('.feedback'),
        postsDiv: document.querySelector('.posts'),
      };

      elements.lead.textContent = i18nInst.t('keyLead');
      elements.h1.textContent = i18nInst.t('keyHeader');
      elements.exampleP.textContent = i18nInst.t('keyExample');
      elements.btn.textContent = i18nInst.t('keyBtn');

      const state = {
        request: {
          status: 'waiting',
          error: '',
        },
        form: {
          status: 'filling',
          error: '',
        },
        data: {
          feeds: [],
          posts: [],
        },
        uiState: {
          visitedLinks: [],
          modal: '',
        },
      };

      const validate = (validlinks, inputvalue) => {
        const schema = yup.object({
          feedUrl: yup.string().url('errTexts.errUrl')
            .notOneOf(
              validlinks,
              'errTexts.errFeed',
            )
            .required('errTexts.required'),
        });
        return schema.validate({ feedUrl: inputvalue });
      };

      const watchedState = onChange(state, mainRender(state, elements, i18nInst));

      const getNewsUpdate = (feeds) => {
        const links = feeds.map((feed) => feed.link);
        const urls = links.map((link) => addProxy(link))
          .map((url) => axios.get(url));

        Promise.all(urls)
          .then((news) => {
            const updatedNews = news.map((issue) => {
              const { posts, titlefeed } = parse(issue);
              const idOfFeed = getFeedId(watchedState.data.feeds, titlefeed);

              const newPostsWithId = posts.map((post) => {
                const postId = {
                  feedId: idOfFeed,
                  id: _.uniqueId('post_'),
                };
                return { ...post, ...postId };
              });
              return newPostsWithId;
            });
            const [...posts] = watchedState.data.posts;
            const updatedPosts = updatePosts(posts, updatedNews);
            watchedState.data.posts = updatedPosts;
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setTimeout(() => getNewsUpdate(feeds), timeoutPostsUpdating);
          });
      };

      setTimeout(() => getNewsUpdate(watchedState.data.feeds), timeoutPostsUpdating);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputValue = e.target[0].value;
        watchedState.request.status = 'processing';

        const validLinks = watchedState.data.feeds.map((feed) => feed.link);
        validate(validLinks, inputValue)
          .then((request) => {
            const reqUrl = addProxy(request.feedUrl);
            return axios.get(reqUrl)
              .then((response) => {
                const { feed, posts } = parse(response);
                const id = _.uniqueId('feed_');
                const additionalKeys = {
                  id,
                  link: request.feedUrl,
                };
                watchedState.data.feeds.push({ ...feed, ...additionalKeys });

                const postsWithId = posts.map((post) => {
                  const identificators = {
                    feedId: id,
                    id: _.uniqueId('post_'),
                  };
                  return { ...post, ...identificators };
                });

                watchedState.form.status = 'filling';
                watchedState.data.posts.push(postsWithId);
                watchedState.request.status = 'finished';
              })
              .catch((err) => {
                const errorAnswer = getErrorCode(err);

                console.log(err.message);
                watchedState.form.status = 'filling';
                watchedState.request.error = errorAnswer;
                watchedState.request.status = 'failed';
              });
          })
          .catch((err) => {
            watchedState.request.status = 'waiting';
            watchedState.form.error = err.message;
            watchedState.form.status = 'invalid';
          });
      });

      const postsDiv = document.querySelector('.posts');
      postsDiv.addEventListener('click', (e) => {
        const targetLink = e.target.closest('a');
        if (targetLink) watchedState.uiState.visitedLinks.push(e.target.dataset.postid);
        const targetModal = e.target.closest('.btn-sm');
        if (targetModal) watchedState.uiState.modal = targetModal.id;
      });
    })
    .catch((err) => {
      console.log('Something went wrong loading', err);
    });
};
