import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  BackHandler,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { fetchSubPlans } from '../../services/axios/apiManager';
import { useRoute } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { useColorContext } from '../../services/state/colorsContext';

const SubscriptionPlans = ({
  stream,
  getData,
  setIsSubScriptionBased,
  setIsOtherPremium,
}) => {
  const navigation = useNavigation();
  // const route = useRoute();
  const { width } = useWindowDimensions();
  // const {stream} = route.params;
  const [plans, setPlans] = useState([]);
  
    const {colors} = useColorContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPlans = async () => {
      try {
        const response = await fetchSubPlans();
        // console.log('Response : ', response.data);
        if (response?.data?.s_plan) {
          setPlans(response.data.s_plan);
        }
      } catch (error) {
        console.log('Error upon fetching plans', error);
      } finally {
        setLoading(false);
      }
    };
    getPlans();
  }, []);

  const handlePressPlan = plan => {
    if (Platform.OS === 'android') {
      navigation.navigate('OrderSummary', {
        getDataAgain: getData,
        stream: stream,
        plan: plan,
        changeIsSubScriptionBased: setIsSubScriptionBased,
        changeIsOtherPremium: setIsOtherPremium,
      });
    }
    else {
      Alert.alert('Error', 'Sorry no payment available yet')
    }
  };
  // useEffect(() => {
  //   const backAction = () => {
  //     // navigation.navigate('Detailed', {id: stream.stream_guid});
  //     navigation.pop();
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, [navigation, stream?.stream_guid]);
  const tagsStyles = {
    p: {
      color: colors.DarkGray,
      fontSize: 15,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 10,
    },
  };
  return (
    <View style={[styles.container,{  backgroundColor: colors.dull,}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <IonIcon name={'chevron-back'} size={30} color={colors.white} />
          </TouchableOpacity>
          <Text style={[styles.mainHeading,{ color: colors.white,}]}>Slect a plan to continue</Text>
        </View>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        )}
        {plans?.length > 0 &&
          plans.map(plan => (
            <View key={plan.sub_plan_guid} style={styles.list}>
              <View style={styles.listItem}>
                <View style={[styles.itemHeader,{ backgroundColor: colors.black,}]}>
                  <Text style={ [  styles.headingTxt,{color: colors.white,}]}>{plan.plan_name}</Text>
                  <Text style={[styles.amountTxt,{color: colors.theme,}]}>{plan.plan_amount}</Text>
                  <Text
                    style={
                    [  styles.headingTxt,{color: colors.white,}]
                    }>{`Every ${plan.plan_faq} ${plan.plan_period}`}</Text>
                </View>
                <View style={styles.itemBody}>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: plan.plan_desc }}
                    tagsStyles={tagsStyles}
                  />
                  <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.7}
                    onPress={() => {
                      handlePressPlan(plan);
                    }}>
                    <Text style={styles.btnTxt}>Subscribe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '5%',
  
    paddingTop: '10%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeading: {
   
    fontSize: 24,
    fontWeight: '700',
  },
  list: {
    width: '100%',
    marginVertical: 10,
  },
  listItem: {
    width: '100%',
  },
  itemHeader: {
    alignItems: 'center',
   
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headingTxt: {
    
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
  },
  amountTxt: {
    
    fontSize: 35,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemBody: {
    alignItems: 'center',
    backgroundColor: colors.white,
    width: '100%',
    paddingVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  descTxt: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
  },
  btn: {
    height: 50,
    width: '50%',
    borderColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme,
    borderRadius: 10,
    marginTop: 10,
  },
  btnTxt: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '500',
  },
});
};

export default SubscriptionPlans;

