import {  Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

type FormFieldProps = {
    title: string,
    OnPress: () => void,
    width: number
};
    
export default function FormButton({ title, OnPress, width }: FormFieldProps) {
    const screenWidth = Dimensions.get('window').width;
    const dynamicWidth = screenWidth * width;
    
    return (
        <TouchableOpacity onPress={OnPress} style={[styles.container, {width: dynamicWidth}]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}
    
const styles = StyleSheet.create({
    container: { 
        backgroundColor: "#777777",
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttonText: { 
        color: 'white',
        fontWeight: 'bold', 
        fontSize: 16 },
});