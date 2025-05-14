import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useColorContext } from '../../services/state/colorsContext';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import { useAppContext } from '../../services/state/context';
import { getData } from '../../services/axios/apiCoreCalls';
import Clipboard from '@react-native-clipboard/clipboard';
import Header from '../../components/header';
import { eps } from '../../services/axios/eps';

const GamifiedContent = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { state } = useAppContext();
  const [badgeData, setBadgeData] = useState([]);
  const {isLoggedIn, logo, slug} = state;
  const { colors } = useColorContext();

  useEffect(() => {
    const fetchGamifiedContent = async () => {
      if (isLoggedIn) {
        try {
          const res = await getData(eps.badgeDetail);
          setBadgeData(res?.data);
        } catch (error) {
          console.log('Error fetching badges:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGamifiedContent();
  }, [isLoggedIn]);

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
  const [modalVisible, setModalVisible] = useState(false);
  const [referralLink, setReferralLink] = useState(null);

  const handleReferralClick = () => {
    setReferralLink(badgeData?.data?.referral_link);
    setModalVisible(true);
  };

  const copyToClipboard = () => {
    Clipboard.setString(referralLink);
    Alert.alert('Referral link copied!');
  };

  if (loading) {
    return (
     <View style={[styles.loaderContainer,{backgroundColor:colors.dull}]}>
        <ActivityIndicator size="large" color={colors.theme} />
      </View>
    );
  }

  if (!badgeData?.data) {
    return (
      <View style={[styles.loaderContainer,{backgroundColor:colors.dull}]}>
        <Text style={{color: 'white'}}>No badges to display</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container,{backgroundColor: colors.dull}]}>
      <Header logoUrl={logo} navigation={navigation} />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={[styles.title,{color:colors.theme}]}>Badges </Text>

          {[
            {
              label: 'Total Points',
              value: badgeData?.data?.total_points || '0',
            },
            {
              label: `${currentMonth} Points`,
              value: badgeData?.data?.current_month_points || '0',
            },
            {
              label: 'Referral Link',
              value: 'Click to View and Copy',
              onPress: handleReferralClick,
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.infoBox,{backgroundColor:colors.white}]}
              onPress={item.onPress}>
              <View style={[styles.iconContainer,{backgroundColor:colors.black}]}>
                <Icon2
                  name={'badge'}
                  size={40}
                  color={colors.theme}
                  style={{padding: 1}}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.infoValue,{color: colors.theme}]}>{item.value}</Text>
                <Text style={[styles.infoLabel,{color: colors.theme}]}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Modal */}
          <Modal visible={modalVisible} transparent animationType="slide">
          <View style={[styles.modalContainer,{backgroundColor: 'rgba(0,0,0,0.5)',}]}>
              <View style={[styles.modalContent,{backgroundColor: colors.white,}]}>
                <Text style={styles.modalTitle}>Your Referral Link</Text>
                <Text style={[styles.modalLink,{color: colors.theme,}]}>{referralLink || 'N/A'}</Text>
                <TouchableOpacity
                  style={[styles.copyButton,{backgroundColor:colors.theme}]}
                  onPress={copyToClipboard}>
                  <Text style={[styles.copyText,{color: colors.white,}]}>Copy to Clipboard</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.closeButton,{backgroundColor:colors.gray}]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={[styles.closeText,{color: colors.white,}]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {badgeData?.data?.badges?.map((badge, index) => (
            <View key={index} style={[styles.badgeCard,{backgroundColor:colors.white}]}>
              {(badge?.details?.completed_at === null ||
                badge?.details?.completed_at === undefined) && (
                <View style={styles.badgeOverlay} />
              )}
              <View style={[styles.badgeHeader,{backgroundColor:colors.black}]}>
                <Image source={{uri: badge?.icon}} style={styles.badgeImage} />
              </View>
              <View style={styles.badgeBody}>
                <Text style={[styles.badgeTitle,{color: colors.black,}]}>{badge?.title}</Text>
                <View style={styles.badgeDetails}>
                  <View>
                    <Text style={[styles.detailText,{color: colors.black,}]}>
                      Points:{' '}
                      <Text style={[styles.highlight,{color: colors.theme,}]}>
                        {badge?.points || '0'}
                      </Text>
                    </Text>
                    <Text style={[styles.detailText,{color: colors.black,}]}>
                      Achieved:{' '}
                      <Text style={[styles.highlight,{color: colors.theme,}]}>
                        {badge?.details?.achieved_points || '0'}
                      </Text>
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.detailText,{color: colors.black,}]}>
                      Remaining:{' '}
                      <Text style={[styles.highlight,{color: colors.theme,}]}>
                        {badge?.points - badge?.details?.achieved_points || '0'}
                      </Text>
                    </Text>
                    <Text style={[styles.detailText,{color: colors.black,}]}>
                      Milestone:{' '}
                      <Text style={[styles.highlight,{color: colors.theme,}]}>
                        {badge?.milestone || '0'}
                      </Text>
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBox,{backgroundColor:colors.black}]}>
                  <Text style={[styles.statusText,{color:colors.white}]}>
                    {badge?.details?.completed_at === null ||
                    badge?.details?.completed_at === undefined
                      ? 'Incomplete'
                      : 'Complete'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  safeArea: {flex: 1, alignItems: 'center'},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: { alignItems: 'center', paddingBottom: 20, minWidth: '90%' },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: {
    width: '90%',
    height: 80,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    borderRadius: 15,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {flex: 1},
  infoValue: {fontSize: 20},
  infoLabel: {fontSize: 15},
  badgeCard: {
    minWidth: '90%',
    borderRadius: 10,
    borderWidth: 4,
    marginTop: 10,
  },
  badgeOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
     backgroundColor: 'rgba(36, 33, 33, 0.6)'
  },
  badgeHeader: {
    minWidth: '100%',
    height: 100,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {height: 65, width: 65, resizeMode: 'contain'},
  badgeBody: {alignItems: 'center', padding: 10},
  badgeTitle: {fontSize: 20, marginTop: 10},
  badgeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  detailText: {fontSize: 17, fontWeight: 'bold'},
  highlight: { fontWeight: 'bold'},
   statusBox: { width: '50%',  justifyContent: 'center', alignItems: 'center', marginTop: 20, height: 40, borderRadius: 15 },
  statusText: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLink: {
    fontSize: 16,
    marginBottom: 10,
  },
  copyButton: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  copyText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
  },
});

export default GamifiedContent;
