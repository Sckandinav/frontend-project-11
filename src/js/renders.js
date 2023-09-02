
import i18n from 'i18next';
import _ from 'lodash';
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



const input = document.getElementById('url-input');
const feedsBox = document.querySelector('.feeds');
const postsBox = document.querySelector('.posts');

const createFeedItem = (feeds, feedArr) => {
  const lastElem = _.last(feedArr);

  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');
  li.append(h3, smallP);

  const parentDiv = document.querySelector(feeds);
  const listGroup = parentDiv.querySelector('ul');
  listGroup.prepend(li);

  input.value = '';
  input.focus();
  return null;
};

const createFeedBlock = (respEmpty, respSt, feeds, feedArr) => {
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
  h3.textContent = lastElem.title;
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');
  smallP.textContent = lastElem.description;
  li.append(h3, smallP);
  listGroup.prepend(li);

  input.value = '';
  input.focus();
  return feedsBox;  
};

const createElemLi = (idfeed, itemlink, title, description) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  li.setAttribute('data-feedid', `#${idfeed}`);

  const link = document.createElement('a');
  link.setAttribute('class', 'fd-bold');
  link.setAttribute('href', itemlink);
  link.setAttribute('data-id', '2');
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = title;

  const btn = document.createElement('button');
  btn.setAttribute('class', 'btn btn-outline-primary btn-sm');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-id', '2');
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  btn.textContent = i18nInst.t('btnPosts');

  const descriptionP = document.createElement('p');
  descriptionP.setAttribute('style', 'display: none');
  descriptionP.textContent = description;
  li.append(link, btn, descriptionP);
  return li;
};

const createPostItem = (posts, postArr) => {
  postArr.forEach((item) => {
    const li = createElemLi(item.idFeed, item.link, item.title, item.description);
    const parentDiv = document.querySelector(posts);
    const listGroup = parentDiv.querySelector('ul');
    listGroup.prepend(li);
  });

  input.value = '';
  input.focus();
  return null;
};


const createPostBlock = (respEmpty, respSt, posts, postArr) => {
  if (postArr.length === 0 || respEmpty === true || respSt !== 200) return false;

  const [children] = postsBox.children;
  if (children !== undefined) return createPostItem(posts, postArr);

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


  const copy = postArr.flat();
  copy.forEach((item) => {
    const li = createElemLi(item.idFeed, item.link, item.title, item.description);
    listGroup.prepend(li);
  });

  return postsBox;
};

const makeUpdatedRendering = (posts, ancestor) => {
  if (posts === null) return false;

  const lastElem = _.last(posts);
  const controlId = lastElem.idFeed;
  const listGroup = ancestor.querySelector('ul');
  posts.forEach((item) => {
    const feedLies = listGroup.querySelectorAll(`li[data-feedid="#${controlId}"]`);
    const allLinks = listGroup.querySelectorAll('li a');
    const linksArr = Array.from(allLinks);
    const innerTexts = linksArr.map((link) => link.innerHTML);
    const firstLi = feedLies[0];

    if (!innerTexts.includes(item.title)) {
      const li = createElemLi(controlId, item.link, item.title, item.description);
      firstLi.before(li);
    }
  });
  return null;  
};

export {
  createFeedBlock,
  createPostBlock,
  makeUpdatedRendering
};