import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import {getStreamsByRating, getNextPageByRating} from './homeStore';
const Rating = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const [rating, setRating] = useState();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [meta, setMeta] = useState({});
  const { colors } = useColorContext();

  useEffect(() => {
    getStreamsByRating(id, setRating, setStreams, setLoading, setMeta);
  }, [id]);

  const handleLoadMore = async () => {
    const currentPage = meta?.current_page;
    if (currentPage + 1 > meta?.last_page) {
      return;
    }
    if (id && !loading) {
      await getNextPageByRating(
        id,
        setStreams,
        setLoadingMore,
        setMeta,
        meta?.current_page + 1,
      );
    }
  };
  const handlePress = item => {
    navigation.navigate('Detailed', {id: item});
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        handlePress(item?.code);
      }}>
      <Image source={{uri: item?.poster}} style={[styles.image,{backgroundColor: colors.black,}]} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container,{    backgroundColor: colors.black,}]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
          style={styles.header}>
          <View>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backButton}
            />
          </View>
          <Text style={[styles.headerText,{    color: colors.white,}]}>{rating?.title}</Text>
        </TouchableOpacity>
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
        <FlatList
          data={streams}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          numColumns={2}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    // backgroundColor:'pink'
  },
  itemContainer: {
    marginHorizontal: '1.66%',
    marginVertical: 10,
    height: 100,
    width: '47.5%',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3.3,
    borderRadius: 5,
  },
  txt: {

    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMore: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 1,
  },
});

export default Rating;
