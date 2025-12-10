import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OtherBankTransferScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [selectedBank, setSelectedBank] = useState("Select Bank");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    };
    loadUser();
  }, []);

  // YOUR FULL BANK LIST
  const banks = [
    "5TT MICROFINANCE BANK",
    "78 FINANCE COMPANY LIMITED",
    "9 PAYMENT SERVICE BANK",
    "9JAPAY MICROFINANCE BANK",
    "AAA FINANCE AND INVESTMENT COMPANY LIMITED",
    "AB MICROFINANCE BANK",
    "Abbey Mortgage Bank",
    "Above Only Microfinance Bank",
    "ABU MICROFINANCE BANK",
    "Access Bank",
    "GTBank",
    "Zenith Bank",
    "First Bank",
    "UBA",
    "Fidelity Bank",
    "Union Bank",
    "Sterling Bank",
    "Wema Bank",
    "Polaris Bank",
  ];

  const verifyAccount = (num) => {
    setAccountNumber(num);
    if (num.length === 10) {
      setTimeout(() => setAccountName("CHUKWUDI OKONKWO"), 1200);
    } else {
      setAccountName("");
    }
  };

  const handleContinue = () => {
    if (selectedBank === "Select Bank") return Alert.alert("Error", "Select a bank");
    if (accountNumber.length !== 10) return Alert.alert("Error", "Enter valid 10-digit account number");
    if (!accountName) return Alert.alert("Error", "Account name not found");
    if (!amount || Number(amount) < 100) return Alert.alert("Error", "Minimum amount is ₦100");

    navigation.navigate("TransferSummary", {
      type: "Other Bank",
      bank: selectedBank,
      accountNumber,
      accountName,
      amount,
      narration,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>To Other Bank</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Daily Limit */}
        <View style={styles.limitBox}>
          <Text style={styles.limitLabel}>Available Daily Transaction Limit:</Text>
          <Text style={styles.limitAmount}>₦1,000,000.00</Text>
        </View>

        <Text style={styles.formTitle}>Enter Transfer Details</Text>

        {/* From Account */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>From Account</Text>
          <TouchableOpacity style={styles.dropdownField}>
            <Text style={styles.dropdownTextBold}>
              SAVINGS ACCOUNT 3090 4190 99
            </Text>
            <Ionicons name="chevron-down" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        {/* TO BANK — NOW SENDS FULL BANK LIST */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>To Bank</Text>
          <TouchableOpacity
            style={styles.dropdownField}
            onPress={() => {
              navigation.navigate("BankListScreen", {
                banks: banks, // ← THIS WAS MISSING!
                onSelectBank: (bank) => setSelectedBank(bank),
              });
            }}
          >
            <Text style={[
              styles.dropdownText,
              selectedBank !== "Select Bank" && styles.dropdownTextBold
            ]}>
              {selectedBank}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or Enter Destination Account</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Select from Beneficiary */}
        <TouchableOpacity style={styles.beneficiaryBtn}>
          <View style={styles.beneficiaryIcon}>
            <Ionicons name="person" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.beneficiaryText}>Select from Beneficiary</Text>
        </TouchableOpacity>

        {/* Amount */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Enter Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.balanceBadge}>
              Available Balance - ₦{user?.balance ? Number(user.balance).toLocaleString() : "0"}
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.ngn}>₦</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Narration */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Enter Narration</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Optional"
              value={narration}
              onChangeText={setNarration}
            />
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },

  scrollContainer: { flex: 1 },

  limitBox: {
    backgroundColor: "#F8FAFC",
    margin: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  limitLabel: { fontSize: 15, color: "#1E293B", marginBottom: 4 },
  limitAmount: { fontSize: 20, fontWeight: "800", color: "#1E293B" },

  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginVertical: 20,
  },

  field: { marginHorizontal: 20, marginBottom: 20 },
  fieldLabel: { fontSize: 14, color: "#64748B", marginBottom: 8 },

  dropdownField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius:2,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  dropdownText: { fontSize: 16, color: "#94A3B8" },
  dropdownTextBold: { color: "#1E293B", fontWeight: "600" },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  dividerText: { marginHorizontal: 12, color: "#64748B", fontSize: 14 },

  beneficiaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 20,
  },
  beneficiaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  beneficiaryText: { fontSize: 16, color: "#3B82F6", fontWeight: "600" },

  amountContainer: { marginTop: 8 },
  balanceBadge: {
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 12,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  input: { flex: 1, fontSize: 18, color: "#1E293B" },
  ngn: { fontSize: 20, fontWeight: "800", color: "#1E293B", marginRight: 8 },

  continueBtn: {
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: "#2f43dcff",
    borderRadius: 30,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 8,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});