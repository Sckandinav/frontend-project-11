import _ from 'lodash';

const createFeedItem = (selector, feedObj) => {
  const input = document.querySelector('#url-input');
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');

  h3.textContent = feedObj.title;
  const smallP = document.createElement('p');
  smallP.setAttribute('class', 'm-0 small text-black-50');
  smallP.textContent = feedObj.description;
  li.append(h3, smallP);

  const parentDiv = document.querySelector(selector);
  const listGroup = parentDiv.querySelector('ul');
  listGroup.prepend(li);

  input.value = '';
};

const createFeedBlock = (feeds, feedsHead) => {
  const input = document.querySelector('#url-input');
  const feedsBox = document.querySelector('.feeds');
  const lastFeed = _.last(feeds);

  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  feedsBox.appendChild(card);

  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  const cardTitle = document.createElement('h4');
  cardTitle.setAttribute('class', 'card-title h4');
  cardTitle.textContent = feedsHead;
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

  h3.textContent = lastFeed.title;
  smallP.textContent = lastFeed.description;
  li.append(h3, smallP);
  listGroup.prepend(li);

  input.value = '';
};

export default (selector, feeds, feedsHead) => {
  const feedsBox = document.querySelector('.feeds');
  const lastFeed = _.last(feeds);
  const [children] = feedsBox.children;
  if (children !== undefined) return createFeedItem(selector, lastFeed);
  return createFeedBlock(feeds, feedsHead);
};
