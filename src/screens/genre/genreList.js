import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useColorContext } from '../../services/state/colorsContext'; // Assuming correct import path

const GenreList = ({ listData, isVibes }) => {
  const navigation = useNavigation();
  const { colors } = useColorContext(); // Place the hook here inside the component

  const handlePressGenre = (id) => {
    navigation.navigate('streamByGenre', { id });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.white }]}>
        {isVibes === 'genre' ? 'Genres' : 'Vibes'}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {listData?.length > 0 &&
            listData.map((item) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item.code}
                style={styles.listItem}
                onPress={() => handlePressGenre(item.code)}
              >
                <FastImage source={{ uri: item.image }} style={[styles.img, { backgroundColor: colors.black }]} />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 5,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
});

export default GenreList;
