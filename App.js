import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import LatestPosts from './home';
import Article from './article';
import About from './about';
import Contact from './contact';
import SideMenu from './menu';

export default function App() {
  const [currentPost, setCurrentPost] = useState(null);
  const [view, setView] = useState('HOME');
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['ALL']);
  const [authorMap, setAuthorMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribeAuthors = onSnapshot(collection(db, "authors"), (snapshot) => {
      const mapping = {};
      snapshot.forEach(doc => { mapping[doc.id] = doc.data().photoUrl; });
      setAuthorMap(mapping);
    }, (err) => console.error("Author Load Error:", err));

    const q = query(collection(db, "posts"), orderBy("publishDate", "desc"));
    const unsubscribePosts = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      const cats = new Set(['ALL']);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        postsArray.push({ id: doc.id, ...data });
        if (data.categories) {
          data.categories.forEach(c => cats.add(c.toUpperCase()));
        }
      });
      setPosts(postsArray);
      setCategories(Array.from(cats));
      setLoading(false);
    }, (err) => {
      console.error("Posts Load Error:", err);
      setLoading(false);
    });

    return () => {
      unsubscribeAuthors();
      unsubscribePosts();
    };
  }, []);

  return (
    <View style={styles.container}>
      <SideMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        setView={setView}
        currentView={view}
      />

      <View style={{ flex: 1, display: (view === 'HOME' && !currentPost) ? 'flex' : 'none' }}>
        <LatestPosts 
          posts={posts} 
          categories={categories} 
          authorMap={authorMap} 
          loading={loading}
          onRead={(data) => setCurrentPost(data)} 
          onOpenMenu={() => setMenuVisible(true)}
        />
      </View>

      {/* ARTICLE view overlay */}
      {currentPost && (
        <Article 
          post={currentPost.post} 
          authorPhoto={currentPost.authorPhoto} 
          onBack={() => setCurrentPost(null)} 
        />
      )}

      {/* ABOUT and CONTACT screens */}
      {view === 'ABOUT' && <About onOpenMenu={() => setMenuVisible(true)} />}
      {view === 'CONTACT' && <Contact onOpenMenu={() => setMenuVisible(true)} />}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#000' } });