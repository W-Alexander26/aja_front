const PUBLIC_TOKEN = import.meta.env.VITE_PUBLIC_API_TOKEN;

const TOKEN_KEY = 'CRSTOKEN';
if (!localStorage.getItem(TOKEN_KEY)) {
  localStorage.setItem(TOKEN_KEY, PUBLIC_TOKEN);
}

const rawFetch = window.fetch;
window.fetch = function (url, opts = {}) {
  opts.headers = {
    ...(opts.headers || {}),
    'x-crs-token': localStorage.getItem(TOKEN_KEY),
  };
  return rawFetch(url, opts);
};

import('axios')
  .then(({ default: axios }) => {
    axios.defaults.headers.common['x-crs-token'] =
      localStorage.getItem(TOKEN_KEY);
  })
  .catch(() => {
  });

console.debug('🪝 Token público seteado desde .env');
