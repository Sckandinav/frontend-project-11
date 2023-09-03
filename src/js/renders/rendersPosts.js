import _ from 'lodash';

const createElemLi = (feedId, postId, itemlink, title, description, btnText) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  li.setAttribute('data-feedid', `#${feedId}`);

  const link = document.createElement('a');
  link.setAttribute('class', 'fw-bold');
  link.setAttribute('href', itemlink);
  link.setAttribute('data-id', '2');
  link.setAttribute('data-postid', `#${postId}`);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = title;
  const btn = document.createElement('button');
  btn.setAttribute('class', 'btn btn-outline-primary btn-sm');
  btn.setAttribute('type', 'button');
  btn.setAttribute('data-id', '2');
  btn.setAttribute('data-bs-toggle', 'modal');
  btn.setAttribute('data-bs-target', '#modal');
  const btnId = _.uniqueId('btn_');
  btn.setAttribute('id', `${btnId}`);
  btn.textContent = btnText;

  const descriptionP = document.createElement('p');
  descriptionP.setAttribute('style', 'display: none');
  const reversedDescription = description.split('').reverse().join('');
  descriptionP.textContent = reversedDescription;
  li.append(link, btn, descriptionP);
  return li;
};

const createPostItem = (posts, postArr, btnText) => {
  const lastPosts = _.last(postArr);
  lastPosts.forEach((item) => {
    const li = createElemLi(item.feedId, item.id, item.link, item.title, item.description, btnText);
    const parentDiv = document.querySelector(posts);
    const listGroup = parentDiv.querySelector('ul');
    listGroup.prepend(li);
  });
};

const createPostBlock = (postArr, postsHead, btnText) => {
  const postsBox = document.querySelector('.posts');

  const card = document.createElement('div');
  card.setAttribute('class', 'card border-0');
  postsBox.appendChild(card);
  const cardBody = document.createElement('div');
  cardBody.setAttribute('class', 'card-body');
  const cardTitle = document.createElement('h4');
  cardTitle.setAttribute('class', 'card-title h4');
  cardTitle.textContent = postsHead;
  cardBody.appendChild(cardTitle);
  const listGroup = document.createElement('ul');
  listGroup.setAttribute('class', 'list-group bordet-0 rounded-0');
  card.append(cardBody, listGroup);
  const copy = postArr.flat();
  copy.forEach((item) => {
    const li = createElemLi(item.feedId, item.id, item.link, item.title, item.description, btnText);
    listGroup.prepend(li);
  });
};

const createPosts = (posts, postArr, postsHead, btnText) => {
  const postsBox = document.querySelector('.posts');
  const [children] = postsBox.children;
  if (children !== undefined) return createPostItem(posts, postArr, btnText);
  return createPostBlock(postArr, postsHead, btnText);
};

const makeUpdatedRendering = (posts, ancestor, btnText) => {
  posts.forEach((postObj) => {
    const lastElem = _.last(postObj);
    const controlId = lastElem.feedId;
    const listGroup = ancestor.querySelector('ul');
    postObj.forEach((item) => {
      const feedLies = listGroup.querySelectorAll(`li[data-feedid="#${controlId}"]`);
      const allLinks = listGroup.querySelectorAll('li a');
      const linksArr = Array.from(allLinks);
      const innerTexts = linksArr.map((link) => link.textContent);
      const firstLi = feedLies[0];
      if (!innerTexts.includes(item.title)) {
        const li = createElemLi(
          controlId,
          item.id,
          item.link,
          item.title,
          item.description,
          btnText,
        );
        firstLi.before(li);
      }
    });
  });
};

export {
  createPosts,
  makeUpdatedRendering,
};