import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Popup from "../components/Popup";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState(""); 

  const showPopup = (title, message) => {
  setPopupTitle(title);
  setPopupMessage(message);
  setPopupVisible(true);
};

const handleGetOtp = async () => {
  const name = fullName.trim();
  const mail = email.trim().toLowerCase();
  const addr = address.trim();
  const pass = password;

  if (!name || !mail || !addr || !pass) {
    showPopup("Empty Fields", "Please fill all fields");
    return;
  }

  setLoading(true);

  try {
    console.log("Sending to backend:", { fullName: name, email: mail, address: addr });

    const response = await fetch("http://192.168.1.6:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: name,
        email: mail,
        address: addr,
        password: pass,
      }),
    });

    console.log("HTTP Status:", response.status);
    console.log("Response OK?", response.ok);

    let data;
    try {
      data = await response.json();
      console.log("Full Backend Response:", data);
    } catch (jsonError) {
      console.log("Could not parse JSON. Raw response:", await response.text());
      data = { message: "Invalid response from server" };
    }

    if (response.ok) {
      showPopup(
        "Success!",
        `Account created!\nAccount No: ${data.user?.accountNumber}\nPlease verify OTP.`
      );

      navigation.navigate("OtpVerification", { email: mail });
    } else {
      showPopup("Registration Failed", data.message || "Unknown error");
    }
  
  } catch (error) {
    console.log("Fetch ERROR (Network/Connection):", error.message);
    showPopup(
      "Cannot Reach Server",
      `Make sure:\n` +
        `• Your laptop & phone are on the SAME WiFi\n` +
        `• Node.js server is running\n` +
        `• IP is correct: 10.220.159.82:5000\n\n` +
        `Error: ${error.message}`
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
       {/* Render the custom popup */}
    <Popup
      visible={popupVisible}
      onClose={() => setPopupVisible(false)}
      title={popupTitle}
      message={popupMessage}
    />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account 📝</Text>
          <Text style={styles.subtitle}>Enter your details to get an OTP</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Address"
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginText}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#222", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#777", fontSize: 15, marginBottom: 25 },
  input: {
    height: 50,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  footerText: { color: "#444", fontSize: 15 },
  loginText: { color: "#4a90e2", fontWeight: "600", fontSize: 15 },
});

export default RegisterScreen;
