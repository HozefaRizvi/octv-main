import React, {useEffect} from 'react';
import {TouchableOpacity, Image, StyleSheet, View, Alert} from 'react-native';
import { useColorContext } from '../services/state/colorsContext';
import {useAppContext} from '../services/state/context';
import {
  fetchStripePaymentIntent,
  storePaymentDetails,
} from '../services/axios/apiManager';
import {usePlatformPay} from '@stripe/stripe-react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useNavigation} from '@react-navigation/native';
import {GPMerchId, GPMerchName} from '../services/axios/eps';

const GPaySheet = ({
  stream,
  plan,
  setLoading,
  setInfo,
  movie,
  getDataAgain,
  getData,
  setIsSubScriptionBased,
  setIsOtherPremium,
  amount,
}) => {
  const navigation = useNavigation();
  const stripe = useStripe();
  const {state} = useAppContext();
  const {isPlatformPaySupported, confirmPlatformPayPayment} = usePlatformPay();
  const {user} = state;
   const { colors } = useColorContext();
  const checkIsPlatformPaySupported = async () => {
    if (!(await isPlatformPaySupported({googlePay: {testEnv: true}}))) {
      Alert.alert('Google Pay is not supported.');
      return false;
    } else {
      return true;
    }
  };
  const onPressGpay = async () => {
    try {
      setInfo('');
      setLoading(true);
      const check = await checkIsPlatformPaySupported();
      if (!check) {
        return;
      }
      //Fetch Payment intent from backend
      const data = {
        monetization_type:
          stream?.monetization_type || movie?.monetization_type,
        amount: amount,
      };
      const intentResponse = await fetchStripePaymentIntent(data);
      if (intentResponse?.data?.ephemeralKey) {
        //open payment sheet
        const clientSeceret = intentResponse.data.payment.client_secret;
        const {error} = await confirmPlatformPayPayment(clientSeceret, {
          googlePay: {
            testEnv: false,
            merchantName: GPMerchName,
            merchantId: GPMerchId,
            merchantCountryCode: 'US',
            currencyCode: 'USD',
            billingAddressConfig: {
              isPhoneNumberRequired: false,
              isRequired: false,
            },
          },
        });

        if (error) {
          Alert.alert(error.code, error.message);
          console.log('Error on Gpay : ', {
            Reason: error.code,
            message: error.message,
          });
          return;
        }
        setInfo('Verifying payment!');
        // Verifying the payment from stripe
        const paymentIntent = await stripe.retrievePaymentIntent(
          intentResponse.data.payment.client_secret,
        );
        if (paymentIntent) {
          if (paymentIntent?.paymentIntent?.status === 'Succeeded') {
            const paymentData = {
              amount: plan?.plan_amount || stream?.amount || movie?.amount,
              monetizationGuid:
                plan?.sub_plan_guid ||
                stream?.stream_guid ||
                movie?.stream_guid,
              monetization_type:
                stream?.monetization_type || movie?.monetization_type,
              transaction_id: paymentIntent.paymentIntent.id,
              payment_information: paymentIntent.paymentIntent,
            };
            // Saving a successful payment details to backend
            const storeResponse = await storePaymentDetails(paymentData);
            if (storeResponse?.data?.payment_code) {
              Alert.alert(
                'Success',
                storeResponse.data.message ||
                  'Payment is successfuly completed.',
              );
            }
            if (setIsSubScriptionBased && setIsOtherPremium) {
              if (
                stream?.monetization_type === 'S' ||
                movie?.monetization_type === 'S'
              ) {
                setIsOtherPremium(false);
                setIsSubScriptionBased(false);
                navigation.goBack();
                typeof getData === 'function' ? getData() : getDataAgain();
              } else {
                setIsOtherPremium(false);
                setIsSubScriptionBased(false);
                typeof getData === 'function' ? getData() : getDataAgain();
              }
            }
          } else {
            Alert.alert('Alert', 'Payment failed or was incomplete.');
          }
        } else {
          Alert.alert(
            'Alert',
            'Cannot verify the payment right now, try again later.',
          );
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {}, []);
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.optContainer,{ backgroundColor: colors.white,}]}
        onPress={() => {
          onPressGpay();
        }}>
        <Image source={require('../assets/images/GPay.png')} />
      </TouchableOpacity>
    </View>
  );
};
export default GPaySheet;

const styles = StyleSheet.create({
  optContainer: {
    height: 46,
    width: 50,
    borderRadius: 5,
   
    alignItems: 'center',
    justifyContent: 'center',
  },
});
