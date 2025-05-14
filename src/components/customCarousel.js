import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import { useColorContext } from '../services/state/colorsContext';
import {useNavigation} from '@react-navigation/native';
import Button from './button';
import {postData} from '../services/axios/apiCoreCalls';
import { appCode } from '../services/axios/eps';

const screenWidth = Dimensions.get('window').width;

const CustomCarousel = ({posters,getData}) => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
   const { colors } = useColorContext();
  const flatListRef = useRef(null);
  const intervalRef = useRef(null);

  const ITEM_WIDTH = screenWidth * 0.9;
  const SPACING = (screenWidth - ITEM_WIDTH) / 2;

  // const startAutoScroll = useCallback(() => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //   }
  //   intervalRef.current = setInterval(() => {
  //     setCurrentIndex(prevIndex => {
  //       const nextIndex = prevIndex === posters.length - 1 ? 0 : prevIndex + 1;
  //       scrollToIndex(nextIndex);
  //       return nextIndex;
  //     });
  //   }, 3000);
  // }, [posters.length, scrollToIndex]);
  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setIsAutoScrolling(true); // Set flag to true for auto-scrolling
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex === posters.length - 1 ? 0 : prevIndex + 1;
        scrollToIndex(nextIndex, true); // Animate auto-scroll
        return nextIndex;
      });
    }, 3000);
  }, [posters.length, scrollToIndex]);

  // useEffect(() => {
  //   startAutoScroll();
  //   return () => {
  //     clearInterval(intervalRef.current);
  //   };
  // }, [posters.length, startAutoScroll]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [posters.length, startAutoScroll]);

  // const scrollToIndex = useCallback(
  //   index => {
  //     if (flatListRef.current) {
  //       flatListRef.current.scrollToOffset({
  //         offset: index * ITEM_WIDTH,
  //         animated: true,
  //       });
  //     }
  //   },
  //   [ITEM_WIDTH],
  // );

  const scrollToIndex = useCallback(
    (index, animated = true) => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: index * ITEM_WIDTH,
          animated, // Pass animated value to scrollToOffset
        });
      }
    },
    [ITEM_WIDTH],
  );
  // const handleScroll = event => {
  //   const contentOffsetX = event.nativeEvent.contentOffset.x;
  //   const newIndex = Math.floor(contentOffsetX / ITEM_WIDTH);
  //   if (newIndex !== currentIndex) {
  //     setCurrentIndex(newIndex);
  //     startAutoScroll();
  //   }
  // };
  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / ITEM_WIDTH);
    // If the newIndex is different and it's not auto-scrolling
    if (newIndex !== currentIndex && !isAutoScrolling) {
      setCurrentIndex(newIndex);
      startAutoScroll(); // Only restart auto-scrolling if it's manual
    }

    // Reset the auto-scrolling flag after manual or auto-scroll ends
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
  };

  const handlePressDetail = item => {
    if (item) {
      navigation.navigate('Detailed', {id: item});
    } else {
      Alert.alert('Error', 'Unable to load details. Try again.');
    }
  };

  const handlePress = item => {
    if (item) {
      navigation.navigate('playerStack', {
        screen: 'mainPlayer',
        params: {
          id: item,
        },
      });
    } else {
      Alert.alert('Error', 'Unable to load stream. Try again.');
    }
  };
  const handleReview = async code => {
    if (!code) {
      console.log('Error: Stream code is missing.');
      return;
    }

    try {
      const res = await postData('remind/me', {stream_code: code});

      if (res?.status === 200) {
        console.log('Reminder set successfully:', res.data);
        await getData();
      } else {
        console.log('Failed to set reminder. Response:', res);
        Alert.alert('Failed To Set The reminder!');
      }
    } catch (error) {
      console.log('Error in handleReview:', error);
      Alert.alert('Failed To Set The reminder!');
    }
  };

  const handleQualityPress = item => {
    navigation.navigate('Quality', {id: item});
  };

  const handleRatingPress = item => {
    navigation.navigate('Rating', {id: item});
  };

  const formatDuration = minutes => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? ` ${hrs}hr ${mins}m` : ` ${mins}m`;
  };

  const renderItem = ({item, index}) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-ITEM_WIDTH * 0.05, 0, ITEM_WIDTH * 0.05],
      extrapolate: 'clamp',
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });
 
    return (
      <View>
        <Animated.View style={[styles.item, {transform: [{scale}]}]}>
          <View>
            <TouchableOpacity
              onPress={() => handlePressDetail(item.stream_guid)}
              activeOpacity={0.7}>
              <Animated.Image
                source={{uri: item?.feature_poster}}
                style={[styles.posterImage, {transform: [{translateX}]}]}
                borderRadius={8}
              />
            </TouchableOpacity>

            <View style={styles.bottomView}>
              <Button
                onPress={() =>
                  item?.notify_label === 'coming soon'
                    ? handleReview(item?.stream_guid)
                    : handlePress(item?.stream_guid)
                }
                icon={
                  item?.notify_label === 'coming soon'
                    ? item?.reminder_set
                      ? 'check'
                      : 'bell' 
                    : 'play' 
                }
                text={
                  item?.notify_label === 'coming soon'
                    ? item?.reminder_set
                      ? 'Reminder Set'
                      : 'Remind Me'
                    : 'Play'
                }
              />
              <View style={styles.bottmText}>
                <Text style={[styles.streamTitle,{ color: colors.white,}]} numberOfLines={1}>
                  {item?.stream_title}
                </Text>
                <View style={styles.btnContainer}>
                  {item?.stream_quality[0]?.title && (
                    <TouchableOpacity
                      style={[styles.hDButton,{  backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed: colors.theme,}]}
                      onPress={() =>
                        handleQualityPress(item?.stream_quality[0]?.code)
                      }>
                      <Text style={[styles.boxStyle,{ color: colors.white,}]}>
                        {item?.stream_quality[0].title}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item?.stream_rating[0]?.title && (
                    <TouchableOpacity
                      style={[styles.pGButton,{  backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed: colors.theme,}]}
                      onPress={() =>
                        handleRatingPress(item?.stream_rating[0]?.code)
                      }>
                      <Text style={[styles.boxStyle,{ color: colors.white,}]}>
                        {item?.stream_rating[0]?.title}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {item?.stream_duration !== '0' &&
                  <Text style={[styles.streamType,{color: colors.white,}]}>
                    {formatDuration(item?.stream_duration || 0)}
                    
                  </Text>
                  }
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={[styles.container,{ backgroundColor: colors.dull,}]}>
      <Animated.FlatList
        ref={flatListRef}
        data={posters}
        keyExtractor={item => item.stream_guid}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{paddingHorizontal: SPACING}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: true,
            listener: handleScroll,
          },
        )}
        renderItem={renderItem}
      />
      <View style={styles.dotContainer}>
        {posters?.map((_, i) => {
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                 {backgroundColor: currentIndex === i ? colors.theme: colors.slideInActive,}
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  item: {
    width: screenWidth * 0.9,
    alignItems: 'center',
    marginTop: 8,
  },
  posterImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    alignSelf: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
 
  streamTitle: {
   
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  streamType: {
    
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 5,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  bottomView: {
    width: '95%',
    height: 70,
    marginTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  bottmText: {
    padding: '1%',
    width: '60%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  hDButton: {
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
   
    borderRadius: 3,
  },
  pGButton: {
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
   
    marginLeft: 10,
    borderRadius: 3,
  },
  boxStyle: {
    fontSize: 9,
    fontWeight: '500',
   
  },
});

export default CustomCarousel;
