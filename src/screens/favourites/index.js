import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useAppContext} from '../../services/state/context';
import {useNavigation} from '@react-navigation/native';
import { useColorContext } from '../../services/state/colorsContext';
import {fetchFavsData} from '../../services/axios/apiManager';
const FavoriteIndex = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [favData, setFavData] = useState([]);
  const { colors } = useColorContext();
  const {state} = useAppContext();
  const {user} = state;
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        console.log('User not found');
      } else {
        const data = {
          requestAction: 'getFavItemInfo',
          userCode: user.user_code,
        };
        const response = await fetchFavsData(data);
        if (response?.app?.length > 0) {
          setFavData(response?.app);
        }
      }
    } catch (error) {
      console.log('Error in get Movies Data ', error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    getData();
  }, [getData]);
  const onRemoveStream = streamGuid => {
    Alert.alert('Alert', 'Do you want to remove this Stream?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => removeData(streamGuid),
      },
    ]);
  };

  const removeData = async streamGuid => {
    try {
      const data = {
        requestAction: 'removeFavitem',
        streamGuid: streamGuid,
        userCode: user.user_code,
      };
      const response = await fetchFavsData(data);
      const {status, msg} = response.app;
      if (status === 1) {
        Alert.alert('Success', msg || 'Stream removed successfully');
        getData();
      } else {
        Alert.alert('Error', 'Failed to remove stream');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      Alert.alert('Error', 'An error occurred while removing from favorites');
    }
  };
  const handlePress = item => {
    navigation.push('Detailed', {id: item});
  };
  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, {color: colors.white,}]}>Favourites</Text>
        </View>
        {!loading && favData?.length <= 0 && (
          <View style={styles.noData}>
            <Text style={[styles.noDataTxt,{color: colors.white,}]}>
              No favorite items found for this user.
            </Text>
          </View>
        )}
        {loading && (
          <View style={styles.noData}>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.listContainer}>
            {favData?.length > 0 &&
              favData.map(item => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={item.code}
                  style={styles.listItem}
                  onPress={() => {
                    handlePress(item.code);
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.rmBtnContainer,{backgroundColor: colors.white,}]}
                    onPress={() => {
                      onRemoveStream(item.code);
                    }}>
                    <EntypoIcon name={'minus'} color={colors.black} size={20} />
                  </TouchableOpacity>
                  <Image source={{uri: item?.poster}} style={[styles.img,{backgroundColor: colors.black,}]} />
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default FavoriteIndex;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: h('5%'),
  },
  backButton: {
    width: 10,
    height: 17,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  list: {
    padding: 10,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  rmBtnContainer: {
    position: 'absolute',
    zIndex: 2,
    right: -5,
    top: 0.5,
    height: 23,
    width: 23,
    borderRadius: 11.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    width: '46%',
    height: 100,
    marginHorizontal: '2%',
    marginBottom: 20,
  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3.8,
    borderRadius: 5,
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataTxt: {
    fontSize: 18,
    fontWeight: '500',
  },
});
