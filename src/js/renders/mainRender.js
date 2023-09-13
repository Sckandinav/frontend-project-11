import _ from 'lodash';
import onChange from 'on-change';
import { changeLinkStyle } from '../utils.js';
import createFeeds from './rendersFeeds.js';
import { createPosts, makeUpdatedRendering } from './rendersPosts.js';
import callModal from './modal.js';

export default (state, elements, i18n) => {
  const watcher = onChange(state, (path, value, previousValue) => {
    switch (path) {
      case 'form.status':
        if (value === 'invalid') {
          elements.input.classList.add('error');
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
        }
        break;
      case 'form.error':
        elements.feedback.textContent = i18n.t(value);
        break;

      case 'request.status':
        if (value === 'processing') {
          elements.feedback.textContent = '';
          elements.input.classList.remove('error');
          elements.input.setAttribute('disabled', '');
          elements.btn.setAttribute('disabled', '');
        }
        if (value === 'waiting') {
          elements.input.removeAttribute('disabled');
          elements.btn.removeAttribute('disabled');
        }
        if (value === 'failed') {
          elements.input.classList.remove('error');
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
          elements.input.removeAttribute('disabled');
          elements.btn.removeAttribute('disabled');
          elements.input.focus({ preventScroll: true });
        }
        if (value === 'finished') {
          elements.input.classList.remove('error');
          elements.feedback.classList.remove('text-danger');
          elements.feedback.classList.add('text-success');
          elements.feedback.textContent = i18n.t('valid');
          elements.input.removeAttribute('disabled');
          elements.btn.removeAttribute('disabled');
          elements.input.focus({ preventScroll: true });
        }
        break;
      case 'request.error':
        elements.feedback.textContent = i18n.t(value);
        break;

      case 'uiState.visitedLinks':
        changeLinkStyle(elements.postsDiv, _.uniq(value));
        break;
      case 'data.feeds':
        if (value) {
          createFeeds(
            '.feeds',
            state.data.feeds,
            i18n.t('keyFeeds'),
          );
        }
        break;
      case 'data.posts':
        if (value.length !== previousValue.length) {
          createPosts(
            '.posts',
            state.data.posts,
            i18n.t('keyPosts'),
            i18n.t('btnPosts'),
          );
        }
        makeUpdatedRendering(state.data.posts, elements.postsDiv, i18n.t('btnPosts'));
        break;
      case 'uiState.modal':
        if (value) {
          callModal(value, i18n.t('modal.primary'), i18n.t('modal.secondary'));
        }
        break;
      default:
        break;
    }
  });

  return watcher;
};
