const callModal = (btnId, primaryText, secondaryText) => {
  const btn = document.querySelector(`#${btnId}`);
  const link = btn.previousElementSibling;
  const href = link.getAttribute('href');
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');
  link.classList.add('visited');

  const description = btn.nextElementSibling;
  const reversedDescription = description.textContent;
  const modalBodyContent = reversedDescription.split('').reverse().join('');

  const readMore = document.querySelector('.btn-primary');
  const close = document.querySelector('.btn-secondary');
  close.textContent = secondaryText;

  const btnLink = document.createElement('a');
  btnLink.setAttribute('class', 'btn btn-primary full-article');
  btnLink.setAttribute('href', `${href}`);
  btnLink.setAttribute('role', 'button');
  btnLink.setAttribute('target', '_blank');
  btnLink.setAttribute('rel', 'noopener noreferrer');
  btnLink.textContent = primaryText;

  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  modalTitle.textContent = link.textContent;
  modalBody.textContent = modalBodyContent;

  const modalFooter = document.querySelector('.modal-footer');
  readMore.remove();
  modalFooter.prepend(btnLink);
};

export default callModal;
