import { View, Text, StyleSheet } from 'react-native';

type FormFieldProps = {
    title: string;
};
    
export default function ScreenTitle({ title }: FormFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}
    
const styles = StyleSheet.create({
    container: {
        marginBottom: 2,
        marginTop: 20,
        width: '100%' },

    title: { 
        marginBottom: 4, 
        fontWeight: 'bold', 
        fontSize: 34,
        color: 'red',
        textAlign: 'center'
    },
});
    