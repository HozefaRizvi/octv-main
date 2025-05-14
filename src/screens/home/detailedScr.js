import React, {useState, useEffect, useCallback} from 'react';
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
import {styles} from './detailStyles';
import VideoPlayer from './videoPlayer';
import { useColorContext } from '../../services/state/colorsContext';
import StreamDetailTabs from './streamDetailTabs';
import {useRoute, useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import LoginAlert from '../../components/authorizeAlert';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {useAppContext} from '../../services/state/context';
import {SafeAreaView} from 'react-native-safe-area-context';
import ShareModal from '../../components/modals/shareModal';
import {fetchFavsData, fetchStreamData} from '../../services/axios/apiManager';
import FastImage from 'react-native-fast-image';
import {getUrl, postData} from '../../services/axios/apiCoreCalls';
import {getActiveProfile, getUserToken} from '../../services/dataManager';
import axios from 'axios';
import {appCode} from '../../services/axios/eps';
const Detailed = ({navigation}) => {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [stream, setStream] = useState([]);
  const [trailerEnded, setTrailerEnded] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToFavorite, setAddingToFavorite] = useState(false);
  const {state, setState} = useAppContext();
  const {user, isTrailerPaused} = state;
  const { colors } = useColorContext();
  const setIsPaused = useCallback(
    bit => {
      setState(prev => ({...prev, isTrailerPaused: bit}));
    },
    [setState],
  );
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const StreamResponse = await fetchStreamData(route.params.id);
      setMovie(StreamResponse?.data);
      setStream(StreamResponse?.data?.relatedStreams);
      setSelectedSeason(StreamResponse?.data?.show?.seasons?.[0]);
      setIsFavorite(StreamResponse?.data?.is_mylist || false);
    } catch (error) {
      console.log('Error in get Data detail screen', error);
    } finally {
      setLoading(false);
      setIsPaused(false);
    }
  }, [route.params.id, setIsPaused]);
  useEffect(() => {
    getData();
  }, [getData, setIsPaused]);
  const getFavData = async () => {
    try {
      setAddingToFavorite(true);
      const data = {
        requestAction: 'addFavItem',
        streamGuid: route.params.id,
        userCode: user.user_code,
      };
      const response = await fetchFavsData(data);
      const {status, msg} = response?.app;
      if (status === 1) {
        Alert.alert('Success', 'Added to your Favorites List');
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
  const convertMins = (timeString = '') => {
    const minutes = parseInt(timeString, 10);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} Hour${hours > 1 ? 's' : ''} ${remainingMinutes} Minute${
        remainingMinutes !== 1 ? 's' : ''
      }`;
    } else if (hours > 0) {
      return `${hours} Hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${remainingMinutes} Minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
  };
  const handlePress = item => {
    setIsPaused(true);
    navigation.navigate('MultiObjects', {id: item});
  };
  const handlePlay = item => {
    navigation.navigate('playerStack', {
      screen: 'mainPlayer',
      params: {
        id: item,
        streamId:route.params.id
      },
    });
    setIsPaused(true);
  };
  const handleQualityPress = item => {
    setIsPaused(true);
    navigation.navigate('Quality', {id: item});
  };
  const handleRatingPress = item => {
    setIsPaused(true);
    navigation.navigate('Rating', {id: item});
  };
  const handleRelatedStream = item => {
    setIsPaused(true);
    navigation.navigate('Detailed', {id: item});
  };
  const handleVideoEnd = () => {
    setTrailerEnded(true);
  };
  const handleSeasonSelect = season => {
    setSelectedSeason(season);
  };
  const {handlePress: handleMyListPress} = LoginAlert({
    onProceed: () => {
      getFavData();
    },
  });
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setIsPaused(false);
  //   }, [setIsPaused]),
  // );

  const handleReview = async code => {
    if (!code) {
      console.log('Error: Stream code is missing.');
      return;
    }

    try {
      const res = await postData('remind/me', {stream_code: code});

      if (res?.status === 200) {
        console.log('Reminder set successfully:', res.data);
        await getData();
      } else {
        console.log('Failed to set reminder. Response:', res);
        Alert.alert('Failed To Set The reminder!');
      }
    } catch (error) {
      console.log('Error in handleReview:', error);
      Alert.alert('Failed To Set The reminder!');
    }
  };
  const [reviewRatingAverage,setReviewRatingAverage]=useState('')
  const [reviewNew,setReviewNew] = useState([]);
  const getMovieReviews = async () => {
    try {
      if (!movie?.code) return;

      const url = getUrl(`userrating/get/${movie?.code}/stream`);
   
      const response = await axios.get(url, {
        headers: {
          hplatform: 'mobile',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          happCode: appCode,
        },
      });
      console.log('response', response?.data);
      setReviewRatingAverage(response?.data?.averageRating)
      setReviewNew(response?.data?.data)

    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getMovieReviews();
  }, [movie?.code, getUserToken, getActiveProfile, getUrl, appCode]);

  return (
    <View style={[styles.container,{ backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
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
            {/* Top Section with Poster */}
            {!trailerEnded && movie?.trailer_url ? (
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
            ) : (
              <ImageBackground
                source={{uri: movie?.poster}}
                style={styles.posterBackground}
                resizeMode="contain">
                <View style={[styles.topOverlay,{}]}>
                  <TouchableOpacity onPress={() => navigation.pop()}>
                    <Image
                      source={require('../../assets/images/back.png')}
                      style={[styles.backButton,{tintColor:colors.white}]}
                    />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            )}
            <View style={styles.recBackground}>
              {movie?.title_logo && movie?.show_title_logo ? (
                <Image
                  source={{uri: movie?.title_logo}}
                  style={{height: 50, width: 150, objectFit: 'contain'}}
                />
              ) : (
                <View style={styles.detailsContainer}>
                  <Text style={[styles.movieTitle,{color: colors.white,}]}>{movie?.title || 'N/A'}</Text>
                </View>
              )}
              <View style={styles.durationBox}>
                {movie?.released_date ? (
                  <TouchableOpacity
                    onPress={() => handlePress(movie?.released_date)}>
                    <Text style={[styles.movieDate,{ color: colors.white,}]}>{movie?.released_date}</Text>
                  </TouchableOpacity>
                ) : null}
                <View style={styles.movieDetails2}>
                  <Text style={[styles.movieSubTitle,{color: colors.white,}]}>
                    {convertMins(movie?.duration)}
                  </Text>
                </View>
                {movie?.streamQuality?.title ? (
                  <TouchableOpacity
                    style={[styles.hDButton,{backgroundColor: colors.theme,}]}
                    onPress={() =>
                      handleQualityPress(movie?.streamQuality?.code)
                    }>
                    <Text style={[styles.boxStyle,{color: colors.white,}]}>
                      {movie?.streamQuality?.title}
                    </Text>
                  </TouchableOpacity>
                ) : null}
               
                {movie?.contentRating?.title ? (
                  <TouchableOpacity
                    style={[styles.pGButton,{backgroundColor: colors.theme,}]}
                    onPress={() =>
                      handleRatingPress(movie?.contentRating?.code)
                    }>
                    <Text style={[styles.boxStyle,{color: colors.white,}]}>
                      {movie?.contentRating?.title}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {movie?.video_rating=== 'Enable'?  <TouchableOpacity
                    style={[styles.hDButton,{flexDirection:'row',gap:5},{backgroundColor: colors.theme,}]}
                   >
                   <Icon name={movie?.rating_type ==='thumbs'?'thumbs-up':movie?.rating_type==='star'?'star':'heart'} size={12} color={colors?.white} />
                    <Text style={[styles.boxStyle,{color: colors.white,}]}>
                      {reviewRatingAverage}
                    </Text>
                  </TouchableOpacity>:null}
                  {movie?.gamified_content=== 1?  <TouchableOpacity
                    style={[styles.hDButton,{flexDirection:'row',gap:5},{backgroundColor: colors.theme,}]}

                    onPress={()=>navigation.navigate('GamifiedContent')}
                   >
                   <Icon2 name={'medal'} size={15} color={colors?.white} />
                   
                  </TouchableOpacity>:null}
              </View>
              {movie?.code && (
                <TouchableOpacity
                  style={[styles.playButton,{backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2' ? colors.darkRed:colors.theme,}]}
                  onPress={() => {
                    if (movie?.notify_label === 'coming soon') {
                      handleReview(movie?.code); // Handle reminder clicks
                    } else {
                      handlePlay(movie?.code);
                    }
                  }}>
                  <View style={styles.iconContainer}>
                    <Icon
                      name={
                        movie?.notify_label === 'coming soon'
                          ? movie?.reminder_set
                            ? 'check'
                            : 'bell'
                          : 'play'
                      }
                      size={25}
                      color={colors.white}
                    />
                    <Text style={[styles.playText,{color: colors.white,}]}>
                      {movie?.notify_label === 'coming soon'
                        ? movie?.reminder_set
                          ? 'Reminder Set'
                          : 'Remind Me'
                        : 'Play'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            {movie?.long_description ? (
              <View style={styles.description}>
                <Text style={[styles.Overview2,{color: colors.white,}]}>{movie?.long_description}</Text>
              </View>
            ) : null}
            <View style={[styles.shareBox,{backgroundColor:colors.dull}]}>
              <TouchableOpacity
                style={styles.sharebtn}
                onPress={handleMyListPress}>
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
              {movie?.share_url ? (
                <TouchableOpacity
                  style={styles.sharebtn}
                  onPress={() => {
                    setShareModalVisible(true);
                  }}>
                  <View style={styles.iconSection}>
                    <Feather name="send" size={19} color={colors.white} />
                  </View>
                  <Text style={[styles.shareTxt,{color: colors.white,}]}>Share</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {movie && (
              <StreamDetailTabs
                movie={movie}
                getData={getData}
                handleSeasonSelect={handleSeasonSelect}
                handleRelatedStream={handleRelatedStream}
                selectedSeason={selectedSeason}
                video_rating={movie?.video_rating}
                reviewRatingAverage={reviewRatingAverage}
                getMovieReviews={getMovieReviews}
                reviewNew={reviewNew}
              />
            )}
          </ScrollView>
        )}
        <ShareModal
          visible={isShareModalVisible}
          onClose={() => setShareModalVisible(false)}
          shareUrl={movie?.share_url}
          is_embed={movie?.['is_embed ']}
          embed_code={movie?.embed_code}
          
        />
      </SafeAreaView>
    </View>
  );
};

export default Detailed;
