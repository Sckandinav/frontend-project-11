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
      const idP = uniqueId('post_');
      posts.push({
        feedId: idF,
        id: idP,
        title: titleP.textContent,
        link: link.textContent,
      });
    });
    return [feed, posts];
  }
  return false;
};