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
import {forgotPassword} from '../../services/axios/apiManager';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const registerValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
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
        <AuthHeader heading={'Forget Password'} msg={''} />
        <View>
          <Formik
            initialValues={{
              email: '',
              requestAction: 'forgotAccountPassword',
            }}
            validationSchema={registerValidationSchema}
            onSubmit={async values => {
              try {
                setLoading(true);
                const response = await forgotPassword(values);
                Alert.alert('Alert', response.data.app.msg, [{text: 'Close'}]);
              } catch (error) {
                console.log('Error in Forgot password', error);
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
                  <Text style={[styles.errorMessage, {color: colors.error}]}>{errors.email}</Text>
                ) : null}
                <ThemeButton
                  text={'Submit'}
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
              <Text style={[styles.txt12, {color: colors.white}]}>Go Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default ForgotPassword;
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  txt12: {
    fontSize: 12,
  },
});
