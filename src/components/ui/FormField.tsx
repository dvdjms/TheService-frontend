import { View, TextInput, Text, StyleSheet, Dimensions, KeyboardTypeOptions, TextInputProps, Platform } from 'react-native';

type FormFieldProps = {
    autoComplete?: string;
    autoFocus?: boolean;
    error?: string;
    keyboardType?: KeyboardTypeOptions;
    label: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    textContentType?: TextInputProps['textContentType'];
    value: string;
    width: number;
};
    
export default function FormField({
    autoComplete,
    autoFocus,
    error,
    keyboardType,
    label,
    onChangeText,
    placeholder,
    secureTextEntry,
    textContentType,
    value,
    width
}: FormFieldProps) {

        const screenWidth = Dimensions.get('window').width;
        const dynamicWidth = screenWidth * width;

    return (
        <View style={[styles.container, {width: dynamicWidth}]} >
            <Text style={styles.label}>{label}</Text>
            <TextInput
                {...(Platform.OS === 'android' ? { autoComplete: autoComplete || 'off' } : {})}
                autoComplete="off"
                autoCapitalize="none"
                autoFocus={autoFocus}
                importantForAutofill="no"
                keyboardType={keyboardType || 'default'}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                style={[styles.input, error && styles.errorInput]}
                textContentType={textContentType || 'none'}
                value={value}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: { 
        marginBottom: 16, 
    },
    label: { 
        marginBottom: 4, 
        fontWeight: 'bold', 
        fontSize: 12,
        paddingLeft: 5,
     },
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
    