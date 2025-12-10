// src/TransactionsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TransactionsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user + token
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");
        if (storedUser && token) {
          const parsed = JSON.parse(storedUser);
          setUser({ ...parsed, token });
          fetchTransactions(token);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load data");
      }
    };
    loadData();
  }, []);

  const fetchTransactions = async (token) => {
    try {
      const response = await fetch("http://192.168.1.6:5000/api/transactions/all", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        Alert.alert("Error", data.message || "Failed to load transactions");
      }
    } catch (error) {
      Alert.alert("Error", "Check your connection");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "deposit": return "arrow-down-circle";
      case "airtime": return "phone-portrait";
      case "data": return "wifi";
      case "withdrawal": return "arrow-up-circle";
      default: return "cash";
    }
  };

  const getColor = (type) => {
    return type === "deposit" ? "#10B981" : "#EF4444";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(",", "");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.download}>Download</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SMS Alert Banner */}
        <View style={styles.alertBanner}>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>No transaction alerts?</Text>
            <Text style={styles.alertSubtitle}>
              Activate SMS alerts to get instant notifications for every transaction
            </Text>
            <TouchableOpacity style={styles.alertBtn}>
              <Text style={styles.alertBtnText}>Activate Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          <Image source={require("../assets/sms-alert.png")} style={styles.alertImage} />
        </View>

        {/* Transaction List */}
        <View style={styles.list}>
          {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet</Text>
          ) : (
            transactions.map((txn, i) => (
              <View key={i} style={styles.txnItem}>
                <View style={[styles.txnIcon, { backgroundColor: getColor(txn.type) + "22" }]}>
                  <Ionicons name={getIcon(txn.type)} size={24} color={getColor(txn.type)} />
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnTitle}>{txn.description || txn.type}</Text>
                  <Text style={styles.txnTime}>{formatDate(txn.created_at)}</Text>
                </View>
                <View style={styles.txnRight}>
                  <Text style={[styles.txnAmount, { color: getColor(txn.type) }]}>
                    {txn.type === "deposit" ? "+" : "-"}₦{Number(txn.amount).toLocaleString()}
                  </Text>
                  <Text style={styles.txnStatus}>Successful</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
  },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  download: { color: "#06B6D4", fontWeight: "700", fontSize: 16 },
  alertBanner: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B" },
  alertSubtitle: { fontSize: 14, color: "#64748B", marginVertical: 8 },
  alertBtn: { flexDirection: "row", alignItems: "center" },
  alertBtnText: { color: "#3B82F6", fontWeight: "700", marginRight: 4 },
  alertImage: { width: 80, height: 80 },
  list: { paddingHorizontal: 20, paddingTop: 20 },
  txnItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  txnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  txnInfo: { flex: 1 },
  txnTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B" },
  txnTime: { fontSize: 14, color: "#64748B", marginTop: 2 },
  txnRight: { alignItems: "flex-end" },
  txnAmount: { fontSize: 16, fontWeight: "800" },
  txnStatus: { fontSize: 14, color: "#10B981", marginTop: 2 },
  emptyText: { textAlign: "center", padding: 40, color: "#64748B", fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 16, color: "#3B82F6" },
});