import axios from 'axios';

export default function baseService(params: any) {
  const effectiveParams = {
    ...params,
    api_key: process.env.REACT_APP_FLICKR_KEY,
  };

  return axios.get('https://api.flickr.com/services/rest', {
    params: effectiveParams,
  });
}
