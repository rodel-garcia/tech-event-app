import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AllEvents from './components/all-events/all-events';
import MyEvents from './components/my-events/my-events';
import MainNav from './components/shared/main-nav/main-nav';

import logo from '../logo.png';
import style from './app.module.scss';

const App: React.FC = () => {
  return (
    <div className={style.app}>
      <Router>
        <header className={style.header}>
          <img src={logo} alt='logo' />
          <MainNav></MainNav>
        </header>
        <main className={style.main}>
          <Switch>
            <Route path='/' exact component={AllEvents} />
            <Route path='/my-events' exact component={MyEvents} />
            <Redirect to='/' />
          </Switch>
        </main>
      </Router>
    </div>
  );
};

export default App;
