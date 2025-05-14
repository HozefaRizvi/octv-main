import React, {useEffect} from 'react';
import {P_KEY, supaBaseUrl} from './src/services/axios/eps';
import DeviceInfo from 'react-native-device-info';
import RootStack from './src/navigation/rootStack';
import {StripeProvider} from '@stripe/stripe-react-native';
import {AppContextProvider} from './src/services/state/context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {setDeviceId} from './src/services/dataManager';
import { HotUpdater } from "@hot-updater/react-native";
import { ColorContextProvider } from './src/services/state/colorsContext';
function App(): React.JSX.Element {
  useEffect(() => {
    const hideNavigationTimeout = setTimeout(() => {
      SystemNavigationBar.stickyImmersive();
    }, 3000);
    return () => clearTimeout(hideNavigationTimeout);
  }, []);
  useEffect(() => {
    const getSyncUniqueId = async () => {
      DeviceInfo.syncUniqueId().then(async uniqueId => {
        if (uniqueId) {
          await setDeviceId(uniqueId);
        }
      });
    };
    getSyncUniqueId();
  }, []);
  
  return (
    <StripeProvider
      publishableKey={P_KEY}
      merchantIdentifier="merchant.identifier">

      <AppContextProvider>
        <ColorContextProvider>
        <RootStack />
        </ColorContextProvider>
      </AppContextProvider>
    </StripeProvider>
  );
}


export default HotUpdater.wrap({ 
  source:supaBaseUrl, 
  reloadOnForceUpdate:true
})(App);
