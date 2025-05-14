import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Share,
  StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useColorContext } from '../../services/state/colorsContext';
import { appCode } from '../../services/axios/eps';
const ShareModal = ({
  visible,
  onClose,
  shareUrl,
  is_embed,
  embed_code = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  
  const { colors} = useColorContext();
  const handleShare = async platform => {
    try {
      const result = await Share.share({message: shareUrl});
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCopy = text => {
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.heading,{ color: colors.black,}]}>Share</Text>
            <TouchableOpacity onPress={onClose}>
              <IonIcon name="close" color={colors.black} size={26} />
            </TouchableOpacity>
          </View>

          {/* Share Buttons */}
          <View style={styles.imgView}>
            {is_embed===1 && 
            <TouchableOpacity onPress={() => setShowEmbedCode(true)}>
              <IonIcon name="code" color={colors.theme} size={35} />
            </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => handleShare('whatsapp')}>
              <IonIcon name="logo-whatsapp" color={colors.theme} size={35} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare('facebook')}>
              <IonIcon name="logo-facebook" color={colors.theme} size={35} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare('twitter')}>
              <Image
                source={require('../../assets/images/twitter.png')}
                style={styles.img}
                tintColor={colors.theme}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare('telegram')}>
              <FontAwesome name="telegram" color={colors.theme} size={35} />
            </TouchableOpacity>
          </View>

          {/* Share Link */}
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={[colors.theme, colors.darkRed]}
            style={styles.linearGradient}>
            <View style={[styles.backView,{ backgroundColor: colors.white,}]}>
              <Text style={[styles.urlText,{ color: colors.black,}]}>{shareUrl}</Text>
              <TouchableOpacity
                onPress={() => handleCopy(shareUrl)}
                style={[styles.copyBtn, copied && styles.copiedBtn ,{backgroundColor: appCode==='RvW1gFOHHJnRvuMuHookfhYdVctk3Ph2'? colors.dull: colors.theme}]}>
                <Text style={styles.btnText}>{copied ? 'Copied' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <Modal visible={showEmbedCode} transparent={true} animationType="fade">
          <View style={styles.embedModalContainer}>
            <View style={styles.embedModalView}>
              <View style={styles.embedHeader}>
                <Text style={[styles.embedHeading,{ color: colors.black,}]}>Embed Code</Text>
                <TouchableOpacity onPress={() => setShowEmbedCode(false)}>
                  <IonIcon name="close" color={colors.black} size={20} />
                </TouchableOpacity>
              </View>
              <View style={styles.embedBox}>
                <Text style={[styles.embedText,{ color: colors.black,}]}>{embed_code}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCopy(embed_code)}
                style={[styles.copyBtn, { backgroundColor: copied ? colors.copied:  colors.theme,}]}>
                <Text style={styles.btnText}>{copied ? 'Copied' : 'Copy'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export default ShareModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: 333,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
   
    fontSize: 21.55,
    fontWeight: '500',
  },
  imgView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  img: {
    width: 45,
    height: 45,
  },
  copyBtn: {
    width: 55,
    height: 25,
    borderRadius: 5,
   
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  
  linearGradient: {
    height: 37,
    width: '95%',
    borderRadius: 5,
    alignItems: 'center',
    padding: 1.5,
    marginVertical: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  backView: {
    flex: 1,
    justifyContent: 'space-between',
   
    width: '100%',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  urlText: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'regular',
   
  },
  btnText: {
 
    fontWeight: 'medium',
    fontSize: 10,
  },

  // Embed Modal Styles
  embedModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  embedModalView: {
    width: 280,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  embedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  embedHeading: {
    fontSize: 18,
    fontWeight: '500',
   
  },
  embedBox: {
    width: '100%',
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    height:40,
    overflow:'hidden'
  },
  embedText: {
    fontSize: 14,
   
  },
});
