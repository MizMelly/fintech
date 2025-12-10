import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


const { width } = Dimensions.get("window");

// PROMO DATA
const promoSlides = [
  {
    id: "1",
    title: "₦50,000 Cashback!",
    subtitle: "Send money to 5 friends this week",
    gradient: ["#2563eb", "#404da3ff"],
    button: "Claim Now",
  },
  {
    id: "2",
    title: "Zero Fees on Bills",
    subtitle: "Pay electricity, airtime & cable TV",
    gradient: ["#2563eb", "#1917b5ff"],
    button: "Pay Now",
  },
  {
    id: "3",
    title: "Refer & Earn ₦2,000",
    subtitle: "Per successful referral",
    gradient: ["#2563eb", "#7b73cbff"],
    button: "Invite",
  },
];

const DashboardScreen = () => {

  const [user, setUser] = useState(null);
  
  // RELOAD USER EVERY TIME YOU RETURN TO DASHBOARD
useFocusEffect(
  useCallback(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        
        if (storedUser && token) {
          const parsed = JSON.parse(storedUser);

          // Fetch fresh transactions
          const res = await fetch("http://192.168.1.6:5000/api/transactions/recent", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();

          if (res.ok && data.transactions) {
            parsed.transactions = data.transactions;
          }

          setUser(parsed);
        }
      } catch (error) {
        console.log("Failed to load dashboard data:", error);
      }
    };
    loadData();
  }, [])
);

useEffect(() => {
  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  };
  loadUser();
}, []);

const fname = user ? user.fullname : "User";

 
  const navigation = useNavigation();
  const { colors } = useTheme();

  const renderPromoSlide = ({ item }) => (
    <LinearGradient
      colors={item.gradient}
      style={styles.promoCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View>
        <Text style={styles.promoTitle}>{item.title}</Text>
        <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.promoButton}>
        <Text style={styles.promoButtonText}>{item.button}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back 👋</Text>
          <Text style={styles.username}>{fname}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell-outline" size={26} color="#fff" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

     {/* Balance Card — NOW UPDATES IN REAL TIME */}
      <LinearGradient
        colors={["#1E40AF", "#3B82F6"]}
        style={styles.balanceCard}
      >
        <View style={styles.balanceRow}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount} numberOfLines={1} adjustsFontSizeToFit>
              ₦{user?.balance ? Number(user.balance).toLocaleString("en-NG") : "0"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addMoneyButton}
            onPress={() => navigation.navigate("DepositForm")}
          >
            <Icon name="plus-circle-outline" size={20} color="#1E293B" />
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <ActionButton icon="cellphone" label="Airtime" onPress={() => navigation.navigate("Airtime")} />
        <ActionButton icon="wifi" label="Data" onPress={() => navigation.navigate("Data")} />
        <ActionButton icon="flash" label="Electricity" onPress={() => navigation.navigate("Electricity")} />
        <ActionButton icon="television" label="Cable TV" onPress={() => navigation.navigate("CableTv")} />
      </View>

      {/* More Services */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>More Services</Text>
       <TouchableOpacity onPress={() => navigation.navigate("MoreServices")}>
  <Text style={styles.viewAll}>See all</Text>
</TouchableOpacity>
      </View>


      <View style={styles.servicesGrid}>
       <Service
  icon="bank-transfer"
  label="Transfer"
  color="#3B82F6"
  onPress={() => navigation.navigate("Transfer")}
/>
<Service
  icon="credit-card-outline"
  label="Pay Bills"
  color="#3B82F6"
  onPress={() => navigation.navigate("PayBills")}
/>
<Service
  icon="cash-multiple"
  label="Loans"
  color="#3B82F6"
  onPress={() => navigation.navigate("Loans")}
/>
<Service
  icon="account-group-outline"
  label="Refer & Earn"
  color="#3B82F6"
  onPress={() => navigation.navigate("ReferEarn")}
/>
      </View>

      {/* Promo Slider */}
      <View style={styles.promoContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Promotions</Text>
        <FlatList
          data={promoSlides}
          renderItem={renderPromoSlide}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={width * 0.88 + 16}
          contentContainerStyle={styles.promoListContent}
        />
      </View>

      {/* Recent Transactions */}
<View style={styles.sectionHeader}>
  <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
  <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
    <Text style={styles.viewAll}>View all</Text>
  </TouchableOpacity>
</View>

<View style={[styles.transactionsList, { backgroundColor: colors.card }]}>
  {user?.transactions?.length > 0 ? (
    user.transactions.map((t, i) => (
      <Transaction
        key={i}
        icon={t.type === "deposit" ? "wallet-plus-outline" : "phone-outline"}
        title={t.title}
        amount={t.amount}
        time={t.time}
        positive={t.positive}
      />
    ))
  ) : (
    <Text style={{ textAlign: "center", padding: 20, color: "#64748B" }}>
      No transactions yet
    </Text>
  )}
</View>
    </ScrollView>
  );
} 

