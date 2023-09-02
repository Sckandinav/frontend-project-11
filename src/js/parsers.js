import { uniqueId } from 'lodash';

export default (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response, 'application/xml');

  const channel = doc.querySelector('channel');
  if (channel) {
    const feed = [];
    const posts = [];
    const titleF = doc.querySelector('channel title');
    const description = doc.querySelector('description');
    const idF = uniqueId('feed_');
    feed.push({
      id: idF,
      title: titleF.textContent,
      description: description.textContent,
    });

    const items = doc.querySelectorAll('item');
    items.forEach((item) => {
      const titleP = item.querySelector('title');
      const link = item.querySelector('link');
      const postDescription = item.querySelector('description');
      const idP = uniqueId('post_');
      posts.push({
        idFeed: idF,
        id: idP,
        title: titleP.textContent,
        description: postDescription.textContent,
        link: link.textContent,
      });
    });
    return [feed, posts];
  }
  return false;
};

const getFeedId = (feedsArr, channel) => {
  if (feedsArr === null) return false;
  let idFeed;
  feedsArr.forEach((arr) => {
    if (arr === null) return false;
    for (let i = 0; i < arr.length; i += 1) {
      const { title, id } = arr[i];
      if (title === channel) idFeed = id;
    }
    return null;
  });
  return idFeed;
};

const makeParsingForAxios = (response, feeds) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response, 'application/xml');

  const channel = doc.querySelector('channel');
  if (channel) {
    const posts = [];
    const titleF = doc.querySelector('channel title'); //
    const items = doc.querySelectorAll('item');
    items.forEach((item) => {
      if (item === null) return false;
      const titleP = item.querySelector('title');
      const link = item.querySelector('link');
      const postDescription = item.querySelector('description');
      const idP = uniqueId('post_');
      const feedId = getFeedId(feeds, titleF.textContent);
      posts.push({
        idFeed: feedId,
        id: idP,
        title: titleP.textContent,
        description: postDescription.textContent,
        link: link.textContent,
      });
      return null;
    });
    return [posts];
  }
  return false;
};

export {
  makeParsingForAxios,
};