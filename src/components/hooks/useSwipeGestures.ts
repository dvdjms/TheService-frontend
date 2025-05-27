import { Gesture } from 'react-native-gesture-handler';
import { Easing, runOnJS, withTiming } from 'react-native-reanimated';
import { UseSwipeGesturesProps } from '@/src/components/types/Service';


export function useSwipeGestures(Props: UseSwipeGesturesProps) {const {  
    isSwiping, isMonthVisible, screenWidth, prevDate, nextDate, previewDate,
    currentTimestamp, verticalThreshold, velocityThreshold, swipeThreshold,
    translateX, translateY, collapseMonth, goToNextDay, goToPreviousDay
    } = Props;

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

            const previewThreshold = screenWidth * 0.01;

            if (Math.abs(e.translationX) > previewThreshold) {
                const newPreview = e.translationX > 0 ? prevDate : nextDate;
                previewDate.value = newPreview;
            } else {
                previewDate.value = currentTimestamp.value;
            }

        })
        .onEnd((e) => {
            // Vertical swipe up
            if (isMonthVisible && e.translationY < -verticalThreshold || e.velocityY < -velocityThreshold) {
                runOnJS(collapseMonth)();
                return;
            } 
            // Swipe right (go to previous day)
            else if (e.translationX > swipeThreshold || e.velocityX > velocityThreshold) {
                // runOnJS(updateTimeBlockDate)(selectedTimeBlock, new Date(prevDate));
                runOnJS(goToPreviousDay)();
                translateX.value = withTiming(
                    screenWidth,
                    { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                    (finished) => {
                        'worklet';
                        if (finished) {
                            translateX.value = 0;
                            isSwiping.value = false;
                        }
                    }
                );
            } 
            // Swipe left (go to next day)
            else if (e.translationX < -swipeThreshold || e.velocityX < -velocityThreshold) {
                // updateTimeBlockDate(selectedTimeBlock, nextDate);
                // runOnJS(updateTimeBlockDate)(selectedTimeBlock, new Date(nextDate))
                runOnJS(goToNextDay)();
                translateX.value = withTiming(
                    -screenWidth,
                    { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
                    (finished) => {
                        'worklet';
                        if (finished) {
                            translateX.value = 0;
                            isSwiping.value = false;
                        }
                    }
                );
            }    
            else {
                translateX.value = withTiming(0, { duration: 200 });
                translateY.value = withTiming(0, { duration: 200 });
                isSwiping.value = false;
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
