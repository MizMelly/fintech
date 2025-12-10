// src/ReferEarnScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReferEarnScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const referralCode = "REF123456";
  const reward = "2,000";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Finpay with my code ${referralCode} and earn ₦${reward} instantly! Download now: [App Link]`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share. Please try again.");
    }
  };

  const handleCopy = () => {
    Alert.alert("Copied!", `Referral code ${referralCode} copied to clipboard!`);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Refer & Earn</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* REWARD CARD */}
        <LinearGradient
          colors={["#3B82F6", "#06B6D4"]}
          style={styles.rewardCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="gift" size={48} color="#FFFFFF" />
          <Text style={styles.rewardText}>Earn ₦{reward} per referral!</Text>
          <Text style={styles.subText}>Your code: {referralCode}</Text>
        </LinearGradient>

        {/* ACTION BUTTONS */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCopy}>
            <View style={styles.btnIcon}>
              <Ionicons name="copy" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Copy Code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <View style={styles.btnIcon}>
              <Ionicons name="share-social" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionText}>Share Link</Text>
          </TouchableOpacity>
        </View>

        {/* HOW IT WORKS */}
        <Text style={styles.howItWorks}>How it Works</Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <Text style={styles.stepText}>Share your referral code with friends</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <Text style={styles.stepText}>They sign up & verify their account</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <Text style={styles.stepText}>You both get ₦{reward} instantly!</Text>
          </View>
        </View>
      

      {/* INVITE BUTTON AT BOTTOM */}
      <View style={[styles.bottomButton, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.inviteBtn} onPress={handleShare}>
          <LinearGradient
            colors={["#3B82F6", "#06B6D4"]}
            style={styles.gradientBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.btnText}>Invite Friends Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  rewardCard: {
    alignItems: "center",
    padding: 40,
    borderRadius: 20,
    marginBottom: 32,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  rewardText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  subText: {
    color: "#E0F2FE",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
  },
  howItWorks: {
    color: "#1E293B",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  steps: {
    gap: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  stepText: {
    color: "#374151",
    fontSize: 16,
    flex: 1,
    fontWeight: "600",
  },
  // NEW: BOTTOM BUTTON
  bottomButton: {
    paddingHorizontal: 20,
  },
  inviteBtn: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
  },
  gradientBtn: {
    padding: 18,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});