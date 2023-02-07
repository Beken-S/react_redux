import {
  BaseError,
  NetworkError,
  UnknownError,
  SyntaxError,
  BadRequestError,
  NotFoundError,
  UnexpectedError,
} from './errors';

type ResultSuccess = [unknown, null];
type ResultFailure = [null, BaseError];

async function fetchJson(
  url: string,
  init?: RequestInit,
  notFoundMessage?: string
): Promise<ResultSuccess | ResultFailure> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    if (error instanceof Error) {
      return [null, new NetworkError('Ошибка соединения.')];
    }
    return [null, new UnknownError('Неизвестная ошибка')];
  }

  if (response.ok) {
    try {
      const result: unknown = await response.json();
      return [result, null];
    } catch {
      return [null, new SyntaxError('Неверный JSON.')];
    }
  }
  if (response.status === 400) {
    return [null, new BadRequestError('Некорректный запрос.')];
  }
  if (response.status === 404) {
    return [null, new NotFoundError(notFoundMessage || 'Информация не найдена.')];
  }
  return [null, new UnexpectedError('Что-то пошло не так.')];
}

export type { ResultFailure, ResultSuccess };
export { fetchJson };
