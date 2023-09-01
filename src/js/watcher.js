import onChange from 'on-change';
import { createPostBlock, createFeedBlock } from './renders.js';

const state = {
  feeds: [],
  error: false,
  status: false,
};

const input = document.getElementById('url-input');

// eslint-disable-next-line
const watchedState = onChange(state, (path) => {  
  if (state.error === false) input.classList.remove('error');
  if (state.error === true) input.classList.add('error');

  if (state.status === true) {
    createFeedBlock(state.error, state.status, '.feeds');
    createPostBlock(state.error, state.status, '.posts');
    state.status = false;
  }
});

export default watchedState;