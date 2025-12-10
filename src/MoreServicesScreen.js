// src/MoreServicesScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const services = [
  // E-COMMERCE
  { id: 1, name: "oramo", logo: require("../assets/oramo.png"), badge: "NEW" },
  { id: 2, name: "AliExpress", logo: require("../assets/aliexpress.png") },
  { id: 3, name: "Gift Cards", logo: require("../assets/giftcard.png"), badge: "HOT" },
  { id: 4, name: "Chowdeck", logo: require("../assets/chowdeck.png") },

  // BILLS PAYMENT
  { id: 5, name: "Electricity", icon: "flash", badge: "HOT" },
  { id: 6, name: "Solar", icon: "sunny" },
  { id: 7, name: "Products and Services", icon: "cube" },
  { id: 8, name: "School & Exam", icon: "school" },
  { id: 9, name: "Credit and Loans", icon: "cash" },
  { id: 10, name: "Internet Services", icon: "wifi" },
  { id: 11, name: "Financial Services", icon: "card" },
  { id: 12, name: "Invoice Payments", icon: "document-text" },
  { id: 13, name: "Aid Grants and Donations", icon: "heart" },
  { id: 14, name: "Religious", icon: "pricetag" },
  { id: 15, name: "Government Payments", icon: "business" },
  { id: 16, name: "Embassies", icon: "flag" },
  { id: 17, name: "TV(Others)", icon: "tv" },
  { id: 18, name: "Shopping", icon: "bag" },
  { id: 19, name: "Online Shopping", icon: "cart" },
  { id: 20, name: "Merchant Payments", icon: "storefront" },
  { id: 21, name: "Blackberry", icon: "phone-portrait" },
  { id: 22, name: "PayChoice", icon: "wallet" },
  { id: 23, name: "Commerce Retail Trade", icon: "shield-checkmark" },
  { id: 24, name: "Prepaid Card Services", icon: "card" },
];

export default function MoreServicesScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const renderService = (item) => (
    <TouchableOpacity key={item.id} style={styles.serviceItem}>
      {item.logo ? (
        <Image source={item.logo} style={styles.logo} resizeMode="contain" />
      ) : (
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={28} color="#3B82F6" />
        </View>
      )}
      {item.badge && (
        <View
          style={[
            styles.badge,
            item.badge === "HOT" ? styles.hotBadge : styles.newBadge,
          ]}
        >
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>All Services</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* E-COMMERCE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E-commerce</Text>
          <View style={styles.grid}>
            {services.slice(0, 4).map(renderService)}
          </View>
        </View>

        {/* BILLS PAYMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bills Payment</Text>
          <View style={styles.grid}>
            {services.slice(4).map(renderService)}
          </View>
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
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceItem: {
    width: "22%",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 8,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 32,
    alignItems: "center",
  },
  hotBadge: {
    backgroundColor: "#EF4444",
  },
  newBadge: {
    backgroundColor: "#3B82F6",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  serviceName: {
    fontSize: 12,
    color: "#1E293B",
    textAlign: "center",
    fontWeight: "600",
  },
});