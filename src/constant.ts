export const API_URL = 'http://127.0.0.1:8888'

export type TApiParams = {
  method?: 'GET' | 'POST',
  url: string,
  token?: string | null,
  body?: string,
}
export const api = ({method, url, token, body}: TApiParams): Promise<any> => {
  let headers: {} = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': token || '',
    }
  }
  return fetch(url, {
    method,
    headers,
    body,
  }).then(resp => resp.json())
}
