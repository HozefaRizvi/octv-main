import React, {useEffect, useRef, useState} from 'react';
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
import {Dropdown} from 'react-native-element-dropdown';
import { appCode } from '../../services/axios/eps';
const SeriesDetailTabs = ({
  movie = [],
  getData,
  handleRelatedStream,
  handleSeasonSelect,
  selectedSeason,
  selectedEpisode,
  setSelectedEpisode,
  handleSelectedEpisode,
}) => {
  // console.log('move in series detail', movie);
  const [currentTab, setCurrentTab] = useState(
    movie ? 'Seasons' : 'Cast', // Removed extra nesting
  );
  const [data, setData] = useState(['Seasons']);
  const [episodes, setEpisodes] = useState(movie?.app?.seasons);

  // console.log('data',episodes)
  useEffect(() => {
    const getBarData = async () => {
      const barData = await populateTabBar(movie, setData); // Pass only `movie`
      setData(barData); // Set the returned array
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
      onPress={() => handleRelatedStream(item.code)}>
      <FastImage source={{uri: item.poster}} style={[styles.portraitImage,{backgroundColor: colors.black,}]} />
      <Text style={[styles.streamTitle3,{ color: colors.white,}]}>
        {item?.title?.length > 25
          ? `${item.title.slice(0, 25)}...`
          : item?.title}
      </Text>
    </TouchableOpacity>
  );
  const dropDownRef = useRef();

  const [value, setValue] = useState(null);
  const seasonOptions = movie?.app?.seasons?.map(season => ({
    label: season.season_title,
    value: season.season_guid,
    episodes: season.episodes,
  }));
  const { colors } = useColorContext();
  return (
    <View style={styles.container}>
      <View style={[styles.row,{   backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed:colors.theme,}]}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, currentTab === item && styles.activeTab,{borderColor: colors.white,}]}
              activeOpacity={0.7}
              onPress={() => {
                setCurrentTab(item);
              }}>
              <Text
                style={[
                  styles.tabTitle, {color: colors.description,},
                  item === currentTab && styles.activeTabTitle,{  color: colors.white,}
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
            {movie?.app?.seasons && (
              <Dropdown
                data={seasonOptions}
                labelField="label"
                valueField="value"
                placeholder={value ? 'Select item' : seasonOptions[0]?.label}
                style={[
                  {
                    borderWidth: 1,
                    borderColor: colors.white,
                    borderRadius: 5,
                    padding: 3,
                    width: 200,
                  },
                ]}
                itemTextStyle={{color: colors.theme}}
                placeholderStyle={{
                  color: colors?.white,
                }}
                selectedTextStyle={{color: colors.theme}}
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                  setValue(item.value);
                  handleSeasonSelect(item);
                }}
              />
            )}
          </ScrollView>
          {selectedSeason && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.episodesContainer}>
              {selectedSeason?.episodes?.map(episode => (
                <TouchableOpacity
                  key={episode.stream_guid}
                  onPress={() => {
                    setSelectedEpisode(episode);
                    // handleSelectedEpisode();
                  }}>
                  <FastImage
                    source={{uri: episode.stream_poster}}
                    style={[styles.portraitImage,{backgroundColor: colors.black,}]}
                  />
                  <Text style={[styles.streamTitle3,{ color: colors.white,}]}>
                    {episode.stream_title.length > 25
                      ? `${episode.stream_title.slice(0, 25)}...`
                      : episode.stream_title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
            reviews={movie?.reviews || []}
            ratingType={movie?.rating_type || 'stars'}
            streamId={movie?.code}
            getData={getData}
          />
        ) : null)}
    </View>
  );
};
export default SeriesDetailTabs;
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
  activeTabTitle: {
  },
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
    backgroundColor: 'transparent',
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