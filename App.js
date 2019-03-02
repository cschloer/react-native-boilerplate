import React from 'react';
import AppContainer from './navigation';
import migrator from './database/migration';

export default class App extends React.Component {

  componentDidMount() {
    console.log('Calling migrate');
    migrator.migrate();
  }

  render() {
    return <AppContainer />;
  }
}
