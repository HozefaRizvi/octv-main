import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '../services/state/context';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FA6Icon from 'react-native-vector-icons/FontAwesome6';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  setActiveProfile,
  setUserData,
  setUserToken,
} from '../services/dataManager';
import RNRestart from 'react-native-restart';

import {
  checkAlertsEnabled,
  deleteUserAccount,
  toggleEnableAlerts,
} from '../services/axios/apiManager';
import Loader from '../components/modals/loader';
import { useColorContext } from '../services/state/colorsContext';
const CustomDrawerContent = ({props}) => {
  const navigation = useNavigation();
    const { colors } = useColorContext();
  const {state, setState} = useAppContext();
  const {
    isLoggedIn,
    user,
    alertsEnabled,
    activeProfile,
    showSignUpButton,
    showManageProfiles,
    showWatchHistory,
    isGamifiedContentEnabled,
    menus,
    menuTabsOptions,
    pages
  } = state;
  const [togglingAlert, setTogglingAlert] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const signOutPressed = () => {
    Alert.alert('Alert', 'Do you want to Sign Out from this account?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => handleSignOut()},
    ]);
  };
  const handleSignOut = async () => {
    await setUserData({});
    await setUserToken('');
    await setActiveProfile({});
    RNRestart.restart();
  };
  const handleToggleAlerts = async () => {
    try {
      setTogglingAlert(true);
      const response = await toggleEnableAlerts();
      if (response?.status === 201 || response?.status === 204) {
        const checkAlerts = await checkAlertsEnabled();
        if (checkAlerts?.data) {
          setState(prev => ({
            ...prev,
            alertsEnabled: checkAlerts.data.subscribed,
          }));
        }
      }
    } catch (error) {
      console.log('Error upon Toggling Alerts', error);
    } finally {
      setTogglingAlert(false);
    }
  };
  const deleteAccountPressed = () => {
    Alert.alert('Alert', 'Your account will be deleted permanently?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => handleDeleteAccount()},
    ]);
  };
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      const response = await deleteUserAccount({
        requestAction: 'deleteUserAccount',
      });
      if (response?.data?.app?.status === 1) {
        await setUserToken('');
        await setUserData({});
        await setActiveProfile({});
        setState(prev => ({
          ...prev,
          user: '',
          isLoggedIn: false,
        }));
        RNRestart.restart();
      } else {
        if (response?.data?.app?.msg) {
          Alert.alert('Alert ', response.data.app.msg);
        } else {
          Alert.alert('Alert', 'Something went wrong, please try again later');
        }
      }
    } catch (error) {
      console.log('ERROR Upon Deleting Account : ', error);
    } finally {
      setDeletingAccount(false);
    }
  };
  const isAboutUsShown = menus?.some(menu => menu?.menu_slug === 'about-us');
   const isPrivacyPolicyPageShown = pages?.find(page => page?.page_slug === 'privacy-policy');
    const isTermsConditionShown = pages?.find(page => page?.page_slug === 'terms-of-service');
  return (
    <DrawerContentScrollView {...props}>
      {isLoggedIn ? (
        <View>
          <View style={styles.profileSection}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.item}
              // onPress={() => navigation.navigate('Login')}
            >
              <View style={[styles.profileIconContainer,{ backgroundColor: colors.theme,}]}>
                <FA6Icon name={'user-large'} color={colors.white} size={25} />
              </View>
              <Text style={[styles.labelBold,{  color: colors.white,}]}>
                {activeProfile?.name || user?.name || ''}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() =>
              navigation.navigate('authStack', {
                screen: 'profileList',
              })
            }>
            <FA6Icon name={'user-large'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Profile</Text>
          </TouchableOpacity>
          {showManageProfiles && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.item}
              onPress={() => {
                navigation.navigate('drawerStack', {
                  screen: 'manageProfile',
                });
              }}>
              <FA6Icon name={'user-gear'} color={colors.white} size={25} />
              <Text  style={[styles.label,{ color: colors.white,}]}>Manage Profiles</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => {
              navigation.navigate('drawerStack', {
                screen: 'changePassword',
              });
            }}>
            <FA6Icon name={'lock'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => {
              navigation.navigate('drawerStack', {
                screen: 'transactionHistory',
              });
            }}>
            <MCIcon
              name={'clipboard-text-clock'}
              color={colors.white}
              size={25}
            />
            <Text  style={[styles.label,{ color: colors.white,}]}>Transaction History</Text>
          </TouchableOpacity>
          {showWatchHistory && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.item}
              onPress={() => {
                navigation.navigate('drawerStack', {
                  screen: 'watchHistory',
                });
              }}>
              <FA6Icon name={'clock'} color={colors.white} size={25} />
              <Text  style={[styles.label,{ color: colors.white,}]}>Watch History</Text>
            </TouchableOpacity>
          )}
          {!isGamifiedContentEnabled && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.item}
              onPress={() => {
                navigation.navigate('GamifiedContent');
              }}>
              <FA6Icon name={'medal'} color={colors.white} size={25} />
              <Text  style={[styles.label,{ color: colors.white,}]}>User Badges</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => handleToggleAlerts()}>
            {togglingAlert ? (
              <ActivityIndicator size={'small'} color={colors.theme} />
            ) : (
              <FontistoIcon
                name={alertsEnabled ? 'bell-alt' : 'bell'}
                color={alertsEnabled ? colors.theme : colors.white}
                size={25}
              />
            )}
            <Text  style={[styles.label,{ color: colors.white,}]}>
              {alertsEnabled ? 'Disable Alerts' : 'Enable Alerts'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() =>
              navigation.navigate('drawerStack', {
                screen: 'FavoriteIndex',
              })
            }>
            <FA6Icon name={'heart'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Favourites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => deleteAccountPressed()}>
            <FA6Icon name={'user-xmark'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => {
              signOutPressed();
            }}>
            <EntypoIcon name={'log-out'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {showSignUpButton === 'Y' && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.item}
              onPress={() =>
                navigation.navigate('authStack', {
                  screen: 'register',
                })
              }>
              <FA6Icon name={'user-large'} color={colors.white} size={25} />
              <Text  style={[styles.label,{ color: colors.white,}]}>Register</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() =>
              navigation.navigate('authStack', {
                screen: 'login',
              })
            }>
            <MCIcon name={'login'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
      {isAboutUsShown && 
             <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() =>
              navigation.navigate('drawerStack', {
                screen: 'AboutUs',
              })
            }>
            <FA6Icon name={'clipboard'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>About Us</Text>
          </TouchableOpacity>
      }
      {isPrivacyPolicyPageShown && 
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() =>
              navigation.navigate('drawerStack', {
                screen: 'PrivacyPolicy',
              })
            }>
            <MCIcon name={'security'} color={colors.white} size={25} />
            <Text  style={[styles.label,{ color: colors.white,}]}>Privacy Policy</Text>
          </TouchableOpacity>
      }
      {isTermsConditionShown && 
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.item}
            onPress={() =>
              navigation.navigate('drawerStack', {
                screen: 'TermsCondition',
              })
            }>
            <MaterialIcons name={'policy'} color={colors.white} size={25} />
            <Text style={[styles.label,{ color: colors.white,}]}>Terms of Service</Text>
          </TouchableOpacity>
      }
      <Loader
        openLoader={deletingAccount}
        setOpenLoader={setDeletingAccount}
        info={'Deleting Account'}
      />
    </DrawerContentScrollView>
  );
};
export default CustomDrawerContent;
const styles = StyleSheet.create({
  profileSection: {
    height: 120,
    justifyContent: 'center',
  },
  profileIconContainer: {
    height: 50,
    width: 50,
   
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  item: {
    flexDirection: 'row',
    paddingLeft: 20,
    height: 50,
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 18,
   
    marginHorizontal: 18,
  },
  labelBold: {
    fontWeight: '500',
    fontSize: 20,
  
    marginHorizontal: 18,
  },
});
