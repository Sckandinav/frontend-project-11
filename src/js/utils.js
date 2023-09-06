import _ from 'lodash';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getFeedId = (feeds, feedTitle) => {
  const idOfFeed = feeds.find((obj) => obj.title === feedTitle);
  return idOfFeed.id;
};

const changeLinkStyle = (postsDiv, visited) => {
  const links = postsDiv.querySelectorAll('li a');
  const linksArr = Array.from(links);
  const visitedLinks = linksArr.filter((link) => visited.includes(link.dataset.postid));
  return visitedLinks.forEach((visLink) => {
    visLink.classList.remove('fw-bold');
    visLink.classList.add('fw-normal');
    visLink.classList.add('visited');
  });
};

const addNews = (oldColl, newColl) => {
  const newNews = newColl.filter((obj, index) => {
    if (oldColl[index] === undefined) return false;
    return obj.title !== oldColl[index].title;
  });
  const updated = [...oldColl, ...newNews];
  return _.uniqBy(updated, 'title');
};

const updatePosts = (oldPosts, newPosts) => {
  const updatedPosts = [];
  oldPosts.forEach((old, index) => {
    const controlId = old[0].feedId;
    const feedIdNew = newPosts[index][0].feedId;
    if (controlId === feedIdNew) {
      const updated = addNews(old, newPosts[index]);
      updatedPosts.push(updated);
    }
  });
  return updatedPosts;
};

export {
  addProxy,
  getFeedId,
  changeLinkStyle,
  updatePosts,
};
