import {
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Constants,
} from 'expo';

export default StyleSheet.create({
  appRoot: {
    paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
  },

});
