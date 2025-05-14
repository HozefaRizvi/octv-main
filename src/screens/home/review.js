import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useColorContext } from '../../services/state/colorsContext';
import ThemeButton from '../../components/buttons/themeButton';
import {UserRating, ThumbsRating} from './ratings';
import {postReviewOnStream} from '../../services/axios/apiManager';
import {useAppContext} from '../../services/state/context';
import Icon from 'react-native-vector-icons/FontAwesome';
const Reviews = ({
  canReview = '',
  reviews = [],
  ratingType = 'stars',
  streamId,
  getData,
  reviewRatingAverage
}) => {
  const {state} = useAppContext();
  const {isLoggedIn, user} = state;
  // console.log("Is Logged in",isLoggedIn)
  const [expanded, setExpanded] = useState(true);
  const [posting, setPosting] = useState(false);
  const [reviewText, setReviewText] = React.useState('');
  const [ratingCount, setRatingCount] = useState(5);
  const [isReviewd, setIsReviewd] = useState(false);
  const { colors } = useColorContext();
  const handlePosting = async () => {
    try {
      setPosting(true);
      if (reviewText?.length <= 0 || streamId?.length <= 0) {
        Alert.alert('Alert', 'Add a comment!');
        return;
      }
      const data = {
        stream_code: streamId,
        show_code: streamId,
        comment: reviewText,
        rating: ratingCount,
      };
      console.log(data)
      const response = await postReviewOnStream(data);
      if (response?.data?.message) {
        await getData();
        Alert.alert('Alert', response.data.message);
        setReviewText('');
        setRatingCount(0);
      }
    } catch (error) {
      console.log('Error on submiting Rating', error);
    } finally {
      setPosting(false);
    }
  };
  const extractInitials = (name = 'Dummy') => {
    if (name?.length > 0) {
      const initials = name
        .split(' ')
        .map(m => m.charAt(0))
        .join('')
        .slice(0, 2)
        .toString()
        .toUpperCase();
      return initials;
    } else {
      return 'U';
    }
  };
  useEffect(() => {
    const temp = reviews?.some(f => f?.user?.id === user?.user_id);
    console.log('he',temp)
    setIsReviewd(temp);
  }, [reviews, user?.user_id]);
  return (
    <View style={styles.container}>
    
      {expanded && (
        <View>
        
            <View style={styles.inputSection}>
            <Text style={{color:colors?.white,padding:3,marginLeft:30,fontSize:25,fontWeight:'bold'}}>Reviews:  <Icon name={ratingType==='thumbs'?'thumbs-up':ratingType==='star'?'star':'heart'} size={20} color={colors?.theme} /> <Text style={{color:colors?.white,padding:3,marginLeft:30,fontSize:20,fontWeight:'bold'}}>{reviewRatingAverage}</Text></Text>
              <View style={styles.ratingSection}>
                {ratingType === 'thumbs' ? (
                  <ThumbsRating
                    initialRating={ratingCount}
                    setRatingCount={setRatingCount}
                    isReadOnly={false}
                  />
                ) : (
                  <UserRating
                    initialRating={ratingCount}
                    ratingType={ratingType}
                    setRatingCount={setRatingCount}
                    isReadOnly={false}
                  />
                )}
              </View>
              {isLoggedIn && canReview === 'Enable' && isReviewd===false && (
                <>
              <TextInput
                editable
                multiline
                placeholder="Let other know what you think...... "
                maxLength={250}
                onChangeText={text => setReviewText(text)}
                value={reviewText}
                placeholderTextColor={colors.gray}
                style={[styles.textArea,{   backgroundColor: colors.white,},{ borderColor: colors.theme,},{color: colors.black,}]}
                numberOfLines={4}
                textAlignVertical="top"
              />
              <View style={styles.postBtn}>
                <ThemeButton
                  text={'Submit'}
                  type={'sm'}
                  pressed={handlePosting}
                  loading={posting}
                />
               
              </View>
              </>
            )}
            </View>
          
          {reviews?.length > 0 ? (
            reviews.map((review, index) => (
              <View key={index} style={[styles.reviewsList,{borderBlockColor: colors.lightGray,}]}>
                <View style={styles.commentHeader}>
                  <View style={[styles.avatar,{  backgroundColor: colors.white,}]}>
                    <Text style={[styles.shortName,{ color: colors.theme,}]}>
                      {extractInitials(review.name)}
                    </Text>
                  </View>
                  <Text style={[styles.userName,{color: colors.white,}]}>{review.user?.name || 'N/A'}</Text>
                </View>
                {ratingType === 'thumbs' ? (
                  <ThumbsRating
                    initialRating={review.rating || 0}
                    setRatingCount={setRatingCount}
                    ifUSerDown={true}
                  />
                ) : (
                  <UserRating
                    initialRating={review.rating || 0}
                    ratingType={ratingType}
                    setRatingCount={setRatingCount}
                    ifUSerDown={true}
                  />
                )}
                <Text style={[styles.comment,{color: colors.white,}]}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noReviewText,{color: colors.white,}]}>No Reviews yet!</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Reviews;
const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
  },
  sectionHeader: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  Overview: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '500',
    marginLeft: 30,
  },
  inputSection: {
    marginBottom: '10%',
  },
  ratingSection: {
    marginLeft: '7%',
    marginBottom: 5,
  },
  textArea: {
    height: 146,
    borderRadius: 7,
    borderWidth: 2,
    width: '86%',
    marginHorizontal: '7%',
    fontSize: 14,
    paddingHorizontal: 15,
  },
  postBtn: {
    marginLeft: '7%',
  },
  reviewsList: {
    width: '86%',
    marginHorizontal: '7%',
    marginBottom: '5%',
    marginTop: '2%',
    paddingBottom: 5,
    borderBottomWidth: 0.5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  shortName: {
    fontSize: 18,
    fontWeight: '900',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  rating: {
    height: 30,
  },
  comment: {
    fontSize: 13,
  },
  noReviewText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: '7%',
  },
});
