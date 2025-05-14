import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Linking, View, Image} from 'react-native';
// import {
//   widthPercentageToDP as w,
//   heightPercentageToDP as h,
// } from 'react-native-responsive-screen';
// import {colors} from '../../assets/colors';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
const Banner = ({visibleStreams}) => {
  const navigation = useNavigation();
  const [imgHeight, setHeight] = useState(0);
  const [imgWidth, setWidth] = useState(0);
  // const aspRatio = {aspectRatio: imgWidth / imgHeight};
  useEffect(() => {
    const getDimensions = () => {
      try {
        Image.getSize(visibleStreams[0]?.stream_poster, (width, height) => {
          if (width && height) {
            setHeight(height);
            setWidth(width);
            // setLoading(false);
          } else {
            console.log('Height width not found ');
          }
        });
      } catch (error) {
        console.log('Error on getting Dimensions', error);
      }
    };
    getDimensions();
  }, [visibleStreams]);

  const handlePressBanner = () => {
    if (
      visibleStreams[0]?.is_external_ad === 'Y' &&
      visibleStreams[0].stream_promo_url
    ) {
      Linking.openURL(visibleStreams[0].stream_promo_url)
        .then(data => {
          console.log('Banner Link is opened successfuly:');
        })
        .catch(error => {
          console.error('Error opening Banner Link:', error);
        });
    } else {
      navigation.navigate('Detailed', {id: visibleStreams[0].stream_promo_url});
    }
  };
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.banner}
        onPress={() => {
          handlePressBanner();
        }}>
        {imgHeight > 0 && imgHeight > 0 && (
          <FastImage
            source={{uri: visibleStreams[0]?.stream_poster}}
            resizeMode="contain"
            style={[styles.streamPoster, {aspectRatio: imgWidth / imgHeight}]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default Banner;
const styles = StyleSheet.create({
  banner: {
    width: '88%',
    // minHeight: 50,
    // maxHeight: 100,
    marginHorizontal: '6%',
    paddingHorizontal: 3,
    marginVertical: 4,
  },
  streamPoster: {
    width: '100%',
    height: undefined,
    borderRadius: 3,
  },
});
