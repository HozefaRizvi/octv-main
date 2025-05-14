import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import ThemeButton from '../../components/buttons/themeButton';
import * as Yup from 'yup';
import {getUserToken} from '../../services/dataManager';
import {changePassword} from '../../services/axios/apiManager';
import { useAppContext } from '../../services/state/context';
const ChangePassword = () => {
  const navigation = useNavigation();
  const {state} = useAppContext();
  const {logo} = state;
  const [loading, setLoading] = useState(false);
  const passwordValidationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please enter your current password!'),
    nPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please enter a new password!'),
    cPassword: Yup.string()
      .required('Please re-enter your new password!')
      .oneOf([Yup.ref('nPassword'), null], 'Passwords must match'),
  });
  const { colors } = useColorContext();
  return (
    
    <KeyboardAvoidingView   style={[styles.container,{backgroundColor: colors.black,}]}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView style={styles.main} contentContainerStyle={{paddingBottom:'10%'}} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <IonIcon name={'chevron-back'} color={colors.white} size={30} />
        </TouchableOpacity>
        <View style={styles.centeredView}>
          <Image
            style={styles.logo}
            source={{uri:logo}}
            resizeMode="contain"
          />
          <Text style={[styles.heading,{ color: colors.theme,}]}>Change Password</Text>
          
        </View>
        <View>
          <Formik
            initialValues={{
              oldPassword: '',
              nPassword: '',
              cPassword: '',
              requestAction: 'changeAccountPassword',
              userCode: '',
            }}
            validationSchema={passwordValidationSchema}
            onSubmit={async values => {
              try {
                setLoading(true);
                const token = await getUserToken();
                values.userCode = token;
                const response = await changePassword(values);
                if (response?.data?.app?.data?.user_code) {
                  Alert.alert('Success', response.data.app.msg, [
                    {text: 'Close'},
                  ]);
                } else if (response?.data?.app?.msg) {
                  Alert.alert('Alert', response.data.app.msg, [
                    {text: 'Close'},
                  ]);
                }
              } catch (error) {
                console.log('Error on Change password', error);
              } finally {
                setLoading(false);
              }
            }}>
            {({handleChange, handleSubmit, values, errors, touched}) => (
              <View style={styles.formContainer}>
                <PrimaryInput
                  label={'Old Password'}
                  value={values.oldPassword}
                  setValue={handleChange('oldPassword')}
                  isPassword={true}
                />
                {errors.oldPassword && touched.oldPassword ? (
                  <Text style={[styles.errorMessage,{ color: colors.error,}]}>{errors.oldPassword}</Text>
                 
                ) : null}
                <PrimaryInput
                  label={'New Password'}
                  value={values.nPassword}
                  setValue={handleChange('nPassword')}
                  isPassword={true}
                />
                {errors.nPassword && touched.nPassword ? (
                  <Text style={[styles.errorMessage,{ color: colors.error,}]}>{errors.nPassword}</Text>
              
                ) : null}
                <PrimaryInput
                  label={'Confirm Password'}
                  value={values.cPassword}
                  setValue={handleChange('cPassword')}
                  isPassword={true}
                />
                {errors.cPassword && touched.cPassword ? (
                  <Text style={[styles.errorMessage,{ color: colors.error,}]}>{errors.cPassword}</Text>
                
                ) : null}
                <View style={styles.btnView}>
                  <ThemeButton
                    text={'Submit'}
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
   
  },
  main: {
    marginTop: '20%',
    marginHorizontal: '7%',
  },
  centeredView: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  logo: {
    height: 100,
    width: 135,
    marginVertical: 10,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
   
   
    marginVertical: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 13,
   
   
    alignSelf: 'flex-start',
  },
  btnView: {
    paddingVertical: 30,
    width: '100%',
  },
});
