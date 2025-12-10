import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const user = {
  name: "Cayle Obiora",
  phone: "+234 801 234 5678",
  email: "cayle@example.com",
  kyc: "Tier 3",
  avatar: require("../assets/ads1.png"),
};

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [biometric, setBiometric] = useState(true);

  const menuItems = [
    { icon: "person-outline", label: "Edit Profile", screen: "EditProfile" },
    { icon: "card-outline", label: "Bank Accounts", screen: "BankAccounts" },
    { icon: "shield-checkmark-outline", label: "Security & PIN", screen: "Security" },
    { icon: "document-text-outline", label: "KYC Verification", badge: user.kyc },
    { icon: "headset-outline", label: "Help & Support", screen: "Support" },
    {
      icon: "log-out-outline",
      label: "Logout",
      action: () =>
        Alert.alert("Logout", "Are you sure?", [
          { text: "Cancel" },
          { text: "Yes", onPress: () => navigation.navigate("Login") },
        ]),
    },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER - BLUE */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.gradientCard}
          >
            <Image source={user.avatar} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
            <View style={styles.kycBadge}>
              <Text style={styles.kycText}>{user.kyc} Verified</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Biometric Toggle */}
        <View style={styles.toggleCard}>
          <View>
            <Text style={styles.toggleTitle}>Face ID / Fingerprint</Text>
            <Text style={styles.toggleSubtitle}>Login with biometric</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggle, biometric && styles.toggleOn]}
            onPress={() => setBiometric(!biometric)}
          >
            <View style={[styles.toggleKnob, biometric && styles.knobOn]} />
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() =>
                item.action
                  ? item.action()
                  : navigation.navigate(item.screen || "Home")
              }
            >
              <Ionicons name={item.icon} size={24} color="#3B82F6" />
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.version}>App Version 2.5.1</Text>

        {/* Edit Profile Button - INSIDE SCROLLVIEW */}
        <View style={styles.editProfileContainer}>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.gradientBtn}
            >
              <Ionicons name="create" size={24} color="#FFFFFF" />
              <Text style={styles.btnText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "800",
  },
  scrollContent: {
    paddingBottom: 140,
  },
  userCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradientCard: {
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 12,
  },
  phone: {
    color: "#E0F2FE",
    fontSize: 16,
    marginTop: 4,
  },
  kycBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  kycText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleTitle: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
  },
  toggleSubtitle: {
    color: "#64748B",
    fontSize: 14,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    padding: 2,
  },
  toggleOn: {
    backgroundColor: "#3B82F6",
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },
  knobOn: {
    transform: [{ translateX: 20 }],
  },
  menu: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  menuLabel: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  version: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  editProfileContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  editProfileBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBtn: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
});