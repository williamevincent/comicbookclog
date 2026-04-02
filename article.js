import React from 'react';
import { 
  StyleSheet, Text, View, ScrollView, Image, 
  SafeAreaView, TouchableOpacity, Dimensions, Platform, StatusBar,
  Linking // Required to open browser
} from 'react-native';

const { width } = Dimensions.get('window');

const Article = ({ post, authorPhoto, onBack }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleOpenLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  const renderTextWithLinks = (text) => {
    // Regex to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Text 
            key={index} 
            style={styles.linkText} 
            onPress={() => handleOpenLink(part)}
          >
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  const renderContent = (content) => {
    if (!content) return null;
    return content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
      <Text key={index} style={styles.paragraph}>
        {renderTextWithLinks(paragraph.trim())}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backTrigger}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerLogo}>CBC</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.mainImage} resizeMode="cover" />
        )}
        
        <View style={styles.contentPadding}>
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {post.categories ? post.categories[0].toUpperCase() : 'NEWS'}
              </Text>
            </View>
            <Text style={styles.dateText}>{formatDate(post.publishDate)}</Text>
          </View>

          <Text style={styles.fullTitle}>{post.title}</Text>

          <View style={styles.authorRow}>
            <Image source={{ uri: authorPhoto }} style={styles.avatar} />
            <View>
              <Text style={styles.byText}>WRITTEN BY</Text>
              <Text style={styles.authorName}>{post.authorName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.bodyContainer}>
            {renderContent(post.content)}
          </View>
          
          <View style={styles.footerSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 
  },
  topHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#1A1A1A',
    marginTop: Platform.OS === 'ios' ? 10 : 0
  },
  backTrigger: { paddingVertical: 5 },
  backText: { color: '#FFD700', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  headerLogo: { color: '#FFF', fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  
  mainImage: { width: width, height: 260 },
  contentPadding: { paddingHorizontal: 25, paddingVertical: 20 },
  
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  badge: { backgroundColor: '#D32F2F', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  dateText: { color: '#666', fontSize: 12, fontWeight: '700' },

  fullTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', lineHeight: 36, marginBottom: 25 },

  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: '#222' },
  byText: { color: '#555', fontSize: 10, fontWeight: '800', marginBottom: 2 },
  authorName: { color: '#BBB', fontSize: 16, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#1A1A1A', marginBottom: 25 },
  
  bodyContainer: { width: '100%' },
  paragraph: { 
    color: '#EEE', 
    fontSize: 17, 
    lineHeight: 28, 
    marginBottom: 18, 
    fontWeight: '400',
    textAlign: 'left'
  },
  // Added link style
  linkText: {
    color: '#FFD700',
    textDecorationLine: 'underline',
    fontWeight: '700'
  },
  footerSpacer: { height: 60 }
});

export default Article;