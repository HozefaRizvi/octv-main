import React from 'react';
import {TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import {useAppContext} from '../services/state/context';
import {useNavigation} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';
import { useColorContext } from '../services/state/colorsContext';
import {
  fetchStripePaymentIntent,
  storePaymentDetails,
} from '../services/axios/apiManager';

const StripeSheet = ({
  stream,
  plan,
  setLoading,
  setInfo,
  movie,
  getDataAgain,
  getData,
  amount,
  setIsSubScriptionBased,
  setIsOtherPremium,
}) => {
  const navigation = useNavigation();
  const stripe = useStripe();
  const {state} = useAppContext();
  const {user} = state;
  const {initPaymentSheet} = useStripe();
      const { colors } = useColorContext();

  const onPressStripe = async () => {
    try {
      setInfo('');
      setLoading(true);
      const data = {
        monetization_type:
          stream?.monetization_type || movie?.monetization_type,
        amount: amount,
      };
      // console.log('data ', data);
      //Fetch Payment intent from backend
      const intentResponse = await fetchStripePaymentIntent(data);
      if (intentResponse?.data?.ephemeralKey) {
        const initSheet = await initPaymentSheet({
          merchantDisplayName: 'ss',
          customerId: intentResponse.data.payment.customer_id,
          customerEphemeralKeySecret: intentResponse.data.ephemeralKey,
          paymentIntentClientSecret: intentResponse.data.payment.client_secret,
          allowsDelayedPaymentMethods: true,
          defaultBillingDetails: {
            name: user?.name,
          },
        });
        if (initSheet.error) {
          return Alert.alert(initSheet.error.message);
        }
        //open payment sheet
        const presentSheet = await stripe.presentPaymentSheet({
          clientSecret: intentResponse.data,
        });
        if (presentSheet.error) {
          console.log('Error on Presenting sheet', presentSheet.error);
        }
        // Verifying the payment from stripe
        setInfo('Verifying payment!');
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
            Alert.alert('Success', 'Payment was successfuly completed.');
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
      Alert.alert(
        'Alert',
        'Payment cannot be processed right now, please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.optContainer,{ backgroundColor: colors.white,}]}
      onPress={() => {
        onPressStripe();
      }}>
      <Image
        style={styles.optImg}
        source={require('../assets/images/creditCards.png')}
      />
    </TouchableOpacity>
  );
};
export default StripeSheet;

const styles = StyleSheet.create({
  optContainer: {
    height: 46,
    width: 50,
    borderRadius: 5,
   
    alignItems: 'center',
    justifyContent: 'center',
  },
  optImg: {height: 26, width: 42},
});
