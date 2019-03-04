import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import s from '../../styles';
import { fetchGroupMeta } from '../../reducers/groupMeta';

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {}

  componentDidMount() {
    this.props.fetchGroupMeta();
  }


  render() {
    console.log('test', this.props.groupMeta);
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
  groupMeta: PropTypes.object,
  fetchGroupMeta: PropTypes.func,
};

const mapStateToProps = state => ({
  groupMeta: state.groupMeta,
});

const mapDispatchToProps = {
  fetchGroupMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
