import i18n from 'i18next';
import ru from './ru.js';

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

const callModal = (btn) => {
  const link = btn.previousElementSibling;
  const href = link.getAttribute('href');
  link.classList.add('visited');
  const description = btn.nextElementSibling;

  const readMore = document.querySelector('.btn-primary');
  const close = document.querySelector('.btn-secondary');
  close.textContent = i18nInst.t('modal.secondary');

  const btnLink = document.createElement('a');
  btnLink.setAttribute('class', 'btn btn-primary full-article');
  btnLink.setAttribute('href', `${href}`);
  btnLink.setAttribute('role', 'button');
  btnLink.setAttribute('target', '_blank');
  btnLink.setAttribute('rel', 'noopener noreferrer');
  btnLink.textContent = i18nInst.t('modal.primary');

  const modalFooter = document.querySelector('.modal-footer');
  readMore.remove();
  modalFooter.prepend(btnLink);

  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  modalTitle.textContent = link.textContent;
  modalBody.textContent = description.textContent;
};

export default callModal;