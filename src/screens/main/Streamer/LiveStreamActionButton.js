import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LIVE_STATUS } from '../Streamer/utils/constants';
import styles from './styles';

const LiveStreamActionButton = ({ currentLiveStatus, onPress }) => {
  let backgroundColor = "#25BEED";
  let text = 'Start Heart Rate Measurement';
  if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
    backgroundColor = '#e74c3c';
    text = 'Stop live stream';
  }
  return (
    <TouchableOpacity onPress={onPress} style={Platform.OS == 'android' ? [styles.btnBeginLiveStreamAndroid, { backgroundColor }] : [styles.btnBeginLiveStreamIos, { backgroundColor }]}>
      <Text style={styles.beginLiveStreamText}>{text}</Text>
    </TouchableOpacity>
  );
};

LiveStreamActionButton.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  currentLiveStatus: PropTypes.number,
  onPress: PropTypes.func,
};

LiveStreamActionButton.defaultProps = {
  navigation: {
    goBack: () => null,
  },
  currentLiveStatus: LIVE_STATUS.PREPARE,
  onPress: () => null,
};

export default LiveStreamActionButton;
