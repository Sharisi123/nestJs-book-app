import axios from 'axios';

const token = localStorage.getItem('jwt');

export const api = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://localhost:4200',
  headers: {
    origin: 'http://localhost:4200',
    Authorization: `Bearer ${token}`,
  },
});
