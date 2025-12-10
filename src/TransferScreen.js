// src/TransferScreen.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TransferScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const transferOptions = [
    // Local Currency
    { icon: "wallet", title: "To FintechMonie Wallet", screen: "TransferForm" },
    // FIXED: Now goes to OtherBankTransferScreen
    { icon: "bank", title: "To Other Bank Account", screen: "OtherBankTransferScreen" },
    { icon: "people", title: "Send To Saved Beneficiary", screen: "Beneficiaries" },
    { icon: "card", title: "eNaira", screen: "ENaira" },
    // Foreign Currency
    { icon: "globe", title: "FX Sales", screen: "FXSales", isForeign: true },
  ];

  const handleTransfer = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Transfer</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* MY FAVORITES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY FAVORITES</Text>
          <View style={styles.favoritesContainer}>
            <TouchableOpacity style={styles.addFavoriteBtn}>
              <View style={styles.plusCircle}>
                <Ionicons name="add" size={36} color="#3B82F6" />
              </View>
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LOCAL CURRENCY TRANSFERS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LOCAL CURRENCY TRANSFERS</Text>
          <View style={styles.optionsContainer}>
            {transferOptions
              .filter(item => !item.isForeign)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.transferCard}
                  onPress={() => handleTransfer(item.screen)}
                >
                  <View style={styles.cardIcon}>
                    <Ionicons name={item.icon} size={28} color="#3B82F6" />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* FOREIGN CURRENCY TRANSFERS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FOREIGN CURRENCY TRANSFERS</Text>
          <View style={styles.optionsContainer}>
            {transferOptions
              .filter(item => item.isForeign)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.transferCard}
                  onPress={() => handleTransfer(item.screen)}
                >
                  <View style={styles.cardIcon}>
                    <Ionicons name={item.icon} size={28} color="#3B82F6" />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={24} color="#94A3B8" />
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },

  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 16,
    letterSpacing: 1.2,
  },

  // MY FAVORITES
  favoritesContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  addFavoriteBtn: { alignItems: "center" },
  plusCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  addText: { 
    fontSize: 17, 
    color: "#3B82F6", 
    fontWeight: "700" 
  },

  // TRANSFER CARDS
  optionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    overflow: "hidden",
  },
  transferCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16.5,
    fontWeight: "600",
    color: "#1E293B",
  },
});