// TODO: can probably make this better with a function that takes in http method

export const apiPost = (url: string, body: any) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then((res) => res.json());

export const apiPut = (url: string, body: any) =>
  fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  }).then((res) => res.json());

export const apiDelete = (url: string) =>
  fetch(url, { method: 'DELETE' }).then((res) => res.json());
