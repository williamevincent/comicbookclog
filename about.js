import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Image, FlatList, ActivityIndicator, Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

const About = ({ onOpenMenu }) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "authors"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamArray = [];
      snapshot.forEach((doc) => {
        teamArray.push({ name: doc.id, ...doc.data() });
      });
      setTeam(teamArray);
      setLoading(false);
    }, (error) => {
      console.error("Team Query Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLink = (url) => {
    if (url) Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberCard}>
      <Image 
        source={{ uri: item.photoUrl || 'https://ui-avatars.com/api/?name=' + item.name }} 
        style={styles.profilePic} 
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberBio}>{item.bio}</Text>
        
        <View style={styles.socialRow}>
          {item.instagram && (
            <TouchableOpacity onPress={() => handleLink(item.instagram)} style={styles.socialBadge}>
              <Text style={styles.socialText}>INSTAGRAM</Text>
            </TouchableOpacity>
          )}
          {item.youtube && (
            <TouchableOpacity onPress={() => handleLink(item.youtube)} style={styles.socialBadge}>
              <Text style={styles.socialText}>YOUTUBE</Text>
            </TouchableOpacity>
          )}
          {item.website && (
            <TouchableOpacity onPress={() => handleLink(item.website)} style={styles.socialBadge}>
              <Text style={styles.socialText}>WEBSITE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onOpenMenu}>
          <View style={styles.menuIcon}>
            <View style={styles.menuBar} /><View style={styles.menuBar} /><View style={styles.menuBar} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={team}
          keyExtractor={(item) => item.name}
          renderItem={renderMember}
          ListHeaderComponent={() => (
            <View style={styles.introSection}>
              <Text style={styles.brandTitle}>COMIC BOOK CLOG</Text>
              <View style={styles.goldDivider} />
              <Text style={styles.missionText}>
                Comic Book Clog is where we talk about comics and everything that comes with being a geek. 
                If it falls under geek culture, we’re probably writing about it.
              </Text>
              <Text style={styles.sectionHeading}>THE TEAM</Text>
            </View>
          )}
          contentContainerStyle={styles.scrollContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  menuIcon: { width: 35, height: 25, justifyContent: 'space-between' },
  menuBar: { height: 5, backgroundColor: '#FFF', borderRadius: 2 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', marginLeft: 40 },
  scrollContent: { paddingBottom: 50 },
  introSection: { padding: 25 },
  brandTitle: { color: '#FFD700', fontSize: 28, fontWeight: '900' },
  goldDivider: { width: 60, height: 4, backgroundColor: '#FFD700', marginTop: 10, marginBottom: 20 },
  missionText: { color: '#EEE', fontSize: 16, lineHeight: 26, marginBottom: 40 },
  sectionHeading: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 20 },
  
  memberCard: { flexDirection: 'row', paddingHorizontal: 25, marginBottom: 40, alignItems: 'flex-start' },
  profilePic: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#FFD700' },
  memberInfo: { flex: 1, marginLeft: 20 },
  memberName: { color: '#FFF', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  memberBio: { color: '#AAA', fontSize: 14, lineHeight: 22, marginBottom: 15 },
  
  socialRow: { flexDirection: 'row', flexWrap: 'wrap' },
  socialBadge: { 
    backgroundColor: '#1A1A1A', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 4, 
    marginRight: 8, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333'
  },
  socialText: { color: '#FFD700', fontSize: 9, fontWeight: '900', letterSpacing: 1 }
});

export default About;