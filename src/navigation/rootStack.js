import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/splash/splash';
import MainStack from './mainStack';
import { useAppContext } from '../services/state/context';
import { useColorContext } from '../services/state/colorsContext';
import { fetcConfigData, checkAlertsEnabled } from '../services/axios/apiManager';
import { getUserData } from '../services/dataManager';
import HomeStack from './homeStack';

function RootStack() {
  const [loading, setLoading] = useState(true);
  const { setState } = useAppContext();
  const { setColor } = useColorContext();

  useEffect(() => {
    const init = async () => {
      try {
        const [configRes, userData, alertsRes] = await Promise.all([
          fetcConfigData(),
          getUserData(),
          checkAlertsEnabled(),
        ]);

        const config = configRes?.data?.data;
        const appInfo = config.app_info;
        const menus = config?.menus || [];

        // Set colors early
        if (config.website_colors) {
          const wc = config.website_colors;
          setColor({
            theme: wc.themeActiveColor,
            dull: wc.bgcolor,
            white: wc.themePrimaryTxtColor,
            share: wc.themeSecondaryTxtColor,
            description: wc.cardDesColor,
            copied: wc.headerBgColor,
            number: wc.navbarSearchColor,
            darkRed: wc.footerbtmBgcolor,
            gray: wc.navbarSearchColor,
            
          });
        }

        // Menu mapping
        const sortedMenus = menus.sort((a, b) => a.menu_order - b.menu_order);
        const tempMenu = {};
        sortedMenus.forEach(menu => {
          if (!['Profile', 'Search'].includes(menu.menu_title)) {
            tempMenu[menu.menu_title] = HomeStack;
          }
        });

        const isAnnouncementValid =
          new Date(appInfo?.announcement?.announcement_end_date) > new Date();

        setState(prev => ({
          ...prev,
          alertsEnabled: alertsRes?.data?.subscribed || false,
          isLoading: false,
          logo: appInfo?.website_logo,
          menus,
          pages: config?.pages || [],
          user: userData,
          isLoggedIn: !!userData?.user_code,
          announcement: isAnnouncementValid ? appInfo?.announcement : {},
          showSignUpButton: config?.is_signup_btn_show || 'Y',
          showWatchHistory: config?.watch_history || 1,
          showManageProfiles: config?.profile_manage || 1,
          isBypassLogin: appInfo?.is_bypass_login || '',
          subOnSignup: appInfo?.subscription_on_signup || '',
          isEmailVerificationEnabled: appInfo?.email_verified === 1,
          isGamifiedContentEnabled: appInfo?.badge_status === 1,
          byPassDetailScreen: appInfo?.bypass_detailscreen === '1',
          menuTabsOptions: tempMenu,
          appColors: config?.website_colors,
        }));
      } catch (e) {
        setState(prev => ({ ...prev, isLoading: false }));
      } finally {
        setLoading(false); // ✅ Don't force delay
      }
    };

    init();
  }, [setState, setColor]);

  return (
    <NavigationContainer>
      {loading ? <Splash /> : <MainStack />}
    </NavigationContainer>
  );
}

export default RootStack;
