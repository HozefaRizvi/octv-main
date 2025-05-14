import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';
import SearchInput from '../../components/inputs/searchInput';
import {useNavigation} from '@react-navigation/native';
import {fetchSearched} from '../../services/axios/apiManager';
import FastImage from 'react-native-fast-image';
import { useColorContext } from '../../services/state/colorsContext';
const Search = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
   const { colors } = useColorContext();
  const [loading, setLoading] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const onChangeQuery = async (value = '') => {
    setQuery(value);
    try {
      setLoading(true);
      if (value.length >= 3) {
        const response = await fetchSearched(query);
        if (response?.data?.search_result?.streams) {
          setSearchedData(response.data.search_result.streams);
        } else {
          setSearchedData([]);
        }
      } else {
        setSearchedData([]);
      }
    } catch (error) {
      console.log('Error in search', error);
    } finally {
      setLoading(false);
    }
  };
  const convertMins = (mins = 0) => {
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    if (hours > 0) {
      return `${hours} hour(s) and ${remainingMinutes} minute(s)`;
    } else {
      return `${remainingMinutes} minute(s)`;
    }
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.listItem}
      onPress={() => {
        navigation.navigate('Detailed', {
          id: item.stream_guid,
        });
      }}>
      <View style={styles.imgContainer}>
        <FastImage source={{uri: item.stream_poster}} style={[styles.img,{ backgroundColor: colors.black,}]} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.name,{ color: colors.theme,}]}>{item.stream_title}</Text>
        <Text style={[styles.time,{ color: colors.white,}]}>{convertMins(item.stream_duration)}</Text>
        <Text style={[styles.desc,{  color: colors.white,}]} numberOfLines={3}>
          {item.stream_description}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.container,{ backgroundColor: colors.dull,}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtnContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <IonIcon name={'chevron-back'} color={colors.white} size={28} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <SearchInput
              label={'Type min of 3 letters here'}
              value={query}
              setValue={value => onChangeQuery(value)}
            />
          </View>
        </View>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        )}
        <View style={styles.list}>
          {searchedData?.length > 0 && (
            <FlatList
              data={searchedData}
              keyExtractor={item => item.code}
              renderItem={renderItem}
              numColumns={1}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    paddingVertical: 20,
    paddingHorizontal: '7%',
  },
  safeArea: {
    flex: 1,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnContainer: {
    width: '10%',
  },
  inputContainer: {
    width: '90%',
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  imgContainer: {
    width: '45%',
  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3.3,
    borderRadius: 5,
   
  },
  detailsContainer: {
    width: '50%',
    paddingLeft: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
   
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
   
    marginVertical: 2,
  },
  desc: {
    fontSize: 9,
    fontWeight: '500',
  
  },
  loader: {
    alignItems: 'center',
  },
});
