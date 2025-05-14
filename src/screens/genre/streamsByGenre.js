import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {getStreamsByGenre, getNextPage} from './genreStore';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../services/state/context';
import {useColorContext} from '../../services/state/colorsContext';
const StreamsByGenre = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route?.params;
  const [streamslist, setStreamslist] = useState([]);
  const [meta, setMeta] = useState({});
  const [genre, setGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const {state} = useAppContext();
  const {categoryType} = state;
  const {colors} = useColorContext();
  useEffect(() => {
    if (id) {
      getStreamsByGenre(
        id,
        setStreamslist,
        setLoading,
        setMeta,
        setGenre,
        categoryType,
      );
    }
  }, [id]);

  const loadNextPage = async () => {
    const currentPage = meta?.current_page;
    if (currentPage + 1 > meta?.last_page) {
      return;
    }
    if (id) {
      getNextPage(
        id,
        setStreamslist,
        setLoadingMore,
        setMeta,
        meta?.current_page + 1,
      );
    }
  };
  console.log("genre",genre)
  const renderItem = ({item}) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        activeOpacity={0.7}
        key={item.code}
        onPress={() => {
          navigation.navigate('Detailed', {id: item.code});
        }}>
        <Image source={{uri: item.poster}} style={[styles.img,{ backgroundColor: colors.black,}]} />
      </TouchableOpacity>
      <Text style={[styles.title,{color: colors.white,}]} numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  );
  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.goBack();
          }}>
          <IonIcon name={'chevron-back'} color={colors.white} size={30} />
        </TouchableOpacity>
        <Text style={[styles.heading,{ color: colors.white,}]}>
          {categoryType === 'genre'
            ? genre?.name
            : genre?.moodbased?.title?.name}
        </Text>
      </View>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size={'large'} color={colors.theme} />
        </View>
      )}
      {loadingMore && (
        <View style={styles.loadMore}>
          <ActivityIndicator size={'large'} color={colors.theme} />
        </View>
      )}

      {streamslist?.length > 0 && (
        <FlatList
          data={streamslist}
          keyExtractor={item => item.code}
          renderItem={renderItem}
          numColumns={2}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

export default StreamsByGenre;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
  
    paddingTop: 40,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
   
    marginVertical: 5,
    marginHorizontal: 5,
  },
  listItem: {
    width: '46%',
    height: 100,
    marginHorizontal: '2%',
    marginBottom: 40,
  },
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3.3,
    borderRadius: 5,
   
  },
  title: {
    fontSize: 12,
    
    fontWeight: '500',
    textAlign: 'center',
  },
  loadMore: {
    position: 'absolute',
    bottom: 0,
    marginLeft: '7%',
    width: '100%',
    zIndex: 1,
  },
});
