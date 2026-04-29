import { useAuthStore } from "@/store/auth";
import { Text, View } from "react-native";
import ActiveBids from "./active-bids";
import ReliabilityScore from "./reliability-score";

export default function ContractorDashboard() {
    const { user } = useAuthStore();

    return (
        <View className="flex-1 justify-center items-center">
            <View>
             <Text>Hi, {user?.firstName}</Text>
             <Text>Here&apos;s an overview of your contractor activity.</Text>
            </View>
           
            <ActiveBids />
            <ReliabilityScore/>
        </View>
    );
}