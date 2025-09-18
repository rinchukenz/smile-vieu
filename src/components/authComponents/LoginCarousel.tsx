import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { moderateScale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

export default function LoginCarousel() {
  // continuous, fractional progress from the carousel (grows unbounded)
  const progress = useSharedValue(0);

  const carouselData = [
    {
      id: "1",
      title:
        "Simplify your dental practice with smart scheduling and patient management",
      subtitle:
        "Streamline appointments, manage patient records, and grow your practice with our comprehensive solution.",
    },
    {
      id: "2",
      title:
        "Enhance patient engagement with seamless communication and reminders",
      subtitle:
        "Send automatic appointment reminders, follow-up messages, and notifications to keep patients informed and connected.",
    },
    {
      id: "3",
      title:
        "Optimize your clinic’s efficiency with detailed insights and analytics",
      subtitle:
        "Analyze patient visits, appointment trends, and staff performance to make data-driven decisions for your practice growth.",
    },
  ];

  const length = carouselData.length;

  return (
    <View style={{ width, alignItems: "center" }}>
      <Carousel
        loop
        width={width}
        height={verticalScale(120)}
        autoPlay
        autoPlayInterval={4000}
        data={carouselData}
        scrollAnimationDuration={800}
        // <-- This fires continuously while swiping/auto-playing
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              alignItems: "center",
              paddingHorizontal: moderateScale(16),
            }}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Animated Dots */}
      <View style={styles.dotsContainer}>
        {carouselData.map((_, i) => {
          const animatedStyle = useAnimatedStyle(() => {
            // progress.value grows; wrap it to [0, length)
            const p = progress.value % length;

            // shortest loop distance between current progress and dot index
            const raw = Math.abs(p - i);
            const dist = Math.min(raw, length - raw); // 0 = active, ~1 = neighbor

            // fade (and subtly scale) based on distance
            const opacity = interpolate(
              dist,
              [0, 0.5, 1],
              [1, 0.7, 0.3],
              Extrapolate.CLAMP
            );
            const scale = interpolate(
              dist,
              [0, 1],
              [1.25, 1],
              Extrapolate.CLAMP
            );

            return { opacity, transform: [{ scale }] };
          });

          return <Animated.View key={i} style={[styles.dot, animatedStyle]} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: moderateScale(16),
    fontFamily: "Mulish-Bold",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: moderateScale(14),
    fontFamily: "Mulish-SemiBold",
    textAlign: "center",
    marginTop: verticalScale(4),
    color: "#7B7B7B",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#107483",
  },
});
