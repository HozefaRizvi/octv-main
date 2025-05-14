import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Slider = ({ posterUrl }) => {
  return (
    <View style={styles.sliderContainer}>
      <Image source={{ uri: posterUrl }} style={styles.posterImage} />
      <TouchableOpacity style={styles.watchNowButton}>
        <Text style={styles.buttonText}>Watch Now</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addToListButton}>
        <Text style={styles.buttonText}>Add to List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  posterImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  watchNowButton: {
    position: 'absolute',
    bottom: 30,
    padding: 10,
    backgroundColor: '#ffa502',
    borderRadius: 5,
  },
  addToListButton: {
    position: 'absolute',
    bottom: 10,
    padding: 10,
    backgroundColor: '#747d8c',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Slider;
