import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function TopicScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Purchase</Text>
      <Text style={styles.subtitle}>Buy data for any network easily.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
