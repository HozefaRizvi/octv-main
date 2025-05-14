import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useColorContext } from '../../services/state/colorsContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoPlayer from './player';
import ShareModal from '../../components/modals/shareModal';
import { styles } from './pStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import StillWatchingModal from '../../components/modals/stillWatchingModal';
import { getDataForPlayer } from '../../components/playerMethods';
import ContentNotAvailable from './notAvailable';
import { useAppContext } from '../../services/state/context';
import CheckPassword from './checkPassword';
import SubscriptionPlans from './subPlans';
import OrderSummary from './orderSummary';
import axios from 'axios';
import { getUrl } from '../../services/axios/apiCoreCalls';
import { appCode } from '../../services/axios/eps';
import StreamDetailTabs from '../home/streamDetailTabs';
import { fetchStreamData } from '../../services/axios/apiManager';
import VideoPlayerIos from './playerIos';
const MainPlayer = () => {
  const { state, setState } = useAppContext();
  const { isLoggedIn, ispasswordProtected, isPaused, isBypassLogin } = state;
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route?.params;
  const { streamId } = route?.params;
  const { colors } = useColorContext()

  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [streamItem, setStreamItem] = useState([]);
  const [listTitle, setListTitle] = useState('You Might Also Like');
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [isWatchingModalVisible, setWatchingModalVisible] = useState(false);
  const [contentNotAvailable, setContentNotAvailable] = useState(false);
  const [isSubScriptionBased, setIsSubScriptionBased] = useState(false);
  const [isOtherPremium, setIsOtherPremium] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [movie, setMovie] = useState(null);

  const setIsPaused = useCallback(
    bit => {
      setState(prev => ({ ...prev, isPaused: bit }));
    },
    [setState],
  );

  const getDataNew = useCallback(async () => {
    try {
      setLoading(true);
      const StreamResponse = await fetchStreamData(route.params.id);
      console.log("Stream", StreamResponse?.data)
      setMovie(StreamResponse?.data);
      //setStream(StreamResponse?.data?.relatedStreams);
      setSelectedSeason(StreamResponse?.data?.show?.seasons?.[0]);
      setIsFavorite(StreamResponse?.data?.is_mylist || false);
    } catch (error) {
      console.log('Error in get Data detail screen', error);
    } finally {
      setLoading(false);
      setIsPaused(false);
    }
  }, [route.params.id]);
  useEffect(() => {
    getDataNew();
  }, [getDataNew]);

  const playNext = async () => {
    if (streamItem?.length > 0) {
      const nextStream = streamItem[0]?.stream_guid;
      await getDataForPlayer(
        nextStream,
        setLoading,
        setStream,
        setStreamItem,
        setListTitle,
        setIsPaused,
        setState,
        setContentNotAvailable,
        setIsOtherPremium,
        setIsSubScriptionBased,
        isLoggedIn,
        navigation,
        ispasswordProtected,
      );
    }
  };
  const getData = async (streamId = id) => {
    await getDataForPlayer(
      streamId,
      setLoading,
      setStream,
      setStreamItem,
      setListTitle,
      setIsPaused,
      setState,
      setContentNotAvailable,
      setIsOtherPremium,
      setIsSubScriptionBased,
      isLoggedIn,
      navigation,
      ispasswordProtected,
    );
  };
  useEffect(() => {
    if (isBypassLogin === 'N' && !isLoggedIn) {
      setIsPaused(true);
      navigation.navigate('authStack', {
        screen: 'login',
      });
    }
    getDataForPlayer(
      id,
      setLoading,
      setStream,
      setStreamItem,
      setListTitle,
      setIsPaused,
      setState,
      setContentNotAvailable,
      setIsOtherPremium,
      setIsSubScriptionBased,
      isLoggedIn,
      navigation,
      ispasswordProtected,
    );
    return () => {
      setIsPaused(true);
    };
  }, [id, isLoggedIn, ispasswordProtected, navigation, setIsPaused, setState]);

  const resetInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimer);
    if (stream?.app_still_watching > 0) {
      const timer = setTimeout(() => {
        setWatchingModalVisible(true);
      }, stream?.app_still_watching * 60 * 1000);
      setInactivityTimer(timer);
    }
  }, [inactivityTimer, stream]);

  const handleUserInteraction = () => {
    if (stream?.app_still_watching > 0) {
      resetInactivityTimer();
    }
  };

  const handleStillWatching = () => {
    setWatchingModalVisible(false);
    resetInactivityTimer();
  };

  const handleGoHome = () => {
    setWatchingModalVisible(false);
    navigation.navigate('HomeIndex');
  };
  const convertMins = (mins = 0) => {
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} Hour${hours > 1 ? 's' : ''} ${remainingMinutes} Minute${remainingMinutes > 1 ? 's' : ''
        }`;
    } else if (hours > 0) {
      return `${hours} Hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${remainingMinutes} Minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
  };
  const handleRelatedStream = item => {
    setIsPaused(true);
    getData(item);
  };
  const handleQualityPress = item => {
    setIsPaused(true);
    navigation.navigate('Quality', { id: item });
  };
  const handleRatingPress = item => {
    setIsPaused(true);
    navigation.navigate('Rating', { id: item });
  };
  const handleSeasonSelect = season => {
    setSelectedSeason(season);
  };
  const renderStreamItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.potraitContainer}
      onPress={() => handleRelatedStream(item.stream_guid)}>
      <Image source={{ uri: item.stream_poster }} style={styles.portraitImage} />
      <Text numberOfLines={2} style={[styles.streamTitle3,{color: colors.white,}]}>
        {item.stream_title}
      </Text>
    </TouchableOpacity>
  );
  const [reviewRatingAverage, setReviewRatingAverage] = useState('');
  const [reviewNew, setReviewNew] = useState([]);
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
      setReviewRatingAverage(response?.data?.averageRating);
      setReviewNew(response?.data?.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getMovieReviews();
  }, [movie?.code, getUrl, appCode]);
  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <ScrollView style={{backgroundColor: colors.dull}} nestedScrollEnabled={true}>
        <View style={[styles.container,{ backgroundColor: colors.dull,}]}>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar
              barStyle="light-content"
              translucent
              backgroundColor="transparent"
            />
            {loading ? (
              <View style={[styles.loader,{   backgroundColor: colors.dull,}]}>
                <ActivityIndicator
                  size={'large'}
                  color={colors.theme}
                  style={{ marginTop: '80%' }}
                />
              </View>
            ) : contentNotAvailable ? (
              <ContentNotAvailable />
            ) : ispasswordProtected ? (
              <CheckPassword stream={stream} />
            ) : isLoggedIn && isSubScriptionBased ? (
              <SubscriptionPlans
                stream={stream}
                getData={getData}
                setIsSubScriptionBased={setIsSubScriptionBased}
                setIsOtherPremium={setIsOtherPremium}
              />
            ) : isLoggedIn && isOtherPremium && Platform.OS === 'android' ? (
              <OrderSummary
                movie={stream}
                getData={getData}
                setIsSubScriptionBased={setIsSubScriptionBased}
                setIsOtherPremium={setIsOtherPremium}
              />
            ) : (
              <View>
                {/* {!isFullScreen && (
                  <TouchableOpacity
                    style={styles.header}
                    onPress={() => navigation.goBack()}>
                    <Image
                      source={require('../../assets/images/back.png')}
                      style={styles.backButton}
                    />
                  </TouchableOpacity>
                )} */}
                {!ispasswordProtected && stream && Platform.OS === 'android' ? (
                  <VideoPlayer
                    stream={stream}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                    ispasswordProtected={ispasswordProtected}
                    setIsOtherPremium={setIsOtherPremium}
                    setIsSubScriptionBased={setIsSubScriptionBased}
                    playNext={playNext}
                    isFullScreen={isFullScreen}
                    setIsFullScreen={setIsFullScreen}
                  />
                ) : !ispasswordProtected && stream && Platform.OS === 'ios' ? (
                  <VideoPlayerIos
                    stream={stream}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                    ispasswordProtected={ispasswordProtected}
                    setIsOtherPremium={setIsOtherPremium}
                    setIsSubScriptionBased={setIsSubScriptionBased}
                    playNext={playNext}
                    isFullScreen={isFullScreen}
                    setIsFullScreen={setIsFullScreen}
                  />
                ) : null}
                {!isFullScreen && (
                  <View>
                    {stream?.title_logo && stream?.show_title_logo ? (
                      <Image
                        source={{ uri: stream?.title_logo }}
                        style={{
                          height: 40,
                          width: 150,
                          objectFit: 'contain',
                          marginTop: 10,
                          marginBottom: 5,
                        }}
                      />
                    ) : (
                      <View style={styles.detailsContainer}>
                        <Text style={[styles.movieTitle,{color: colors.white,}]}>
                          {stream?.stream_title || ''}
                        </Text>
                      </View>
                    )}

                    <View style={styles.durationBox}>
                      {stream?.stream_duration ? (
                        <View style={styles.movieDetails2}>
                          <Text style={[styles.movieSubTitle,{color: colors.white,}]}>
                            {convertMins(stream?.stream_duration)}
                          </Text>
                        </View>
                      ) : null}

                      {stream?.content_qlt ? (
                        <TouchableOpacity
                          style={[styles.hDButton,{ backgroundColor: colors.theme,}]}
                          onPress={() =>
                            handleQualityPress(stream?.content_qlt_codes)
                          }>
                          <Text style={[styles.boxStyle,{ color: colors.white,}]}>
                            {stream?.content_qlt}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {stream?.content_rating ? (
                        <TouchableOpacity
                          style={[styles.pGButton,{  backgroundColor: colors.theme,}]}
                          onPress={() =>
                            handleRatingPress(stream?.content_rating_codes)
                          }>
                          <Text style={[styles.boxStyle,{ color: colors.white,}]}>
                            {stream?.content_rating}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {movie?.video_rating === 'Enable' ? <TouchableOpacity
                        style={[styles.hDButton, { flexDirection: 'row', gap: 5 , backgroundColor: colors.theme,}]}
                      >
                        <Icon name={movie?.rating_type === 'thumbs' ? 'thumbs-up' : movie?.rating_type === 'star' ? 'star' : 'heart'} size={12} color={colors?.white} />
                        <Text style={styles.boxStyle}>
                          {reviewRatingAverage}
                        </Text>
                      </TouchableOpacity> : null}
                      {stream?.share_url ? (
                        <TouchableOpacity
                          style={styles.sharebtn}
                          onPress={() => {
                            setShareModalVisible(true);
                          }}>
                          <Feather name="send" size={19} color={colors.white} />
                          <Text style={[styles.shareTxt,{ color: colors.share,}]}>Share</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <ShareModal
                      visible={isShareModalVisible}
                      onClose={() => setShareModalVisible(false)}
                      shareUrl={stream?.share_url}
                    />
                    {stream?.stream_description ? (
                      <Text style={[styles.Overview2,{color: colors.white,}]}>
                        {stream?.stream_description}
                      </Text>
                    ) : null}
                    {movie && (
                      <StreamDetailTabs
                        movie={movie}
                        getData={getDataNew}
                        handleSeasonSelect={handleSeasonSelect}
                        handleRelatedStream={handleRelatedStream}
                        selectedSeason={selectedSeason}
                        video_rating={movie?.video_rating}
                        reviewRatingAverage={reviewRatingAverage}
                        getMovieReviews={getMovieReviews}
                        reviewNew={reviewNew}
                      />
                    )}
                  </View>
                )}
              </View>
            )}
          </SafeAreaView>
          <StillWatchingModal
            visible={isWatchingModalVisible}
            onStay={handleStillWatching}
            onLeave={handleGoHome}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
export default MainPlayer;
