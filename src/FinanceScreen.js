// src/FinanceScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const financeData = [
  {
    id: 1,
    title: "Total Balance",
    amount: "₦2,446,500.00",
    icon: "wallet",
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "Spend & Save",
    amount: "₦188,801.01",
    icon: "trending-up",
    color: "#10B981",
  },
  {
    id: 3,
    title: "FWealth",
    amount: "₦1,888,801.01",
    icon: "cash",
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Loans",
    amount: "₦0.00",
    icon: "card",
    color: "#EF4444",
  },
];

const quickActions = [
  { icon: "add-circle", label: "Add Money", screen: "AddMoney" },
  { icon: "send", label: "Transfer", screen: "PayBills" },
  { icon: "receipt", label: "Pay Bills", screen: "PayBills" },
  { icon: "gift", label: "Refer & Earn", screen: "ReferEarn" },
];

export default function FinanceScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Finance</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BALANCE ROW 1: Total + Spend & Save */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceCard}>
            <View style={[styles.iconCircle, { backgroundColor: financeData[0].color + "22" }]}>
              <Ionicons name={financeData[0].icon} size={28} color={financeData[0].color} />
            </View>
            <Text style={styles.cardTitle}>{financeData[0].title}</Text>
            <Text style={styles.cardAmount}>{financeData[0].amount}</Text>
          </View>

          <View style={styles.balanceCard}>
            <View style={[styles.iconCircle, { backgroundColor: financeData[1].color + "22" }]}>
              <Ionicons name={financeData[1].icon} size={28} color={financeData[1].color} />
            </View>
            <Text style={styles.cardTitle}>{financeData[1].title}</Text>
            <Text style={styles.cardAmount}>{financeData[1].amount}</Text>
          </View>
        </View>

        {/* BALANCE ROW 2: FWealth + Loans */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceCard}>
            <View style={[styles.iconCircle, { backgroundColor: financeData[2].color + "22" }]}>
              <Ionicons name={financeData[2].icon} size={28} color={financeData[2].color} />
            </View>
            <Text style={styles.cardTitle}>{financeData[2].title}</Text>
            <Text style={styles.cardAmount}>{financeData[2].amount}</Text>
          </View>

          <View style={styles.balanceCard}>
            <View style={[styles.iconCircle, { backgroundColor: financeData[3].color + "22" }]}>
              <Ionicons name={financeData[3].icon} size={28} color={financeData[3].color} />
            </View>
            <Text style={styles.cardTitle}>{financeData[3].title}</Text>
            <Text style={styles.cardAmount}>{financeData[3].amount}</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionItem}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon} size={28} color="#3B82F6" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="arrow-down-circle" size={24} color="#10B981" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Airtime Bonus</Text>
                <Text style={styles.activityTime}>Today, 1:41 PM</Text>
              </View>
              <Text style={styles.activityAmount}>+₦20.00</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="arrow-up-circle" size={24} color="#EF4444" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Spend & Save Withdrawal</Text>
                <Text style={styles.activityTime}>Today, 1:41 PM</Text>
              </View>
              <Text style={styles.activityAmount}>-₦188.01</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Transactions</Text>
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
    fontSize: 20,
    fontWeight: "800",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
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
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionItem: {
    width: "23%",
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    color: "#1E293B",
    textAlign: "center",
    fontWeight: "600",
  },
  activityList: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  activityTime: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: "800",
  },
  viewAllBtn: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#3B82F6",
    borderRadius: 30,
  },
  viewAllText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});