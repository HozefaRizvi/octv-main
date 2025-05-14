import React, {useState} from 'react';
import {TouchableOpacity, Image, Text, View, Alert} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated from 'react-native-reanimated';
import Button from '../../components/button';
import {styles} from './homeStyles';
import {useNavigation} from '@react-navigation/native';
import { useColorContext } from '../../services/state/colorsContext';

const HomeCarousel = ({posters}) => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useColorContext();
  const handlePress = item => {
    if (item) {
      navigation.navigate('Player', {id: item});
    } else {
      Alert.alert('Error', 'Unable to load stream. Try again.');
    }
  };
  const handlePressDetail = item => {
    if (item) {
      navigation.navigate('Detailed', {id: item});
    } else {
      Alert.alert('Error', 'Unable to load details. Try again.');
    }
  };
  const formatDuration = minutes => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return ` ${hrs}hr ${mins}m`;
    } else {
      return ` ${mins}m`;
    }
  };
  const handleQualityPress = item => {
    navigation.navigate('Quality', {id: item});
  };
  const handleRatingPress = item => {
    navigation.navigate('Rating', {id: item});
  };
  const renderItem = ({item, index}) => (
    <View>
      <TouchableOpacity
        onPress={() => handlePressDetail(item.stream_guid)}
        activeOpacity={0.7}>
        <Image
          source={{uri: item?.feature_poster}}
          style={styles.posterImage}
          borderRadius={8}
        />
      </TouchableOpacity>

      <View style={styles.bottomView}>
        <Button onPress={() => handlePress(item?.stream_guid)} />
        <View style={styles.bottmText}>
          {/* <View style={{backgroundColor:'pink'}}> */}
          <Text style={[styles.streamTitle,{ color: colors.white,}]} numberOfLines={1}>
            {item?.stream_title}
          </Text>
          {/* </View> */}
          <View style={styles.btnContainer}>
            {item?.stream_quality[0]?.title ? (
              <TouchableOpacity
                style={[styles.hDButton,{backgroundColor: colors.theme,}]}
                onPress={() =>
                  handleQualityPress(item?.stream_quality[0]?.code)
                }>
                <Text style={[styles.boxStyle,{color: colors.white,}]}>
                  {item?.stream_quality[0].title}
                </Text>
              </TouchableOpacity>
            ) : null}
            {item?.stream_rating[0]?.title ? (
              <TouchableOpacity
                style={[styles.pGButton,{ backgroundColor: colors.theme,}]}
                onPress={() => handleRatingPress(item?.stream_rating[0]?.code)}>
                <Text style={[styles.boxStyle,{color: colors.white,}]}>
                  {item?.stream_rating[0]?.title}
                </Text>
              </TouchableOpacity>
            ) : null}
            <Text style={[styles.streamType,{color: colors.white,}]}>
              {formatDuration(item?.stream_duration || 0)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.dotContainer}>
        {posters?.map((_, i) => {
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                currentIndex === i ? { backgroundColor: '#FF5733' } : { backgroundColor: '#CCCCCC' }

              ]}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <Carousel
      data={posters}
      renderItem={renderItem}
      width={390}
      height={320}
      autoPlay={true}
      loop={true}
      autoPlayInterval={2000}
      pagingEnabled={true}
      mode="parallax"
      onSnapToItem={index => setCurrentIndex(index)}
      style={styles.carousel}
    />
  );
};

export default HomeCarousel;
