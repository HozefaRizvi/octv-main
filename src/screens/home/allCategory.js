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
import {colors} from '../../assets/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {getNextPageByCategory, getStreamsByCategory} from './homeStore';
import { useColorContext } from '../../services/state/colorsContext';
const AllCategory = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const [qdata, setQdata] = useState();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [meta, setMeta] = useState({});
  const { colors } = useColorContext();

  useEffect(() => {
    getStreamsByCategory(id, setQdata, setStreams, setLoading, setMeta);
  }, [id]);

  const handleLoadMore = async () => {
    const currentPage = meta?.current_page;
    if (currentPage + 1 > meta?.last_page) {
      return;
    }
    if (id && !loading) {
      await getNextPageByCategory(
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
      <FastImage source={{uri: item?.poster}} style={[styles.image,{ backgroundColor: colors.black,}]} />
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
          <Text style={[styles.headerText,{color: colors.white,}]}>{qdata?.cat_title}</Text>
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
          keyExtractor={(item, index) => index}
          numColumns={2}
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
    paddingHorizontal: '5%',
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
  itemContainer: {
    marginHorizontal: 5,
    marginVertical: 7,
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

export default AllCategory;
