import { Text, StyleSheet, View } from "react-native";
import { GestureDetector, PanGesture } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";


interface Props {
    isBlockRenderable: boolean;
    appointmentBlockStyle: { top: number; height: number; };
    topResizeGesture: PanGesture;
    moveGesture: PanGesture;
    bottomResizeGesture: PanGesture;
}


const SelectedTimeBlock = ({ isBlockRenderable, appointmentBlockStyle, topResizeGesture, 
    moveGesture, bottomResizeGesture }: Props) => (

    <>
        {isBlockRenderable && (
            <Animated.View
                pointerEvents="auto"
                style={[styles.selectedTimeBlock, appointmentBlockStyle]}
            >
                {/* Top edge drag zone */}
                <GestureDetector gesture={topResizeGesture}>
                    <View style={styles.topResizeGesture} />
                </GestureDetector>

                {/* Middle drag zone */}
                <GestureDetector gesture={moveGesture}>
                    <View style={styles.moveGesture}>
                        <Text style={ styles.appointmentTitle}></Text>
                    </View>
                </GestureDetector>

                {/* Bottom edge drag zone */}
                <GestureDetector gesture={bottomResizeGesture}>
                    <View style={styles.bottomResizeGesture} />
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
        // left: 62,
        // right: 5,
        backgroundColor: 'rgba(110, 33, 243, 0.15)',
        borderWidth: 2.5,
        borderColor:  '#6C4DFF',
        // borderColor: '#2196f3',
        borderRadius: 5,
    },
    moveGesture: {
        flex: 1, 
        justifyContent: 'center' ,
    },
    topResizeGesture: {
        position: 'absolute',
        backgroundColor: 'white',
        borderColor: '#6C4DFF',
        borderWidth: 2.5,
        borderRadius: 50,
        top: -7,
        left: 10,
        right: 0,
        height: 12,
        width: 12,
        zIndex: 10,
    },
    bottomResizeGesture:{
        position: 'absolute',
        backgroundColor: 'white',
        borderColor: '#6C4DFF',
        borderWidth: 2.5,
        borderRadius: 50,      
        bottom: -7,
        // left: 0,
        right: 10,
        height: 12,
        width: 12,
        zIndex: 10,
    },
});

export default SelectedTimeBlock;