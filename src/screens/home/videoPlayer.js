import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';
import {styles} from './playerStyles';
import {colors} from '../../assets/colors';
const VideoPlayer = ({trailerUrl, poster, onVideoEnd, isPaused}) => {
  return (
    <View style={[styles.container,{   backgroundColor: 'black',}]}>
      {trailerUrl ? (
        <View style={styles.videoContainer}>
          <Video
            source={{uri: trailerUrl}}
            style={styles.video}
            paused={isPaused}
            resizeMode="contain"
            poster={poster}
            onEnd={onVideoEnd}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" color={colors.theme} />
      )}
    </View>
  );
};

export default VideoPlayer;
