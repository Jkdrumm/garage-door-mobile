import {StyleSheet, Text} from 'react-native';
import {Button, type ButtonProps} from 'react-native-paper';
import {useColorModeValue} from 'hooks';
import {colors} from 'colors';

export type PrimaryButtonProps = {
  label: string;
} & Omit<ButtonProps, 'children'>;

export function PrimaryButton({label, ...props}: PrimaryButtonProps) {
  const textColor = useColorModeValue('white', 'black');
  const buttonColor = useColorModeValue(
    props.disabled ? colors.red[600] : colors.purple[600],
    props.disabled ? colors.red[300] : colors.purple[200],
  );
  return (
    <Button
      contentStyle={[styles.button, {backgroundColor: buttonColor}]}
      style={[styles.buttonWrapper, styles.button]}
      {...props}>
      <Text style={{color: textColor}}>{props.loading ? '' : label}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 16,
  },
  button: {
    width: 200,
    height: 64,
    borderRadius: 48,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
