import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {fetchTransactionHistory} from '../../services/axios/apiManager';
import { useAppContext } from '../../services/state/context';
const TransactionHistory = () => {
  const navigation = useNavigation();
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
   const {state} = useAppContext();
   const { colors } = useColorContext();
  const {logo} = state;
  useEffect(() => {
    const getTransactionHistory = async () => {
      try {
        setLoading(true);
        const response = await fetchTransactionHistory();
        if (response?.data) {
          setTransactionHistory(response.data);
        }
      } catch (error) {
        console.log('Error on Transaction History', error);
      } finally {
        setLoading(false);
      }
    };
    getTransactionHistory();
  }, []);

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
          <Text style={[styles.heading,{color: colors.theme,}]}>Transaction History</Text>
        </View>
      </View>
      <View style={[styles.list,{backgroundColor: colors.dull,}]}>
        {loading && <ActivityIndicator color={colors.theme} size={'large'} />}
        {!loading && transactionHistory && transactionHistory.length <= 0 && (
          <View style={styles.noDataView}>
            <Text style={[styles.noDataTxt,{color: colors.white,}]}>
              You dont have any watch history yet!
            </Text>
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          {transactionHistory &&
            transactionHistory?.length > 0 &&
            transactionHistory.map(item => (
              <View style={[styles.listItem,{borderBottomColor: colors.lightGray,}]} key={item.transaction_id}>
                <View style={styles.row}>
                  <Text style={[styles.key,{ color: colors.white,}]}>Plan Name</Text>
                  <Text style={[styles.value,{ color: colors.white,}]}>{item.plan_name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.key,{ color: colors.white,}]}>Plan Type</Text>
                  <Text style={[styles.value,{ color: colors.white,}]}>{item.plan_type}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.key,{ color: colors.white,}]}>Transaction Id</Text>
                  <Text style={[styles.value,{ color: colors.white,}]}>{item.transaction_id}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.key,{ color: colors.white,}]}>Amount</Text>
                  <Text style={[styles.value,{ color: colors.white,}]}>{item.amount}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.key,{ color: colors.white,}]}>Status</Text>
                  <Text style={[styles.value,{ color: colors.white,}]}>{item.plan_status}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.key,{ color: colors.white,}]}>Expired On</Text>
                  <Text style={[styles.value,{ color: colors.white,}]}>{item.expiry_date}</Text>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default TransactionHistory;

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
    width: 140,
    marginVertical: 5,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginVertical: 20,
  },
  list: {
    flex: 1,
    padding: '7%',
  },
  listItem: {
    paddingVertical: 10,
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  key: {
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    fontSize: 14,

  },
  noDataView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataTxt: {
    fontSize: 16,
  },
});
