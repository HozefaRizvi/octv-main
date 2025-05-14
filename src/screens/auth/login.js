import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import ThemeButton from '../../components/buttons/themeButton';
import AuthHeader from '../../components/headers/authHeader';
import {login} from '../../services/axios/apiManager';
import {setUserData, setUserToken} from '../../services/dataManager';
import {useAppContext} from '../../services/state/context';

const Login = () => {
  const {state, setState} = useAppContext();
  const {showSignUpButton} = state;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });
  const { colors } = useColorContext();
  return (
    <View style={[styles.container, {backgroundColor: colors.black}]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader
          heading={'Welcome Back'}
          msg={'Hello there, Sign in to continue '}
        />
        <View>
          <Formik
            initialValues={{
              email: '',
              password: '',
              requestAction: 'validateUserAccount',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={async values => {
              try {
                setLoading(true);
                const response = await login(values);
                if (response?.data?.app?.data?.user_code) {
                  await setUserToken(response.data.app.data.user_code);
                  await setUserData(response.data.app.data);
                  setState(prev => ({
                    ...prev,
                    user: response.data.app.data,
                    isLoggedIn: true,
                  }));
                  // navigation.goBack();
                   navigation.navigate('HomeIndex');
                }else {
                      Alert.alert(
                        'Alert',
                        response.data.app.msg ||
                        'Something went wrong. Please try again!',
                      );
                     if( response.data.app.msg==='You have not completed your sign up process, please complete it OR Email Verification' && !isEmailVerificationEnabled)
                     {
                      navigation.navigate('emailVerification')
                     }
                     
                    }
              } catch (error) {
                console.log('Error in Login');
              } finally {
                setLoading(false);
              }
            }}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View style={styles.formContainer}>
                <PrimaryInput
                  label={'Your email'}
                  value={values.email}
                  setValue={handleChange('email')}
                  keyBoardType={'email-address'}
                />
                {errors.email && touched.email ? (
                  <Text style={[styles.errorMessage,{ color: colors.error}]}>{errors.email}</Text>
                ) : null}
                <PrimaryInput
                  label={'Password'}
                  value={values.password}
                  setValue={handleChange('password')}
                  isPassword={true}
                />
                {errors.password && touched.password ? (
                  <Text style={[styles.errorMessage,{ color: colors.error}]}>{errors.password}</Text>
                ) : null}
                <View style={styles.row}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('emailVerification');
                    }}>
                    <Text style={[styles.themeTxt12,{color: colors.theme}]}>Email Verification?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('forgotPassword');
                    }}>
                    <Text style={[styles.themeTxt12,{color: colors.theme}]}>Forget Password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnView}>
                  <ThemeButton
                    text={'Log in'}
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
          {showSignUpButton === 'Y' && (
            <View style={styles.footer}>
              <Text style={[styles.txt10,{color: colors.white}]}>Don’t have an Account? </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('register');
                }}>
                <Text style={[styles.themeTxt10,{color: colors.theme}]}>Please Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default Login;
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
  row: {
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeTxt12: {
    fontSize: 12,
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
