import axios from 'axios';

import { EVENTS_API_URL } from '../app.constant';
import { RequestParams } from '../app.types';

const DEFAULT_PARAMS: RequestParams = { _sort: 'startDate', _order: 'desc' };

const techEventApi = axios.create({
  baseURL: EVENTS_API_URL,
  responseType: 'json',
  params: DEFAULT_PARAMS,
});

export default techEventApi;
