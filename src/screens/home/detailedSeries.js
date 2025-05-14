import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { styles } from './detailStyles';
import VideoPlayer from './videoPlayer';
import { useColorContext } from '../../services/state/colorsContext';
import StreamDetailTabs from './streamDetailTabs';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import LoginAlert from '../../components/authorizeAlert';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppContext } from '../../services/state/context';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShareModal from '../../components/modals/shareModal';
import { fetchFavsData, fetchStreamData,fetchStreamSeriesData } from '../../services/axios/apiManager';
import axios from 'axios';
import SeriesDetailTabs from './seriesDetailTabs';
import { appCode } from '../../services/axios/eps';
const DetailedSeries = ({ navigation }) => {
  const route = useRoute();

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [stream, setStream] = useState([]);
  const [trailerEnded, setTrailerEnded] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorite, setAddingToFavorite] = useState(false);
  const { state, setState } = useAppContext();
  const { user, isTrailerPaused } = state;
  const [seasons,setSeasons] = useState([])
  const [selectedEpisode,setSelectedEpisode]= useState(null);
  const { colors } = useColorContext();
  
  const [genres,setGenres] = useState([])
  const setIsPaused = useCallback(
    bit => {
      setState(prev => ({ ...prev, isTrailerPaused: bit }));
    },
    [setState],
  );
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      
      const StreamResponse = await fetchStreamSeriesData(route?.params?.id);
      // console.log('@@@@',StreamResponse?.data?.app?.seasons)
      setSeasons(StreamResponse.data?.seasons)
      setMovie(StreamResponse?.data);
      setStream(StreamResponse?.data?.relatedStreams);
      setSelectedSeason(StreamResponse?.data?.app?.seasons?.[0]);
      setIsFavorite(StreamResponse?.data?.is_mylist || false);
    } catch (error) {
      console.log('Error in get Data detail screen', error);
    } finally {
      setLoading(false);
      setIsPaused(false);
    }
  }, [route.params.id, setIsPaused,]);
  useEffect(() => {
    getData();
    setGenres(movie?.app.series_details.genre)
  }, [getData, setIsPaused]);
  useEffect(()=>{
    if(selectedEpisode)
    {
    navigation.navigate('Detailed', {id: selectedEpisode?.stream_guid});
    }
  },[selectedEpisode])
  const getFavData = async () => {
    try {
      setAddingToFavorite(true);
      const data = {
        requestAction: 'addFavItem',
        streamGuid: route.params.id,
        userCode: user.user_code,
      };
      const response = await fetchFavsData(data);
      const { status, msg } = response?.app;
      if (status === 1) {
        Alert.alert('Success', msg || 'Stream added to favorites successfully');
        setIsFavorite(true);
        setAddingToFavorite(false);
        await getData();
      } else {
        Alert.alert('Alert', 'Stream Already exist');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Error', 'An error occurred while adding to favorites');
    } finally {
      setAddingToFavorite(false);
    }
  };
  // const convertMins = (timeString = '') => {
  //   const minutes = parseInt(timeString, 10);
  //   const hours = Math.floor(minutes / 60);
  //   const remainingMinutes = minutes % 60;
  //   console.log('minutes: ',minutes, 'hour: ',hours, 'remaing ',remainingMinutes)

  //   if (hours > 0 && remainingMinutes > 0) {
  //     return `${hours} Hour${hours > 1 ? 's' : ''} ${remainingMinutes} Minute${remainingMinutes !== 1 ? 's' : ''
  //       }`;
  //   } else if (hours > 0) {
  //     return `${hours} Hour${hours > 1 ? 's' : ''}`;
  //   } else {
  //     return `${remainingMinutes} Minute${remainingMinutes !== 1 ? 's' : ''}`;
  //   }
  // };
  const convertMins = (timeString = '') => {
    const minutes = parseInt(timeString, 10);

    // Validate the input; if invalid, default to 0
    if (isNaN(minutes) || minutes < 0) {
        return '0 Minutes';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
        return `${hours} Hour${hours > 1 ? 's' : ''} ${remainingMinutes} Minute${remainingMinutes !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} Hour${hours > 1 ? 's' : ''}`;
    } else {
        return `${remainingMinutes} Minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
};

  const handlePress = item => {
    setIsPaused(true);
    navigation.navigate('MultiObjects', { id: item });
  };
  const handlePlay = item => {
    navigation.navigate('playerStack', {
      screen: 'mainPlayer',
      params: {
        id: item,
      },
    });
    setIsPaused(true);
  };
  const handleQualityPress = item => {
    setIsPaused(true);
    navigation.navigate('Quality', { id: item });
  };
  const handleRatingPress = item => {
    setIsPaused(true);
    navigation.navigate('Rating', { id: item });
  };
  const handleRelatedStream = item => {
    setIsPaused(true);
    navigation.navigate('Series', { id: item });
  };
  const handleVideoEnd = () => {
    setTrailerEnded(true);
  };
  const handleSeasonSelect = season => {
    console.log("Season Selected",season)
    setSelectedSeason(season);
  };
  const handleSelectedEpisode =() => {
    console.log("selected episode",selectedEpisode)
  };
  const { handlePress: handleMyListPress } = LoginAlert({
    onProceed: () => {
      getFavData();
      console.log('Item added to My List');
    },
  });
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsPaused(false);
  //   }, [setIsPaused]),
  // );
//   console.log('movie trailer: ',movie)
//   console.log('stream: ',stream)
// console.log('series',movie?.app.series_details);
// console.log('seasons selected',selectedSeason)
const genreTitles = movie?.app.series_details.genre?.map(item => item.title);
  // console.log('selected season', selectedSeason)
  return (
    <View style={[styles.container,{ backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
        {/* <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={{alignItems:'center', backgroundColor: colors.background, padding: 10, flexDirection: 'row', width: '100%', paddingVertical: 20 }}>
          <Image
            source={require('../../assets/images/back.png')}
            resizeMode="contain"
            style={{ height: 18, width: 18,tintColor:colors.theme }}
          />
          <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.movieTitle, { textAlign: 'center', alignSelf: 'center', flex: 1, fontSize: 22}]}>{movie?.title}</Text>
        </TouchableOpacity> */}
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        ) : (
          <ScrollView nestedScrollEnabled={true}>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={{alignItems:'center',position:'absolute',zIndex:10,padding:5,top:trailerEnded ? 20 : 2,left:2}}>
          <Image
            source={require('../../assets/images/back.png')}
            resizeMode="contain"
            style={{ height: 25, width: 25,tintColor:colors.white }}
          />
          </TouchableOpacity>
            {/* Top Section with Poster */}
            {/* {!trailerEnded && movie?.trailer_url ? (
              <VideoPlayer
                trailerUrl={movie?.trailer_url}
                poster={movie?.poster}
                onVideoEnd={handleVideoEnd}
                movieTitle={movie?.title}
                movieDuration={movie?.duration}
                releaseDate={movie?.released_date}
                movieCode={movie?.code}
                rating={movie?.contentRating?.title}
                quality={movie?.streamQuality?.title}
                ratingCode={movie?.contentRating?.code}
                qualityCode={movie?.streamQuality?.code}
                share={movie?.share_url}
                isPaused={isTrailerPaused}
                setIsPaused={setIsPaused}
              />
            ) : ( */}
              <ImageBackground
                source={{ uri: movie?.app.series_details.stream_poster }}
                style={styles.posterBackground}
                resizeMode="contain">
                {/* <View style={styles.topOverlay}>
                  <TouchableOpacity onPress={() => navigation.pop()}>
                    <Image
                      source={require('../../assets/images/back.png')}
                      style={styles.backButton}
                    />
                  </TouchableOpacity>
                </View> */}
              </ImageBackground>
            {/* )} */}
            <View style={styles.recBackground}>
              {movie?(
                <View style={styles.detailsContainer}>
                  <Text style={[styles.movieTitle,{color: colors.white,}]}>{movie?.app.series_details.stream_title}</Text>
                </View>
              ) : null}
              <View style={styles.durationBox}>
                {movie? (
                  <TouchableOpacity
                    onPress={() => handlePress(movie?.app.series_details.totalseason)}>
                    <Text style={[styles.movieDate,{ color: colors.white,}]}>{movie?.app.series_details.totalseason}</Text>
                  </TouchableOpacity>
                ) : null}
                {movie? (
                <View style={styles.movieDetails2}>
                  <Text style={[styles.movieSubTitle,{color: colors.white,}]}>{genreTitles?.join(", ")}</Text>
                </View>
                ): null}
                {movie?.app.series_details?.content_qlt ?(
                  <TouchableOpacity
                    style={[styles.hDButton,{backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed: colors.theme,}]}
                    onPress={() =>
                      handleQualityPress(movie?.app.series_details?.content_qlt_codes)
                    }>
                    <Text style={[styles.boxStyle,{color: colors.white,}]}>
                      {movie?.app.series_details?.content_qlt}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {movie?.app.series_details?.content_rating ? (
                  <TouchableOpacity
                    style={[styles.pGButton,{backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed: colors.theme,}]}
                    onPress={() =>
                      handleRatingPress(movie?.app.series_details?.content_rating_codes)
                    }>
                    <Text style={[styles.boxStyle,{color: colors.white,}]}>
                      {movie?.app.series_details?.content_rating}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {movie? (
                <TouchableOpacity
                  style={[styles.playButton,{backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed: colors.theme,}]}
                  onPress={() => {
                    handlePlay(movie?.app?.series_details?.episode_code)
                  }}>
                  <View style={styles.iconContainer}>
                    <Icon name="play" size={25} color={colors.white} />
                    <Text style={[styles.playText,{color: colors.white,}]}>Play</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            {movie? (
              <View style={styles.description}>
                <Text style={[styles.Overview2,{color: colors.white,}]}>{movie?.app.series_details.stream_description}</Text>
              </View>
            ) : null}
            <View style={styles.shareBox}>
              <TouchableOpacity
                style={styles.sharebtn}
              onPress={handleMyListPress}
              >
                <View style={styles.iconSection}>
                  {addingToFavorite ? (
                    <ActivityIndicator size={'small'} color={colors.theme} />
                  ) : isFavorite ? (
                    <Feather
                      name={'minus-circle'}
                      color={colors.theme}
                      size={20}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/list.png')}
                      style={styles.shareButton}
                    />
                  )}
                </View>
                <Text style={[styles.shareTxt,{color: colors.white,}]}>MY List</Text>
              </TouchableOpacity>
              {movie? (
                <TouchableOpacity
                  style={styles.sharebtn}
                  onPress={() => {
                    setShareModalVisible(true);
                  }}>
                  <View style={styles.iconSection}>
                    <Feather name="send" size={19} color={colors.theme} />
                  </View>
                  <Text style={[styles.shareTxt,{color: colors.white,}]}>Share</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {movie && (
              <SeriesDetailTabs
                movie={movie}
                getData={getData}
                handleSeasonSelect={handleSeasonSelect}
                handleRelatedStream={handleRelatedStream}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
                setSelectedEpisode={setSelectedEpisode}
                handleSelectedEpisode={handleSelectedEpisode}
               
              />
            )}
          </ScrollView>
        )}
        <ShareModal
          visible={isShareModalVisible}
          onClose={() => setShareModalVisible(false)}
          shareUrl={movie?.share_url}
        />
      </SafeAreaView>
    </View>
  );
};

export default DetailedSeries;