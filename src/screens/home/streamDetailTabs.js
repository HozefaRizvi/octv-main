import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import {CastCrewChild} from './castCrew';
import Reviews from './review';
import {populateTabBar} from './homeStore';
import FastImage from 'react-native-fast-image';
import { appCode } from '../../services/axios/eps';
const StreamDetailTabs = ({
  movie = [],
  getData,
  handleRelatedStream,
  handleSeasonSelect,
  selectedSeason,
  video_rating,
  reviewRatingAverage,
  getMovieReviews,
  reviewNew,
}) => {
  const [currentTab, setCurrentTab] = useState(
    movie?.show ? 'Seasons' : 'Cast',
  );
  const [data, setData] = useState([]);
  useEffect(() => {
    const getBarData = async () => {
      const barData = await populateTabBar(movie, setData);
      setData(barData);
    };
    getBarData();
  }, [getData, movie]);
  const tabName = item => {
    if (item === 'Cast') {
      return 'Credits';
    } else if (item === 'Reviews') {
      return `Reviews (${movie?.reviews?.length || 0})`;
    } else {
      return item;
    }
  };
  const renderStreamItem = item => (
    <TouchableOpacity
      key={item.code}
      onPress={() => handleRelatedStream(item?.code)}>
      <FastImage source={{uri: item?.poster}} style={[styles.portraitImage,{backgroundColor: colors.black,}]} />
      <Text style={[styles.streamTitle3,{ color: colors.white,}]}>{item?.title}</Text>
    </TouchableOpacity>
  );
  const { colors } = useColorContext();
  //console.log("Movie Review ",movie?.reviews , "MOvie Ratings",movie?.rating_type ,"Movie Video Ratigns",movie?.video_rating)
  return (
    <View style={styles.container}>
      <View style={[styles.row,{ backgroundColor: appCode==='54137662273ec8298e3dfd76e8d2533a' ? colors.dull:colors.darkRed}]}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data
            ?.filter(item => item !== 'Reviews' || video_rating === 'Enable') 
            .map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tab, currentTab === item && styles.activeTab, { borderColor: colors.theme,}]}
                activeOpacity={0.7}
                onPress={() => {
                  setCurrentTab(item);
                }}>
                <Text
                  style={[
                    styles.tabTitle,{ color: colors.white,},
                    item === currentTab && styles.activeTabTitle,{color: appCode==='eRrgx2ZjqZzWpoIencXYM0a85g4H5ykG '? colors.white :  colors.theme},
                  ]}>
                  {tabName(item)}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      {currentTab === 'Seasons' && (
        <View style={styles.seasonSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movie?.show?.seasons?.map((season, index) =>
              season?.name ? (
                <TouchableOpacity
                  key={season?.code}
                  style={[
                    styles.seasonButton,{backgroundColor: colors.theme,},
                    selectedSeason.code === season?.code &&
                      styles.seasonButtonActive,{   backgroundColor: colors.black,},{  borderColor: colors.theme,}
                  ]}
                  onPress={() => handleSeasonSelect(season)}>
                  <Text style={[styles.seasonText,{color: colors.white,}]}>{season?.name}</Text>
                </TouchableOpacity>
              ) : null,
            )}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.episodesContainer}>
            {selectedSeason?.streams?.map(item => renderStreamItem(item))}
          </ScrollView>
        </View>
      )}
      {currentTab === 'You Might Also Like' && (
        <View style={styles.suggestedSection}>
          {/* <Text style={styles.suggestion}>You Might Also Like</Text> */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScrollView}>
            {movie?.relatedStreams.map(item => (
              <TouchableOpacity
                key={item.code}
                // style={styles.itemContainer}
                onPress={() => handleRelatedStream(item.code)}>
                <FastImage
                  source={{uri: item.poster}}
                  style={[styles.portraitImage,{backgroundColor: colors.black,}]}
                />
                <Text style={[styles.streamTitle3,{ color: colors.white,}]}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {currentTab === 'Cast' && (
        <View>
          <CastCrewChild
            expandable={false}
            sectionTitle={'Cast:'}
            infoText={movie?.cast}
            type={'cast'}
          />
          <CastCrewChild
            expandable={false}
            sectionTitle={'Writer:'}
            infoText={movie?.writers}
            type={'cast'}
          />
          <CastCrewChild
            expandable={false}
            sectionTitle={'Directors:'}
            infoText={movie?.directors}
            type={'cast'}
          />
          <CastCrewChild
            expandable={false}
            sectionTitle={'Producer:'}
            infoText={movie?.producers}
            type={'cast'}
          />
        </View>
      )}
      {currentTab === 'Languages' && (
        <CastCrewChild
          expandable={false}
          // sectionTitle={'Language:'}
          infoText={movie?.languages}
          type={'language'}
        />
      )}
      {currentTab === 'Advisories' && (
        <CastCrewChild
          expandable={false}
          // sectionTitle={'Advisory:'}
          infoText={movie?.advisories}
          type={'advisory'}
        />
      )}
      {currentTab === 'Tags' && (
        <CastCrewChild
          expandable={false}
          // sectionTitle={'Tags:'}
          infoText={movie?.tags}
          type={'tags'}
        />
      )}
      {currentTab === 'Genre' && (
        <CastCrewChild
          expandable={false}
          // sectionTitle={'Genre:'}
          infoText={movie?.genre}
          type={'genre'}
        />
      )}
      {currentTab === 'Reviews' &&
        (movie?.reviews && movie?.rating_type ? (
          <Reviews
            canReview={movie?.video_rating || 'Disable'}
            reviews={reviewNew || []}
            ratingType={movie?.rating_type || 'stars'}
            streamId={movie?.code}
            getData={getMovieReviews}
            reviewRatingAverage={reviewRatingAverage}
          />
        ) : null)}
    </View>
  );
};
export default StreamDetailTabs;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: '3%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  // activeTabTitle: {
  // },
  seasonSection: {
    padding: 3,
    marginTop: 5,
    marginLeft: '7%',
  },
  seasonButton: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  seasonButtonActive: {
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  episodesContainer: {
    marginTop: 20,
    marginBottom: 5,
  },
  suggestedSection: {
    padding: 5,
    marginTop: 5,
  },
  suggestionsScrollView: {
    marginVertical: 15,
  },
  portraitImage: {
    width: 160,
    height: undefined,
    borderRadius: 5,
    aspectRatio: 6 / 3.4,
    marginHorizontal: 5,
  },
  streamTitle3: {

    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 23,
  },
});
