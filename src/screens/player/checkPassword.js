import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import ThemeButton from '../../components/buttons/themeButton';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {postCheckPasswordStream} from '../../services/axios/apiManager';

import IonIcon from 'react-native-vector-icons/Ionicons';
import ShareModal from '../../components/modals/shareModal';
import {useAppContext} from '../../services/state/context';
import {
  getStreamPasswords,
  setStreamPasswords,
} from '../../services/dataManager';
import { useColorContext } from '../../services/state/colorsContext';
const CheckPassword = ({stream}) => {
  const route = useRoute();
  // const {stream} = route.params;
  const {setState} = useAppContext();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [storedPassword, setStoredPassword] = useState('');
  const {colors} = useColorContext();
  const passwordValidationSchema = Yup.object().shape({
    stream_password: Yup.string().required('Please enter password!'),
  });
  const convertMins = (mins = 0) => {
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    if (hours > 0) {
      return `${hours} Hour ${remainingMinutes} Minutes`;
    } else {
      return `${remainingMinutes} minutes`;
    }
  };
  const handleQualityPress = item => {
    navigation.navigate('Quality', {id: item});
  };
  const handleRatingPress = item => {
    navigation.navigate('Rating', {id: item});
  };
  const handleSubmitPassword = async password => {
    try {
      setLoading(true);
      const data = {
        stream_code: stream?.stream_guid,
        stream_password: password,
      };
      const response = await postCheckPasswordStream(data);
      if (response?.data?.success) {
        const passwords = await getStreamPasswords();
        if (passwords) {
          const newPasswords = [
            ...passwords,
            {
              stream_code: stream?.stream_guid,
              stream_password: stream?.password,
            },
          ];
          await setStreamPasswords(newPasswords);
        } else {
          await setStreamPasswords([
            {
              stream_code: stream?.stream_guid,
              stream_password: stream?.password,
            },
          ]);
        }
        setState(prev => ({...prev, ispasswordProtected: false}));
        navigation.navigate('Player', {
          id: stream?.stream_guid,
          passwordAccepted: true,
        });
      } else {
        Alert.alert('Error', response?.data?.message || 'Incorrect password', [
          {text: 'Close'},
        ]);
      }
    } catch (error) {
      console.log('Error on Change password', error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.navigate('HomeIndex');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => {
        backHandler.remove();
      };
    }, [navigation]),
  );
  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.main}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => {
            navigation.navigate('HomeIndex');
          }}>
          <IonIcon name={'chevron-back'} color={colors.white} size={30} />
        </TouchableOpacity>
        <View>
          <Formik
            initialValues={{
              stream_password: storedPassword || '',
            }}
            validationSchema={passwordValidationSchema}
            onSubmit={async values => {
              handleSubmitPassword(values.stream_password);
            }}>
            {({handleChange, handleSubmit, values}) => (
              <View style={styles.formContainer}>
                <PrimaryInput
                  label={'Please enter password'}
                  value={values.stream_password}
                  setValue={handleChange('stream_password')}
                  isPassword={true}
                />
                <View style={styles.btnView}>
                  <ThemeButton
                    text={'Submit'}
                    type={'lrg'}
                    pressed={() => {
                      handleSubmit();
                    }}
                    loading={loading}
                  />
                </View>
              </View>
            )}
          </Formik>
          <View style={styles.movieDetails}>
            <Text style={[styles.movieTitle,{ color: colors.white,}]}>{stream?.stream_title}</Text>
          </View>
          <View style={styles.durationBox}>
            <View style={styles.movieDetails2}>
              <Text style={[styles.movieSubTitle,{ color: colors.white,}]}>
                {convertMins(stream?.stream_duration)}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.hDButton,{ backgroundColor: colors.theme,}]}
              onPress={() => handleQualityPress(stream?.content_qlt_codes)}>
              <Text style={[styles.boxStyle,{ color: colors.white,}]}>{stream?.content_qlt}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pGButton,{  backgroundColor: colors.theme,}]}
              onPress={() => handleRatingPress(stream?.content_rating_codes)}>
              <Text style={[styles.boxStyle,{ color: colors.white,}]}>{stream?.content_rating}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sharebtn}
              onPress={() => {
                setShareModalVisible(true);
              }}>
              <Image
                source={require('../../assets/images/share.png')}
                style={styles.shareButton}
              />
              <Text style={[styles.shareTxt,{color: colors.share,}]}>Share</Text>
            </TouchableOpacity>
          </View>
          <ShareModal
            visible={isShareModalVisible}
            onClose={() => setShareModalVisible(false)}
            shareUrl={stream?.share_url}
          />
        </View>
      </View>
    </View>
  );
};

export default CheckPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  main: {
    marginTop: h('12%'),
    marginHorizontal: '7%',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  formContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
 
  
  btnView: {
    paddingVertical: 30,
    width: '100%',
    alignItems: 'center',
  },
  movieDetails: {
    padding: '7%',
    width: '75%',
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 28,
   
    fontWeight: '700',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 20,
  },
  movieDetails2: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  movieSubTitle: {
    fontSize: 14,
   
    fontWeight: '600',
    marginVertical: 5,
  },
  hDButton: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
   
    marginLeft: 10,
    borderRadius: 3,
  },
  pGButton: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  
    marginLeft: 10,
    borderRadius: 3,
  },
  boxStyle: {
    fontSize: 8,
    fontWeight: '500',
   
  },
  sharebtn: {
    width: 29,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    left: 75,
  },
  shareButton: {
    width: 13,
    height: 15,
  },
  shareTxt: {
    fontSize: 10,
    fontWeight: 'regular',
    
  },
});
