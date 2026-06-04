import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileSetup({ navigation }) {
  // State for user inputs (defaulting to strings because TextInput returns text)
  const [usageTime, setUsageTime] = useState("45");
  const [messages, setMessages] = useState("10");
  const [matches, setMatches] = useState("3");
  const [swipeRatio, setSwipeRatio] = useState("0.8");

  const [loading, setLoading] = useState(false);

  const analyzeProfile = async () => {
    setLoading(true);
    try {
      // IMPORTANT: Replace with your computer's local IP address (e.g., 192.168.1.5)
      // Do not use 'localhost' if running on a physical phone via Expo Go
      const backendURL = `${process.env.EXPO_PUBLIC_API_URL}/predict`;

      const response = await axios.post(backendURL, {
        app_usage_time_min: parseFloat(usageTime),
        message_sent_count: parseInt(messages),
        mutual_matches: parseInt(matches),
        swipe_right_ratio: parseFloat(swipeRatio),
      });

      // Stop loading and navigate to Screen 2, passing the result along
      setLoading(false);
      navigation.navigate("Dashboard", { archetype: response.data.archetype });
    } catch (error) {
      setLoading(false);
      Alert.alert("Connection Error", "Could not reach the FastAPI backend.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dating App Simulator</Text>

      <Text style={styles.label}>Daily Usage (Minutes):</Text>
      <TextInput
        style={styles.input}
        value={usageTime}
        onChangeText={setUsageTime}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Messages Sent:</Text>
      <TextInput
        style={styles.input}
        value={messages}
        onChangeText={setMessages}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Mutual Matches:</Text>
      <TextInput
        style={styles.input}
        value={matches}
        onChangeText={setMatches}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Swipe Right Ratio (0.0 to 1.0):</Text>
      <TextInput
        style={styles.input}
        value={swipeRatio}
        onChangeText={setSwipeRatio}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={analyzeProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analyze My Vibe</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: { fontSize: 16, marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
