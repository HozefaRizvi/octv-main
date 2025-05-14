import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import { useColorContext } from '../../services/state/colorsContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import ThemeButton from '../../components/buttons/themeButton';
import AuthHeader from '../../components/headers/authHeader';
import {ValidateOTP} from '../../services/axios/apiManager';
import {useAppContext} from '../../services/state/context';
import {
  setActiveProfile,
  setUserData,
  setUserToken,
} from '../../services/dataManager';
import {BackHandler} from 'react-native';

const OTPVerification = () => {
  const route = useRoute();
  const {emailAddress} = route?.params;
  const navigation = useNavigation();
  const {setState} = useAppContext();
  const [loading, setLoading] = useState(false);
  const registerValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    otp: Yup.string().required('Please enter OPT.'),
  });
  useEffect(() => {
    const backAction = async () => {
      await Promise.all([
        setUserToken(''),
        setUserData({}),
        setActiveProfile({}),
      ]);
      setState(prev => ({
        ...prev,
        user: '',
        isLoggedIn: false,
      }));
      navigation.goBack();
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);

  const { colors } = useColorContext();

  return (
    <View style={[styles.container,{backgroundColor: colors.black}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader heading={'OTP Verification'} msg={''} />
        <Text>We have sent you an OTP to your email address.</Text>
        <View>
          <Formik
            initialValues={{
              requestAction: 'validateOtp',
              email: emailAddress || '',
              otp: '',
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async values => {
              try {
                setLoading(true);
                const response = await ValidateOTP(values);
                if (response?.data?.app?.status === 1) {
                  Alert.alert('Success', response.data.app.msg);
                 
                  navigation.navigate('HomeIndex');
                } else {
                  Alert.alert(
                    'Alert',
                    'Something went wrong, please try again later',
                  );
                }
              } catch (error) {
                console.log('Error Upon Resending OTP  : ', error);
                Alert.alert(
                  'Alert',
                  'Something went wrong, please try again later',
                );
              } finally {
                setLoading(false);
              }
            }}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View style={styles.formContainer}>
                <PrimaryInput
                  label={'OTP'}
                  value={values.otp}
                  setValue={handleChange('otp')}
                  keyBoardType={'numeric'}
                />
                {errors.otp && touched.otp ? (
                  <Text style={[styles.errorMessage,{color: colors.error}]}>{errors.otp}</Text>
                ) : null}
                <ThemeButton
                  text={'Verify'}
                  type={'xl'}
                  pressed={() => {
                    handleSubmit();
                  }}
                  loading={loading}
                />
              </View>
            )}
          </Formik>
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={[styles.txt12,{color: colors.white}]}>Go Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default OTPVerification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: '7%',
  },
  formContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 13,
    marginLeft: '10%',
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  txt12: {
    fontSize: 12,
  },
});
