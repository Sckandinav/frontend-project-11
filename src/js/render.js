const buildContainer = (name, i18nInstance) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');

  const div = document.createElement('div');
  div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nInstance.t(`containers.${name}`);
  div.appendChild(h2);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  container.replaceChildren(div, list);
  return { container, list };
};

const setAttributes = (el, attrs) => {
  Object.entries(attrs).forEach((element) => {
    const [key, value] = element;
    el.setAttribute(key, value);
  });
};

const renderForm = ({ input, feedback }, { isValidate, error }, i18nInstance) => {
  if (isValidate === 'true') {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  } else {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(`errors.${error}`);
  }
};

const renderFeeds = ({ containerFeeds }, { feeds }, i18nInstance) => {
  containerFeeds.innerHTML = '';
  const { container, list } = buildContainer('feeds', i18nInstance);

  feeds.forEach((feed) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;

    listItem.replaceChildren(title, description);
    list.appendChild(listItem);
  });
  containerFeeds.appendChild(container);
};

const renderPosts = ({ containerPosts }, { posts, viewedPosts }, i18nInstance) => {
  containerPosts.innerHTML = '';
  const { container, list } = buildContainer('posts', i18nInstance);

  posts.forEach((post) => {
    const listItem = document.createElement('li');
    listItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const link = document.createElement('a');
    link.href = post.link;
    setAttributes(link, { 'data-id': `${post.id}`, target: '_blank', rel: 'noopener noreferrer' });
    link.textContent = post.title;

    if (viewedPosts.has(post.id)) {
      link.classList.add('fw-normal', 'link-secondary');
    } else {
      link.classList.add('fw-bold');
    }

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    setAttributes(button, {
      type: 'button',
      'data-id': `${post.id}`,
      'data-bs-toggle': 'modal',
      'data-bs-target': '#modal',
    });
    button.textContent = i18nInstance.t('buttons.read');

    listItem.replaceChildren(link, button);
    list.appendChild(listItem);
  });
  containerPosts.appendChild(container);
};

const renderLoadingProcess = ({ input, feedback, submit }, { status, error }, i18nInstance) => {
  switch (status) {
    case 'loading':
      submit.setAttribute('disabled', 'disabled');
      feedback.textContent = i18nInstance.t('success.loading');
      break;
    case 'finished':
      input.value = '';
      input.focus();
      submit.removeAttribute('disabled');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('success.rssAdded');
      break;
    case 'failed':
      submit.removeAttribute('disabled');
      feedback.classList.add('text-danger');
      feedback.textContent = i18nInstance.t(`errors.${error}`);
      break;
    default:
      throw new Error(`${status}`);
  }
};

const renderModal = ({ title, text, link }, { posts }, postId) => {
  const viewedPost = posts.flat().find(({ id }) => id === postId);
  title.textContent = viewedPost.title;
  text.textContent = viewedPost.description;
  link.href = viewedPost.link;
};

export default (elements, state, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form':
      renderForm(elements, value, i18nInstance);
      break;
    case 'loadingProcess':
      renderLoadingProcess(elements, value, i18nInstance);
      break;
    case 'feeds':
      renderFeeds(elements, state, i18nInstance);
      break;
    case 'posts':
      renderPosts(elements, state, i18nInstance);
      break;
    case 'viewedPosts':
      renderPosts(elements, state, i18nInstance);
      break;
    case 'modal.postId':
      renderModal(elements.modal, state, value);
      break;
    default:
      break;
  }
};
