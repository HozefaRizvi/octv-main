import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  Linking,
  Image
} from 'react-native';
import { useColorContext } from '../services/state/colorsContext';
import Slider from '@react-native-community/slider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {formatTime} from '../services/CustomFunctions/parsevtt';
const PlayerControls = ({
  currentTime,
  videoRef,
  duration,
  setIsPaused,
  isPaused,
  setCurrentTime,
  playNext,
  displaySubtitle,
  setDisplaySubtitle,
  subLanguages,
  selectedSubtitleIndex,
  setSelectedSubtitleIndex,
  playPrevious,
  canWeGoBack,
  isSomethigntoPlayNext,
  chapters,
  seekToChapter,
  buyNow,
  callToAction,
}) => {
  const isSkipForwardDisabled = currentTime >= duration * 60;
  const [modallanguage, setmodallangage] = useState(false);
  const [chapterShow, setChapterShow] = useState(false);
   const { colors } = useColorContext();
  const [buyNowState, setBuyNowState] = useState(false);
  console.log("Buy now",buyNow)
  // Convert time_offset to seconds (assuming format "00.00.15")
  const buyNowTime =
    buyNow?.length > 0
      ? parseInt(buyNow[0]?.time_offset?.split('.')?.join(''))
      : null;

  useEffect(() => {
    if (buyNowTime !== null && Math.floor(currentTime) === buyNowTime) {
      setBuyNowState(true);

      // Set timeout to turn it off after 10 seconds
      const timer = setTimeout(() => setBuyNowState(false), 15000);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [currentTime, buyNowTime]);
  return (
    <View style={styles.container}>
      {buyNowState && 
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 0,
          top: -55,
          backgroundColor: colors?.theme,
          padding: 10,
        }}
        onPress={() => {
          if (buyNow?.[0]?.source_type === 'external' && buyNow?.[0]?.external_link) {
            Linking.openURL(buyNow[0].external_link);
          }
          else if(buyNow?.[0]?.source_type === 'internal')
          {
              //logic will be here 
          }
        }}
        >
       
         {/* <Text style={{color:colors?.white}}>{buyNow?.[0]?.name}</Text> */}
         {/* <Image source={{uri:buyNow?.[0]?.img_url}} style={{objectFit:'cover',height:50,width:100}}/> */}
      </TouchableOpacity>
      } 
    
      {displaySubtitle && subLanguages?.length > 0 ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            top: -55,
            backgroundColor: colors?.white,
            padding: 10,
          }}
          onPress={() => setmodallangage(true)}>
          <Text style={{color: colors?.theme}}>
            {subLanguages[selectedSubtitleIndex] ||
              subLanguages[0] ||
              'No Subtitles'}
          </Text>
        </TouchableOpacity>
      ) : null}

      <Modal
        transparent={true}
        animationType="slide"
        visible={modallanguage}
        onRequestClose={() => setmodallangage(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: colors?.black,
              padding: 20,
              width: '80%',
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                textAlign: 'center',
                color: colors?.white,
              }}>
              Select Subtitle Language
            </Text>

            {/* Subtitle Options List */}
            <FlatList
              data={subLanguages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    borderRadius: 5,
                    backgroundColor:
                      selectedSubtitleIndex === index ? colors.theme : 'white',
                  }}
                  onPress={() => {
                    setSelectedSubtitleIndex(index);
                    setmodallangage(false);
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color:
                        selectedSubtitleIndex === index ? 'white' : 'black',
                      fontWeight: 'bold',
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={{
                marginTop: 15,
                backgroundColor: colors.DarkGray,
                padding: 10,
                borderRadius: 10,
                alignItems: 'center',
              }}
              onPress={() => setmodallangage(false)}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.controls}>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={canWeGoBack}
          onPress={() => {
            setCurrentTime(0);
            playPrevious();
          }}>
          <IonIcon
            name={'play-skip-back-sharp'}
            color={isSomethigntoPlayNext ? colors.white : colors?.DarkGray}
            size={27}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setCurrentTime(currentTime - 10);
            videoRef.current.seek(currentTime - 10);
          }}>
          <IonIcon name={'play-back'} color={colors.white} size={27} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setIsPaused(!isPaused);
          }}>
          <IonIcon
            name={isPaused ? 'play' : 'pause'}
            color={colors.white}
            size={27}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setCurrentTime(currentTime + 10);
            videoRef.current.seek(currentTime + 10);
          }}>
          <IonIcon name={'play-forward'} color={colors.white} size={27} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={isSomethigntoPlayNext}
          onPress={() => {
            playNext();
          }}>
          <IonIcon
            name={'play-skip-forward'}
            color={isSomethigntoPlayNext ? colors.white : colors?.DarkGray}
            size={27}
          />
        </TouchableOpacity>
        {chapters?.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setChapterShow(true)}>
            <IonIcon name={'list-outline'} color={colors?.white} size={27} />
          </TouchableOpacity>
        )}
        {subLanguages?.length > 0 && (
          <TouchableOpacity
            onPress={() => setDisplaySubtitle(!displaySubtitle)}>
            <Icon2
              name={displaySubtitle ? 'subtitles' : 'subtitles-off'}
              size={20}
              color={colors?.white}
              style={{}}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.seeker}>
        <View style={styles.currentTime}>
          <Text style={[styles.timeTxt,{ color: colors?.white,}]} numberOfLines={1}>
            {Math.floor(currentTime / 3600)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor((currentTime % 3600) / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, '0')}{' '}
          </Text>
        </View>
        <Slider
          style={styles.slider}
          value={currentTime}
          maximumValue={duration * 60}
          minimumValue={0}
          onValueChange={time => videoRef?.current?.seek(time)}
          minimumTrackTintColor={colors.theme}
          maximumTrackTintColor={colors.white}
          thumbTintColor="#FFF"
          // renderStepNumber
        />
        <View style={styles.totalTime}>
          <Text style={[styles.timeTxt,{ color: colors?.white,}]} numberOfLines={1}>
            {Math.floor(duration / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, '0')}
          </Text>
        </View>
        <Modal
          transparent={true}
          animationType="slide"
          visible={chapterShow}
          onRequestClose={() => setChapterShow(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: colors?.dull,
                padding: 20,
                width: '80%',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  textAlign: 'center',
                  color: colors?.white,
                }}>
                Select Chapter
              </Text>

              {/* Subtitle Options List */}
              <FlatList
                data={chapters}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 10}}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => seekToChapter(item.startTime)}
                    style={[styles.chapterItem,{backgroundColor: colors?.theme,}]}>
                    <Text style={styles.chapterTitle}>{item.title}</Text>
                    <Text style={[styles.chapterTime,{ color: colors?.white,}]}>
                      {formatTime(item.startTime)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {/* Close Button */}
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  backgroundColor: colors.DarkGray,
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                onPress={() => setChapterShow(false)}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
export default PlayerControls;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    bottom: 20,
    zindex: 99,
  },
  controls: {
    flexDirection: 'row',
    height: 35,
    justifyContent: 'space-evenly',
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    
    borderRadius: 10,
    marginBottom: 8,
  },
  chapterTitle: {
    fontSize: 16,
    color: 'white',
  },
  chapterTime: {
    fontSize: 14,
   
  },
  seeker: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    zindex: 10,
    justifyContent: 'center',
  },
  currentTime: {
    width: '12%',
  },
  slider: {
    width: '65%',
    alignSelf: 'center',
  },
  totalTime: {
    width: '12%',
  },
  timeTxt: {
    fontSize: 9,
 
    fontWeight: '600',
    textAlign: 'center',
  },
});
