import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const loanTypes = [
  { id: "1", name: "Quick Loan", amount: "₦5,000 - ₦50,000", rate: "5% interest", duration: "30 days" },
  { id: "2", name: "Salary Advance", amount: "₦10,000 - ₦100,000", rate: "3% interest", duration: "Payday" },
  { id: "3", name: "Business Loan", amount: "₦20,000 - ₦200,000", rate: "7% interest", duration: "90 days" },
];

export default function LoansScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState(null);
  const [amount, setAmount] = useState("");

  const handleApply = () => {
    if (!selectedType || !amount) return Alert.alert("Error", "Select loan type and amount");
    Alert.alert("Loan Application", `Apply for ₦${amount} ${selectedType.name} loan`, [
      { text: "Cancel" },
      { text: "Apply", onPress: () => Alert.alert("Success", "Loan approved! Funds disbursed.") },
    ]);
  };

  const renderType = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.loanCard,
        selectedType?.id === item.id && styles.selectedLoan,
      ]}
      onPress={() => setSelectedType(item)}
    >
      <Text style={styles.loanName}>{item.name}</Text>
      <Text style={styles.loanAmount}>{item.amount}</Text>
      <Text style={styles.loanRate}>{item.rate}</Text>
      <Text style={styles.loanDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Apply for Loan</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={loanTypes}
        renderItem={renderType}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.loanList}
      />

      <View style={styles.inputSection}>
        <Text style={styles.label}>Loan Amount (₦)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter desired amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity 
        onPress={handleApply} 
        style={[
          styles.floatingBtn,
          { bottom: insets.bottom + 20 }   // FIXED: Dynamic bottom
        ]}
      >
        <LinearGradient colors={["#00D4FF", "#1E3CFF"]} style={styles.gradientBtn}>
          <Text style={styles.btnText}>Apply Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0D2C" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, paddingTop: Platform.OS === "android" ? 50 : 20 },
  title: { color: "#FFF", fontSize: 20, fontWeight: "800" },
  loanList: { padding: 20 },
  loanCard: { backgroundColor: "#141727", padding: 20, borderRadius: 16, marginBottom: 16 },
  selectedLoan: { backgroundColor: "#00D4FF", borderWidth: 2, borderColor: "#FFF" },
  loanName: { color: "#FFF", fontSize: 20, fontWeight: "800" },
  loanAmount: { color: "#00D4FF", fontSize: 18, fontWeight: "700", marginVertical: 4 },
  loanRate: { color: "#E2E8F0", fontSize: 14 },
  loanDuration: { color: "#64748B", fontSize: 14 },
  inputSection: { paddingHorizontal: 20, marginBottom: 20 },
  label: { color: "#E2E8F0", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  input: { backgroundColor: "#141727", color: "#FFF", padding: 16, borderRadius: 12, fontSize: 18 },
  floatingBtn: { 
  position: "absolute", 
  left: 20, 
  right: 20 
},
  gradientBtn: { padding: 18, borderRadius: 16, alignItems: "center" },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "800" },
});