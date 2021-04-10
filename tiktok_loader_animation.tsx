import React, { useEffect, useState } from 'react';
import {
    Button,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { cancelAnimation, Easing, interpolate, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, {Circle, Defs, ClipPath} from 'react-native-svg';

const styles = StyleSheet.create({
    screen: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FFF',
    },
});

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BASE_DIAMETER = 50;

const radius_input_range = [0, 0.5, 1];
const radius_output_range = [BASE_DIAMETER, BASE_DIAMETER * 0.6, BASE_DIAMETER];

const radius_input_range_bigger = [0, 0.5, 1];
const radius_output_range_bigger = [BASE_DIAMETER, BASE_DIAMETER * 1.2, BASE_DIAMETER];

const TikTokAnimationScreen = ({ navigation }) => {

    const animatedValue = useSharedValue(0.0);

    const greenCircleProps = useAnimatedProps(() => {        
        const cx = interpolate(animatedValue.value, [0, 1], [75, 25]); // from right to left
        const d = interpolate(animatedValue.value, radius_input_range, radius_output_range);
        return {
            cx: cx,
            r: d / 2,
        };
    });

    const redCircleProps = useAnimatedProps(() => {
        const cx = interpolate(animatedValue.value, [0, 1], [25, 75]); // from left to right
        const d = interpolate(animatedValue.value, radius_input_range_bigger, radius_output_range_bigger);
        return {
            cx: cx,
            r: d / 2,
        };
    });

    const backgroundProps = useAnimatedProps(() => {
        const cx = interpolate(animatedValue.value, [0, 1], [25, 75]); // from left to right
        const d = interpolate(animatedValue.value, radius_input_range_bigger, radius_output_range_bigger);
        return {
            cx: cx,
            r: d / 2,
        };
    });

    const clipPathProps = useAnimatedProps(() => {
        const cx = interpolate(animatedValue.value, [0, 1], [75, 25]); // from right to left
        const d = interpolate(animatedValue.value, radius_input_range, radius_output_range);
        
        return {
            cx: cx,
            r: d / 2,
        };
    });





    return (
        <SafeAreaView style={styles.screen}>
            
            <Svg height="100" width="100" viewBox="0 0 100 100">
            { 
                <Defs>
                    <ClipPath id="background-clippath">
                        
                        <AnimatedCircle animatedProps={clipPathProps} cy="50" r="25" />
                    </ClipPath>
                </Defs>
              }
                { /* left circle */ }
                <AnimatedCircle animatedProps={redCircleProps} cy="50" fill="rgb(240, 50, 75)" />

                { /* right circle */ }
                <AnimatedCircle animatedProps={greenCircleProps} cy="50" fill="rgb(66, 221, 240)" />

                { /* left circle with background color */ }
                <AnimatedCircle animatedProps={backgroundProps} cy="50" fill="rgb(10, 10, 10)" clipPath="url(#background-clippath)" />
                    
            

            </Svg>

            <Button title="Start animation" onPress={() => {
                animatedValue.value = 0;
                animatedValue.value =  withRepeat(withTiming(1, { duration: 400 }), -1, true);
            }}></Button>


        </SafeAreaView>
    );
}

export default TikTokAnimationScreen;