import {Alert} from 'react-native';
import {getStreamPasswords} from '../services/dataManager';
import {fetchCoupon, fetcPlayerData} from '../services/axios/apiManager';
import publicIp from 'react-native-public-ip';
const getPublicIpAddress = async () => {
  try {
    const ip = await publicIp();
    //console.log('Public IP address:', ip);
    return ip;
  } catch (error) {
    console.log('Error fetching public IP address:', error);
    return null;
  }
};
export const getDataForPlayer = async (
  id,
  setLoading,
  setStream,
  setStreamItem,
  setListTitle,
  setIsPaused,
  setState,
  setContentNotAvailable,
  setIsOtherPremium,
  setIsSubScriptionBased,
  isLoggedIn,
  navigation,
  ispasswordProtected,
) => {
  try {
    setLoading(true);
    // const ip = 'MTU0LjE5Mi4xMzguMzY=';
    const ip = await getPublicIpAddress();
    if (!ip) {
      throw new Error('Unable to fetch public IP address');
    }
    const StreamResponse = await fetcPlayerData(id, ip);
    if (StreamResponse?.data?.geoerror) {
      setContentNotAvailable(true);
    } else if (StreamResponse?.data?.app?.stream_details) {
      setStream(StreamResponse.data.app.stream_details);
      setStreamItem(StreamResponse.data.app.latest_items.streams);
      setListTitle(StreamResponse.data.app.latest_items.title);
      const {password, limit_watch_time, monetization_type, is_buyed} =
        StreamResponse.data.app.stream_details;
      const isPassed = await checkOrAskePassword(
        password,
        setIsPaused,
        setState,
      );
      if (isPassed && limit_watch_time === 'no') {
        if (!ispasswordProtected) {
          if (monetization_type !== 'F' && is_buyed === 'N') {
            if (!isLoggedIn) {
              setIsPaused(true);
              navigation.navigate('authStack', {
                screen: 'login',
              });
            } else {
              if (monetization_type === 'S') {
                setIsPaused(true);
                setIsSubScriptionBased(true);
              } else {
                setIsPaused(true);
                setIsOtherPremium(true);
              }
            }
          } else {
            setIsPaused(false);
          }
        }
      } else {
        setIsPaused(false);
      }
    }
  } catch (error) {
    console.log('Error On Getting stream data :', error);
  } finally {
    setLoading(false);
  }
};

const checkOrAskePassword = async (password, setIsPaused, setState) => {
  if (password && password !== null) {
    const passwords = await getStreamPasswords();
    if (passwords?.length > 0) {
      const savedPassword = passwords.some(
        item => item.stream_password === password,
      );
      if (savedPassword) {
        setIsPaused(false);
        setState(prev => ({...prev, ispasswordProtected: false}));
        return true;
      } else {
        setIsPaused(true);
        setState(prev => ({...prev, ispasswordProtected: true}));
        return false;
      }
    }
  } else {
    setState(prev => ({...prev, ispasswordProtected: false}));
    setIsPaused(false);
    return true;
  }
};

export const getStreamCoupon = async data => {
  try {
    const response = await fetchCoupon(data);
    return response;
  } catch (error) {
    console.log('Error on Fetching Coupon', error);
  }
};

export const getPositionStyle = position => {
  switch (position) {
    case 'top-left':
      return {justifyContent: 'flex-start', alignItems: 'flex-start'};
    case 'top-right':
      return {justifyContent: 'flex-start', alignItems: 'flex-end'};
    case 'left-top':
      return {justifyContent: 'flex-start', alignItems: 'flex-start'};
    case 'right-top':
      return {justifyContent: 'flex-start', alignItems: 'flex-end'};
    case 'top-center':
      return {justifyContent: 'flex-start', alignItems: 'center'};
    case 'bottom-left':
      return {justifyContent: 'flex-end', alignItems: 'flex-start'};
    case 'left-bottom':
      return {justifyContent: 'flex-end', alignItems: 'flex-start'};
    case 'bottom-right':
      return {justifyContent: 'flex-end', alignItems: 'flex-end'};
    case 'right-bottom':
      return {justifyContent: 'flex-end', alignItems: 'flex-end'};
    case 'bottom-center':
      return {justifyContent: 'flex-end', alignItems: 'center'};
    case 'center':
      return {alignItems: 'center', justifyContent: 'center'};
    case 'left-center':
      return {alignItems: 'flex-start', justifyContent: 'center'};
    case 'right-center':
      return {alignItems: 'flex-end', justifyContent: 'center'};
    default:
      return {justifyContent: 'center', alignItems: 'center'};
  }
};