import { Gesture } from 'react-native-gesture-handler';
import { Easing, runOnJS, useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { UseSwipeGesturesProps } from '@/src/components/types/Service';
import { addDaysNumber } from '../utils/timeUtils';


export function useSwipeGestures(Props: UseSwipeGesturesProps) {const {  
    isSwiping, isMonthVisible, screenWidth, previewDate, setSelectedDate,
    selectedDateShared, verticalThreshold, velocityThreshold, swipeThreshold,
    translateX, translateY, collapseMonth, isContentReadyForSnap
    } = Props;


    useAnimatedReaction(
        () => isContentReadyForSnap.value,
        (ready, wasReady) => {
            'worklet';
            if (ready && (wasReady === false || wasReady === null)) {
                translateX.value = 0;
                isContentReadyForSnap.value = false;
                isSwiping.value = false;
            }
        },
        [isContentReadyForSnap, translateX]
    );

    
    const panGesture = Gesture.Pan()
        .onBegin(() => {
            isSwiping.value = true;
        })
        .onUpdate((e) => {
            if (isMonthVisible && Math.abs(e.translationX) > Math.abs(e.translationY)) {
                translateY.value = e.translationY;
                translateX.value = 0;
            } else {
                translateX.value = e.translationX;
            }

            const previewThreshold = screenWidth * 0.05;

            if (Math.abs(e.translationX) > previewThreshold) {
                const direction = e.translationX > 0 ? -1 : 1;
                const potentialDate = addDaysNumber(selectedDateShared.value, direction);
                if (previewDate.value !== potentialDate) {
                    previewDate.value = potentialDate;
                }
            } else {
                 previewDate.value = null;
            }

            // if (Math.abs(e.translationX) > screenWidth - 110) {
            //     centerOpacity.value = 0;

            // } else {
            //     centerOpacity.value = 1;
            // }

        })
        .onEnd((e) => {
            // Vertical swipe up
            if (isMonthVisible && e.translationY < -verticalThreshold || e.velocityY < -velocityThreshold) {                
                runOnJS(collapseMonth)();
                isSwiping.value = false;
                return;
            } 
  
            // Swipe right (go to previous day)
            if (e.translationX > swipeThreshold || e.velocityX > velocityThreshold) {
                translateX.value = withTiming(
                    screenWidth,
                    { duration: 250, easing: Easing.out(Easing.linear) },
                    (finished) => {
                        'worklet';
                        if(finished) {
                        const newDate = addDaysNumber(selectedDateShared.value, -1);
                        selectedDateShared.value = newDate;
                        runOnJS(setSelectedDate)(newDate);
                        //  centerOpacity.value = 1;
                        // previewDate.value = null; 
                    }}
                );
            } 
            // Swipe left (go to next day)
            else if (e.translationX < -swipeThreshold || e.velocityX < -velocityThreshold) {         
                translateX.value = withTiming(
                    -screenWidth,
                    { duration: 250, easing: Easing.out(Easing.linear) },
                    () => {
                        'worklet';
                        const newDate = addDaysNumber(selectedDateShared.value, 1);
                        selectedDateShared.value = newDate;
                        runOnJS(setSelectedDate)(newDate);
                        // previewDate.value = null; 
                        // isSwiping.value = false;
                        //  centerOpacity.value = 1;
                    }
                );
            }    
            else {
                // cancel swipe
                translateX.value = withTiming(
                    0,
                    { duration: 300 },
                    () => {
                        isSwiping.value = false;
                    }
                );
            }
        }
    );


    // closes Month on tap
    const tapGesture = Gesture.Tap()
        .enabled(isMonthVisible)
        .onEnd(() => {
            runOnJS(collapseMonth)();
    });


    return {
        panGesture,
        tapGesture,
    };
}
