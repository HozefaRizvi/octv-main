import {
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useColorContext } from '../../services/state/colorsContext';
import {
  fetcPersonData,
  followUnFollowPerson,
} from '../../services/axios/apiManager';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './personStyle';
import {useAppContext} from '../../services/state/context';
const PersonDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {state} = useAppContext();
  const {isLoggedIn} = state;
  const [press, setPress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState(null);
  const [stream, setStream] = useState([]);
  const { colors } = useColorContext();
  const getPersonData = useCallback(async () => {
    try {
      const response = await fetcPersonData(route.params.id);
      setPerson(response.data);
      setStream(response.data.streams);
    } catch (error) {
      console.log('Error in get Person Data ', error);
    } finally {
      setLoading(false);
    }
  }, [route.params.id]);
  useEffect(() => {
    getPersonData();
  }, [getPersonData]);
  const handleRelatedStream = item => {
    navigation.push('Detailed', {id: item});
  };
  const handlePress = async () => {
    if (!isLoggedIn || !person?.code) {
      Alert.alert('Alert', 'Please Login to follow this person!');
      return;
    }
    try {
      setPress(true);
      const data = {
        actor_code: person?.code,
      };
      const response = await followUnFollowPerson(data);
      if (response?.data?.message) {
        await getPersonData();
      }
    } catch (error) {
      console.log('Error Upon Follow Toggle: ', error);
    } finally {
      setPress(false);
    }
  };
  const renderStreamItem = item => (
    <TouchableOpacity
      key={item.code}
      onPress={() => handleRelatedStream(item.code)}>
      <Image source={{uri: item.image}} style={[styles.portraitImage,{backgroundColor: colors.black,}]} />
      <Text style={[styles.streamTitle3,{    color: colors.white,}]}>{item.title}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.container,{backgroundColor: colors.dull,}]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size={'large'} color={colors.theme} />
          </View>
        ) : (
          <ScrollView nestedScrollEnabled={true}>
            <TouchableOpacity
              style={styles.header}
              onPress={() => navigation.goBack()}>
              <Image
                source={require('../../assets/images/back.png')}
                style={styles.backButton}
              />
            </TouchableOpacity>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={[colors.theme, colors.darkRed]}
              style={styles.linearGradient}>
              <View style={[styles.backView,{backgroundColor: colors.black,}]}>
                <Image source={{uri: person?.poster}} style={styles.img} />
              </View>
            </LinearGradient>
            <View style={styles.txt}>
              <Text style={[styles.name,{color: colors.theme,}]}>{person?.name}</Text>
            </View>
            {isLoggedIn ? (
              <TouchableOpacity
                style={[styles.followbtn,{  backgroundColor: colors.theme,}]}
                onPress={() => {
                  handlePress();
                }}>
                {press ? (
                  <ActivityIndicator size={'small'} color={colors.white} />
                ) : (
                  <Text style={[styles.btnStyleInactive,{color: colors.white,}]}>
                    {person?.follow ? 'Following' : 'Follow'}
                  </Text>
                )}
              </TouchableOpacity>
            ) : null}
            <View style={styles.txt}>
              <Text style={[styles.description,{color: colors.description,}]}>{person?.description}</Text>
            </View>
            <View style={styles.txtMedia}>
              <Text style={[styles.nameMedia,{color: colors.white,}]}>
                Media pertaining to {person?.name}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestionsScrollView}>
                {stream.map(item => renderStreamItem(item))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

export default PersonDetail;
