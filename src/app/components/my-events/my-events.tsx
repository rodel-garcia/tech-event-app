import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import { TechEvent } from '../../app.types';
import { EVENTS_API_URL, LOCALSTORAGE_KEY_PREFFIX } from '../../app.constant';

import Spinner from '../shared/spinner/spinner';
import EventList from '../shared/event-list/event-list';

type MyEventsState = {
  isLoading: boolean;
  eventsList: TechEvent[] | [];
};

class MyEvents extends React.Component<{}, MyEventsState> {
  state: MyEventsState = {
    isLoading: false,
    eventsList: [],
  };

  componentDidMount() {
    this.setMyEventsList();
  }

  private setMyEventsList = async () => {
    const myEventsList: TechEvent[] = [];
    const ids = this.getEventIdsFromStorage();
    this.setState({ isLoading: true });
    const response = await axios.get(EVENTS_API_URL, {
      params: { _sort: 'startDate', _order: 'desc' },
    });
    const eventsList = response.data as TechEvent[];
    _.forEach(ids, (id) => {
      const event = eventsList.find((event) => event.id === id);
      myEventsList.push(event as TechEvent);
    });
    this.setState({ eventsList: myEventsList, isLoading: false });
  };

  private getEventIdsFromStorage = (): number[] => {
    const ids: number[] = [];
    _.forEach(_.keys(localStorage), (key) => {
      if (key.includes(`${LOCALSTORAGE_KEY_PREFFIX}_`)) {
        ids.push(+key.split('_')[1]);
      }
    });
    return ids;
  };

  private onCancelEvent = (eventId: number) => {
    localStorage.removeItem(`${LOCALSTORAGE_KEY_PREFFIX}_${eventId}`);
    this.setMyEventsList();
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.eventsList && this.state.eventsList.length ? (
          <EventList
            events={this.state.eventsList}
            onCancelEvent={this.onCancelEvent}
          />
        ) : (
          <em>Your list is empty</em>
        )}
      </div>
    );
  }
}

export default MyEvents;
