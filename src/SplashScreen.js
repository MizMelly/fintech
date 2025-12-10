import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, Animated, Dimensions, FlatList, StatusBar } from "react-native";


const { width } = Dimensions.get('window');

const slides = [
  { id: '1', image: require('../assets/Splash1.jpg') },
  { id: '2', image: require('../assets/Splash2.jpg') },
  { id: '3', image: require('../assets/Splash3.jpg') },
];

const SLIDE_DURATION = 1000; // 1 seconds

export default function SplashScreen({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  //--- Auto scroll----

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [currentIndex]);

  //--- GO to Login Page after all slides----

  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      const timeout = setTimeout(() => {
        navigation.replace("Login");
      }, SLIDE_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="cover"/>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16} />

        {/* Dot Indicators */}
      <View style={styles.dots}>
        {slides.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (i - 1) * width, i * width, (i + 1) * width
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i.toString()}
              style={[styles.dot, { opacity }]}
            />
          );
        })}
        </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: { width, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: "100%" },
  dots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    marginHorizontal: 5,
  },
});