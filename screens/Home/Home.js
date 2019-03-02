import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import s from '../../styles';
import db from '../../database/db';

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    test: null,
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'select * from anothertest',
        [],
        (_, res) => {
          console.log('res from sqlite', res);
          // this.setState({ items: _array })
        },
        (_, res) => {
          console.log('ERROR res', res);
        }
      );
    });

  }


  render() {
    console.log('test', this.state.test);
    return (
      <View style={s.appRoot}>
        <ScrollView>
          <View>
            <Text>Welcome</Text>
          </View>
        </ScrollView>
      </View>
    );
  }


}

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
