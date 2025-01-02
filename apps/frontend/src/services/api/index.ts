import Client from './Client';

export const petApi = new Client({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
