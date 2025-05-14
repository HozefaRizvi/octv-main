import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  Image,
  useWindowDimensions,
  Text,
  BackHandler,
  Modal,
  Dimensions,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

import Icon from 'react-native-vector-icons/Feather';
import LoginAlert from '../../components/authorizeAlert';
import {saveWathedTime} from '../../services/axios/apiManager';
import PlayerControls from '../../components/playerControls';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useAppContext} from '../../services/state/context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {getPositionStyle} from '../../components/playerMethods';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {parse} from '@plussub/srt-vtt-parser';
import {parseVTT} from '../../services/CustomFunctions/parsevtt';
const isYouTubeUrl = url => {
  return url?.includes('youtube.com') || url?.includes('youtu.be');
};

const getYouTubeVideoId = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/.*[?&]v=)([^"&?/ ]{11})/);
  return match ? match[1] : null;
};
import YoutubeIframe from 'react-native-youtube-iframe';
import { useColorContext } from '../../services/state/colorsContext';
const VideoPlayer = ({
  stream,
  isPaused,
  setIsPaused,
  setIsOtherPremium,
  setIsSubScriptionBased,
  playNext,
  isFullScreen,
  setIsFullScreen,
  playPrevious,
  isSomethigntoPlayNext,
  canWeGoBack,
}) => {
  const {width, height} = useWindowDimensions();
  const styles = createStyles(width, height);
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const {state} = useAppContext();
  const {ispasswordProtected, isLoggedIn} = state;
  const [currentTime, setCurrentTime] = useState(0);
  const [timeToSave, setTimeToSave] = useState(30);
  const {colors} = useColorContext();
  // const [buffering, setBuffering] = useState(true);
  const [showControls, setShowControls] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const [duration, setDuration] = useState(0);
  // const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [isVastAdShowing, setIsVastAdShowing] = useState(false);
  const appLimitWatchTime = stream?.watch_time_duration * 60;
  const [displaySubtitle, setDisplaySubtitle] = useState(false);
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('window').height,
  );
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );
  const [orientation, setOrientation] = useState('PORTRAIT');
  useEffect(() => {
    if (isFullScreen) {
      SystemNavigationBar.navigationHide();
    } else {
      SystemNavigationBar.navigationShow();
      SystemNavigationBar.setNavigationColor(colors?.black, true);
      SystemNavigationBar.leanBack(false);
      SystemNavigationBar.immersive(false);
      SystemNavigationBar.stickyImmersive(false);
    }
  }, [isFullScreen]);
  useEffect(() => {
    const handleOrientationChange = newOrientation => {
      if (newOrientation.includes('LANDSCAPE')) {
        setOrientation('LANDSCAPE');
        setIsFullScreen(true);
      } else {
        setOrientation('PORTRAIT');
        setIsFullScreen(false);
      }
    };

    Orientation.addOrientationListener(handleOrientationChange);

    return () => {
      Orientation.removeOrientationListener(handleOrientationChange);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      Orientation.unlockAllOrientations(); // Allow free rotation when entering screen

      return () => {
        Orientation.lockToPortrait(); // Force portrait when leaving
      };
    }, []),
  );
  const loginAlert = LoginAlert({
    onProceed: () => {
      // console.log('Resuming video after login');
      setIsPaused(false);
    },
  });
  const saveStreamWatchedTime = async () => {
    try {
      const data = {
        requestAction: 'saveStrmDur',
        streamGuid: stream.stream_guid,
        strmDur: currentTime,
      };
      const response = await saveWathedTime(data);
      if (response?.data?.app?.updated_at) {
        //.log('Watch time updated!');
      }
    } catch (error) {
      console.log('ERROR Upon Saving Watch History : ', error);
    }
  };
  const handleMonetizationCheck = async (monetizationType, isBuyed) => {
    //console.log('Monetization Type:', monetizationType);
    if (
      monetizationType === 'N' ||
      monetizationType === 'F' ||
      monetizationType === null
    ) {
      setIsSubScriptionBased(false);
      setIsOtherPremium(false);
      return;
    } else if (monetizationType !== 'F' && isBuyed === 'N') {
      if (monetizationType === 'S') {
        setIsPaused(true);
        setIsSubScriptionBased(true);
      } else if (monetizationType === 'P') {
        setIsPaused(true);
        setIsOtherPremium(true);
      } else {
        setIsSubScriptionBased(false);
        setIsOtherPremium(false);
      }
    }
  };
  useEffect(() => {
    if (showControls) {
      setTimeout(() => {
        if (!isPaused) {
          setShowControls(false);
        }
      }, 20000);
    }
  }, [showControls]);
  const onProgress = async data => {
    //console.log('Stream MOnitization', stream?.monetization_type);
    const subtitle = parsedSubtitles.find(
      ({from, to}) =>
        data.currentTime * 1000 >= from && data.currentTime * 1000 <= to,
    );
    setCurrentSubtitle(subtitle ? subtitle.text : '');
    setCurrentTime(data.currentTime);
    if (currentTime > timeToSave && isLoggedIn) {
      setTimeToSave(currentTime + 60);
      await saveStreamWatchedTime();
    }
    if (data.currentTime > appLimitWatchTime) {
      if (!isLoggedIn && stream.monetization_type !== 'F' && !isAlertShown) {
        setIsPaused(true);
        setIsAlertShown(true);
        loginAlert.handlePress();
      } else {
        if (!isLoggedIn && stream.limit_watch_time === 'yes' && !isAlertShown) {
          setIsPaused(true);
          setIsAlertShown(true);
          loginAlert.handlePress();
        } else {
          if (!ispasswordProtected) {
            await handleMonetizationCheck(
              stream?.monetization_type,
              stream?.is_buyed,
            );
          }
        }
      }
    }
  };
  const [isResume, setIsResume] = useState(false);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (stream?.stream_duration > 0 && stream?.stream_watched_dur_in_pct > 0) {
      setShowModal(true);
      //if (videoRef?.current?.pause) {
      // videoRef.current.pause();
      //}
    }
  }, [stream]);

  const handleResume = () => {
    setIsResume(true);
    setShowModal(false);
  };

  const handleStartOver = async() => {
    setIsResume(false);
    setShowModal(false);
    if (videoRef.current) {
      videoRef.current.seek(0);
      await saveStreamWatchedTime()
    }
    // Reset the time tracking variables
    setCurrentTime(0);
  };

  const onLoad = data => {
    if (stream?.stream_duration > 0 && stream?.stream_watched_dur_in_pct > 0) {
      const playedTime =
        ((stream.stream_duration * 60) / 100) *
        stream.stream_watched_dur_in_pct;

      if (stream.stream_watched_dur_in_pct > 97) {
        videoRef.current.seek(0);
        // videoRef?.current?.resume();
      } else if (isResume) {
        videoRef.current.seek(playedTime);
        //videoRef?.current?.resume();
        setTimeToSave(playedTime + 30);
      } else {
        videoRef.current.seek(0);
        // videoRef?.current?.resume();
      }
    }
  };

  // const onloadStart = () => {
  //   setIsLoading(true);
  // };
  // const onBuffer = data => {
  //   setBuffering(data.isBuffering);
  // };
  const dismissFullScreen = async () => {
    setIsFullScreen(false);
  };
  const onEnd = async () => {
    await dismissFullScreen();
    setIsPaused(true);
    await playNext();
    // videoRef.current?.seek(0);
    // setTimeToSave(30);
  };
  // const seek = time => {
  //   if (videoRef.current) {
  //     videoRef.current.seek(time);
  //   }
  // };
  const [lockOrientationNew, setLockORientationNew] = useState(false);
  const [nstate, setnstate] = useState(false);
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      Orientation.lockToLandscape();
      SystemNavigationBar.navigationHide();
      setIsFullScreen(true);
    } else {
      Orientation.lockToPortrait();
      SystemNavigationBar.navigationHide();
      setIsFullScreen(false);
    }
  };
  // useEffect(() => {
  //   if (!isFullScreen) {
  //     // Orientation.lockToPortrait();
  //   }
  //   SystemNavigationBar.navigationShow();
  //   const hideNavigationTimeout = setTimeout(() => {
  //     SystemNavigationBar.navigationHide();
  //   }, 2000);
  //   return () => clearTimeout(hideNavigationTimeout);
  // }, [isFullScreen]);

  const handleAdClick = () => {
    if (stream?.overlay_ad?.target_url) {
      Linking.openURL(stream.overlay_ad.target_url);
    }
  };
  const handleAdClose = () => {
    setIsAdVisible(false);
  };

  const handleShowControls = () => {
    if (!isVastAdShowing) {
      setShowControls(!showControls);
    }
  };
  const handlePlayVastAd = event => {
    //console.log('Vast event : ', event);
    if (event.event === 'ERROR') {
      return;
    }
    if (
      event.event === 'CONTENT_RESUME_REQUESTED' ||
      event.event === 'ALL_ADS_COMPLETED'
    ) {
      setIsAdVisible(true);
      setIsVastAdShowing(false);
    } else {
      setShowControls(false);
      setIsAdVisible(false);
      setIsVastAdShowing(true);
    }
  };
  const handleBackBtnPressed = useCallback(() => {
    if (isFullScreen) {
      setnstate(true);
      Orientation.lockToPortrait();
      setTimeout(() => {
        Orientation.unlockAllOrientations(); // Allow free rotation after switching to portrait
      }, 5000);
      SystemNavigationBar.navigationHide();
      StatusBar.setHidden(false);
    } else {
      navigation.goBack();
    }
  }, [isFullScreen, navigation, setIsFullScreen]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackBtnPressed,
    );

    return () => backHandler.remove();
  }, [handleBackBtnPressed]);
  // const adUrlVast = 'https://onlinechannel.io/vmaps/7/xml';
  // const audioUrl =
  //   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const adUrlToUse = stream?.stream_ad_url || stream?.global_ad_url;
  const getSubtitleTracks = () => {
    if (!stream?.subtitles || stream.subtitles.length === 0) {
      return [];
    }
    return stream.subtitles.map(subtitle => ({
      title: subtitle.name || 'Subtitle',
      language: 'en', // Adjust based on API data if language info is available
      type: TextTrackType.SUBRIP || TextTrackType.VTT,
      uri: subtitle?.file_url,
    }));
  };
  const [subtitles, setSubtitles] = useState(stream?.subtitles);
  const [parsedSubtitles, setParsedSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [subLanguages, setSuLanguages] = useState(
    subtitles.map(item => item.name),
  );

  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(0);
  useEffect(() => {
    const subtitleFileUrl = subtitles[selectedSubtitleIndex]?.file_url;
    if (subtitleFileUrl) {
      fetch(subtitleFileUrl)
        .then(response => response.text())
        .then(data => {
          const {entries} = parse(data);
          setParsedSubtitles(entries);
        })
        .catch(error => console.error('Failed to load subtitles:', error));
    }
  }, [selectedSubtitleIndex, subtitles]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (stream?.chapter) {
      fetch(stream.chapter)
        .then(response => response.text()) // Get VTT text
        .then(data => {
          console.log('Raw VTT:', data);
          const parsedChapters = parseVTT(data);
          setChapters(parsedChapters);
        })
        .catch(error => console.error('Failed to load chapters:', error));
    }
  }, [stream?.chapter]);

  const seekToChapter = startTime => {
    if (videoRef.current) {
      videoRef.current.seek(startTime);
    }
  };

  adTagUrl1 =
    'https://cdn.theoplayer.com/demos/ads/vmap/single-pre-mid-post-no-skip.xml';

  // console.log('Stream URL', stream?.stream_url);

  return (
    <>
    {stream?.stream_url ? (
      isYouTubeUrl(stream.stream_url) ? (
        <YoutubeIframe
           
           height={250}
           play={!isPaused && !showModal}
           videoId={getYouTubeVideoId(stream.stream_url)}
         />
      ):(
        <View style={[styles.container,{ backgroundColor: colors.black,}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {stream?.stream_url ? (

          <Video
            ref={videoRef}
            source={{uri: stream?.stream_url}}
            style={[isFullScreen ? styles.fullVideo : styles.potraitvideo, { backgroundColor: colors.dull}]}
            controls={false}
            paused={isPaused || showModal}
            onLoad={onLoad}
            onProgress={onProgress}
            onEnd={onEnd}
            resizeMode="cover"
            rate={1.0}
            adTagUrl={adUrlToUse}
            onReceiveAdEvent={handlePlayVastAd}
            muted={!isLoggedIn}
            preferredForwardBufferDuration={10}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
              backBufferDurationMs: 70000,
              cacheSizeMB: 0,
              live: {targetOffsetMs: 500},
            }}
          />
      
      ) : null}
      {currentSubtitle && displaySubtitle ? (
        <Text style={[styles.subtitle, {bottom: isFullScreen ? 35 : 25}]}>
          {currentSubtitle}
        </Text>
      ) : null}
      {!isVastAdShowing && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.overLay}
          onPress={() => {
            handleShowControls();
          }}>
          {stream?.watermark?.status === '1' && (
            <View
              activeOpacity={1}
              style={[
                styles.watermarkContainer,
                getPositionStyle(stream?.watermark?.position),
              ]}>
              {stream?.watermark?.type === 'image' &&
              stream?.watermark?.image ? (
                <Image
                  source={{uri: stream.watermark.image}}
                  style={[
                    styles.watermarkImage,
                    {
                      opacity: stream?.watermark?.opacity,
                      width: parseInt(stream?.watermark?.size, 10) || 0,
                      height: parseInt(stream?.watermark?.size, 10) || 0,
                    },
                  ]}
                />
              ) : stream.watermark.type === 'text' && stream.watermark.text ? (
                <Text
                  style={[
                    styles.watermarkText,
                    {
                      fontSize: parseInt(stream.watermark.size, 10),
                      opacity: stream?.watermark?.opacity || 0.5,
                       color: colors.white,
                    },
                  ]}>
                  {stream.watermark.text}
                </Text>
              ) : null}
            </View>
          )}
          {!showControls && isAdVisible && stream?.overlay_ad?.image_url ? (
            <TouchableOpacity
              style={styles.adContainer}
              onPress={handleAdClick}
              activeOpacity={0.8}>
              <Image
                source={{uri: stream.overlay_ad.image_url}}
                style={styles.adImage}
              />
              <TouchableOpacity
                style={[styles.closeButton,{ backgroundColor: colors.white,}]}
                onPress={handleAdClose}>
                <Icon name="x" size={20} color={colors.black} />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : null}
          {showControls && (
            <PlayerControls
              currentTime={currentTime}
              videoRef={videoRef}
              duration={parseInt(stream?.stream_duration, 10) || 0}
              setIsPaused={setIsPaused}
              isPaused={isPaused}
              setCurrentTime={setCurrentTime}
              playNext={playNext}
              displaySubtitle={displaySubtitle}
              setDisplaySubtitle={setDisplaySubtitle}
              subLanguages={subLanguages}
              selectedSubtitleIndex={selectedSubtitleIndex}
              setSelectedSubtitleIndex={setSelectedSubtitleIndex}
              playPrevious={playPrevious}
              isSomethigntoPlayNext={isSomethigntoPlayNext}
              canWeGoBack={canWeGoBack}
              chapters={chapters}
              seekToChapter={seekToChapter}
            />
          )}
          {showModal && (
            <>
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 99,
                  bottom: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.modalText,{ color: colors?.white,}]}>Resume or start over?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                     style={[styles.button,{ backgroundColor: colors?.theme,}]}
                    onPress={handleResume}>
                    <Text style={styles.buttonText}>Resume</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button,{ backgroundColor: colors?.theme,}]}
                    onPress={handleStartOver}>
                    <Text style={styles.buttonText}>Start Over</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          {showControls && (
            <View style={styles.playerHeader}>
              <TouchableOpacity onPress={() => handleBackBtnPressed()}>
                <Image
                  source={require('../../assets/images/back.png')}
                  style={styles.backButton}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleFullScreen}
                style={styles.fullscreenButton}>
                <Icon
                  name={isFullScreen ? 'minimize' : 'maximize'}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      )}
      {stream.stream_content_type === 'A' && (
        <View style={styles.thumbNail}>
          <Image
            source={{uri: stream.stream_poster}}
            style={styles.thumbnailImg}
          />
        </View>
      )}

      
    </View>
     )
    ) : null}
    </>
  );
};
export default VideoPlayer;
export const createStyles = (width, height) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
     
      width: '100%',
      zIndex: 2,
    },
    fullVideo: {
      width: width,
      height: height,
     
    },
    potraitvideo: {
      width: width,
      height: width * 0.56,
      
    },
    title: {
     
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    
    playerHeader: {
      position: 'absolute',
      top: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 30,
      zIndex: 5,
      width: '100%',
    },
    backButton: {
      height: 20,
      width: 12,
    },
    fullscreenButton: {},
    adContainer: {
      position: 'absolute',
      bottom: 0,
      zIndex: 4,
      alignSelf: 'center',
    },
    adImage: {
      width: 250,
      height: 50,
      resizeMode: 'contain',
    },
    closeButton: {
      position: 'absolute',
      right: 0,
      top: 7,
     
    },
    overLay: {
      position: 'absolute',
      zIndex: 3,
      top: 0,
      height: '100%',
      width: '100%',
      opacity: 0.7,
    },
    watermarkContainer: {
      position: 'absolute',
      zIndex: 0,
      height: '100%',
      width: '100%',
    },
    watermarkImage: {
      resizeMode: 'contain',
    },
    watermarkText: {
     
      fontWeight: 'bold',
    },
    thumbNail: {
      position: 'absolute',
      zIndex: 1,
      top: 0,
      height: '100%',
      width: '100%',
      opacity: 0.7,
    },
    subtitle: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      color: 'white',
      fontSize: 14,
      textAlign: 'center',
      // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 5,
    },
    thumbnailImg: {
      height: '100%',
      width: '100%',
    },
   
    
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
     
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      gap: 5,
    },
    button: {
     
      padding: 10,
      borderRadius: 5,
      marginHorizontal: 10,
      width: '30%',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
  });