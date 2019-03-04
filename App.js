import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';

import AppContainer from './navigation';
import migrator from './database/migration';
import reducer from './reducers/rootReducer';


const loggerMiddleware = createLogger();
const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    // loggerMiddleware,
  ),
);

export default class App extends React.Component {

  state = {
    loadingMigrations: true,
  }

  render() {
    const { loadingMigrations } = this.state;
    if (loadingMigrations) {
      // Load the migrations before the app itself mounts
      return (
        <AppLoading
          startAsync={() => migrator.migrate()}
          onError={error => {
            console.warn(error);
            this.setState({ loadingMigrations: false });
          }}
          onFinish={() => this.setState({ loadingMigrations: false })}
        />
      );
    }
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
