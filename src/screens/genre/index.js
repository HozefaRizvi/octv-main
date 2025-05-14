import React, {useState, useEffect} from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/header';
import GenreList from './genreList';
import {useAppContext} from '../../services/state/context';
import {getGenreData} from './genreStore';
import {getHomeData} from '../home/homeStore';
import { useColorContext } from '../../services/state/colorsContext';


const GenreIndex = () => {
  const navigation = useNavigation();
  const {state} = useAppContext();
  const {logo, categoryType, slug} = state;
  const {colors} = useColorContext();
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (categoryType === 'genre') {
          const response = await getGenreData();
          setListData(response?.genres || []);
        } else {
          const homeResponse = await getHomeData(slug);
          setListData(homeResponse?.moodbaseds || []);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryType, slug]);

  return (
    <View style={[styles.container,{ backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <Header logoUrl={logo} navigation={navigation} />
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.theme} />
          </View>
        ) : (
          <GenreList listData={listData}  isVibes={categoryType}/>
        )}
      </SafeAreaView>
    </View>
  );
};

export default GenreIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
