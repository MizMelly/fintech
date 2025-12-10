import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  StatusBar,
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

// Network Detection
const prefixMap = {
  MTN: ["0803", "0806", "0703", "0706", "0810", "0813", "0814", "0816", "0903", "0906", "0913", "0916"],
  Airtel: ["0802", "0808", "0708", "0812", "0701", "0901", "0902", "0904", "0907", "0912"],
  Glo: ["0805", "0807", "0705", "0811", "0815", "0905", "0915"],
  "9mobile": ["0809", "0817", "0818", "0909", "0908"],
};

const networks = [
  { id: "1", name: "MTN", logo: require("../assets/mtn.jpg"), color: "#F59E0B", gradient: ["#FBBF24", "#F59E0B"] },
  { id: "2", name: "Airtel", logo: require("../assets/airtel.jpg"), color: "#DC2626", gradient: ["#EF4444", "#DC2626"] },
  { id: "3", name: "Glo", logo: require("../assets/glo.png"), color: "#16A34A", gradient: ["#22C55E", "#16A34A"] },
  { id: "4", name: "9mobile", logo: require("../assets/9mobile.jpg"), color: "#10B981", gradient: ["#34D399", "#10B981"] },
];

// Data Plans
const allDataPlans = [
  { id: "mtn1", name: "1GB Daily", price: 300, validity: "24hrs", network: "MTN", logo: require("../assets/mtn.jpg") },
  { id: "mtn2", name: "2GB Weekly", price: 500, validity: "7 days", network: "MTN", logo: require("../assets/mtn.jpg") },
  { id: "airtel1", name: "1.5GB Monthly", price: 500, validity: "30 days", network: "Airtel", logo: require("../assets/airtel.jpg") },
  { id: "glo1", name: "3.9GB", price: 1000, validity: "30 days", network: "Glo", logo: require("../assets/glo.png") },
  { id: "mtn3", name: "10GB Monthly", price: 2500, validity: "30 days", network: "MTN", logo: require("../assets/mtn.jpg") },
  { id: "airtel2", name: "6GB", price: 1500, validity: "30 days", network: "Airtel", logo: require("../assets/airtel.jpg") },
];

export default function DataScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [promoIndex, setPromoIndex] = useState(0);

  // Load user
  useEffect(() => {
    AsyncStorage.getItem("user").then((saved) => {
      if (saved) setUser(JSON.parse(saved));
    });
  }, []);

  // Auto slide promo
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePhoneChange = (value) => {
    const numeric = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhone(numeric);
    if (numeric.length >= 4) {
      const prefix = numeric.substring(0, 4);
      for (const [name, prefixes] of Object.entries(prefixMap)) {
        if (prefixes.includes(prefix)) {
          setSelectedNetwork(networks.find(n => n.name === name) || null);
          return;
        }
      }
      setSelectedNetwork(null);
    } else {
      setSelectedNetwork(null);
    }
  };

  const filteredPlans = useMemo(() => {
    return selectedNetwork
      ? allDataPlans.filter(p => p.network === selectedNetwork.name)
      : allDataPlans;
  }, [selectedNetwork]);

  const handleBuyData = async () => {
    if (!phone || phone.length !== 11) return Alert.alert("Error", "Enter valid 11-digit number");
    if (!selectedNetwork) return Alert.alert("Error", "Network not detected");
    if (!selectedPlan) return Alert.alert("Error", "Select a data plan");
    if (selectedPlan.price > Number(user?.balance || 0)) return Alert.alert("Error", "Insufficient balance");

    setLoading(true);

    try {
      const response = await fetch("http://172.20.10.3:5000/api/transactions/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          network: selectedNetwork.name,
          phone,
          plan: selectedPlan.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newBalance = user.balance - selectedPlan.price;
        const updatedUser = { ...user, balance: newBalance };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        Alert.alert("Success!", `${selectedPlan.name} activated on ${phone}`);
        navigation.goBack();
      } else {
        Alert.alert("Failed", data.message || "Data purchase failed");
      }
    } catch (err) {
      Alert.alert("Error", "Check your connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Buy Data</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* MAIN SCROLLVIEW — NOW WORKS PERFECTLY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }} // Space for floating button
      >
        {/* Promo Image */}
        <Image
          source={promoImages[promoIndex]}
          style={styles.promoImage}
          resizeMode="cover"
        />

        {/* Network Banner */}
        {selectedNetwork && (
          <View style={styles.networkBanner}>
            <LinearGradient colors={selectedNetwork.gradient} style={styles.networkGradient}>
              <Image source={selectedNetwork.logo} style={styles.networkLogo} />
            </LinearGradient>
            <Text style={styles.networkText}>{selectedNetwork.name} Detected</Text>
          </View>
        )}

        {/* Phone Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={22} color="#3B82F6" />
            <TextInput
              style={styles.input}
              placeholder="08012345678"
              keyboardType="numeric"
              value={phone}
              onChangeText={handlePhoneChange}
              maxLength={11}
            />
            {selectedNetwork && <Image source={selectedNetwork.logo} style={styles.smallLogo} />}
          </View>
        </View>

        {/* Data Plans Grid */}
        <View style={styles.section}>
          <Text style={styles.label}>Choose Data Plan</Text>
          <View style={styles.plansGrid}>
            {filteredPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan?.id === plan.id && styles.selectedPlan,
                ]}
                onPress={() => setSelectedPlan(plan)}
              >
                <Image source={plan.logo} style={styles.planLogo} />
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
                <Text style={styles.planValidity}>{plan.validity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Floating Buy Button */}
        <View style={styles.floatingContainer}>
          <TouchableOpacity
            style={[styles.buyBtn, (!selectedPlan || loading) && styles.buyBtnDisabled]}
            onPress={handleBuyData}
            disabled={!selectedPlan || loading}
          >
            <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.buyGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="wifi" size={24} color="#fff" />
                  <Text style={styles.buyText}>Buy Data Now</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },

  promoImage: {
    width: width * 0.9,
    height: 180,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
  },

  networkBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  networkGradient: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", marginRight: 12 },
  networkLogo: { width: 32, height: 32, resizeMode: "contain" },
  networkText: { fontSize: 16, fontWeight: "700", color: "#1E293B" },

  section: { marginHorizontal: 20, marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1E293B" },

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
  smallLogo: { width: 30, height: 30, resizeMode: "contain" },

  plansGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  planCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  selectedPlan: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  planLogo: { width: 48, height: 48, marginBottom: 12 },
  planName: { fontSize: 16, fontWeight: "700" },
  planPrice: { fontSize: 24, color: "#3B82F6", fontWeight: "900" },
  planValidity: { fontSize: 14, color: "#64748B" },

  floatingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 10,
  },
  buyBtn: { borderRadius: 30, overflow: "hidden" },
  buyBtnDisabled: { opacity: 0.6 },
  buyGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buyText: { color: "#fff", fontSize: 18, marginLeft: 10, fontWeight: "800" },
});