import React, {useState, useEffect, useCallback} from 'react';
import {View, StatusBar, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/header';
import {useAppContext} from '../../services/state/context';
import {getHomeData} from './homeStore';
import {styles} from './homeStyles';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { useColorContext } from '../../services/state/colorsContext';
import Home from './home';

const HomeIndex = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [posters, setPosters] = useState([]);
  const [category, setCategory] = useState([]);
  const {state} = useAppContext();
  const { colors } = useColorContext();
  const {logo, slug} = state;
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const homeResponse = await getHomeData(slug);
     
      setPosters(homeResponse?.featured_items?.streams);
      setCategory(homeResponse?.categories);
    } catch (error) {
      console.log('Error in get Home Data ', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    getData();
  }, [getData]);
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [getData]),
  );
  
  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <Header logoUrl={logo} navigation={navigation} />
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        ) : (
          <Home
            posters={posters}
            category={category}
            loading={loading}
            getData={getData}
          />
        )}
      </SafeAreaView>
    </View>
  );
};
export default HomeIndex;
