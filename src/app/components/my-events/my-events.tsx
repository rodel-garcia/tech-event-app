import React from 'react';
import _ from 'lodash';
import { AxiosError } from 'axios';

import techEventApi from '../../api/tech-event';

import { TechEvent } from '../../app.types';
import { LOCALSTORAGE_KEY_PREFFIX } from '../../app.constant';

import Spinner from '../shared/spinner/spinner';
import EventList from '../shared/event-list/event-list';
import ErrorMessage from '../shared/error-message/error-message';

type MyEventsState = {
  isLoading: boolean;
  eventsList: TechEvent[] | [];
  error: AxiosError | null;
};

class MyEvents extends React.Component<{}, MyEventsState> {
  state: MyEventsState = {
    isLoading: false,
    eventsList: [],
    error: null,
  };

  componentDidMount() {
    this._setMyEventsList();
  }

  private _getEventIdsFromStorage = (): number[] => {
    const ids: number[] = [];
    _.forEach(_.keys(localStorage), (key) => {
      if (key.includes(`${LOCALSTORAGE_KEY_PREFFIX}_`)) {
        ids.push(+key.split('_')[1]);
      }
    });
    return ids;
  };

  private _onCancelEvent = (eventId: number) => {
    localStorage.removeItem(`${LOCALSTORAGE_KEY_PREFFIX}_${eventId}`);
    this._setMyEventsList();
  };

  private _setMyEventsList = () => {
    const eventsList: TechEvent[] = [];
    const ids = this._getEventIdsFromStorage();
    this.setState({ isLoading: true });

    techEventApi
      .get('/')
      .then((res) => {
        _.forEach(ids, (id) => {
          const event = res.data.find((event: TechEvent) => event.id === id);
          eventsList.push(event as TechEvent);
        });
        this.setState({ eventsList, isLoading: false });
      })
      .catch((e: AxiosError) => {
        this.setState({ error: e, isLoading: false });
      });
  };

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.error ? (
          <ErrorMessage error={this.state.error} />
        ) : this.state.eventsList && this.state.eventsList.length ? (
          <EventList
            events={this.state.eventsList}
            onCancelEvent={this._onCancelEvent}
          />
        ) : (
          <em>Your list is empty</em>
        )}
      </div>
    );
  }
}

export default MyEvents;
