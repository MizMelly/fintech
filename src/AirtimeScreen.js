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
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const promoImages = [
  require("../assets/ads1.png"),
  require("../assets/ads2.png"),
  require("../assets/ads3.png"),
];

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

export default function AirtimeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [voucher, setVoucher] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(floatAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, floatAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentIndex.current + 1) % promoImages.length;
      flatListRef.current?.scrollToOffset({
        offset: next * width,
        animated: true,
      });
      currentIndex.current = next;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

 // Load user from storage (for token + user info)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser({ ...parsed, token });
        }
      } catch (error) {
        console.log("Failed to load user:", error);
      }
    };
    loadUser();
  }, []);

  const detectNetwork = (num) => {
    if (num.length < 4) {
      setSelectedNetwork(null);
      return;
    }
    const prefix = num.substring(0, 4);
    for (const [name, prefixes] of Object.entries(prefixMap)) {
      if (prefixes.includes(prefix)) {
        const found = networks.find((n) => n.name === name);
        if (found) setSelectedNetwork(found);
        return;
      }
    }
    setSelectedNetwork(null);
  };

  const handlePhoneChange = (value) => {
    const numeric = value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhone(numeric);
    detectNetwork(numeric);
  };

  const topUpAmounts = [100, 200, 500, 1000, 2000, 5000];

  // GET FINAL AMOUNT
  const getFinalAmount = () => {
    if (customAmount) return Number(customAmount);
    if (selectedAmount) return selectedAmount;
    return 0;
  };

const handleBuy = async () => {
  const amount = getFinalAmount();

  if (!amount || amount < 50) {
    Alert.alert("Invalid Amount", "Please select or enter an amount ≥ ₦50");
    return;
  }

  if (!phone || phone.length !== 11) {
    Alert.alert("Invalid Phone", "Enter a valid 11-digit number");
    return;
  }

  if (!selectedNetwork) {
    Alert.alert("Network Error", "Could not detect network. Try again.");
    return;
  }

  if (!user || amount > Number(user.balance || 0)) {
    Alert.alert("Insufficient Funds", `You need ₦${amount.toLocaleString()}`);
    return;
  }

  setLoading(true);

  const requestBody = {
    amount,
    network: selectedNetwork.name,
    phone,
    voucher: voucher || null,
  };

  console.log("Airtime purchase request:", requestBody);

  try {
    const response = await fetch("http://192.168.1.6:5000/api/transactions/airtime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("Airtime purchase response:", response.status, data);

    if (response.ok) {
      // Update balance locally
      const newBalance = Number(user.balance) - amount;
      const updatedUser = { ...user, balance: newBalance };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      Alert.alert("Success!", `Airtime purchased successfully!\n₦${amount.toLocaleString()} to ${phone}`);
      navigation.goBack();
    } else {
      // Show backend error message
      console.log("Airtime failed:", data.message || "Unknown error");
      Alert.alert("Failed", data.message || "Airtime purchase failed");
    }
  } catch (error) {
    console.error("Network or fetch error:", error);
    Alert.alert("Error", "Network error. Check your connection.");
  } finally {
    setLoading(false);
  }
};

  const position = Animated.divide(scrollX, width);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Buy Airtime</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Promo Slider */}
        <View style={styles.promoContainer}>
          <FlatList
            ref={flatListRef} data={promoImages} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => (
              <Image source={item} style={styles.promoImage} resizeMode="cover" />
            )}
            keyExtractor={(_, i) => i.toString()}
          />
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

        {/* Network Banner */}
        {selectedNetwork && (
          <Animated.View style={[styles.networkBanner, { backgroundColor: selectedNetwork.color + "22" }, { transform: [{ scale: floatAnim }] }]}>
            <LinearGradient colors={selectedNetwork.gradient} style={styles.networkGradient}>
              <Image source={selectedNetwork.logo} style={styles.networkLogo} />
            </LinearGradient>
            <Text style={styles.networkText}>{selectedNetwork.name} Network Detected</Text>
          </Animated.View>
        )}

        {/* Phone Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={22} color="#3B82F6" />
            <TextInput
              style={styles.input}
              placeholder="08012345678"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="numeric"
              maxLength={11}
            />
            {selectedNetwork && <Image source={selectedNetwork.logo} style={styles.smallLogo} />}
          </View>
        </View>

        {/* Quick Amounts */}
        <View style={styles.section}>
          <Text style={styles.label}>Quick Top-Up</Text>
          <View style={styles.amountGrid}>
            {topUpAmounts.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.amountBtn,
                  selectedAmount === amt && styles.amountBtnSelected,
                ]}
                onPress={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
              >
                <Text style={[styles.amountText, selectedAmount === amt && styles.amountTextSelected]}>
                  ₦{amt.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Or Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.ngn}>₦</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
              value={customAmount}
              onChangeText={(v) => {
                setCustomAmount(v.replace(/[^0-9]/g, ""));
                setSelectedAmount(null);
              }}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Voucher */}
        <View style={styles.section}>
          <Text style={styles.label}>Recharge Voucher (Optional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card" size={22} color="#3B82F6" />
            <TextInput
              style={styles.input}
              placeholder="Enter 16-digit PIN"
              placeholderTextColor="#94A3B8"
              value={voucher}
              onChangeText={setVoucher}
              keyboardType="numeric"
              maxLength={16}
            />
          </View>
        </View>

        {/* FLOATING BUY BUTTON */}
        <View style={styles.floatingContainer}>
          <TouchableOpacity 
            onPress={handleBuy} 
            style={styles.buyBtn}
            disabled={loading}
          >
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.buyGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="flash" size={24} color="#FFFFFF" />
                  <Text style={styles.buyText}>Buy Airtime Now</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  scrollContent: {
    paddingBottom: 160, // Space for floating button + bottom nav
  },
  promoContainer: {
    height: 180,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  promoImage: {
    width,
    height: 180,
  },
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
  networkBanner: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  networkGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  networkLogo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  networkText: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 16,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
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
  input: {
    flex: 1,
    color: "#1E293B",
    fontSize: 17,
    marginLeft: 12,
  },
  ngn: {
    color: "#1E293B",
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 8,
  },
  smallLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amountBtn: {
    width: "31%",
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amountBtnSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  amountText: {
    color: "#1E293B",
    fontWeight: "700",
  },
  amountTextSelected: {
    color: "#FFFFFF",
  },
  floatingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buyBtn: {
    borderRadius: 30,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buyGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  buyText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
    marginLeft: 12,
  },
  headerSpacer: {
    width: 28,
  },
});