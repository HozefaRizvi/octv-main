import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useColorContext } from '../../services/state/colorsContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import MultiSelectInput from '../../components/inputs/multiSelect';
import ThemeButton from '../../components/buttons/themeButton';
import {useAppContext} from '../../services/state/context';
import {
  editUserProfile,
  fetchStoredProfiles,
} from '../../services/axios/apiManager';
const InputSection = ({
  allRatings,
  contentRating,
  profileId,
  getProfilesList,
}) => {
  const { colors } = useColorContext();
  const [selectedCategories, setSelectedCategories] = useState(contentRating);
  const [updating, setUpdating] = useState(false);
  const editProfile = async () => {
    try {
      setUpdating(true);
      const data = {
        content_rating: selectedCategories,
      };
      const response = await editUserProfile(profileId, data);
      if (response?.data?.data?.user_id) {
        await getProfilesList();
        Alert.alert('Success', 'Your profile has been updated.');
      } else {
        Alert.alert('Alert', 'Something went wrong, please try again later.');
      }
    } catch (error) {
      Alert.alert('Alert', 'Something went wrong, please try again later.');
    } finally {
      setUpdating(false);
    }
  };
 

  return (
    <View style={styles.inputRow}>
      <View style={styles.inputSection}>
        <MultiSelectInput
          bgc={colors.black}
          data={allRatings}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      </View>
      <View style={styles.btnSection}>
        <ThemeButton
          text={'Update'}
          type={'sm'}
          pressed={() => {
            editProfile();
          }}
          loading={updating}
        />
      </View>
    </View>
  );
};
const ManageProfile = () => {
   const { colors } = useColorContext();
  const navigation = useNavigation();
  const {state, setState} = useAppContext();
  const {user, userProfiles, allRatings, isLoggedIn} = state;
  const [loading, setLoading] = useState(true);
  
   const {logo} = state;
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
  return (
    <View style={[styles.container,{backgroundColor: colors.black}]}>
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
          style={styles.logo}
          source={{uri:logo}}
          resizeMode="contain"
        />
        <Text style={[styles.heading,{color: colors.theme,}]}>Manage Profile</Text>
        {loading && (
          <View>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          {userProfiles &&
            userProfiles.map((item, index) => (
              <View style={styles.section} key={index}>
                <Text style={[styles.label, {color: colors.white,}]}>Profile Name :</Text>
                <View style={styles.row}>
                  <View style={styles.nameSection}>
                    <Text style={[styles.name,{color: colors.white,}]}>{item.name}</Text>
                  </View>
                  <InputSection
                    contentRating={item.content_rating}
                    allRatings={allRatings}
                    profileId={item.id}
                    getProfilesList={getProfilesList}
                  />
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default ManageProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    marginTop: '20%',
    marginHorizontal: '5%',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  logo: {
    height: 100,
    width: 140,
    marginVertical: 5,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    marginVertical: 20,
  },
  section: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 30,
  },
  label: {
    fontSize: 22,
    fontWeight: '500',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
  },
  nameSection: {
    width: '15%',
    paddingTop: 10,
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  inputSection: {
    width: '55%',
    maxHeight: 120,
    minHeight: 120,
  },
  name: {
    fontSize: 18,
  },
  btnSection: {
    width: '80%',
    marginLeft: 5,
    marginTop: 1,
  },
});
