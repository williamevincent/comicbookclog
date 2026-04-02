import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Image, Modal, Dimensions, Animated, Easing, Platform, StatusBar 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SideMenu = ({ visible, onClose, setView, currentView }) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width,
      duration: visible ? 450 : 300,
      easing: visible ? Easing.out(Easing.back(1)) : Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const getLinkStyle = (viewName) => {
    return [
      styles.navText,
      currentView === viewName && { color: '#FFD700' }
    ];
  };

  return (
    <Modal 
      transparent={true} 
      visible={visible} 
      onRequestClose={onClose}
      statusBarTranslucent={true} 
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
          
          <View style={styles.menuHeader}>
            <View style={styles.headerSafeWrapper}>
              <Image 
                source={require('./assets/cbc_logo.png')} 
                style={styles.logoImage}
                resizeMode="cover"
              />
              
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.closeIcon}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <View style={styles.menuBar} />
                <View style={styles.menuBar} />
                <View style={styles.menuBar} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.navLinks}>
            {/* HOME Section */}
            <TouchableOpacity onPress={() => { setView('HOME'); onClose(); }}>
              <Text style={getLinkStyle('HOME')}>HOME</Text>
            </TouchableOpacity>

            {/* ABOUT Section */}
            <TouchableOpacity onPress={() => { setView('ABOUT'); onClose(); }}>
              <Text style={getLinkStyle('ABOUT')}>ABOUT</Text>
            </TouchableOpacity>

            {/* CONTACT Section */}
            <TouchableOpacity onPress={() => { setView('CONTACT'); onClose(); }}>
              <Text style={getLinkStyle('CONTACT')}>CONTACT</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>

        <TouchableOpacity 
          style={styles.touchClose} 
          onPress={onClose} 
          activeOpacity={1} 
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: 'rgba(0,0,0,0.85)',
    height: height + (Platform.OS === 'android' ? 100 : 0), 
  },
  sideMenu: { 
    width: width * 0.75, 
    backgroundColor: '#000', 
    height: '100%',
    top: 0,
  },
  touchClose: { 
    width: width * 0.25, 
    height: '100%' 
  },
  menuHeader: { 
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 40,
  },
  headerSafeWrapper: {
    marginTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
  },
  logoImage: { 
    width: '100%', 
    height: 180,
  },
  closeIcon: { 
    position: 'absolute', 
    top: 15, 
    right: 20, 
    width: 35, 
    height: 25, 
    justifyContent: 'space-between',
    zIndex: 10
  },
  menuBar: { 
    height: 5, 
    backgroundColor: '#FFF', 
    borderRadius: 2 
  },
  navLinks: { 
    paddingHorizontal: 30 
  },
  navText: { 
    color: '#888', 
    fontSize: 32, 
    fontWeight: '900', 
    marginBottom: 25,
    letterSpacing: -0.5 
  },
});

export default SideMenu;