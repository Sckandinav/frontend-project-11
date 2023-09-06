export default (response) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data.contents, 'text/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error(`Error! ${errorNode}`);
  }

  const titleFeed = doc.querySelector('channel title');
  const feedDescription = doc.querySelector('description');

  const feed = {
    title: titleFeed.textContent,
    description: feedDescription.textContent,
  };

  const items = doc.querySelectorAll('item');
  const itemsArr = Array.from(items);

  const posts = itemsArr.map((item) => {
    const titlePost = item.querySelector('title');
    const link = item.querySelector('link');
    const postDescription = item.querySelector('description');
    return {
      title: titlePost.textContent,
      description: postDescription.textContent,
      link: link.textContent,
    };
  });
  return {
    feed,
    posts,
    titlefeed: titleFeed.textContent,
  };
};
