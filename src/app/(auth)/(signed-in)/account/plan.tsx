import { subscriptionPlans } from "@/src/constants/drawerScreens";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/styles/globalStyles";
import { router } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";


export default function PlanScreen() {
    const { subscriptionTier } = useAuth();

    const onChoose = (name: string) => {
        console.log(name)

    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Plan</Text>

            {subscriptionPlans.map((plan) => {

                const isActive = subscriptionTier === plan.name.toLocaleLowerCase();

                return (
                <View 
                    key={plan.name} 
                    style={[
                        styles.card,
                        isActive && styles.activeCard
                    ]}>
                    <Text style={styles.cardTitle}>{plan.name}</Text>
                    <Text style={styles.cardPrice}>{plan.price}</Text>
                    <View style={styles.features}>
                        {plan.features.map((f) => (
                        <Text key={f} style={styles.feature}>• {f}</Text>
                        ))}
                    </View>
                    {!isActive ? (
                        <Button title="Choose Plan" onPress={() => onChoose(plan.name)} />
                    ): (
                        <Text style={styles.currentPlan}>Current Plan</Text>
                    )}
                </View>
            )})}
                <Button title="Back to account" onPress={() => router.back()} />
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        height: 180
    },
    activeCard: {
        borderWidth: 2,
        borderColor: colors.companyMediumPurple,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    cardPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563EB', // Tailwind's blue-600
    },
    features: {
        marginTop: 8,
    },
    feature: {
        fontSize: 14,
        color: '#374151', // Tailwind's gray-700
    },
    currentPlan: {
        fontSize: 17,
        textAlign: 'center',
        paddingTop: 10,
        color: colors.companyMediumPurple,
    }
});
