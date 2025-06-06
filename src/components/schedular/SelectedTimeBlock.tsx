import { Text, StyleSheet, View } from "react-native";
import { GestureDetector, PanGesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";


interface Props {
    isBlockRenderable: boolean;
    appointmentBlockStyle: { top: number; height: number; };
    topResizeGesture: PanGesture;
    moveGesture: PanGesture;
    bottomResizeGesture: PanGesture;
    appointmentTitle: string
}


const SelectedTimeBlock = ({ isBlockRenderable, appointmentBlockStyle, topResizeGesture, 
    moveGesture, bottomResizeGesture, appointmentTitle }: Props) => (

    <>
        {isBlockRenderable && (
            <Animated.View
                pointerEvents="auto"
                style={[styles.selectedTimeBlock, appointmentBlockStyle]}
            >
                {/* Top edge drag zone */}
                <GestureDetector gesture={topResizeGesture}>
                    <View style={styles.topResizeGesture}/>
                </GestureDetector>

                {/* Middle drag zone */}
                <GestureDetector gesture={moveGesture}>
                    <View style={styles.moveGesture} >
                        <Text style={ styles.appointmentTitle}>{appointmentTitle}</Text>
                    </View>
                </GestureDetector>

                {/* Bottom edge drag zone */}
                <GestureDetector gesture={bottomResizeGesture}>
                    <View style={styles.bottomResizeGesture}/>
                </GestureDetector>
            </Animated.View>
        )}
    </>
);


const styles = StyleSheet.create({
    appointmentTitle: {
        height: 20,
        paddingLeft: 10
    },
    selectedTimeBlock: {
        position: 'absolute',
        left: 62,
        right: 5,
        backgroundColor: 'rgba(33, 150, 243, 0.3)',
        borderWidth: 3,
        borderColor: '#2196f3',
        borderRadius: 3,
    },
    moveGesture: {
        flex: 1, 
        justifyContent: 'center' ,
    },
    topResizeGesture: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', 
        zIndex: 10,
    },
    bottomResizeGesture:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.2)', 
        zIndex: 10,
    },
});

export default SelectedTimeBlock;