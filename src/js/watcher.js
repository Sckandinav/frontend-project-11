import onChange from 'on-change';
import i18n from 'i18next';
import { createPostBlock, createFeedBlock } from './renders.js';
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

const elements = {
  lead: document.querySelector('.lead'),
  input: document.getElementById('url-input'),
  display3: document.querySelector('.display-3'),
  exampleP: document.querySelector('.mt-2'),
  btn: document.querySelector('button[type="submit"]'),
  dangerP: document.querySelector('.text-danger'),
};

elements.lead.textContent = i18nInst.t('keyLead');
elements.display3.textContent = i18nInst.t('keyHeader');
elements.exampleP.textContent = i18nInst.t('keyExample');
elements.btn.textContent = i18nInst.t('keyBtn');

const state = {
  feeds: [],
  error: false,
  status: false,
  yupError: '',
};


const watchedState = onChange(state, (path) => {  
  if (state.error === true) elements.input.classList.add('error');
  if (state.error === true) input.classList.add('error');

  if (state.error === false) {
    elements.input.classList.remove('error');
    state.yupError = '';
    state.yupError = '';
  }

  if (state.status === true) {
    createFeedBlock(state.error, state.status, '.feeds');
    createPostBlock(state.error, state.status, '.posts');
    state.status = false;
  }
  if (state.yupError !== '') {
    elements.dangerP.textContent = state.yupError.message;
  }
  if (state.yupError === '') {
    elements.dangerP.textContent = '';
  }
});

export default watchedState;