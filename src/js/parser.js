export default (contents) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'text/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    const error = new Error(parserError.textContent);
    error.isParserError = true;
    throw error;
  }

  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
  };

  const posts = Array.from(doc.querySelectorAll('item')).map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return { title, link, description };
  });
  return { feed, posts };
};
