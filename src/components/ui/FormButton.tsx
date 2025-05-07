import { View, TextInput, Text, StyleSheet } from 'react-native';

type FormFieldProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
};
    
export default function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
}: FormFieldProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, error && styles.errorInput]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: { 
        marginBottom: 16, 
        width: 250 },
    label: { 
        marginBottom: 4, 
        fontWeight: 'bold', 
        fontSize: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    errorInput: {
        borderColor: 'red',
    },
    error: {
        marginTop: 4,
        color: 'red',
        fontSize: 14,
    },
});