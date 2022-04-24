import { atLeast } from './string';

export const dateToDateTime = (date) => {
  if (!date) date = new Date();
  else if (typeof date !== 'object') date = new Date(date);
  return (
    date.getFullYear() +
    '-' +
    atLeast(date.getMonth() + 1) +
    '-' +
    atLeast(date.getDate()) +
    'T' +
    atLeast(date.getHours()) +
    ':' +
    atLeast(date.getMinutes()) +
    ':' +
    atLeast(date.getSeconds())
  );
};

export const beautifyDateTime = (date) => {
  if (!date) date = new Date();
  else if (typeof date !== 'object') date = new Date(date);
  return date.toLocaleString();
};
