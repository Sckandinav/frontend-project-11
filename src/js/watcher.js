import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import { createPostBlock, makeUpdatedRendering } from './renders/renders-posts.js';
import createFeedBlock from './renders/renders-feeds.js';
import { makeParsingForAxios } from './parsers.js';
import ru from './locales/ru';
import callModal from './renders/modal.js';

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

const elements = {
  lead: document.querySelector('.lead'),
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  display3: document.querySelector('.display-3'),
  exampleP: document.querySelector('.mt-2'),
  btn: document.querySelector('button[type="submit"]'),
  dangerP: document.querySelector('.feedback'),
  postsDiv: document.querySelector('.posts'),
};

elements.lead.textContent = i18nInst.t('keyLead');
elements.display3.textContent = i18nInst.t('keyHeader');
elements.exampleP.textContent = i18nInst.t('keyExample');
elements.btn.textContent = i18nInst.t('keyBtn');

const state = {
  feeds: [],
  repetError: false,
  buildStatus: false,
  yupError: '',
  loadErr: '',
  responseEmpty: false,
  responseFeeds: [],
  responsePosts: [],
  responceStatus: '',
  input: 'ready',
  arrFeeds: [],
  arrPosts: [],
  final: false,
  process: 'wait',
  setTimeout: {
  trueLinks: [],
  axiosError: '',
  },
  mutation: false,
};

const fillArr = (feeds, posts, repErr) => {
  if (repErr === true) return false;
  const lastElemF = _.last(state.responseFeeds);
  const lastElemP = _.last(state.responsePosts);
  if (lastElemF) feeds.push(lastElemF);
  if (lastElemP) posts.push(lastElemP);
  return null;
};


const watchedState = onChange(state, (path) => {
  fillArr(state.arrFeeds, state.arrPosts, state.repetError);
  const billetFeeds = state.arrFeeds.flat();
  const uniqFeeds = _.uniq(billetFeeds);
  const uniqPosts = _.last(state.arrPosts);
  if (state.yupError !== '') elements.dangerP.textContent = state.yupError;
  if (state.repetError === true) {
    elements.input.classList.add('error');
    elements.dangerP.classList.remove('text-success');
    elements.dangerP.classList.add('text-danger');
  }
  if (state.input === '') {
    elements.input.classList.remove('error');
    elements.dangerP.textContent = '';
    elements.dangerP.classList.remove('text-success');
    elements.dangerP.classList.add('text-danger');
  }
  if (state.repetError === false) {
    elements.input.classList.remove('error');
    state.yupError = '';
  }
  if (state.process === 'processing') {
    elements.input.setAttribute('disabled', '');
    elements.btn.setAttribute('disabled', '');
    elements.dangerP.textContent = '';
  }
  if (state.process === 'wait') {
    elements.input.removeAttribute('disabled');
    elements.btn.removeAttribute('disabled');
  }
  if (state.responseEmpty === true && _.last(state.responseFeeds) === null) {
    elements.dangerP.classList.remove('text-success');
    elements.dangerP.classList.add('text-danger');
    elements.dangerP.textContent = i18nInst.t('errTexts.invalid');
    if (state.yupError !== '') state.responseEmpty = false;
  }
  if (uniqFeeds.length !== 0 && state.buildStatus === true
    && state.final === true && _.last(state.responseFeeds) !== null) {
    createFeedBlock(state.responseEmpty, state.responceStatus, '.feeds', uniqFeeds);
    createPostBlock(state.responseEmpty, state.responceStatus, '.posts', uniqPosts);
    elements.dangerP.classList.remove('text-danger');
    elements.dangerP.classList.add('text-success');
    elements.dangerP.textContent = i18nInst.t('valid');
    state.buildStatus = false;
    state.final = false;
    const filteredLinks = state.setTimeout.trueLinks.filter((link) => link !== undefined);
    const workingLinks = _.uniq(filteredLinks);
    const getNewsUpdate = (links) => {
      const billet = links.map((link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`);
      const urls = billet.map((detail) => axios(detail).then((response) => response.data.contents));
      Promise.all(urls)
        .then((data) => {
          data.forEach((item) => {
            if (makeParsingForAxios(item, state.responseFeeds) === false) {
              throw new Error('No data');
            }
            const info = makeParsingForAxios(item, state.responseFeeds);
            const [posts] = info;
            makeUpdatedRendering(posts, elements.postsDiv);
          });
        })
        .catch((error) => {
          state.setTimeout.axiosError = error;
          console.log(error);
        });
      setTimeout(getNewsUpdate, 5000, links);
    };
    setTimeout(() => getNewsUpdate(workingLinks), 5000);
  }

  if (state.mutation === true) {
    const liButtons = elements.postsDiv.querySelectorAll('.btn-sm');
    liButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        callModal(btn);
      });
    });
    const links = elements.postsDiv.querySelectorAll('li a');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        link.classList.remove('fw-bold');
        link.classList.add('fw-normal');
        link.classList.add('visited');
      });
    });
  }

  if (state.loadErr === 'Network Error' && state.responceStatus !== 200) {
    elements.dangerP.classList.remove('text-success');
    elements.dangerP.classList.add('text-danger');
    elements.dangerP.textContent = i18nInst.t('errTexts.networkErr');
  }
});

export default watchedState;