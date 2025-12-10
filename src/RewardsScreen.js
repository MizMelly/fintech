import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RewardsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [points, setPoints] = useState(2450);
  const [streak] = useState(5);
  const [referrals] = useState(3);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleCheckIn = () => {
    Alert.alert("Check-in Success!", "You earned 50 points! Keep it up!", [
      { text: "Continue", onPress: () => setPoints(points + 50) },
    ]);
  };

  const handleSpin = () => {
    Alert.alert("Spin & Win!", "You won ₦200 cashback!", [
      { text: "Claim", onPress: () => setPoints(points + 200) },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER - BLUE */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Rewards</Text>
        <TouchableOpacity onPress={() => Alert.alert("History", "Coming soon!")}>
          <Ionicons name="time-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Points Card */}
        <View style={styles.pointsCard}>
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.gradientCard}
          >
            <Ionicons name="diamond" size={40} color="#FFFFFF" />
            <Text style={styles.points}>{points.toLocaleString()}</Text>
            <Text style={styles.pointsLabel}>Total Points</Text>
          </LinearGradient>
        </View>

        {/* Streak & Referral Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color="#3B82F6" />
            <Text style={styles.statValue}>{streak} Days</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={28} color="#3B82F6" />
            <Text style={styles.statValue}>{referrals}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
        </View>

        {/* Daily Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Check-in</Text>
          <TouchableOpacity style={styles.checkinBtn} onPress={handleCheckIn}>
            <LinearGradient
              colors={["#3B82F6", "#2563EB"]}
              style={styles.gradientBtn}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.btnText}>Check-in for 50 pts</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Spin to Win */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spin & Win</Text>
          <TouchableOpacity style={styles.spinContainer} onPress={handleSpin}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="refresh-circle" size={80} color="#3B82F6" />
            </Animated.View>
            <Text style={styles.spinText}>Tap to Spin!</Text>
          </TouchableOpacity>
        </View>

        {/* Refer & Earn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refer & Earn</Text>
          <View style={styles.referCard}>
            <Ionicons name="gift" size={32} color="#3B82F6" />
            <View style={styles.referContent}>
              <Text style={styles.referTitle}>Invite Friends</Text>
              <Text style={styles.referSubtitle}>
                Earn ₦2,000 per successful referral
              </Text>
            </View>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => navigation.navigate("ReferEarn")}
            >
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Redeem Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Redeem Points</Text>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>₦1,000 Cashback (1,000 pts)</Text>
            <Ionicons name="chevron-forward" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>Free Data 1GB (800 pts)</Text>
            <Ionicons name="chevron-forward" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Share Button - INSIDE SCROLLVIEW */}
      <View style={styles.floatingContainer}>
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => navigation.navigate("ReferEarn")}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={styles.gradientBtn}
          >
            <Ionicons name="share-social" size={24} color="#FFFFFF" />
            <Text style={styles.btnText}>Invite & Earn ₦2,000</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "800",
  },
  scrollContent: {
    paddingBottom: 140, // Space for floating button + bottom nav
  },
  pointsCard: {
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
  points: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    marginVertical: 8,
  },
  pointsLabel: {
    color: "#E0F2FE",
    fontSize: 16,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statValue: {
    color: "#1E293B",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  statLabel: {
    color: "#64748B",
    fontSize: 14,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#1E293B",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  checkinBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBtn: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },
  spinContainer: {
    alignItems: "center",
    padding: 20,
  },
  spinText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  referCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  referContent: {
    flex: 1,
    marginLeft: 12,
  },
  referTitle: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "700",
  },
  referSubtitle: {
    color: "#64748B",
    fontSize: 14,
  },
  shareBtn: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  redeemBtn: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  redeemText: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "600",
  },
  floatingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  floatingBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
});