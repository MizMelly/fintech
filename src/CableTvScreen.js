import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tvProviders = [
  { id: "1", name: "DSTV", code: "dstv" },
  { id: "2", name: "GOTV", code: "gotv" },
  { id: "3", name: "STARTIMES", code: "startimes" },
];

export default function CableTvScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [smartCard, setSmartCard] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}
    };
    loadUser();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedProvider) return Alert.alert("Error", "Select a provider");
    if (!smartCard || smartCard.length < 8) return Alert.alert("Error", "Enter valid smart card number");
    if (!amount || Number(amount) < 100) return Alert.alert("Error", "Minimum amount is ₦100");
    if (Number(amount) > Number(user?.balance || 0)) return Alert.alert("Error", "Insufficient balance");

    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.6:5000/api/transactions/cabletv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          provider: selectedProvider.name,
          smart_card: smartCard,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newBalance = Number(user.balance) - Number(amount);
        const updatedUser = { ...user, balance: newBalance };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        Alert.alert("Success!", `₦${amount} subscription renewed\n${selectedProvider.name}`);
        navigation.goBack();
      } else {
        Alert.alert("Failed", data.message || "Subscription failed");
      }
    } catch (error) {
      Alert.alert("Error", "Check your connection");
    } finally {
      setLoading(false);
    }
  };
const promoSlides = [
  {
    title: "Never Miss Your Favorite Shows!",
    subtitle: "Renew your DSTV, GOTV or Startimes instantly.",
    offer: "Instant activation — No service charge",
  },
  {
    title: "Save More on TV Subscription!",
    subtitle: "Enjoy seamless renewal anytime.",
    offer: "Get 5% cashback on DSTV Premium!",
  },
  {
    title: "Fast • Secure • Reliable",
    subtitle: "Your favourite channels always active.",
    offer: "Pay in seconds with your wallet",
  },
];

const [slideIndex, setSlideIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setSlideIndex((prev) => (prev + 1) % promoSlides.length);
  }, 3500);

  return () => clearInterval(interval);

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

return (
  <ScrollView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

    {/* Header */}
    <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Cable TV</Text>
      <View style={{ width: 28 }} />
    </View>

    {/* AUTO-SLIDING PROMO CAROUSEL */}
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      contentOffset={{ x: slideIndex * 320, y: 0 }}
      style={{ marginTop: 20 }}
    >
      {promoSlides.map((item, index) => (
        <LinearGradient
          key={index}
          colors={["#3B82F6", "#2563EB"]}
          style={styles.promoCard}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{item.title}</Text>
            <Text style={styles.promoSubtitle}>{item.subtitle}</Text>

            <View style={styles.promoHighlight}>
              <Text style={styles.highlightText}>{item.offer}</Text>
            </View>
          </View>
        </LinearGradient>
      ))}
    </ScrollView>

    {/* Provider Selection */}
    <View style={styles.section}>
      <Text style={styles.label}>Select Provider</Text>
      <View style={styles.providerGrid}>
        {tvProviders.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.providerCard,
              selectedProvider?.id === item.id && styles.selectedProvider,
            ]}
            onPress={() => setSelectedProvider(item)}
          >
            <Text style={styles.providerLogo}>TV</Text>
            <Text style={styles.providerName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    {/* Smart Card */}
    <View style={styles.section}>
      <Text style={styles.label}>Smart Card / IUC Number</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="card" size={22} color="#3B82F6" />
        <TextInput
          style={styles.input}
          placeholder="Enter smart card number"
          value={smartCard}
          onChangeText={setSmartCard}
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
          placeholder="2500"
          value={amount}
          onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
        />
      </View>
    </View>

    {/* Subscribe button */}
    <View style={styles.floatingContainer}>
      <TouchableOpacity
        style={[
          styles.subscribeBtn,
          (!selectedProvider || !amount || loading) && styles.subscribeBtnDisabled,
        ]}
        onPress={handleSubscribe}
        disabled={!selectedProvider || !amount || loading}
      >
        <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.subscribeGradient}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="tv" size={24} color="#fff" />
              <Text style={styles.subscribeText}>Renew Subscription</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },

 
highlightText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
},
  // PROMOTIONAL WRITE-UP CARD
 promoCard: {
  width: 320,
  height: 150,
  marginLeft: 20,
  borderRadius: 16,
  padding: 18,
  justifyContent: "center",
  elevation: 6,
},
promoContent: { alignItems: "center" },
promoTitle: {
  fontSize: 18,
  fontWeight: "800",
  color: "#fff",
  textAlign: "center",
  marginBottom: 6,
},
promoSubtitle: {
  fontSize: 14,
  color: "#E0F2FE",
  textAlign: "center",
  lineHeight: 20,
  marginBottom: 10,
},
promoHighlight: {
  backgroundColor: "rgba(255,255,255,0.25)",
  padding: 8,
  borderRadius: 12,
  width: "90%",
},
  section: { marginHorizontal: 20, marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1E293B" },

  providerGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  providerCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 6,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  selectedProvider: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  providerLogo: { fontSize: 40, marginBottom: 8 },
  providerName: { fontSize: 16, fontWeight: "700", color: "#1E293B" },

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
  subscribeBtn: { borderRadius: 30, overflow: "hidden", elevation: 10 },
  subscribeBtnDisabled: { opacity: 0.6 },
  subscribeGradient: { flexDirection: "row", paddingVertical: 18, justifyContent: "center", alignItems: "center" },
  subscribeText: { color: "#fff", fontSize: 18, marginLeft: 10, fontWeight: "800" },
});