import * as url from 'url'

export const parseUrl = (_url: string) => {
  const { query, pathname: path } = url.parse(_url, true)
  return {
    query,
    path,
  }
}
