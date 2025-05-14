import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Dimensions,
  Platform,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import FastImage from 'react-native-fast-image';
import WatchedBar from '../../components/watchedBar';
import PremiumIcon from '../../components/streamIcon';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../services/state/context';

const width = Dimensions.get('screen').width;

const StreamItem = ({ isTopTen, index, item, cardType, showBar = false }) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigation = useNavigation();
  const { state } = useAppContext();
  const { byPassDetailScreen } = state;
  const { colors } = useColorContext();

  const handlePress = () => {
   
    if (item.stream_type === 'A') {
      if (item.is_external_ad === 'N') {
        if (byPassDetailScreen || item?.bypass_detailscreen === "1") {
          navigation.navigate('playerStack', {
            screen: 'mainPlayer',
            params: {
              id: item?.stream_guid,
            },
          });
        } else {
          navigation.navigate('Detailed', {
            id: item.stream_promo_url,
          });
        }
      } else if (item.is_external_ad === 'Y') {
        Linking.openURL(item.stream_promo_url).catch(err =>
          console.error('Failed to open URL', err),
        );
      }
    } else if (item.stream_type === 'S'  && item.contentType !== 'episode') {
      if (byPassDetailScreen || item?.bypass_detailscreen === "1") {
        navigation.navigate('playerStack', {
          screen: 'mainPlayer',
          params: {
            id: item?.stream_guid,
          },
        });
      } else {
        navigation.navigate('DetailedSeries', { id: item.stream_guid });
      }
    } else {
      if (byPassDetailScreen || item?.bypass_detailscreen === "1") {
        navigation.navigate('playerStack', {
          screen: 'mainPlayer',
          params: {
            id: item?.stream_guid,
          },
        });
      } else {
        navigation.navigate('Detailed', { id: item.stream_guid });
      }
    }
  };

  const getContainerStyle = () => {
    if (isTopTen) return styles.itemContainer;
    switch (cardType) {
      case 'LA':
        return styles.landScapeContainer;
      case 'PO':
        return styles.portraitContainer;
      case 'ST':
        return styles.standardContainer;
      default:
        return styles.squareContainer;
    }
  };

  const getInnerStyle = () => {
    let baseStyle;
    switch (cardType) {
      case 'LA':
        baseStyle = styles.landScape;
        break;
      case 'PO':
        baseStyle = styles.portrait;
        break;
      case 'ST':
        baseStyle = styles.standard;
        break;
      default:
        baseStyle = styles.square;
    }
    return StyleSheet.flatten([baseStyle, isTopTen && styles.itemImage, { overflow: 'hidden' }]);
  };

  const getImageStyle = () => {
    switch (cardType) {
      case 'LA':
        return styles.landscapeImage;
      case 'PO':
        return styles.portraitImage;
      case 'ST':
        return styles.standardImage;
      default:
        return styles.squareImage;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container,{marginHorizontal: isTopTen ? 5 : 5}]}
      key={item?.stream_guid}
      onPress={handlePress}
    >
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color={colors.theme} />
        </View>
      )}
      <View style={getContainerStyle()}>
        {isTopTen && (
          <View style={[styles.num,{marginRight:Platform.OS==='android'? 5:0}]}>
            <Text style={[styles.streamNumber, { color: colors.lightGray }]}>
              {index + 1}
            </Text>
          </View>
        )}
        <View>
          <PremiumIcon item={item} />
          <View style={getInnerStyle()}>
            <FastImage
              source={
                hasError
                  ? require('../../assets/images/default.jpg')
                  : { uri: item?.stream_portrait || item?.stream_poster }
              }
              resizeMode="contain"
              style={getImageStyle()}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setHasError(true);
              }}
            />
            {showBar && (
              <View style={[styles.watchedBar, { backgroundColor: colors.lightGray }]}>
                <WatchedBar watched={item?.stream_watched_dur_in_pct || 0} />
              </View>
            )}
          </View>
          {item?.stream_title && (
            <Text
              style={[styles.streamTitle, { color: colors.white }]}
              numberOfLines={1}
            >
              {item?.stream_title}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StreamItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 5
  },
  landScapeContainer: {
    height: 130,
    width: (width / 100) * 48,
    alignItems: 'center',
    borderRadius: 5,
  },
  portraitContainer: {
    height: 175,
    width: (width / 100) * 28,
    alignItems: 'center',
    borderRadius: 5,
  },
  standardContainer: {
    height: 120,
    width: (width / 100) * 33,
    alignItems: 'center',
    borderRadius: 5,
  },
  squareContainer: {
    height: 130,
    width: (width / 100) * 33,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  landScape: {
    height: 110,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  portrait: {
    height: 155,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  standard: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  square: {
    height: 120,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  itemImage: {
    height: 75,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeImage: {
    width: '100%',
    borderRadius: 5,
    aspectRatio: 16 / 9.2,
    zIndex: 2,
  },
  portraitImage: {
    width: '100%',
    borderRadius: 5,
    aspectRatio: 2.1 / 2.92,
    zIndex: 2,
  },
  standardImage: {
    width: '100%',
    borderRadius: 5,
    aspectRatio: 8 / 6,
    zIndex: 2,
  },
  squareImage: {
    width: '100%',
    borderRadius: 5,
    aspectRatio: 1 / 1,
    zIndex: 2,
  },
  watchedBar: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
    zIndex: 10,
    width: '90%',
  },
  num: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '65%',
    
  },
  streamNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    width: 168,
    justifyContent: 'center',
  },
  streamTitle: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 12,
  },
  loader: {
    position: 'absolute',
    zIndex: 5,
  },
});
