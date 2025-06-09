import { format } from "date-fns";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";


interface Props {
    displayDate: number;
    selectedDate: number;
    isMonthVisible: boolean
}


const DateHeader = (({ displayDate, selectedDate, isMonthVisible }: Props) => (

    <View style={{ flexDirection: "row", zIndex: 1 }}>
        <View style={isMonthVisible ? styles.dayContainerDefault : styles.dayContainerVisible}>
            <Animated.Text style={styles.dayName}>{format(new Date(displayDate), 'EEE')}</Animated.Text>
            <Animated.Text style={styles.dayNumber}>{format(new Date(displayDate), 'dd')}</Animated.Text>
        </View>
            <View style={[{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }, isMonthVisible ? styles.dayContainerDefault : styles.dayContainerVisible]}>
            <Text style={{ width: 300, paddingLeft: 30, fontSize: 16 }}>
                {format(new Date(selectedDate), 'EEE dd MMM yyy')}
            </Text>
        </View>
    </View>
));


const styles = StyleSheet.create({
    dayContainerVisible: {
        backgroundColor: "white",
        borderRadius: 2,
        // iOS shadow
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderBottomColor: 'grey',
        zIndex: 1,
        // Android shadow (elevation = spread + blur approximation)
        elevation: 4,
        width: 40
    },
    dayContainerDefault:{
        backgroundColor: 'white',  
        borderBottomColor: '#eee', 
        borderBottomWidth: 1,
        width: 40
    },
    dayName: {
        backgroundColor: "transparent",
        paddingTop: 7,
        paddingBottom: 3,
        width: 60,
        textAlign: 'center',
        fontSize: 11,
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        fontWeight: 500
    },
    dayNumber: {
        backgroundColor: "white",
        width: 60,
        textAlign: 'center',
        borderRightColor: '#eeeeee',
        borderRightWidth: 1,
        paddingBottom: 3,
        fontSize: 11,
        fontWeight: 500
    },
});


export default DateHeader;