import { Tabs } from "expo-router";
import { Notas, PapeleraIcon } from "../../components/Icons";

export default function tabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e17f29",
        tabBarInactiveTintColor: "#bdbdbd",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500", marginTop: 2 },
        tabBarStyle: { backgroundColor: "#181818", paddingBottom: 10 },
        headerStyle: { backgroundColor: "#181818" },
        headerTintColor: "white",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mis Notas",
          tabBarIcon: ({ color }) => <Notas color={"white"}
          />,
        }}
      />

      <Tabs.Screen
        name="papelera"
        options={{
          title: "Papelera",
          tabBarIcon: ({ color }) => <PapeleraIcon color={"white"} />,
        }}
      />
    </Tabs>
  );
}
