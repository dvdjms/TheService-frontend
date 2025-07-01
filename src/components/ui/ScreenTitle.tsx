import { colors } from '@/src/styles/globalStyles';
import { View, Text, StyleSheet } from 'react-native';

type FormFieldProps = {
    title: string;
};
    
export default function ScreenTitle({ title }: FormFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.underline} />
        </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
        marginBottom: 2,
        width: '100%',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        letterSpacing: 1,
        paddingTop: 7,
        textAlign: 'center'
    },
    underline: {
        marginTop: 6,
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.companyMediumPurple,
        alignSelf: 'center'
    }, 
});
    