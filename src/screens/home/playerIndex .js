import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../../services/state/context';
import { Alert, Platform } from 'react-native';
const PlayerIndex = ({ stream, isPasswordAccepted }) => {
  const navigation = useNavigation();
  const { state } = useAppContext();
  const { isLoggedIn } = state;
  const { colors } = useColorContext();

  const handleNavigation = () => {
    if (!isPasswordAccepted) {
      return;
    }
    const { limit_watch_time, monetization_type, isByed } = stream;

    if (limit_watch_time === "no") {
      switch (monetization_type) {
        case "S":
          if (isLoggedIn) {
            navigation.navigate('SubscriptionPlans', { stream });
          } else {
            navigation.navigate('Login', {
              from: 'CheckPassword', 
              stream,
            });
          }
          break;
        case "P":
        case "O":
          if (isLoggedIn) {
            if(Platform.OS === 'android'){
            navigation.navigate('OrderSummary', { stream });
            }
            else{
              Alert.alert('Error', 'Sorry no payment available yet')
            }
            
          } else {
            navigation.navigate('Login', {
              from: 'CheckPassword', 
              stream,
            });
          }
          break;
        case "F":
          navigation.navigate('Player', { stream });
          break;
        default:
          break;
      }
    }
  };

  React.useEffect(() => {
    handleNavigation();
  }, [isPasswordAccepted, stream]);

  return null; 
};

export default PlayerIndex;
