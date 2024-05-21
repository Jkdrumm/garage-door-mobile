import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

export interface LoadingIndicatorProps {
  isLoading: boolean;
  isError?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
  isError,
}) => {
  const dotColor = isLoading ? 'yellow' : isError ? 'red' : 'green';

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 32 32">
        <Circle cx="16" cy="16" r="16" fill={dotColor} />
      </Svg>
      {isLoading && (
        <ActivityIndicator size="small" color="gray" style={styles.spinner} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
