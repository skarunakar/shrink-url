const BASE_URL = 'http://localhost:3000';

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  },
});

const http = {
  get: (url, params) => httpClient.get(url, params),
  post: (url, params) => httpClient.post(url, params),
};