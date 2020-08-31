import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import {
  EVENTS_API_URL,
  SEARCH_FILTER_DEBOUNCE_TIME,
  DATA_LENGTH_LIMIT,
} from '../../app.constant';
import {
  TechEvent,
  RequestParams,
  FilterValues,
  FilterNames,
} from '../../app.types';

import SearchFilter from './search-filter/search-filter';
import EventList from '../shared/event-list/event-list';
import Spinner from '../shared/spinner/spinner';

import style from './all-events.module.scss';

type AllEventState = {
  events: TechEvent[] | null;
  isLoading: boolean;
  isFiltering: boolean | null;
  filter: FilterValues;
  totalLength: number;
};

class AllEvents extends React.Component<{}, AllEventState> {
  state: AllEventState = {
    events: null,
    isLoading: false,
    isFiltering: null,
    totalLength: 0,
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
    this.setInitialState();
  }

  setInitialState() {
    this.fetchEventsData({ _start: 0, _end: DATA_LENGTH_LIMIT });
    this.setTotalLength();
    this.setState({ isFiltering: false });
  }

  private processFilter = (val: string | boolean, name: string) => {
    if (FilterNames.NAME === name || FilterNames.CITY === name) {
      this.filterBySearchTerms(val as string, name);
    } else if (FilterNames.ONLY_FREE === name) {
      this.filterOnlyFree(val as boolean);
    } else {
      this.filterByTimeOfDay(val as boolean, name);
    }
  };

  private setStateFilter(val: string | boolean, name: string) {
    this.setState({
      isLoading: true,
      isFiltering: (val as string) !== '' || val !== null || (val as boolean),
    });
    if (
      FilterNames.NAME === name ||
      FilterNames.CITY === name ||
      FilterNames.ONLY_FREE === name
    ) {
      this.setState({ filter: { ...this.resetFilterState(), [name]: val } });
    } else {
      this.setState({ filter: { [name]: val } });
    }
  }

  private resetFilterState(): FilterValues {
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

  private onFilter = (val: string | boolean, name: string) => {
    this.setStateFilter(val, name);
    this.processFilter(val, name);
  };

  private filterByTimeOfDay(val: boolean, name: string) {
    const [startingHour, endingHour] =
      FilterNames.MORNING === name
        ? [6, 12]
        : FilterNames.AFTERNOON === name
        ? [12, 17]
        : FilterNames.EVENING === name
        ? [17, 21]
        : [21, 6];
    val
      ? this.fetchEventsData({}, { startingHour, endingHour })
      : this.setInitialState();
  }

  private filterOnlyFree(val: boolean) {
    const { city, name } = this.state.filter;
    const params = {
      name_like: name,
      city_like: city,
    };
    val && _.assign(params, { isFree: val });
    val || name || city ? this.fetchEventsData(params) : this.setInitialState();
  }

  private filterBySearchTerms = _.debounce(
    (val: string, filterName: string) => {
      const { name, city, isFree } = this.state.filter;
      let params = { city_like: city, name_like: name };
      params = { ...params, [`${filterName}_like`]: val };
      isFree && _.assign(params, { isFree });
      val || name || city || isFree
        ? this.fetchEventsData(params)
        : this.setInitialState();
    },
    SEARCH_FILTER_DEBOUNCE_TIME
  );

  private applyDayFilter(
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

  private fetchEventsData = async (
    params?: RequestParams,
    filter?: { startingHour: number; endingHour: number }
  ) => {
    let filteredResponseData = null;
    this.setState({ isLoading: true });
    const eventsResponse = await axios.get(EVENTS_API_URL, {
      params: { ...params, _sort: 'startDate', _order: 'desc' },
    });
    if (filter) {
      this.setState({ isFiltering: true });
      filteredResponseData = this.applyDayFilter(
        eventsResponse.data,
        filter
      ) as TechEvent[];
    }
    this.setState({
      events: filteredResponseData || (eventsResponse.data as TechEvent[]),
      isLoading: false,
    });
  };

  private setTotalLength = async () => {
    const res = await axios.get(EVENTS_API_URL);
    this.setState({ totalLength: res.data.length });
  };

  private onLoadmore = async () => {
    this.setState({ isLoading: true });
    const res = await axios.get(EVENTS_API_URL, {
      params: {
        _start: this.state.events?.length,
        _end: (this.state.events?.length || 0) + DATA_LENGTH_LIMIT,
        _sort: 'startDate',
        _order: 'desc',
      },
    });
    const totalEvents = _.concat(this.state.events, res.data);
    this.setState({
      events: totalEvents,
      isLoading: false,
    });
  };

  render() {
    return (
      <div className={style['all-events']}>
        <SearchFilter onFilter={this.onFilter} values={this.state.filter} />
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.events && this.state.events.length ? (
          <EventList
            events={this.state.events}
            onLoadMore={this.onLoadmore}
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
