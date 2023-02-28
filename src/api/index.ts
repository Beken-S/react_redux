const BASE_URL = 'https://api.github.com';
const OPTIONS: RequestInit = {
  method: 'GET',
  headers: {
    Accept: 'application/vnd.github+json',
  },
  redirect: 'follow',
};

export { BASE_URL, OPTIONS };
