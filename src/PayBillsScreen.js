import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const billTypes = [
  { id: "1", name: "Electricity", icon: "flash" },
  { id: "2", name: "Water", icon: "water" },
  { id: "3", name: "Internet", icon: "wifi" },
];

export default function PayBillsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [billType, setBillType] = useState(null);
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");

  const handlePay = () => {
    if (!billType || !account || !amount) return Alert.alert("Error", "Fill all fields");
    Alert.alert("Confirm Payment", `Pay ₦${amount} for ${billType.name} (${account})`, [
      { text: "Cancel" },
      { text: "Pay Bill", onPress: () => Alert.alert("Success", "Bill paid!") },
    ]);
  };

  const renderType = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.typeCard,
        billType?.id === item.id && styles.selectedType,
      ]}
      onPress={() => setBillType(item)}
    >
      <Ionicons name={item.icon} size={32} color="#092cb8ff" />
      <Text style={styles.typeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#092cb8ff" />
        </TouchableOpacity>
        <Text style={styles.title}>Pay Bills</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* BILL TYPE GRID */}
      <FlatList
        data={billTypes}
        renderItem={renderType}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.typeList}
      />

      {/* INPUT FIELDS */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Account/Reference</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter account or reference"
          placeholderTextColor="#a0aec0"
          value={account}
          onChangeText={setAccount}
        />
        <Text style={styles.label}>Amount (₦)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#a0aec0"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      {/* FLOATING PAY BUTTON */}
      <TouchableOpacity
        onPress={handlePay}
        style={[styles.floatingBtn, { bottom: insets.bottom + 20 }]}
      >
        <LinearGradient colors={["#092cb8ff", "#08151eff"]} style={styles.gradientBtn}>
          <Text style={styles.btnText}>Pay Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f7fafc"  // Light background
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    padding: 20, 
    paddingTop: Platform.OS === "android" ? 50 : 20 
  },
  title: { 
    color: "#092cb8ff", 
    fontSize: 22, 
    fontWeight: "800" 
  },
  typeList: { 
    padding: 20 
  },
  typeCard: { 
    backgroundColor: "#ffffff", 
    padding: 24, 
    borderRadius: 16, 
    margin: 8, 
    alignItems: "center", 
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedType: { 
    backgroundColor: "#092cb8ff", 
    borderColor: "#092cb8ff" 
  },
  typeName: { 
    color: "#092cb8ff", 
    fontSize: 16, 
    fontWeight: "700", 
    marginTop: 12 
  },
  inputSection: { 
    paddingHorizontal: 20, 
    marginBottom: 20 
  },
  label: { 
    color: "#092cb8ff", 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 8, 
    marginTop: 20 
  },
  input: { 
    backgroundColor: "#ffffff", 
    color: "#1a202c", 
    padding: 16, 
    borderRadius: 12, 
    fontSize: 18, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  floatingBtn: { 
    position: "absolute", 
    left: 20, 
    right: 20 
  },
  gradientBtn: { 
    padding: 18, 
    borderRadius: 16, 
    alignItems: "center" 
  },
  btnText: { 
    color: "#FFF", 
    fontSize: 18, 
    fontWeight: "800" 
  },
});