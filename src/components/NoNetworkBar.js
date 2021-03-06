import React, { Component } from 'react';
import { View, StatusBar, Animated, Easing, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import i18n from '../i18n';
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme['color-danger-800'],
  },
  offlineText: {
    color: theme['color-white'],
    padding: 8,
    textAlign: 'center',
    fontWeight: theme['font-medium'],
    fontSize: theme['text-primary-size'],
  },
});

export default class OfflineBar extends Component {
  animationConstants = {
    DURATION: 800,
    TO_VALUE: 4,
    INPUT_RANGE: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    OUTPUT_RANGE: [0, -15, 0, 15, 0, -15, 0, 15, 0],
  };

  state = {
    isConnected: true,
  };

  constructor() {
    super();
    this.animation = new Animated.Value(0);
  }

  componentWillMount() {
    NetInfo.addEventListener(state => {
      const { isConnected } = state;

      this.setNetworkStatus(isConnected);
    });
  }

  setNetworkStatus = status => {
    this.setState({ isConnected: status });
    if (status) {
      this.triggerAnimation();
    }
  };

  // Took Reference from https://egghead.io/lessons/react-create-a-button-shake-animation-in-react-native#/tab-code
  triggerAnimation = () => {
    this.animation.setValue(0);
    Animated.timing(this.animation, {
      duration: this.animationConstants.DURATION,
      toValue: this.animationConstants.TO_VALUE,
      useNativeDriver: true,
      ease: Easing.bounce,
    }).start();
  };

  render() {
    const interpolated = this.animation.interpolate({
      inputRange: this.animationConstants.INPUT_RANGE,
      outputRange: this.animationConstants.OUTPUT_RANGE,
    });
    const animationStyle = {
      transform: [{ translateX: interpolated }],
    };
    const { isConnected } = this.state;
    return !isConnected ? (
      <View style={styles.container}>
        <StatusBar backgroundColor={theme['color-danger-800']} />
        <Animated.Text style={[styles.offlineText, animationStyle]}>
          {i18n.t('ERRORS.OfFLINE')}
        </Animated.Text>
      </View>
    ) : null;
  }
}
