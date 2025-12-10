import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import Popup from "../components/Popup";  

const OtpVerification = ({ route, navigation }) => {
  const { email } = route.params || {};

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
const [popupTitle, setPopupTitle] = useState("");
const [popupMessage, setPopupMessage] = useState("");

const showPopup = (title, message) => {
  setPopupTitle(title);
  setPopupMessage(message);
  setPopupVisible(true);
};

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input
  const handleOtpChange = (text, index) => {
    if (!/^[0-9]?$/.test(text)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleBackspace = (text, index) => {
    if (text === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // VERIFY OTP FUNCTION — CLEAN & CORRECT
  const handleVerifyOtp = async () => {
    const joinedOtp = otp.join("");

    if (joinedOtp.length < 6) {
       showPopup("Invalid OTP", "Please enter all 6 digits.");
      
      return;
    }

    try {
      setLoading(true);

      console.log("\n===== OTP REQUEST DEBUG =====");
      console.log("API URL:", "http://192.168.1.6:5000/api/auth/verify-otp");
      console.log("Email Sent:", email);
      console.log("Joined OTP Sent:", joinedOtp);
      console.log("Request Body:", JSON.stringify({ email, otp: joinedOtp }));

      const response = await fetch(
        "http://192.168.1.6:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: joinedOtp }),
        }
      );

      console.log("Status Code:", response.status);

      const data = await response.json().catch(() => {
        console.log("❌ Failed to parse JSON response");
        return null;
      });

      console.log("Backend Raw Response:", data);

      if (!response.ok) {
        console.log("❌ Backend Error Message:", data?.message);
         showPopup("Failed", data?.message || "Invalid OTP");
        return;
      }

      console.log("✅ OTP Verification Success:", data);
      showPopup("Success", "OTP Verified!");
      navigation.navigate("Login");

    } catch (error) {
      console.log("❌ FETCH ERROR:", error.message);
       showPopup("Error", "Network issue. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP FUNCTION
  const handleResendOtp = async () => {
    if (timer > 0) return;

    try {
      setResending(true);

      const response = await fetch(
        "http://192.168.1.6:5000/api/auth/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showPopup("Success", "A new OTP has been sent!");
        setTimer(30);
      } else {
         showPopup("Failed", data.message || "Could not resend OTP.");
      }

    } catch (error) {
       showPopup("Error", "Network issue. Try again later.");
    } finally {
      setResending(false);
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
      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP 🔐</Text>

        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(digit, index);
                }
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={timer > 0 || resending}
        >
          <Text style={styles.resendText}>
            {timer > 0
              ? `Resend OTP in ${timer}s`
              : resending
              ? "Resending..."
              : "Didn’t receive OTP? Resend"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ------- STYLES -------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
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
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginVertical: 15,
  },
  email: {
    color: "#4a90e2",
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  otpBox: {
    width: 50,
    height: 55,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resendText: {
    textAlign: "center",
    marginTop: 15,
    color: "#4a90e2",
  },
});

export default OtpVerification;
