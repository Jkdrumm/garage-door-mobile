import {useRef} from 'react';
import {
  Animated,
  PanResponder,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {colors} from 'colors';
import {Trash} from 'react-native-feather';
import {useColorModeValue} from 'hooks';
import {DomainListItem} from 'types';
import {useTheme} from '@react-navigation/native';
import {LoadingIndicator} from './LoadingIndicator';

export type SwipeableListItemProps = {
  item: DomainListItem;
  maxSwipeDistance?: number;
  onPress: () => void;
  onDelete: () => void;
};

export function SwipeableListItem({
  item,
  maxSwipeDistance = 50,
  onPress,
  onDelete,
}: SwipeableListItemProps) {
  console.log(item);
  const swipeable = useRef(new Animated.ValueXY()).current;
  let previousDx = useRef(0).current;
  let currentSwipePosition = useRef(0).current;
  let totalSwipeDistance = useRef(0).current;

  const sprintSettings = {
    useNativeDriver: false,
    overshootClamping: true,
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      previousDx = 0;
      totalSwipeDistance = 0;
    },
    onPanResponderMove: (_e, gestureState) => {
      totalSwipeDistance += Math.abs(gestureState.dx - previousDx);
      currentSwipePosition += gestureState.dx - previousDx;
      previousDx = gestureState.dx;
      if (Math.abs(currentSwipePosition) < 10) {
        Animated.spring(swipeable, {
          toValue: {x: 0, y: 0},
          ...sprintSettings,
        }).start();
        return;
      }
      if (currentSwipePosition > maxSwipeDistance)
        currentSwipePosition = maxSwipeDistance;
      if (currentSwipePosition < -maxSwipeDistance)
        currentSwipePosition = -maxSwipeDistance;
      Animated.spring(swipeable, {
        toValue: {x: currentSwipePosition, y: 0},
        ...sprintSettings,
        speed: 100,
      }).start();
    },
    onPanResponderRelease: () => {
      if (Math.abs(currentSwipePosition) < 10 && totalSwipeDistance < 10)
        onPress();
      if (currentSwipePosition >= 25) currentSwipePosition = maxSwipeDistance;
      else if (currentSwipePosition <= -25)
        currentSwipePosition = -maxSwipeDistance;
      else currentSwipePosition = 0;

      Animated.spring(swipeable, {
        toValue: {x: currentSwipePosition, y: 0},
        ...sprintSettings,
      }).start();
    },
  });

  const textColor = useColorModeValue('black', 'white');
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onDelete()}
        style={[styles.deleteBox, styles.deleteBoxLeft]}>
        <Trash color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete()}
        style={[styles.deleteBox, styles.deleteBoxRight]}>
        <Trash color="white" />
      </TouchableOpacity>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.swipeableContainer,
          {
            transform: [{translateX: swipeable.x}],
            backgroundColor: theme.colors.background,
          },
        ]}>
        <View>
          <Text style={{color: textColor}}>{item.deviceName}</Text>
          <Text style={{color: textColor}}>{item.domain}</Text>
        </View>
        <LoadingIndicator
          isLoading={item.isLoading ?? false}
          isError={item.isError ?? false}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red[500],
    position: 'relative',
    borderRadius: 999,
  },
  swipeableContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteBox: {
    position: 'absolute',
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBoxLeft: {
    left: 16,
  },
  deleteBoxRight: {
    right: 16,
  },
  deleteText: {
    color: 'white',
  },
});