// REUSABLE COMPONENTS
const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.actionIconContainer}>
      <Icon name={icon} size={26} color="#3B82F6" />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const Service = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.serviceItem} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.serviceIcon}>
      <Icon name={icon} size={28} color={color || "#2563EB"} />
    </View>
    <Text style={styles.serviceLabel}>{label}</Text>
  </TouchableOpacity>
);

const Transaction = ({ icon, title, amount, time, positive }) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionIcon}>
      <Icon name={icon} size={24} color="#00AEEF" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.transactionTitle, { color: "#111827" }]}>{title}</Text>
      <Text style={styles.transactionTime}>{time}</Text>
    </View>
    <Text
      style={[
        styles.transactionAmount,
        { color: positive ? "#00AEEF" : "#EF4444" },
      ]}
    >
      {amount}
    </Text>
  </View>
);

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcome: {
    fontSize: 15,
    color: "#040912ff",
  },
  username: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },
  iconButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 30,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    backgroundColor: "#EF4444",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  balanceCard: {
  borderRadius: 20,
  padding: 20,
  marginHorizontal: 16,
  marginBottom: 28,
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
},

balanceRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

balanceInfo: {
  flex: 1,
  marginRight: 16,
},

balanceTitle: {
  color: "#E0E7FF",
  fontSize: 15,
  fontWeight: "600",
  marginBottom: 4,
},

balanceAmount: {
  color: "#FFFFFF",
  fontSize: 34,
  fontWeight: "800",
  letterSpacing: 0.5,
  // Auto-shrink if too big (e.g. ₦999,999,999.00)
  minimumFontSize: 24,
},

addMoneyButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 16,
  paddingVertical: 11,
  borderRadius: 30,
  elevation: 6,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  // PREVENT OVERFLOW
  maxWidth: 140,
  justifyContent: "center",
},

addMoneyText: {
  color: "#1E293B",
  fontWeight: "700",
  fontSize: 14,
  marginLeft: 6,
},
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 50,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  viewAll: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 16,
  },
  serviceItem: {
    width: (width - 48 - 16) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceIcon: {
    marginBottom: 12,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  promoContainer: {
    marginBottom: 32,
  },
  promoCard: {
    width: width * 0.88,
    height: 180,
    marginRight: 16,
    padding: 24,
    borderRadius: 20,
    justifyContent: "space-between",
  },
  promoTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  promoSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  promoButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 14,
  },
  promoListContent: {
    paddingLeft: 16,
    paddingRight: width * 0.12,
  },
  transactionsList: {
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    marginBottom: 40,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#0000",
  },
  transactionIcon: {
    backgroundColor: "#e1ecf0ff",
    padding: 12,
    borderRadius: 50,
    marginRight: 16,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  transactionTime: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "800",
  },
});

export default DashboardScreen;