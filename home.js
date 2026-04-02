import React, { useState, useMemo, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, Image, ActivityIndicator,
  Platform, StatusBar, BackHandler 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 

const LatestPosts = ({ onRead, onOpenMenu, posts, categories, authorMap, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const backAction = () => {
      if (selectedCategory !== 'ALL') {
        setSelectedCategory('ALL');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [selectedCategory]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'ALL') return posts;
    return posts.filter(p => 
      p.categories && p.categories.some(c => c.toUpperCase() === selectedCategory)
    );
  }, [posts, selectedCategory]);

  const getCategoryColor = (cat) => {
    if (cat === 'ALL') return '#FFD700'; 
    const colors = ['#D32F2F', '#7B1FA2', '#388E3C', '#FBC02D', '#E64A19', '#1976D2'];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleReadPost = (post) => {
    onRead({ 
      post: post, 
      authorPhoto: authorMap[post.authorName] || `https://ui-avatars.com/api/?name=${post.authorName}`
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onOpenMenu} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={styles.menuIcon}>
            <View style={styles.menuBar} /><View style={styles.menuBar} /><View style={styles.menuBar} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CBC FEED</Text>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryBox, 
                { backgroundColor: selectedCategory === cat ? getCategoryColor(cat) : '#1A1A1A' },
                selectedCategory === cat && styles.selectedCategoryBox
              ]}
            >
              <Text style={[
                styles.categoryBoxText,
                { color: selectedCategory === cat && cat === 'ALL' ? '#000' : '#FFF' }
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && posts.length === 0 ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          removeClippedSubviews={Platform.OS === 'android'}
          showsVerticalScrollIndicator={false}
        >
          {filteredPosts.map((post) => (
            <View key={post.id} style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {post.categories && post.categories.length > 0 ? post.categories[0].toUpperCase() : 'NEWS'}
                </Text>
              </View>
              
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleReadPost(post)}>
                <View style={styles.cardHeader}>
                  <Image 
                    source={{ uri: authorMap[post.authorName] || `https://ui-avatars.com/api/?name=${post.authorName}&background=random&color=fff` }} 
                    style={styles.avatar} 
                  />
                  <View style={styles.titleContainer}>
                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.postAuthor} numberOfLines={1}>
                      {post.authorName} <Text style={styles.dateText}>• {formatDate(post.publishDate)}</Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {post.imageUrl && (
                <TouchableOpacity activeOpacity={0.9} onPress={() => handleReadPost(post)}>
                  <View style={styles.imageShadow}>
                    <Image source={{ uri: post.imageUrl }} style={styles.featuredImage} />
                  </View>
                </TouchableOpacity>
              )}

              <Text style={styles.bodyText} numberOfLines={3}>{post.excerpt}</Text>
              
              <TouchableOpacity 
                style={styles.readButton}
                onPress={() => handleReadPost(post)}
              >
                <Text style={styles.readButtonText}>CONTINUE READING</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
  
  categoryContainer: { height: 60, paddingVertical: 10 },
  categoryScroll: { paddingHorizontal: 20, alignItems: 'center' },
  categoryBox: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginRight: 10 },
  selectedCategoryBox: { borderWidth: 1, borderColor: '#FFD700' },
  categoryBoxText: { fontWeight: '900', fontSize: 11, letterSpacing: 0.5 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#0D0D0D', borderRadius: 16, padding: 20, marginTop: 25, borderWidth: 1, borderColor: '#1A1A1A' },
  badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 10 },
  badgeText: { color: '#000', fontWeight: '900', fontSize: 10 },
  
  cardHeader: { flexDirection: 'row', marginBottom: 18, paddingRight: 40 }, 
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12, borderWidth: 1, borderColor: '#333' },
  titleContainer: { flex: 1, justifyContent: 'center' },
  postTitle: { color: '#FFF', fontSize: 18, fontWeight: '800', lineHeight: 24 },
  postAuthor: { color: '#AAA', fontSize: 11, marginTop: 4 },
  dateText: { color: '#666' },
  
  imageShadow: { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
  featuredImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15 },
  bodyText: { color: '#BBB', fontSize: 14, lineHeight: 20, marginBottom: 22 },
  
  readButton: { backgroundColor: '#FFD700', width: '100%', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  readButtonText: { color: '#000', fontWeight: '900', letterSpacing: 1.5, fontSize: 12 },
});

export default LatestPosts;