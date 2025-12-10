import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Popup from "../components/Popup";  
// Remove this line → import ForgotScreen from "./ForgotScreen";  // NOT NEEDED!

const LoginScreen = () => {
  const navigation = useNavigation(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const showPopup = (title, message = "") => {
    setPopupTitle(title);
    setPopupMessage(message);
    setPopupVisible(true);
  };

const handleLogin = async () => {
  if (!email || !password) {
    showPopup("Error", "Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch("http://192.168.1.6:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await response.json();
    console.log("Login Response:", data);

    if (response.ok) {
      // SAVE USER DATA TO ASYNC STORAGE
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      showPopup("Success!", "Login successful!");
      setTimeout(() => navigation.navigate("Dashboard"), 1500);
    } else {
      showPopup("Login Failed", data.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    showPopup("Network Error", "Cannot connect to server");
  }
};

  const handleForgotPassword = () => {
    console.log("Navigating to Forgot Password...");
    navigation.navigate("ForgotScreen"); // This works now!
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Popup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        title={popupTitle}
        message={popupMessage}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>— Or sign in with —</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#DB4437" }]}>
            <Icon name="google" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#1877F2" }]}>
            <Icon name="facebook" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#1DA1F2" }]}>
            <Icon name="twitter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#4a90e2",
    fontWeight: "500",
    fontSize: 14,
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
  orText: { textAlign: "center", color: "#999", marginVertical: 20 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 15 },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  footerText: { color: "#444", fontSize: 15 },
  registerText: { color: "#4a90e2", fontWeight: "600", fontSize: 15 },
});

export default LoginScreen;