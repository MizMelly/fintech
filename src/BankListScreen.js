// src/BankListScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BankListScreen({ navigation, route }) {
  const { banks = [], onSelectBank } = route.params || {};
  const [search, setSearch] = useState("");
  const [filteredBanks, setFilteredBanks] = useState(banks);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = banks.filter(bank =>
        bank.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banks);
    }
  };

  const selectBank = (bank) => {
    onSelectBank?.(bank);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Bank</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      <FlatList
        data={filteredBanks}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bankItem} onPress={() => selectBank(item)}>
            <Text style={styles.bankName}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#1E293B" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: "#1E293B" },

  list: { paddingHorizontal: 20 },

  bankItem: {
    backgroundColor: "#64748B",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  bankName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelBtn: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 18,
    color: "#1E293B",
    fontWeight: "600",
  },
});