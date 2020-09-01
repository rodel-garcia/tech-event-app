import React from 'react';
import _ from 'lodash';
import { AxiosError } from 'axios';

import {
  SEARCH_FILTER_DEBOUNCE_TIME,
  DATA_LENGTH_LIMIT,
} from '../../app.constant';
import {
  TechEvent,
  RequestParams,
  FilterValues,
  FilterNames,
} from '../../app.types';
import techEventApi from '../../api/tech-event';

import SearchFilter from './search-filter/search-filter';
import EventList from '../shared/event-list/event-list';
import Spinner from '../shared/spinner/spinner';

import style from './all-events.module.scss';
import ErrorMessage from '../shared/error-message/error-message';

type AllEventState = {
  events: TechEvent[] | null;
  isLoading: boolean;
  isFiltering: boolean | null;
  filter: FilterValues;
  totalLength: number;
  error: AxiosError | null;
};

class AllEvents extends React.Component<{}, AllEventState> {
  state: AllEventState = {
    events: null,
    isLoading: false,
    isFiltering: null,
    totalLength: 0,
    error: null,

    filter: {
      name: '',
      city: '',
      isFree: false,
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    },
  };

  componentDidMount() {
    this._setInitialState();
    this._setTotalLength();
  }

  private _setInitialState() {
    this._fetchEventsData({ _start: 0, _end: DATA_LENGTH_LIMIT });
    this.setState({ isFiltering: false });
  }

  private _processFilter = (val: string | boolean, name: string) => {
    if (FilterNames.NAME === name || FilterNames.CITY === name) {
      this.filterBySearchTerms(val as string, name);
    } else if (FilterNames.ONLY_FREE === name) {
      this._filterOnlyFree(val as boolean);
    } else {
      this._filterByTimeOfDay(val as boolean, name);
    }
  };

  private _setFilterState(val: string | boolean, name: string) {
    this.setState({
      isLoading: true,
      isFiltering: (val as string) !== '' || val !== null || (val as boolean),
    });
    if (
      FilterNames.NAME === name ||
      FilterNames.CITY === name ||
      FilterNames.ONLY_FREE === name
    ) {
      this.setState({ filter: { ...this._resetFilterState(), [name]: val } });
    } else {
      this.setState({ filter: { [name]: val } });
    }
  }

  private _resetFilterState(): FilterValues {
    return {
      name: this.state.filter.name,
      city: this.state.filter.city,
      isFree: this.state.filter.isFree,
      morning: false,
      afternoon: false,
      evening: false,
      night: false,
    };
  }

  private _onFilter = (val: string | boolean, name: string) => {
    this._setFilterState(val, name);
    this._processFilter(val, name);
  };

  private _filterByTimeOfDay(val: boolean, name: string) {
    const [startingHour, endingHour] =
      FilterNames.MORNING === name
        ? [6, 12]
        : FilterNames.AFTERNOON === name
        ? [12, 17]
        : FilterNames.EVENING === name
        ? [17, 21]
        : [21, 6];
    val
      ? this._fetchEventsData({}, { startingHour, endingHour })
      : this._setInitialState();
  }

  private _filterOnlyFree(val: boolean) {
    const { city, name } = this.state.filter;
    const params = {
      name_like: name,
      city_like: city,
    };
    val && _.assign(params, { isFree: val });
    val || name || city
      ? this._fetchEventsData(params)
      : this._setInitialState();
  }

  private filterBySearchTerms = _.debounce(
    (val: string, filterName: string) => {
      const { name, city, isFree } = this.state.filter;
      let params = { city_like: city, name_like: name };
      params = { ...params, [`${filterName}_like`]: val };
      isFree && _.assign(params, { isFree });
      val || name || city || isFree
        ? this._fetchEventsData(params)
        : this._setInitialState();
    },
    SEARCH_FILTER_DEBOUNCE_TIME
  );

  private _applyDayFilter(
    data: TechEvent[],
    filter: { startingHour: number; endingHour: number }
  ): TechEvent[] {
    return data?.filter((event: TechEvent) => {
      const startDateHours = new Date(event.startDate).getHours();
      return filter.startingHour < filter.endingHour
        ? startDateHours >= filter.startingHour &&
            startDateHours < filter.endingHour
        : (startDateHours >= filter.startingHour && startDateHours < 24) ||
            (startDateHours >= 0 && startDateHours < filter.endingHour);
    }) as TechEvent[];
  }

  private _fetchEventsData = async (
    params?: RequestParams,
    filter?: { startingHour: number; endingHour: number }
  ) => {
    let filteredData: TechEvent[] | null = null;
    this.setState({ isLoading: true });
    techEventApi
      .get('/', { params })
      .then((response) => {
        if (filter) {
          this.setState({ isFiltering: true });
          filteredData = this._applyDayFilter(response.data, filter);
        }
        this.setState({
          events: filteredData || (response.data as TechEvent[]),
          isLoading: false,
        });
      })
      .catch((e: AxiosError) => {
        this.setState({ error: e, isLoading: false });
      });
  };

  private _setTotalLength = () => {
    techEventApi
      .get('/')
      .then((res) => {
        this.setState({ totalLength: res.data.length });
      })
      .catch((e: AxiosError) => {
        this.setState({ error: e, isLoading: false });
      });
  };

  private _onLoadmore = () => {
    this.setState({ isLoading: true });
    const { events } = this.state;
    techEventApi
      .get('/', {
        params: {
          _start: events?.length,
          _end: (events?.length || 0) + DATA_LENGTH_LIMIT,
        },
      })
      .then((res) => {
        this.setState({
          events: _.concat(this.state.events, res.data),
          isLoading: false,
        });
      })
      .catch((e: AxiosError) => {
        this.setState({ error: e, isLoading: false });
      });
  };

  render() {
    return (
      <div className={style['all-events']}>
        <SearchFilter onFilter={this._onFilter} values={this.state.filter} />
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.error ? (
          <ErrorMessage error={this.state.error} />
        ) : this.state.events && this.state.events.length ? (
          <EventList
            events={this.state.events}
            onLoadMore={this._onLoadmore}
            isShowMoreVisible={
              !this.state.isFiltering &&
              this.state.totalLength > this.state.events.length
            }
          />
        ) : (
          <em>No results found</em>
        )}
      </div>
    );
  }
}

export default AllEvents;
