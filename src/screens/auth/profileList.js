import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import {styles} from './profileListStyles';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AddProfileModal from '../../components/modals/addProfileModal';
import {useAppContext} from '../../services/state/context';
import {useNavigation} from '@react-navigation/native';
import {setActiveProfile} from '../../services/dataManager';
import {
  fetchStoredProfiles,
  deleteProfile,
} from '../../services/axios/apiManager';

const ProfileList = () => {
  const navigation = useNavigation();
  const [openAddProfileModal, setOpenAddProfileModal] = useState(false);
  // const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const {state, setState} = useAppContext();
  
  const {logo} = state;
  const {user, userProfiles, activeProfile, isLoggedIn} = state;

  const getProfilesList = useCallback(async () => {
    try {
      if (isLoggedIn) {
        const response = await fetchStoredProfiles(user?.user_id);
        setState(prevState => ({
          ...prevState,
          allRatings: response?.data.all_ratings,
          userProfiles: response?.data.user_profiles,
        }));
      }
    } catch (error) {
      console.log('Error in get Profiles List', error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, setState, user?.user_id]);
  useEffect(() => {
    getProfilesList();
  }, [getProfilesList]);

  const removeProfile = async id => {
    try {
      if (activeProfile?.id === id) {
        await deleteProfile(id);
        await getProfilesList();
        await setActiveProfile({});
        setState(prev => ({...prev, activeProfile: {}}));
      } else {
        await deleteProfile(id);
        await getProfilesList();
      }
    } catch (error) {
      console.log('Error on removing profile', error);
    }
  };
  const onRemovePressed = id => {
    Alert.alert('Alert', 'Do you want to remove this profile?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => removeProfile(id)},
    ]);
  };
  const handleProfileClicked = async item => {
    try {
      await setActiveProfile(item);
      setState(prev => ({...prev, activeProfile: item}));
      navigation.navigate('HomeIndex');
    } catch (error) {
      console.log('Error On Navigating back: ', error);
    }
  };
  const { colors } = useColorContext();
  return (
    <View style={[styles.container,{backgroundColor: colors.black,}]}>
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
        <Image
         source={{uri:logo}}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={[styles.heading,{ color: colors.white,}]}>Who’s Watching?</Text>

        <View style={styles.listContainer}>
          {userProfiles && userProfiles.length <= 0 ? (
            <View style={styles.btnContainer}>
              {loading ? (
                <ActivityIndicator size={'large'} color={colors.theme} />
              ) : (
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={[styles.addBtn,{backgroundColor: colors.theme,}]}
                    activeOpacity={0.7}
                    onPress={() => {
                      setOpenAddProfileModal(true);
                    }}>
                    <IonIcon name={'add'} color={colors.white} size={70} />
                  </TouchableOpacity>
                  <Text style={[styles.btnTxt,{color: colors.white,}]}>Add Profile</Text>
                </View>
              )}
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.list}>
                {userProfiles &&
                  userProfiles.map((item, index) => (
                    <View style={styles.listItemCOntainer} key={index}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.listBtn,{  backgroundColor: colors.theme,}]}
                        onPress={() => {
                          handleProfileClicked(item);
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[styles.rmBtnContainer,{backgroundColor: colors.white,}]}
                          onPress={() => {
                            onRemovePressed(item.id);
                          }}>
                          <EntypoIcon
                            name={'minus'}
                            color={colors.black}
                            size={20}
                          />
                        </TouchableOpacity>
                        <Image
                          source={require('../../assets/images/profileAvatar.png')}
                          style={styles.profAvatar}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.listBtnTxt,{color: colors.white,}]} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  ))}
                {userProfiles?.length < 6 && (
                  <View style={styles.listItemCOntainer}>
                    <TouchableOpacity
                      style={[styles.listBtn,{  backgroundColor: colors.theme,}]}
                      onPress={() => {
                        setOpenAddProfileModal(!openAddProfileModal);
                      }}>
                      <IonIcon name={'add'} color={colors.white} size={45} />
                    </TouchableOpacity>
                    <Text style={[styles.listBtnTxt,{color: colors.white,}]} numberOfLines={2}>
                      Add Profile
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <AddProfileModal
        openModal={openAddProfileModal}
        setOpenModal={setOpenAddProfileModal}
        getProfilesList={getProfilesList}
      />
    </View>
  );
};
export default ProfileList;
