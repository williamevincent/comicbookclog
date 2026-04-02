import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Contact = ({ onOpenMenu }) => {
  const handleEmail = (recipient, subject = "") => {
    const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(url).catch(err => console.error("Failed to open mail app", err));
  };

  const handleWeb = () => {
    Linking.openURL('https://comicbookclog.com/advertising-on-comicbookclog/').catch(err => console.error("Failed to open website", err));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onOpenMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={styles.menuIcon}>
            <View style={styles.menuBar} /><View style={styles.menuBar} /><View style={styles.menuBar} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CONTACT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>WANT TO JOIN THE TEAM?</Text>
          <Text style={styles.description}>
            Send us an email and use the subject line <Text style={styles.highlight}>“CBC Author.”</Text>
          </Text>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleEmail("comicbookclog@gmail.com", "CBC Author")}
          >
            <Text style={styles.actionButtonText}>SEND APPLICATION</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>FOR ADVERTISING DETAILS</Text>
          <Text style={styles.description}>
            Please visit our website for more information regarding partnerships and placements.
          </Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleWeb}>
            <Text style={styles.actionButtonText}>VISIT WEBSITE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>NEED HELP WITH THE APP?</Text>
          <Text style={styles.description}>
            To report a bug, share feedback, or resolve app-related issues, contact Will.
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.supportButton]} 
            onPress={() => handleEmail("evincentwilliam@gmail.com", "App Support")}
          >
            <Text style={styles.actionButtonText}>GET SUPPORT</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>OFFICIAL EMAIL</Text>
          <Text style={styles.footerInfo}>comicbookclog@gmail.com</Text>
          <Text style={styles.footerLabel}>FOUNDER OF COMIC BOOK CLOG</Text>
          <Text style={styles.footerInfo}>Jamie Insalaco</Text>
          <Text style={styles.footerLabel}>DEVELOPED BY</Text>
          <Text style={styles.footerInfo}>William Evincent</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#111'
  },
  menuIcon: { width: 35, height: 25, justifyContent: 'space-between' },
  menuBar: { height: 5, backgroundColor: '#FFF', borderRadius: 2 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', marginLeft: 40, letterSpacing: 2 },
  
  content: { padding: 25, paddingBottom: 60 },
  section: { marginBottom: 10 },
  label: { color: '#555', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  description: { color: '#BBB', fontSize: 15, lineHeight: 22, marginBottom: 20 },
  highlight: { color: '#FFD700', fontWeight: 'bold' },
  
  actionButton: { 
    backgroundColor: '#1A1A1A', 
    paddingVertical: 14, 
    borderRadius: 8, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  supportButton: { borderColor: '#FFD700' },
  actionButtonText: { color: '#FFD700', fontWeight: '900', fontSize: 12, letterSpacing: 1 },
  
  divider: { height: 1, backgroundColor: '#111', marginVertical: 30 },
  
  footer: { marginTop: 20, paddingTop: 30, borderTopWidth: 1, borderTopColor: '#111' },
  footerLabel: { color: '#333', fontSize: 10, fontWeight: '900', marginBottom: 5 },
  footerInfo: { color: '#666', fontSize: 14, marginBottom: 15 }
});

export default Contact;