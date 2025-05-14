import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import * as Yup from 'yup';
import {Formik} from 'formik';
import { useColorContext } from '../../services/state/colorsContext';
import RNRestart from 'react-native-restart';
import {useNavigation} from '@react-navigation/native';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import ThemeButton from '../../components/buttons/themeButton';
import AuthHeader from '../../components/headers/authHeader';
import {registerUser} from '../../services/axios/apiManager';
import {useAppContext} from '../../services/state/context';
import {setUserToken, setUserData} from '../../services/dataManager';

const Register = () => {
  const navigation = useNavigation();
  const {state,setState} = useAppContext();
  const { isEmailVerificationEnabled } = state;
  const [loading, setLoading] = useState(false);
  const registerValidationSchema = Yup.object().shape({
    name: Yup.string().required('User name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password can not be empty')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });
  const { colors } = useColorContext();
  return (
    <KeyboardAvoidingView style={[styles.container,{ backgroundColor: colors.black}]}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader heading={'Register'} msg={'Create your new account'} />
        <View>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              requestAction: 'createAccount',
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async values => {
              try {
                setLoading(true);
                const response = await registerUser(values);
                if (response?.data?.app?.data?.user_code) {
                  await setUserToken(response.data.app.data.user_code);
                  await setUserData(response.data.app.data);
                  setState(prev => ({
                    ...prev,
                    user: response.data.app.data,
                    isLoggedIn: true,
                  }));
                  if (isEmailVerificationEnabled) {
                      navigation.navigate("otpVerification", {
                        emailAddress: values.email,
                      });
                    } else {
                      RNRestart.restart();
                    }
                  // RNRestart.restart();
                  // navigation.navigate('HomeScr');
                } else {
                  if (response?.data?.app?.msg) {
                    Alert.alert('Alert', response.data.app.msg);
                  } else {
                    Alert.alert(
                      'Alert',
                      'Something went wrong, please try again later',
                    );
                  }
                }
              } catch (error) {
                console.log('ERROR on Register : ', error);
              } finally {
                setLoading(false);
              }
            }}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View style={styles.formContainer}>
                <PrimaryInput
                  label={'User name'}
                  value={values.name}
                  setValue={handleChange('name')}
                />
                {errors.name && touched.name ? (
                  <Text style={[styles.errorMessage,{color: colors.error}]}>{errors.name}</Text>
                ) : null}
                <PrimaryInput
                  label={'Your email'}
                  value={values.email}
                  setValue={handleChange('email')}
                  keyBoardType={'email-address'}
                />
                {errors.email && touched.email ? (
                  <Text style={[styles.errorMessage,{color: colors.error}]}>{errors.email}</Text>
                ) : null}
                <PrimaryInput
                  label={'Password'}
                  value={values.password}
                  setValue={handleChange('password')}
                  isPassword={true}
                />
                {errors.password && touched.password ? (
                  <Text style={[styles.errorMessage,{color: colors.error}]}>{errors.password}</Text>
                ) : null}
                <PrimaryInput
                  label={'Retype password'}
                  value={values.confirmPassword}
                  setValue={handleChange('confirmPassword')}
                  isPassword={true}
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <Text style={[styles.errorMessage,{color: colors.error}]}>
                    {errors.confirmPassword}
                  </Text>
                ) : null}
                <View style={styles.btnView}>
                  <ThemeButton
                    text={'Register'}
                    type={'xl'}
                    pressed={() => {
                      handleSubmit();
                    }}
                    loading={loading}
                  />
                </View>
              </View>
            )}
          </Formik>
          <View style={styles.footer}>
            <Text style={[styles.txt10, {color: colors.white}]}>Already have an Account? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('login');
              }}>
              <Text style={[styles.themeTxt10,{color: colors.theme}]}>Please Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Register;
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
    marginLeft: '2%',
    alignSelf: 'flex-start',
  },
  btnView: {
    paddingVertical: 10,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  txt10: {
    fontSize: 10,
  },
  themeTxt10: {
    fontSize: 10,
  },
});
