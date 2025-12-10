// src/AddMoneyScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DepositForm from "./DepositForm";

export default function AddMoneyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const accountNumber = "701 234 5678";

  const copyNumber = () => {
    Clipboard.setString(accountNumber.replace(/\s/g, ""));
    Alert.alert("Copied!", "Account number copied to clipboard");
  };

  const shareDetails = () => {
    Alert.alert("Share", "Share account details via WhatsApp, SMS, etc.");
  };

  const methods = [
    {
      icon: "business",
      title: "Bank Transfer",
      subtitle: "Add money via mobile or internet banking",
      screen: null,
    },
    {
      icon: "cash",
      title: "Cash Deposit",
      subtitle: "Fund your account with nearby merchants",
      screen: DepositForm,
    },
    {
      icon: "card",
      title: "Top-up with Card/Account",
      subtitle: "Add money directly from your bank card or account",
      screen: null,
    },
    {
      icon: "logo-usd",
      title: "Bank USSD",
      subtitle: "With other banks' USSD code",
      screen: null,
    },
    {
      icon: "qr-code",
      title: "Scan my QR Code",
      subtitle: "Show QR code to any OPay user",
      screen: null,
    },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Money</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANK TRANSFER CARD */}
        <View style={styles.bankCard}>
          <View style={styles.bankHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="business" size={28} color="#3B82F6" />
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankTitle}>Bank Transfer</Text>
              <Text style={styles.bankSubtitle}>
                Add money via mobile or internet banking
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
          </View>

          <View style={styles.accountSection}>
            <Text style={styles.accountLabel}>fintech Account Number</Text>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.copyBtn} onPress={copyNumber}>
                <Text style={styles.copyText}>Copy Number</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn} onPress={shareDetails}>
                <Text style={styles.shareText}>Share Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* OR Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* OTHER METHODS */}
        <View style={styles.methodsContainer}>
          {methods.slice(1).map((method, i) => (
  <TouchableOpacity
    key={i}
    style={styles.methodItem}
    onPress={() => {
      if (method.screen) {
        navigation.navigate(method.screen);
      }
    }}
  >
              <View style={styles.methodIcon}>
                <Ionicons name={method.icon} size={24} color="#3B82F6" />
              </View>
              <View style={styles.methodText}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  bankCard: {
    backgroundColor: "#3B82F6",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bankHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankInfo: {
    flex: 1,
  },
  bankTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  bankSubtitle: {
    color: "#E0F2FE",
    fontSize: 14,
    marginTop: 2,
  },
  accountSection: {
    alignItems: "center",
  },
  accountLabel: {
    color: "#E0F2FE",
    fontSize: 14,
    marginBottom: 8,
  },
  accountNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  copyBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  copyText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  shareBtn: {
    backgroundColor: "#06B6D4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  shareText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 40,
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  orText: {
    color: "#64748B",
    fontWeight: "600",
    marginHorizontal: 12,
  },
  methodsContainer: {
    paddingHorizontal: 20,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodText: {
    flex: 1,
  },
  methodTitle: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
  },
  methodSubtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 2,
  },
});