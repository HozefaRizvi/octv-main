import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {colors} from '../assets/colors';
import {fetchPayPalPaymentIntent} from '../services/axios/apiManager';
import WebView from 'react-native-webview';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useColorContext } from '../services/state/colorsContext';
const PayPalSheet = ({
  stream,
  plan,
  amount,
  movie,
  setLoading,
  loading,
  setInfo,
}) => {
  const [approvalUrl, setApprovalUrl] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
   const { colors } = useColorContext();
  const onPressPaypal = async () => {
    try {
      setLoading(true);
      const data = {
        monetization_type:
          stream?.monetization_type || movie?.monetization_type,
        amount: stream.amount,
      };
      const response = await fetchPayPalPaymentIntent(data);
      if (response?.data?.links && response?.data?.links?.length > 0) {
        const temp = response.data.links.find(f => f.rel === 'approve').href;
        setApprovalUrl(temp);
        setOpenPaymentModal(!openPaymentModal);
        const capURL = response.data.links.find(f => f.rel === 'capture').href;
        setCaptureUrl(capURL);
      } else {
        Alert.alert('Alert', 'Something went wrong please try again later.');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.optContainer,{ backgroundColor: colors.white,}]}
        onPress={() => {
          onPressPaypal();
        }}>
        <Image source={require('../assets/images/payPal.png')} />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openPaymentModal}
        onRequestClose={() => {
          setOpenPaymentModal(!openPaymentModal);
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView,{ color: colors.black, backgroundColor: colors.white,shadowColor: colors.black,}]}>
            <View style={styles.btnView}>
              <TouchableOpacity
                style={[styles.btn,{backgroundColor: colors.theme,}]}
                onPress={() => {
                  setOpenPaymentModal(!openPaymentModal);
                }}>
                <AntDesignIcon name="close" color={colors.white} size={28} />
              </TouchableOpacity>
            </View>
            <WebView
              source={{uri: approvalUrl}}
              onNavigationStateChange={navState => {
                // Handle PayPal success/cancel redirects
                if (navState.url.includes('https://your-success-url')) {
                  Alert.alert(
                    'Payment successful!',
                    'Your payment has been processed.',
                  );
                } else if (navState.url.includes('https://your-cancel-url')) {
                  Alert.alert('Payment canceled', 'The payment was canceled.');
                } else {
                  Alert.alert('Payment canceled', 'The payment was canceled.');
                }
              }}
            />
            {loading && (
              <ActivityIndicator size={'large'} color={colors.theme} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default PayPalSheet;

const styles = StyleSheet.create({
  optContainer: {
    height: 46,
    width: 50,
    borderRadius: 5,
   
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
   
    width: '95%',
    height: '90%',
   
    borderRadius: 10,
    paddingVertical: 10,
    
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
  },
  btnView: {
    height: '6%',
  },
  btn: {
    position: 'absolute',
    top: 0,
    right: 10,
    height: 38,
    width: 38,
    borderRadius: 10,
    
    justifyContent: 'center',
    alignItems: 'center',
  },
});
