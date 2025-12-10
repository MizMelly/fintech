// App.js
import React from "react";
import { StatusBar, Platform, StyleSheet } from "react-native";
import { enableScreens } from "react-native-screens";
enableScreens();


import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";



// SCREENS
import SplashScreen from "./src/SplashScreen";
import LoginScreen from "./src/LoginScreen";
import DashboardScreen from "./src/DashboardScreen";
import AirtimeScreen from "./src/AirtimeScreen";
import DataScreen from "./src/DataScreen";
import ElectricityScreen from "./src/ElectricityScreen";
import CableTvScreen from "./src/CableTvScreen";
import ForgotScreen from "./src/ForgotScreen";
import RegisterScreen from "./src/RegisterScreen";
import OtpVerification from "./src/OtpVerification";
import TransactionsScreen from "./src/TransactionsScreen";
import RewardsScreen from "./src/RewardsScreen";
import ProfileScreen from "./src/ProfileScreen";
import PayBillsScreen from "./src/PayBillsScreen";
import ReferEarnScreen from "./src/ReferEarnScreen";
import LoansScreen from "./src/LoansScreen"; 
import TransferScreen from "./src/TransferScreen"; 
import AddMoneyScreen from "./src/AddMoneyScreen";
import MoreServicesScreen from "./src/MoreServicesScreen";
import FinanceScreen from "./src/FinanceScreen";
import DepositForm from "./src/DepositForm";
import OtherBankTransferScreen from "./src/OtherBankTransferScreen";
import BankListScreen from "./src/BankListScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// YOUR GRADIENT – LIGHT MODE
const TabBarBackground = () => (

  <LinearGradient
    colors={["#092cb8ff", "#08151eff"]}  // ← YOUR COLORS
    style={styles.tabBarBackground}
    start={{ x: 0, y: 1 }}
    end={{ x: 0, y: 0 }}
  />
);

// ICON LOGIC
const TabIcon = ({ focused, color, routeName }) => {
  let iconName;
  switch (routeName) {
    case "Home":
      iconName = focused ? "home" : "home-outline";
      break;
    case "Transactions":
      iconName = "swap-horizontal";
      break;
    case "Rewards":
      iconName = focused ? "gift" : "gift-outline";
      break;
    case "Profile":
      iconName = focused ? "account" : "account-outline";
      break;
    default:
      iconName = "circle-outline";
  }
  return <Icon name={iconName} size={28} color={color} />;
};

const TabIconHome = (props) => <TabIcon {...props} routeName="Home" />;
const TabIconFinance = (props) => <TabIcon {...props} routeName="Finance" />;
const TabIconRewards = (props) => <TabIcon {...props} routeName="Rewards" />;
const TabIconProfile = (props) => <TabIcon {...props} routeName="Profile" />;


     
// BOTTOM TABS – RISES FROM GROUND + ANDROID SAFE
function BottomTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#a0aec0",
        tabBarLabelStyle: { 
          fontSize: 11, 
          fontWeight: "600", 
          marginBottom: 5 
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 50 + insets.bottom,  
          paddingBottom: insets.bottom,  
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: TabIconHome }} />
      <Tab.Screen name="Finance" component={FinanceScreen} options={{ tabBarIcon: TabIconFinance }} />
      <Tab.Screen name="Rewards" component={RewardsScreen} options={{ tabBarIcon: TabIconRewards }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: TabIconProfile }} />
    </Tab.Navigator>
  );
}

// MAIN APP – LIGHT MODE ONLY
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#092cb8ff"  
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/* AUTH */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />
          <Stack.Screen name="ForgotScreen" component={ForgotScreen} />

          {/* MAIN */}
          <Stack.Screen name="Dashboard" component={BottomTabs} />

          {/* SERVICES */}
          <Stack.Screen name="Airtime" component={AirtimeScreen} />
          <Stack.Screen name="Data" component={DataScreen} />
          <Stack.Screen name="Electricity" component={ElectricityScreen} />
          <Stack.Screen name="CableTv" component={CableTvScreen} /> 
          <Stack.Screen name="ReferEarn" component={ReferEarnScreen} />
          <Stack.Screen name="PayBills" component={PayBillsScreen} />
          <Stack.Screen name="Loans" component={LoansScreen} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
          <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
          <Stack.Screen name="MoreServices" component={MoreServicesScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="DepositForm" component={DepositForm} />
          <Stack.Screen name="OtherBankTransferScreen" component={OtherBankTransferScreen} />
          <Stack.Screen name="BankListScreen" component={BankListScreen} />

          

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    flex: 1,
    borderTopLeftRadius: 0,  // ← Full width, no radius
    borderTopRightRadius: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
