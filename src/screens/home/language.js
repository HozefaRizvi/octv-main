import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import {getNextPageByLanguage, getStreamsByLanguage} from './homeStore';

const Language = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const [qdata, setQdata] = useState();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { colors } = useColorContext();
  const [meta, setMeta] = useState({});
  useEffect(() => {
    getStreamsByLanguage(id, setQdata, setStreams, setLoading, setMeta);
  }, [id]);

  const handleLoadMore = async () => {
    const currentPage = meta?.current_page;
    if (currentPage + 1 > meta?.last_page) {
      return;
    }
    if (id && !loading) {
      await getNextPageByLanguage(
        id,
        setStreams,
        setLoadingMore,
        setMeta,
        meta?.current_page + 1,
      );
    }
  };
  const handlePress = item => {
    navigation.push('Detailed', {id: item});
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
    <View style={[styles.container,{ backgroundColor: colors.black,}]}>
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
        <Text style={[styles.headerText,{color: colors.white,}]}>{qdata?.title}</Text>
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
        <FlatList
          data={streams}
          renderItem={renderItem}
          keyExtractor={item => item.code.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </SafeAreaView>
    </View>
  );
};

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

export default Language;
