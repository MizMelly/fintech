// src/ElectricityScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// Promo Images
const promoImages = [
  require("../assets/ads1.png"),
  require("../assets/ads2.png"),
  require("../assets/ads3.png"),
];

// Electricity Companies
const discos = [
  { id: "1", name: "Ikeja Electric", code: "ikeja", logo: require("../assets/oramo.png") },
  { id: "2", name: "Eko Electric", code: "ekedc", logo: require("../assets/giftcard.png") },
  { id: "3", name: "Abuja Electric", code: "aedc", logo: require("../assets/mtn.jpg") },
  { id: "4", name: "PHCN", code: "phcn", logo: require("../assets/glo.png") },
];

export default function ElectricityScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedDisco, setSelectedDisco] = useState(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // FIXED LINE 40 — Promo slider with Animated + Dots
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Auto scroll promo
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (Math.round(scrollX._value / width) + 1) % promoImages.length;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [scrollX]);

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}
    };
    loadUser();
  }, []);

  const handlePayBill = async () => {
    if (!selectedDisco) return Alert.alert("Error", "Select a disco");
    if (!meterNumber || meterNumber.length < 6) return Alert.alert("Error", "Enter valid meter number");
    if (!amount || Number(amount) < 100) return Alert.alert("Error", "Minimum amount is ₦100");
    if (Number(amount) > Number(user?.balance || 0)) return Alert.alert("Error", "Insufficient balance");

    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.6:5000/api/transactions/electricity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          disco: selectedDisco.name,
          meter_number: meterNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newBalance = Number(user.balance) - Number(amount);
        const updatedUser = { ...user, balance: newBalance };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        Alert.alert("Success!", `₦${amount} paid to ${selectedDisco.name}\nMeter: ${meterNumber}`);
        navigation.goBack();
      } else {
        Alert.alert("Failed", data.message || "Payment failed");
      }
    } catch (error) {
      Alert.alert("Error", "Check your connection");
    } finally {
      setLoading(false);
    }
  };

  // Dots animation
  const position = Animated.divide(scrollX, width);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Electricity Bill</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promo Slider — NOW WORKS PERFECTLY */}
        <View style={styles.promoContainer}>
          <FlatList
            ref={flatListRef}
            data={promoImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => (
              <Image source={item} style={styles.promoImage} resizeMode="cover" />
            )}
            keyExtractor={(_, i) => i.toString()}
          />
          {/* Dots Indicator */}
          <View style={styles.dots}>
            {promoImages.map((_, i) => {
              const opacity = position.interpolate({
                inputRange: [i - 1, i, i + 1],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
            })}
          </View>
        </View>

        {/* Disco Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Provider</Text>
          <FlatList
            data={discos}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.discoCard,
                  selectedDisco?.id === item.id && styles.selectedDisco,
                ]}
                onPress={() => setSelectedDisco(item)}
              >
                <Image source={item.logo} style={styles.discoLogo} resizeMode="contain" />
                <Text style={styles.discoName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Meter Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Meter Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="flash" size={22} color="#3B82F6" />
            <TextInput
              style={styles.input}
              placeholder="Enter meter number"
              value={meterNumber}
              onChangeText={setMeterNumber}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount (₦)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.ngn}>₦</Text>
            <TextInput
              style={styles.input}
              placeholder="1000"
              value={amount}
              onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Floating Pay Button */}
        <View style={styles.floatingContainer}>
          <TouchableOpacity
            style={[styles.payBtn, (!selectedDisco || !amount || loading) && styles.payBtnDisabled]}
            onPress={handlePayBill}
            disabled={!selectedDisco || !amount || loading}
          >
            <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.payGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="flash" size={24} color="#fff" />
                  <Text style={styles.payText}>Pay Bill Now</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },

  promoContainer: { height: 180, marginHorizontal: 20, marginTop: 20, borderRadius: 20, overflow: "hidden" },
  promoImage: { width, height: 180 },

  dots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginHorizontal: 4,
  },

  section: { marginHorizontal: 20, marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1E293B" },

  discoList: { paddingVertical: 10 },
  discoCard: {
    width: 120,
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  selectedDisco: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  discoLogo: { width: 48, height: 48, marginBottom: 8 },
  discoName: { fontSize: 14, fontWeight: "700", color: "#1E293B" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: { flex: 1, fontSize: 17, marginLeft: 12, color: "#1E293B" },
  ngn: { fontSize: 20, fontWeight: "800", marginLeft: 8, color: "#1E293B" },

  floatingContainer: { paddingHorizontal: 20, paddingBottom: 30 },
  payBtn: { borderRadius: 30, overflow: "hidden", elevation: 10 },
  payBtnDisabled: { opacity: 0.6 },
  payGradient: { flexDirection: "row", paddingVertical: 18, justifyContent: "center", alignItems: "center" },
  payText: { color: "#fff", fontSize: 18, marginLeft: 10, fontWeight: "800" },
});