import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard({ route, navigation }) {
  // Extract the archetype passed from the navigation route
  const { archetype } = route.params;

  // Determine styling based on the result
  let cardColor = "#bdc3c7"; // Default gray
  let description = "We aren't sure how you use the app.";

  if (archetype === "Active Networker") {
    cardColor = "#2ecc71"; // Green
    description =
      "You are highly intentional. Your swipe-to-match ratio and message volume show you are here to make real connections.";
  } else if (archetype === "Casual Browser") {
    cardColor = "#3498db"; // Blue
    description =
      "You log in, check things out, and leave. You aren't heavily invested right now, and that's totally fine.";
  } else if (archetype === "Passive Lurker") {
    cardColor = "#e67e22"; // Orange
    description =
      "High screen time, low interaction. You spend a lot of time swiping but rarely send messages to your matches.";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Analysis Complete</Text>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <Text style={styles.archetypeText}>{archetype}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Recalculate Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#2c3e50",
  },
  card: {
    padding: 30,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  archetypeText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    marginTop: 40,
    padding: 15,
    width: "80%",
    borderWidth: 2,
    borderColor: "#34495e",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#34495e", fontSize: 16, fontWeight: "bold" },
});
