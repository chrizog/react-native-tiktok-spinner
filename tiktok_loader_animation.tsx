import React from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,

} from 'react-native';
import Animated, { Easing, Extrapolate, interpolate, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, {Circle, Defs, ClipPath, G} from 'react-native-svg';

const GREEN_COLOR = "rgb(66, 221, 240)";
const RED_COLOR = "rgb(240, 50, 75)";
const BACKGROUND_COLOR = "rgb(10, 10, 10)";

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
});

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);



const VIEWBOX_HEIGHT = 100;
const VIEWBOX_WIDTH = 100;
const BASE_DIAMETER = 50;
const BASE_RADIUS = BASE_DIAMETER / 2;

const calcAnimatedPropsRightToLeft = (sharedValue: Animated.SharedValue<number>, firstPart: boolean) => {
    "worklet";

    const inputRangePosition = firstPart ? [0, 1] : [1, 2];
    const inputRangeDiameter = firstPart ? [0, 0.5, 1] : [1, 1.5, 2];

    const cx = interpolate(sharedValue.value, inputRangePosition, [VIEWBOX_WIDTH - BASE_RADIUS, BASE_RADIUS], Extrapolate.CLAMP);
    const d = interpolate(sharedValue.value, inputRangeDiameter, [BASE_DIAMETER, BASE_DIAMETER * 0.6, BASE_DIAMETER], Extrapolate.CLAMP);
    return {
        cx: cx,
        r: d / 2,
    };
}

const calcAnimatedPropsLefttoRight = (sharedValue: Animated.SharedValue<number>, firstPart: boolean) => {
    "worklet";

    const inputRangePosition = firstPart ? [0, 1] : [1, 2];
    const inputRangeDiameter = firstPart ? [0, 0.5, 1] : [1, 1.5, 2];

    const cx = interpolate(sharedValue.value, inputRangePosition, [BASE_RADIUS, VIEWBOX_WIDTH - BASE_RADIUS], Extrapolate.CLAMP);
    const d = interpolate(sharedValue.value, inputRangeDiameter, [BASE_DIAMETER, BASE_DIAMETER * 1.2, BASE_DIAMETER], Extrapolate.CLAMP);
    return {
        cx: cx,
        r: d / 2,
    };
}


const TikTokAnimationScreen = ({ navigation }) => {

    const animatedValue = useSharedValue(0.0);

    // Group 1 is only visible in the first half of the animation cycle
    const group1Props = useAnimatedProps(() => {
        return {
            opacity: interpolate(animatedValue.value, [0, 1, 1, 2], [1, 1, 0, 0])
        };
    });

    const group1RightToLeftCircleProps = useAnimatedProps(() => {
        // position from right to left
        return calcAnimatedPropsRightToLeft(animatedValue, true);
    });

    const group1LeftToRightCircleProps = useAnimatedProps(() => {
        // position from left to right
        return calcAnimatedPropsLefttoRight(animatedValue, true);
    });

    const group1LeftToRightBackgroundCircleProps = useAnimatedProps(() => {
        // position from left to right
        return calcAnimatedPropsLefttoRight(animatedValue, true);
    });

    const group1ClipPathProps = useAnimatedProps(() => {
        // position from right to left
        return calcAnimatedPropsRightToLeft(animatedValue, true);
    });


    // Group 2 is only visible in the second half of the animation cycle
    const group2Props = useAnimatedProps(() => {
        const opacity = interpolate(animatedValue.value, [0, 1, 1, 2], [0, 0, 1, 1]);
        return {
            opacity: opacity,
        };
    });

    const group2LeftToRightCircleProps = useAnimatedProps(() => {
        // position from left to right
        return calcAnimatedPropsLefttoRight(animatedValue, false);
    });

    const group2RightToLeftCircleProps = useAnimatedProps(() => {
        // position from right to left
        return calcAnimatedPropsRightToLeft(animatedValue, false);
    });

    const group2LeftToRightBackgroundCircleProps = useAnimatedProps(() => {
        // position from left to right
        return calcAnimatedPropsLefttoRight(animatedValue, false);
    });

    const group2ClipPathProps = useAnimatedProps(() => {
        // position from right to left
        return calcAnimatedPropsRightToLeft(animatedValue, false);
    });



    return (
        <SafeAreaView style={styles.screen}>
            
            <Svg height="40" width="40" viewBox="0 0 100 100">
                <Defs>
                    <ClipPath id="group1-background-clippath">
                        <AnimatedCircle animatedProps={group1ClipPathProps} cy="50" />
                    </ClipPath>

                    <ClipPath id="group2-background-clippath">
                        <AnimatedCircle animatedProps={group2ClipPathProps} cy="50" />
                    </ClipPath>
                </Defs>


                <AnimatedG animatedProps={group1Props}>
                    { /* left circle */ }
                    <AnimatedCircle animatedProps={group1LeftToRightCircleProps} cy="50" fill={RED_COLOR} />

                    { /* right circle */ }
                    <AnimatedCircle animatedProps={group1RightToLeftCircleProps} cy="50" fill={GREEN_COLOR} />

                    { /* left circle with background color */ }
                    <AnimatedCircle animatedProps={group1LeftToRightBackgroundCircleProps} cy="50" fill={BACKGROUND_COLOR} clipPath="url(#group1-background-clippath)" />
                </AnimatedG>


                <AnimatedG animatedProps={group2Props}>
                
                    { /* second part of animation. left circle. from left right */ }
                    <AnimatedCircle animatedProps={group2LeftToRightCircleProps} cy="50" fill={GREEN_COLOR} />

                    { /* second part of animation. right circle. from right to left */ }
                    <AnimatedCircle animatedProps={group2RightToLeftCircleProps} cy="50" fill={RED_COLOR} />
                
                    { /* left circle with background color */ }
                    <AnimatedCircle animatedProps={group2LeftToRightBackgroundCircleProps} cy="50" fill={BACKGROUND_COLOR} clipPath="url(#group2-background-clippath)" />

                </AnimatedG>

            </Svg>

            <Button title="Start animation" onPress={() => {
                animatedValue.value = 0;
                animatedValue.value =  withRepeat(withTiming(2, { duration: 900, easing: Easing.linear }), -1, false);
            }}></Button>


        </SafeAreaView>
    );
}

export default TikTokAnimationScreen;