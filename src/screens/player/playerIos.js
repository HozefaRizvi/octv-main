import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  FlatList,
  Dimensions
} from 'react-native';
import Video, { TextTrackType, ViewType } from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { colors } from '../../assets/colors';
import Icon from 'react-native-vector-icons/Feather';
import LoginAlert from '../../components/authorizeAlert';
import { saveWathedTime } from '../../services/axios/apiManager';
import PlayerControls from '../../components/playerControls';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../services/state/context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { getPositionStyle } from '../../components/playerMethods';
import { parse } from '@plussub/srt-vtt-parser';
import IonIcon from 'react-native-vector-icons/Ionicons'
// import { requestTrackingPermission } from 'react-native-tracking-transparency';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { parseVTT } from '../../services/CustomFunctions/parsevtt';
import YoutubeIframe from 'react-native-youtube-iframe';

const VideoPlayerIos = ({
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
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const { state } = useAppContext();
  const { ispasswordProtected, isLoggedIn, isBypassLogin } = state;
  const [currentTime, setCurrentTime] = useState(0);
  const [timeToSave, setTimeToSave] = useState(30);
  const [showControls, setShowControls] = useState(false);
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [isVastAdShowing, setIsVastAdShowing] = useState(false);
  const appLimitWatchTime = stream?.watch_time_duration * 60;
  // const adUrlToUse = stream?.ios_ad_url;
  const adUrlToUse = stream?.stream_ad_url || stream?.global_ad_url;
  const [fileUrl, setFileUrl] = useState('')
  const [subtitles, setSubtitles] = useState(stream?.subtitles)
  const [parsedSubtitles, setParsedSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [displaySubtitle, setDisplaySubtitle] = useState(false)
  const [subLanguages, setSuLanguages] = useState(subtitles.map((item) => item.name))
  // const subtitleFileUrl = stream.subtitles?.[0]?.file_url || ''; // Use the first subtitle as default
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState(0); // Track selected subtitle
  const streamUrlType = stream?.stream_url.endsWith('.m3u8')
  const [chapters, setChapters] = useState([]);
  const [isResume, setIsResume] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get('window').height,
  );
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get('window').width,
  );
  const [orientation, setOrientation] = useState('PORTRAIT');

  const isYouTubeUrl = url => {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/.*[?&]v=)([^"&?/ ]{11})/);
    return match ? match[1] : null;
  };

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
      setCurrentTime(0)
      await saveStreamWatchedTime()
    }
  };

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
        console.log('Watch time updated!');
      }
    } catch (error) {
      console.log('ERROR Upon Saving Watch History : ', error);
    }
  };
  const handleMonetizationCheck = async (monetizationType, isBuyed) => {
    // if (monetizationType !== 'F' && isBuyed === 'N') {
    //   setIsPaused(true);
    //   if (monetizationType === 'S') {
    //     setIsSubScriptionBased(true);
    //   } else {
    //     setIsOtherPremium(true);
    //   }
    // }
  };
  useEffect(() => {
    if (showControls) {
      setTimeout(() => {
        setShowControls(false)
        setIsDropdownVisible(false)
      }, 5000);
    }
  }, [showControls])
  const onProgress = async data => {
    const subtitle = parsedSubtitles.find(
      ({ from, to }) => data.currentTime * 1000 >= from && data.currentTime * 1000 <= to
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
        // loginAlert.handlePress();
      } else {
        if (!isLoggedIn && stream.limit_watch_time === 'yes' && !isAlertShown) {
          setIsPaused(true);
          setIsAlertShown(true);
          // loginAlert.handlePress();
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
    // setShowControls(true);
  };
  const onLoad = data => {
    if (!isResume && stream?.stream_duration > 0 && stream?.stream_watched_dur_in_pct > 0) {
      if (stream.stream_watched_dur_in_pct > 97) {
        videoRef.current.seek(0);
      } else {
        const playedTime =
          ((stream.stream_duration * 60) / 100) *
          stream.stream_watched_dur_in_pct;
        videoRef.current.seek(playedTime);
        setTimeToSave(playedTime + 30);
      }
    }
  };
  
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
  useEffect(() => {
    if (!isFullScreen) {
      Orientation.lockToPortrait();
    }
    SystemNavigationBar.navigationShow();
    const hideNavigationTimeout = setTimeout(() => {
      SystemNavigationBar.navigationHide();
    }, 2000);
    return () => clearTimeout(hideNavigationTimeout);
  }, [isFullScreen]);

  const handleAdClick = () => {
    if (stream?.overlay_ad?.target_url) {
      Linking.openURL(stream.overlay_ad.target_url);
    }
  };
  const handleAdClose = () => {
    setIsAdVisible(false);
  };

  const handleShowControls = () => {
    setShowControls(!showControls);
  };
  const handlePlayVastAd = event => {
    console.log('Vast event : ', event);
    if (event.event == 'ERROR') {
      setIsVastAdShowing(false)
      setShowControls(true)
      return;
    }
    if (event.event === 'UNKNOWN') {
      setIsVastAdShowing(false)
      setIsAdVisible(true)
      setShowControls(true)
      return;
    }
    // if( event.data?.logData?.type === 'adLoadError'){
    //   // console.log('error occured, display control')
    //   setShowControls(true)
    // }
    if (
      event.event == 'LOADED' ||
      event.event == 'STARTED') {
      setIsAdVisible(false);
      setIsVastAdShowing(true);
      setShowControls(false);
    }
    if (
      event.event == 'FIRST_QUARTILE') {
      setIsAdVisible(false);
      setIsVastAdShowing(true);
      setShowControls(false);
    }
    if (event.event == 'MIDPOINT') {
      setIsAdVisible(false);
      setIsVastAdShowing(true);
      setShowControls(false);
    }
    if (event.event == 'THIRD_QUARTILE') {
      setIsAdVisible(false);
      setIsVastAdShowing(true);
      setShowControls(false);
    }
    if (
      event.event == 'AD_METADATA' ||
      event.event == 'AD_PERIOD_ENDED' ||
      event.event == 'SKIPPED' ||
      event.event == 'ALL_ADS_COMPLETED'
    ) {
      setIsAdVisible(true)
      setIsVastAdShowing(false);
      setShowControls(true);
      console.log('ads completed : ', event);
    }
    if (
      event.event == 'COMPLETED'
    ) {
      setIsAdVisible(true)
      setIsVastAdShowing(false);
      setShowControls(true);
      console.log('ads completed : ', event);
    }
    // else {
    //   setShowControls(false);
    //   setIsAdVisible(false);
    //   setIsVastAdShowing(true);
    // }
  };
  const handleBackBtnPressed = useCallback(() => {
    setIsPaused(true);
    if (isFullScreen) {
      Orientation.lockToPortrait();
      setIsFullScreen(false);
    } else {
      navigation.goBack();
    }
  }, [isFullScreen, navigation, setIsFullScreen, setIsPaused]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackBtnPressed,
    );

    return () => backHandler.remove();
  }, [handleBackBtnPressed]);

  useEffect(() => {
    const subtitleFileUrl = subtitles[selectedSubtitleIndex]?.file_url;
    if (subtitleFileUrl) {
      fetch(subtitleFileUrl)
        .then((response) => response.text())
        .then((data) => {
          const { entries } = parse(data);
          setParsedSubtitles(entries); // Update parsed subtitles
        })
        .catch((error) => console.error('Failed to load subtitles:', error));
    }
  }, [selectedSubtitleIndex, subtitles]);


  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  useEffect(() => { }, [isDropdownVisible, displaySubtitle])

  const handleSubtitleChange = (index) => {
    console.log('index: ', index)
    setSelectedSubtitleIndex(index);
    setIsDropdownVisible(false); // Close dropdown after selection
  };

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

  //const newUrl = `https://onlinechannel.io/vmaps/22/xml?deviceid={{value}}&useragent={{value}}&deviceip={{value}}&idfa={{value}}`
  // console.log('###new url: ',stream?.stream_ad_url || stream?.global_ad_url)
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
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {stream?.stream_url ? (
        <Video
          ref={videoRef}
          source={{ uri: stream?.stream_url }}
          // source={{uri: audioUrl}}
          style={isFullScreen ? styles.fullVideo : styles.potraitvideo}
          controls={false}
          paused={isPaused}
          onLoad={onLoad}
          onLoadStart={() => setShowControls(true)}
          onReadyForDisplay={() => setShowControls(true)}
          onProgress={onProgress}
          onEnd={onEnd}
          resizeMode='cover'
          rate={1.0}
          ignoreSilentSwitch='ignore' // it is because not to mute the video even mobile is in silent mode
          // adTagUrl={'https://onlinechannel.io/vmaps/22/xml'}
          adTagUrl={stream?.stream_ad_url || stream?.global_ad_url}
          //  adTagUrl="https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpremidpostoptimizedpodbumper&ciu_szs=300x250&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&cmsid=496&vid=short_onecue&correlator="
          // adTagUrl={'https://onlinechannel.io/vmaps/7/xml'}
          onReceiveAdEvent={event => handlePlayVastAd(event)}
          muted={isBypassLogin === 'N' && !isLoggedIn ? true : false}
          // muted={false}
          preferredForwardBufferDuration={10}
          bufferConfig={{
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000,
            backBufferDurationMs: 70000,
            cacheSizeMB: 0,
            live: {
              targetOffsetMs: 500,
            },
          }}
        />
      ) : null}
      {currentSubtitle && displaySubtitle ? (
        <Text style={[styles.subtitle, { bottom: isFullScreen ? 35 : 25 }]}>{currentSubtitle}</Text>
      ) : null}
      {!isVastAdShowing &&
        <View style={{ position: 'position', alignSelf: 'flex-end', zIndex: 5, bottom: 50 }}>
          {showControls &&
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', right: isFullScreen ? 20 : 5, bottom: isFullScreen && 20 }}
              activeOpacity={1}
              onPress={() => {
                setDisplaySubtitle(!displaySubtitle)
                setIsDropdownVisible(true)
                // setIsDropdownVisible(!isDropdownVisible)
              }}>
              <MaterialIcons name={displaySubtitle ? 'subtitles' : 'subtitles-off'} color={colors.white} size={20} style={{ padding: 3 }} />
            </TouchableOpacity>
          }
          {displaySubtitle && showControls && isDropdownVisible && (
            <View style={[styles.dropdown, { bottom: isFullScreen ? 50 : 30 }]}>
              <FlatList
                data={subtitles.map((item) => item.name)}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text>No subtitles available</Text>}
                renderItem={({ item, index }) => (
                  <TouchableOpacity key={index}
                    style={[
                      styles.subtitleOption,
                      // selectedSubtitle?.name === item.name &&
                      //   styles.selectedOption,
                    ]}
                    onPress={() => handleSubtitleChange(index)}>
                    <Text style={[styles.subtitleText, { color: selectedSubtitleIndex === index ? colors.theme : colors.black }]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>}
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
                  source={{ uri: stream.watermark.image }}
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
                source={{ uri: stream.overlay_ad.image_url }}
                style={styles.adImage}
              />
              <TouchableOpacity
                style={styles.closeButton}
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
                <Text style={styles.modalText}>Resume or start over?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleResume}>
                    <Text style={styles.buttonText}>Resume</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
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
            source={{ uri: stream.stream_poster }}
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
export default VideoPlayerIos;
export const createStyles = (width, height) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.black,
      width: '100%',
      zIndex: 2,
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
    fullVideo: {
      width: width,
      height: height,
      backgroundColor: colors.dull,
      overflow: 'hidden'
    },
    potraitvideo: {
      width: width,
      height: width * 0.56,
      backgroundColor: colors.dull,
      overflow: 'hidden'
    },
    title: {
      color: colors.white,
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
    infoText: {
      color: colors.white,
      fontSize: 12,
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
      tintColor: colors.white
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
      backgroundColor: colors.white,
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
      color: colors.white,
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
    thumbnailImg: {
      height: '100%',
      width: '100%',
    },
    dropdown: {
      position: 'absolute',
      right: 2,
      // bottom: 30,
      backgroundColor: colors.white,
      borderRadius: 4,
      padding: 4,
      zIndex: 20,
      // width: 150,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    subtitleOption: {
      padding: 10,
      paddingVertical: 5
      // borderBottomWidth: 1,
      // borderBottomColor: colors.gray,
    },
    selectedOption: {
      backgroundColor: colors.theme,
    },
    subtitleText: {
      color: colors.white,
      textAlign: 'center',
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: colors?.white,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      gap: 5,
    },
    button: {
      backgroundColor: colors?.theme,
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