import {View, Text, StyleSheet} from 'react-native';
import {
  AlertCircle,
  AlertTriangle,
  Loader,
  Lock,
  Unlock,
} from 'react-native-feather';
import {useUserLevel, usePress, useGarageState, useColorModeValue} from 'hooks';
import {UserLevel, GarageState} from 'enums';
import {CenterBox, PrimaryButton} from 'components';
import {colors} from 'colors';

export function Home() {
  const {data: garageDoorState} = useGarageState();
  const doorState = garageDoorState as GarageState;
  const {data: userLevel} = useUserLevel();
  const {mutate: pressButton, isLoading: isWaitingAcknowledgement} = usePress();

  function getPermissionsText(canView: boolean) {
    if (canView)
      return 'You do not have permission to move the garage door, you may only see its state. If this is an error, please contact your system administrator.';
    return "You do not have permission to view the garage door's status. If this is an error, please contact your system administrator.";
  }

  function getGarageText(state: GarageState) {
    return [
      'Garage Door: Open',
      'Garage Door: Closed',
      'Garage Door: Unknown',
      'Connecting to server...',
    ][state];
  }

  function getGarageBoxColor(state: GarageState) {
    return [
      colors.green[300],
      colors.red[300],
      colors.purple[300],
      colors.orange[300],
    ][state];
  }

  const statusColor = useColorModeValue('black', 'white');

  function getGarageBoxIcon(state: GarageState) {
    const props = {
      color: statusColor,
      style: styles.centerIcon,
    };
    return [
      <Unlock width={48} height={48} key={1} {...props} />,
      <Lock width={48} height={48} key={2} {...props} />,
      <AlertCircle width={48} height={48} key={3} {...props} />,
      <Loader width={48} height={48} key={4} {...props} />,
    ][state];
  }

  const canMove = userLevel !== undefined && userLevel >= UserLevel.USER;
  const canView = userLevel !== undefined && userLevel >= UserLevel.VIEWER;

  const textStyle = [styles.centerText, {color: statusColor}];

  const isActivateDisabled = !canMove || doorState === GarageState.FETCHING;

  return (
    <View style={styles.centerBox}>
      <CenterBox title="Garage Door">
        {(!canMove || !canView) && (
          <View style={[styles.box, styles.orangeBackground]}>
            <AlertTriangle width={48} height={48} color={statusColor} />
            <Text style={textStyle}>{getPermissionsText(canView)}</Text>
          </View>
        )}
        {canView && (
          <View
            style={[
              styles.box,
              {backgroundColor: getGarageBoxColor(doorState)},
            ]}>
            {getGarageBoxIcon(doorState)}
            <Text style={textStyle}>{getGarageText(doorState)}</Text>
          </View>
        )}
        <PrimaryButton
          onPress={() => pressButton()}
          disabled={isActivateDisabled}
          loading={isWaitingAcknowledgement}
          label="Activate"
        />
      </CenterBox>
    </View>
  );
}

const styles = StyleSheet.create({
  centerBox: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    borderRadius: 8,
    padding: 8,
    paddingBottom: 16,
    paddingTop: 0,
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  centerIcon: {
    margin: 16,
    marginBottom: 0,
    height: 48,
  },
  orangeBackground: {backgroundColor: colors.orange[300]},
});
