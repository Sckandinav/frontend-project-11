import i18n from 'i18next';
import _ from 'lodash';
import ru from '../locales/ru.js';

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

const input = document.getElementById('url-input');
const feedsBox = document.querySelector('.feeds');

const createFeedItem = (feeds, feedArr) => {
  const lastElem = _.last(feedArr);

  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');

  h3.textContent = lastElem.title;
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');
  smallP.textContent = lastElem.description;
  li.append(h3, smallP);

  const parentDiv = document.querySelector(feeds);
  const listGroup = parentDiv.querySelector('ul');
  listGroup.prepend(li);

  input.value = '';
  input.focus();
  return null;
};

export default (respEmpty, respSt, feeds, feedArr) => {
  if (feedArr.length === 0 || respEmpty === true || respSt !== 200) return false;
  input.classList.remove('error');

  const [children] = feedsBox.children;
  if (children !== undefined) return createFeedItem(feeds, feedArr);
  const lastElem = _.last(feedArr);

  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  feedsBox.appendChild(card);

  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  const cardTitle = document.createElement('h4');
  cardTitle.setAttribute('class', 'card-title h4');
  cardTitle.textContent = i18nInst.t('keyFeeds');
  cardBody.appendChild(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.setAttribute('class', 'list-group bordet-0 rounded-0');
  card.append(cardBody, listGroup);

  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');

  h3.textContent = lastElem.title;
  smallP.textContent = lastElem.description;
  li.append(h3, smallP);
  listGroup.prepend(li);

  input.value = '';
  input.focus();
  return feedsBox;
};