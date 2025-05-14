import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import WatchedBar from '../../components/watchedBar';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {fetchWatchHistory} from '../../services/axios/apiManager';
import FastImage from 'react-native-fast-image';

const WatchHistory = () => {
  const navigation = useNavigation();
  const [watchHistory, setWatchHistory] = useState([]);
  const { colors } = useColorContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getWatchHistory = async () => {
      try {
        const response = await fetchWatchHistory();
        if (response?.data?.app?.streams) {
          setWatchHistory(response.data.app.streams);
        }
      } catch {
        err => {
          console.log('Error on Watch histroy', err);
        };
      } finally {
        setLoading(false);
      }
    };
    getWatchHistory();
  }, []);
  const handlePresItem = item => {
    navigation.navigate('Detailed', {id: item});
  };
  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.main}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <IonIcon name={'chevron-back'} color={colors.white} size={30} />
        </TouchableOpacity>
        <View style={styles.centeredView}>
         
          <Text style={[styles.heading,{color: colors.theme,}]}>Watch History</Text>
        </View>
      </View>
      <View style={[styles.list,{backgroundColor: colors.dull,}]}>
        {loading && <ActivityIndicator color={colors.theme} size={'large'} />}
        {!loading && watchHistory && watchHistory.length <= 0 && (
          <View style={styles.noDataView}>
            <Text style={[styles.noDataTxt,{color: colors.theme,}]}>
              You dont have any watch history yet!
            </Text>
          </View>
        )}
        <ScrollView>
          {watchHistory &&
            watchHistory.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.listItem,{borderBlockColor: colors.gray,}]}
                onPress={() => handlePresItem(item.stream_guid)}
                key={index}>
                <View style={styles.imgSection}>
                  <FastImage
                    source={{uri: item.stream_poster}}
                    style={[styles.img, {backgroundColor: colors.black,}]}
                  />
                  <WatchedBar
                    total={item.stream_duration}
                    watched={item.stream_watched_dur_in_pct}
                  />
                </View>
                <View style={styles.detailsSection}>
                  <Text style={[styles.title,{color: colors.white,}]}>{item.stream_title}</Text>
                  <View style={styles.row}>
                    <Text style={[styles.details,{color: colors.white,}]}>{item.year}</Text>
                    <View style={[styles.dot,{backgroundColor: colors.white,}]} />
                    <Text
                      style={
                        styles.details
                      }>{`${item.stream_duration} mins`}</Text>
                    <View style={[styles.dot,{backgroundColor: colors.white,}]} />
                    <Text style={[styles.details,{color: colors.white,}]} numberOfLines={2}>
                      {item.stream_episode_title}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.box, {borderColor: colors.theme,}]}>
                      <Text style={[styles.details,{color: colors.white,}]}>{item.content_qlt}</Text>
                    </View>
                    <View style={[styles.box, {borderColor: colors.theme,}]}>
                      <Text style={[styles.details,{color: colors.white,}]}>{item.content_rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default WatchHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    marginTop: '20%',
    marginHorizontal: '7%',
  },
  centeredView: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  logo: {
    height: 100,
    width: 115,
    marginVertical: 10,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginVertical: 20,
  },
  list: {
    flex: 1,
    padding: '7%',
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 5,
    borderBottomWidth: 0.5,
    paddingVertical: 2,
  },
  imgSection: {
    width: '40%',
    height: 80,
  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3.3,
    borderRadius: 5,
  },
  detailsSection: {
    width: '60%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  details: {
    fontSize: 11,
  },
  dot: {
    height: 6,
    width: 6,
    marginHorizontal: 10,
    borderRadius: 3,
    marginTop: 1,
  },
  box: {
    marginRight: 5,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataTxt: {
    fontSize: 15,
  },
});
