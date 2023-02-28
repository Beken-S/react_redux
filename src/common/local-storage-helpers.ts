import { UnknownError } from './errors';

function safelyGetItem<T, K extends string = string>(key: K): [T | null, Error | null] {
  const item = localStorage.getItem(key);
  if (item == null) {
    return [item, null];
  }
  try {
    const result: T = JSON.parse(item);
    return [result, null];
  } catch (error) {
    localStorage.removeItem(key);
    if (error instanceof Error) {
      return [null, error];
    }
    return [null, new UnknownError('Неизвестная ошибка.')];
  }
}

function safelySetItem<T, K extends string = string>(key: K, item: T): null | Error {
  let jsonString: string;
  try {
    jsonString = JSON.stringify(item);
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    return new UnknownError('Неизвестная ошибка.');
  }
  try {
    localStorage.setItem(key, jsonString);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error;
    }
    return new UnknownError('Неизвестная ошибка.');
  }
}

export { safelyGetItem, safelySetItem };
