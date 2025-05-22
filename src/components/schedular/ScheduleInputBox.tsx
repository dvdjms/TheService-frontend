import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';


export default function SceduleInputBox( ) {


    const onChangeNumber = () => {


    }

    return (
        <View>
            <TextInput 
                style={styles.input}
                onChangeText={onChangeNumber}
                placeholder="useless placeholder"
                keyboardType="numeric"
            />
        </View>
    );
}


const styles = StyleSheet.create({
    input: {
        height: 40,
        marginLeft: 50,
        padding: 10,
        backgroundColor: '#eee'
    },
});
