
import i18n from 'i18next';
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



const input = document.getElementById('url-input');
const feedsBox = document.querySelector('.feeds');
const postsBox = document.querySelector('.posts');

const createFeedItem = (feeds) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');
  h3.textContent = 'Заголовок';
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');
  smallP.textContent = 'Текст';
  li.append(h3, smallP);

  const parentDiv = document.querySelector(feeds);
  const listGroup = parentDiv.querySelector('ul');
  listGroup.prepend(li);

  input.value = '';
  input.focus();
};

const createFeedBlock = (err, status, feeds) => {
  if (err === true && status === false) return false;
  input.classList.remove('error');

  const [children] = feedsBox.children;
  if (children !== undefined) return createFeedItem(feeds);

  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  feedsBox.appendChild(card);

  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  const cardTitle = document.createElement('h4');
  cardTitle.setAttribute('class', 'card-title h4');
  cardTitle.textContent = i18nInst.t('Фиды');
  cardBody.appendChild(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.setAttribute('class', 'list-group bordet-0 rounded-0');
  card.append(cardBody, listGroup);

  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');
  h3.textContent = 'Заголовок';
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');
  smallP.textContent = 'Текст';
  li.append(h3, smallP);
  listGroup.prepend(li);

  input.value = '';
  input.focus();
  return feedsBox;
};

const createPostItem = (posts) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  const link = document.createElement('a');
  link.setAttribute('class', 'fd-bold');
  link.setAttribute('href', '#');
  link.setAttribute('data-id', '2');
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = 'Тема / Содержание';

  const btn = document.createElement('button');
  btn.setAttribute('class', 'btn btn-outline-primary btn-sm');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-id', '2');
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  btn.textContent = i18nInst.t('Просмотр');

  const parentDiv = document.querySelector(posts);
  const listGroup = parentDiv.querySelector('ul');
  li.append(link, btn);
  listGroup.prepend(li);

  input.value = '';
  input.focus();
};

const createPostBlock = (err, status, posts) => {
  if (err === true && status === false) return false;
  input.classList.remove('error');

  const [children] = postsBox.children;
  if (children !== undefined) return createPostItem(posts);

  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  postsBox.appendChild(card);
  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  const cardTitle = document.createElement('h4');
  cardTitle.setAttribute('class', 'card-title h4');
  cardTitle.textContent = i18nInst.t('Посты');
  cardBody.appendChild(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.setAttribute('class', 'list-group bordet-0 rounded-0');
  card.append(cardBody, listGroup);

  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  const link = document.createElement('a');
  link.setAttribute('class', 'fd-bold');
  link.setAttribute('href', '#');
  link.setAttribute('data-id', '2');
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = 'Тема / Содержание';

  const btn = document.createElement('button');
  btn.setAttribute('class', 'btn btn-outline-primary btn-sm');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-id', '2');
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  btn.textContent = i18nInst.t('Просмотр');

  li.append(link, btn);
  listGroup.prepend(li);

  input.value = '';
  input.focus();
  return postsBox;
};

export {
  createFeedBlock,
  createPostBlock,
};