import { Ionicons } from '@expo/vector-icons';
import { View, TextInput, Text, StyleSheet, Dimensions, KeyboardTypeOptions, TextInputProps, Platform } from 'react-native';

type FormFieldProps = {
    autoComplete?: string;
    autoFocus?: boolean;
    error?: string;
    keyboardType?: KeyboardTypeOptions;
    label: string;
    onChangeText: (text: string) => void;
    onSubmitEditing?: () => void;
    placeholder?: string;
    returnKeyType?: TextInputProps['returnKeyType'];
    secureTextEntry?: boolean;
    textContentType?: TextInputProps['textContentType'];
    value: string;
    width: number;
    iconName: keyof typeof Ionicons.glyphMap;
};
    
export default function FormField({
    autoComplete,
    autoFocus,
    error,
    keyboardType,
    label,
    onChangeText,
    onSubmitEditing,
    placeholder,
    returnKeyType,
    secureTextEntry,
    textContentType,
    value,
    width,
    iconName
}: FormFieldProps) {

        const screenWidth = Dimensions.get('window').width;
        const dynamicWidth = screenWidth * width;

    return (
        <View style={[styles.container, {width: dynamicWidth}]} >
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <Ionicons 
                    name={iconName}
                    size={18}
                    color="gray"
                    style={styles.icon} />
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
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={returnKeyType}
                    numberOfLines={1}
                    multiline={false}
                />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: { 
        overflow: 'hidden'
    },
    label: { 
        marginBottom: 4, 
        fontWeight: 'bold', 
        fontSize: 12,
        paddingLeft: 5,
     },
    input: {
        // borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        height: 50,
    },
    errorInput: {
        borderColor: 'red',
    },
    error: {
        marginTop: 4,
        color: 'red',
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 11,
        borderColor: '#ccc',
        alignItems: 'center',

    },
    icon: {
        paddingLeft: 7
        // color: 'green'
    }
});
    