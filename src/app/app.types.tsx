export type TechEvent = {
  id: number;
  isFree: boolean;
  name: string;
  city: number;
  startDate: string;
  endDate: string;
};

export type RequestParams = {
  _start?: number;
  _end?: number;
  _sort?: string;
  _order?: string;
  city_like?: string;
  name_like?: string;
  isFree?: boolean;
};

export type FilterValues = {
  name?: string;
  city?: string;
  isFree?: boolean;
  morning?: boolean;
  afternoon?: boolean;
  evening?: boolean;
  night?: boolean;
};

export enum FilterNames {
  NAME = 'name',
  CITY = 'city',
  ONLY_FREE = 'isFree',
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night',
}
