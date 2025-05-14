import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PrimaryInput from '../../components/inputs/PrimaryInput';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../components/modals/loader';
import {useRoute} from '@react-navigation/native';
import {plans} from '../../services/staticData';
import {styles} from './orderSummaryStyles';

import StripeSheet from '../../components/stripeSheet';
import PayPalSheet from '../../components/payPalSheet';
import GPaySheet from '../../components/gpaySheet';
import {getStreamCoupon} from '../../components/playerMethods';
import {useColorContext} from '../../services/state/colorsContext';

const OrderSummary = ({
  movie,
  getData,
  setIsSubScriptionBased,
  setIsOtherPremium,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const {colors} = useColorContext();
  const platformOS = Platform.OS;
  const {
    stream,
    plan,
    getDataAgain,
    changeIsSubScriptionBased,
    changeIsOtherPremium,
  } = route.params;
  const [coupounCode, setCoupounCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [info, setInfo] = useState('');
  const [ammount, setAmmount] = useState(
    plan?.plan_amount || stream?.amount || movie?.amount || 0,
  );
  const checkCoupon = async () => {
    if (applyingCoupon) {
      return;
    }
    try {
      setApplyingCoupon(true);
      const data = {
        offer: coupounCode,
        monetization_guid:
          plan?.sub_plan_guid ||
          movie?.monetization_guid ||
          stream?.monetization_guid,
        monetization_type:
          movie?.monetization_type || stream?.monetization_type,
      };
      const response = await getStreamCoupon(data);
      if (
        response?.data?.data?.expiry_date &&
        response?.data?.data?.final_amount
      ) {
        const {expiry_date, final_amount, used_count, max_usage} =
          response.data.data;
        const isDateValid = new Date(expiry_date) > new Date();

        if (!isDateValid) {
          Alert.alert(
            'Sorry',
            response?.data?.data?.msg || 'This coupon is expired',
          );
        } else if (used_count > max_usage) {
          Alert.alert(
            'Sorry',
            response?.data?.data?.msg || 'Coupon usage exeeded!',
          );
        } else {
          setAmmount(final_amount);
          setCouponApplied(true);
        }
      } else {
        Alert.alert('Alert', response?.data?.data?.msg || 'Coupon not found');
      }
    } catch (error) {
      Alert.alert('Alert', 'Coupon not found');
      console.log('Error upon Coupon checking', error);
    } finally {
      setApplyingCoupon(false);
    }
  };
  const removeCouponPressed = () => {
    Alert.alert('Alert', 'Do you want to remove coupon?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => handleRemoveCoupon()},
    ]);
  };
  const handleRemoveCoupon = () => {
    setAmmount(plan?.plan_amount || stream?.amount || movie?.amount);
    setCouponApplied(false);
  };
  const handleCancelOrder = () => {
    Alert.alert(
      'Oops, Try Again !',
      '',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={[styles.container, {backgroundColor: colors.dull}]}>
      <ScrollView>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            navigation.goBack();
            // navigation.navigate('Detailed', {
            //   id: stream?.stream_guid || movie?.stream_guid,
            // });
          }}>
          <IonIcon name={'chevron-back'} size={30} color={colors.white} />
        </TouchableOpacity>
        <View
          style={[
            styles.imgContainer,
            {backgroundColor: colors.black, borderColor: colors.lightGray},
          ]}>
          <Image
            source={{uri: stream?.stream_poster || movie?.stream_poster}}
            style={styles.img}
          />
        </View>
        <View
          style={[styles.summaryContainer, {backgroundColor: colors.black}]}>
          <Text style={[styles.heading, {color: colors.theme}]}>
            Order Summary
          </Text>
          <Text style={[styles.name, {color: colors.white}]}>
            {stream?.stream_title || movie?.stream_title}
          </Text>
          <View style={styles.keyValue}>
            <Text style={[styles.key, {color: colors.theme}]}>Plan Type:</Text>
            <Text style={[styles.value, {color: colors.white}]}>
              {plans[stream?.monetization_type] ||
                plans[movie?.monetization_type]}
            </Text>
          </View>
          <View style={styles.keyValue}>
            <Text style={[styles.key, {color: colors.theme}]}>
              Plan Validity:
            </Text>
            {plan?.plan_faq && plan?.plan_period ? (
              <Text style={[styles.value, {color: colors.white}]}>
                {`${plan?.plan_faq || ''} ${plan?.plan_period || ''}`}
              </Text>
            ) : stream?.planFaq || stream?.plan_period ? (
              <Text style={[styles.value, {color: colors.white}]}>
                {`${stream?.planFaq || ''} ${stream?.plan_period || ''}`}
              </Text>
            ) : movie?.planFaq || movie?.plan_period ? (
              <Text style={[styles.value, {color: colors.white}]}>
                {`${movie?.planFaq || ''} ${movie?.plan_period || ''}`}
              </Text>
            ) : null}
          </View>
          {couponApplied ? (
            <View>
              <View style={styles.cpnApplied}>
                <Text style={[styles.cpnApldTxt, {color: colors.theme}]}>
                  Coupon successfully applied!
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeCouponPressed()}
                activeOpacity={0.7}
                style={styles.cpnApplied}>
                <Text style={[styles.cpnApldTxt, {color: colors.theme}]}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponContainer}>
              <View style={styles.inputContainer}>
                <PrimaryInput
                  label={'Enter Coupon Code'}
                  value={coupounCode}
                  setValue={setCoupounCode}
                />
              </View>
              <TouchableOpacity
                style={[styles.couponBtn, {backgroundColor: colors.theme}]}
                activeOpacity={0.7}
                onPress={() => {
                  checkCoupon();
                }}>
                {applyingCoupon ? (
                  <ActivityIndicator size={'small'} color={colors.white} />
                ) : (
                  <Text style={[styles.couponBtnTxt, {color: colors.white}]}>
                    Apply
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          <View
            style={[
              styles.ammountContainer,
              {
                backgroundColor: colors.black,
                fontSize: 15,

                fontWeight: '500',
              },
            ]}>
            <Text
             style={[
              styles.ammountContainer,
              {
                backgroundColor: colors.black,
                fontSize: 15,

                fontWeight: '500',
              },
            ]}>
              Amount
            </Text>
            <Text  style={[
              styles.ammountContainer,
              {
                backgroundColor: colors.theme,
                fontSize: 15,

                fontWeight: '500',
              },
            ]}>
              {` $${parseFloat(ammount).toFixed(2)}`}
            </Text>
          </View>
          <Text style={styles.heading}>Pay with</Text>
          <View style={styles.POptContainer}>
            <PayPalSheet
              stream={stream}
              plan={plan}
              amount={ammount}
              movie={movie}
              setLoading={setLoading}
              loading={loading}
              setInfo={setInfo}
            />
            {platformOS === 'android' && (
              <GPaySheet
                stream={stream}
                amount={ammount}
                plan={plan}
                movie={movie}
                setLoading={setLoading}
                loading={loading}
                setInfo={setInfo}
                getDataAgain={getDataAgain}
                getData={getData}
                setIsSubScriptionBased={
                  changeIsSubScriptionBased || setIsSubScriptionBased
                }
                setIsOtherPremium={changeIsOtherPremium || setIsOtherPremium}
              />
            )}
            <StripeSheet
              stream={stream}
              plan={plan}
              amount={ammount}
              movie={movie}
              setLoading={setLoading}
              loading={loading}
              setInfo={setInfo}
              getDataAgain={getDataAgain}
              getData={getData}
              setIsSubScriptionBased={
                changeIsSubScriptionBased || setIsSubScriptionBased
              }
              setIsOtherPremium={changeIsOtherPremium || setIsOtherPremium}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.cancelBtn,{ borderColor: colors.theme,}]}
            onPress={handleCancelOrder}>
            <Text style={[styles.btnTxt,{ color: colors.white,}]}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Loader openLoader={loading} setOpenLoader={setLoading} info={info} />
    </View>
  );
};
export default OrderSummary;
