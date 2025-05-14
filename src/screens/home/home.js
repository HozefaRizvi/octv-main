import React from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { styles } from './homeStyles';
import HomeCarousel from './homeCarousel';
import Category from './category';
import CustomCarousel from '../../components/customCarousel';
import { useColorContext } from '../../services/state/colorsContext';

const Home = ({ posters, category, loading, getData }) => {
  const hasPosters = posters?.length > 0;
  const hasCategory = category?.some(cat => cat.streams && cat.streams.length > 0);
  const { colors } = useColorContext();

  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <ScrollView
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getData}
            tintColor={colors.theme}
            colors={[colors.theme]}
          />
        }
      >
        {hasPosters && <CustomCarousel posters={posters} getData={getData} />}
        {/* {hasPosters && <HomeCarousel posters={posters} />} */}
        {hasCategory &&
          category
            .filter(cat => cat.streams && cat.streams.length > 0)
            .map(cat => <Category key={cat.cat_guid} category={cat} />)}

        {!hasPosters && !hasCategory && (
          <View style={{ alignSelf: 'center', marginTop: '50%' }}>
            <Text style={{ fontSize: 30, color: colors.theme }}>Nothing Found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
