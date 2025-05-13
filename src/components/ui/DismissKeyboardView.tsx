import { Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, View } from 'react-native';
import { ReactNode } from 'react';
import { useHeaderHeight } from '@react-navigation/elements';

type Props = {
  children: ReactNode;
};

export default function DismissKeyboardView({ children }: Props) {
    const headerHeight = useHeaderHeight();
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={headerHeight}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1}}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View>{children}</View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
