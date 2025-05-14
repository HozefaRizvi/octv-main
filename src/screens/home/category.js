import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import StreamItem from './streamItem';
import {colors} from '../../assets/colors';
import Banner from './banners';
import {useNavigation} from '@react-navigation/native';
import { useColorContext } from '../../services/state/colorsContext';
import {FlatList} from 'react-native-gesture-handler';
const Category = ({category}) => {
  const navigation = useNavigation();
  const {colors} = useColorContext();
  const isBasic = category?.card_type === 'BA';
  const visibleStreams = category?.streams?.length > 0 ? category?.streams : [];
  const handlePress = item => {
    navigation.navigate('AllCategory', {id: item});
  };
  return (
    <View key={category?.cat_guid} style={styles.categoryContainer}>
      {isBasic ? (
        visibleStreams?.length > 0 && <Banner visibleStreams={visibleStreams} />
      ) : (
        <View>
          <View style={styles.categoryHeader}>
            <Text style={[styles.categoryTitle,{  color: colors.white,}]}>{category?.cat_title}</Text>
            {category?.is_show_view_more === 'Y' && (
              <TouchableOpacity onPress={() => handlePress(category?.cat_guid)}>
                <Text style={[styles.viewAll,{ color: colors.theme,}]}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.itemsRow}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={visibleStreams}
              keyExtractor={item => item.stream_guid}
              renderItem={({item, index}) => (
                <StreamItem
                  showBar={
                    category?.cat_title === 'Continue Watching' ? true : false
                  }
                  key={item?.stream_guid}
                  item={item}
                  cardType={category?.card_type}
                  isTopTen={category?.is_top10 === 'Y'}
                  index={index}
                />
              )}
            />
          
          </View>
        </View>
      )}
    </View>
  );
};

export default Category;
const styles = StyleSheet.create({
  categoryContainer: {
    // marginTop: 5,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  
  },
  viewAll: {
    fontSize: 14,
   
  },
  itemsRow: {
    marginLeft: '6.5%',
  },
});
