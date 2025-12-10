import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DepositForm = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Popup states
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = (title, message) => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const closePopup = () => setPopupVisible(false);

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

  // Format currency
  const formatCurrency = (text) => {
    const numbersOnly = text.replace(/[^0-9]/g, "");
    if (!numbersOnly) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(numbersOnly);
  };

  const handleAmountChange = (text) => {
    setAmount(formatCurrency(text));
  };

  // HANDLE DEPOSIT — NOW 100% CORRECT
  const handleDeposit = async () => {
    if (!amount || amount === "₦0") {
      showPopup("Invalid Amount", "Please enter a valid deposit amount");
      return;
    }

    const rawAmount = Number(amount.replace(/[^0-9]/g, ""));
    const email=user?.email || "";
    const fullname=user?.fullname || "";
    if (rawAmount < 100) {
      showPopup("Minimum Deposit", "Minimum deposit is ₦100");
      return;
    }

    if (!user?.token) {
      showPopup("Not Logged In", "Please log in again");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.6:5000/api/transactions/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`, // Critical!
        },
        body: JSON.stringify({
          amount: rawAmount,
          email: email,
          fullname: fullname,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: "Server error" };
      }

      if (response.ok) {
        showPopup(
          "Deposit Successful!",
          `₦${rawAmount.toLocaleString()} has been credited to your account.\n\nNew Balance: ₦${data.newBalance?.toLocaleString() || "Updated"}`
        );

        // Clear form & go back after 2 seconds
        setTimeout(() => {
          setAmount("");
          navigation.navigate("Dashboard");
        }, 2000);
      } else {
        showPopup("Deposit Failed", data.message || "Transaction failed. Try again.");
      }
    } catch (error) {
      console.log("Deposit error:", error);
      showPopup(
        "No Connection",
        "Could not reach server.\n\nCheck:\n• Same WiFi\n• Server is running\n• IP: 172.20.10.3:5000"
      );
    } finally {
      setLoading(false);
    }
  };

  const recents = [
    { name: "DANIEL IFEANYI OKEKE", phone: "611 945 8490" },
    { name: "ELOHOR JASMINE ENIWOAREKE", phone: "705 777 4264" },
    { name: "PEACE OFURE EJODAMEN", phone: "810 160 0671" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1d4ed8" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Deposit Money</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Blue Hero Card */}
        {/* === BLUE HERO CARD — AMOUNT FITS + YOU CAN TYPE === */}
<View style={styles.heroCard}>
  <Text style={styles.heroTitle}>How much would you like to deposit?</Text>

  {/* This shows the big beautiful amount */}
  <Text 
    style={styles.amountDisplay}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.3}
  >
    {amount || "₦0"}
  </Text>

  {/* This invisible TextInput covers the whole area so you can type */}
  <TextInput
    style={styles.touchableInput}
    keyboardType="numeric"
    value={amount.replace(/[^0-9]/g, "")}
    onChangeText={(text) => {
      const numbers = text.replace(/[^0-9]/g, "");
      if (!numbers) {
        setAmount("");
      } else {
        const formatted = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
          minimumFractionDigits: 0,
        }).format(numbers);
        setAmount(formatted);
      }
    }}
    placeholder="Enter amount"
    placeholderTextColor="transparent"
    showSoftInputOnFocus={true}
  />

  <Text style={styles.currencyText}>Nigerian Naira • NGN</Text>
</View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitBtn, (!amount || loading) && styles.submitBtnDisabled]}
            onPress={handleDeposit}
            disabled={!amount || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Deposit</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Recipients */}
        <View style={styles.recentsSection}>
          <Text style={styles.recentsTitle}>Recent Recipients</Text>
          {recents.map((person, i) => (
            <TouchableOpacity key={i} style={styles.recentItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {person.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </Text>
              </View>
              <View style={styles.recentDetails}>
                <Text style={styles.recentName}>{person.name}</Text>
                <Text style={styles.recentPhone}>{person.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Recipients</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Popup Modal */}
      <Modal visible={popupVisible} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>{popupTitle}</Text>
            <Text style={styles.popupMessage}>{popupMessage}</Text>
            <TouchableOpacity style={styles.popupBtn} onPress={closePopup}>
              <Text style={styles.popupBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  appBar: {
    backgroundColor: "#1d4ed8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backBtn: { padding: 6 },
  appBarTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  heroCard: {
  backgroundColor: "#1d4ed8",
  marginHorizontal: 20,
  marginTop: 30,
  borderRadius: 32,
  paddingVertical: 70,
  paddingHorizontal: 30,
  alignItems: "center",
  elevation: 15,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 10 },
  position: "relative", // Important for overlay
},

amountDisplay: {
  fontSize: 78,
  fontWeight: "900",
  color: "#ffffff",
  textAlign: "center",
  letterSpacing: 2,
  minWidth: "100%",
  includeFontPadding: false,
  marginBottom: 10,
  numberOfLines: 1,
  adjustsFontSizeToFit: true,
  minimumFontScale: 0.3,
},

// THIS IS THE FIX — covers the entire amount area
touchableInput: {
  position: "absolute",
  top: 100,        // Adjust to cover the amount area
  left: 0,
  right: 0,
  bottom: 60,      // Leave space for currency text
  opacity: 0,      // Invisible but tappable and typeable
  textAlign: "center",
  fontSize: 64,
  color: "transparent",
  caretHidden: true, // Optional: hide cursor
},

currencyText: {
  color: "#93c5fd",
  fontSize: 18,
  fontWeight: "600",
  marginTop: 16,
},
heroTitle: {
  color: "#fff",
  fontSize: 27,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 40,
  lineHeight: 38,
},
// Hidden input — invisible but lets you type
hiddenInput: {
  position: "absolute",
  width: 100,
  height: 50,
  opacity: 0,
  top: 0,
  left: 0,
},
  submitSection: { paddingHorizontal: 40, marginTop: 30 },
  submitBtn: { backgroundColor: "#1d4ed8", paddingVertical: 22, borderRadius: 20, alignItems: "center" },
  submitBtnDisabled: { backgroundColor: "#94a3b8" },
  submitBtnText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  recentsSection: { paddingHorizontal: 20, marginTop: 20 },
  recentsTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16, color: "#1e293b" },
  recentItem: { flexDirection: "row", backgroundColor: "#fff", padding: 22, borderRadius: 20, marginBottom: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center", marginRight: 18 },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  recentDetails: { flex: 1 },
  recentName: { fontSize: 17, fontWeight: "600", color: "#1e293b" },
  recentPhone: { color: "#64748b", marginTop: 4 },

  viewAllBtn: { alignItems: "center", marginTop: 10 },
  viewAllText: { color: "#1d4ed8", fontSize: 16, fontWeight: "600" },

  popupOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  popup: { width: "85%", backgroundColor: "#fff", padding: 25, borderRadius: 20, elevation: 10 },
  popupTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10, color: "#1e293b" },
  popupMessage: { fontSize: 16, color: "#475569", marginBottom: 20 },
  popupBtn: { backgroundColor: "#1d4ed8", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  popupBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});

export default DepositForm;