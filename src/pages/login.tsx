import {useContext, useRef} from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {login} from 'auth';
import {CenterBox, PrimaryButton, SessionContext} from 'components';
import {StackNavigationProp} from 'types';
import {useColorModeValue} from '../hooks/util';
import {colors} from 'colors';
import {useQueryClient} from '@tanstack/react-query';

export function Login({navigation}: StackNavigationProp<'Login'>) {
  const {setSession} = useContext(SessionContext);
  const textColor = useColorModeValue('black', 'white');
  const [usernameRef, passwordRef] = [useRef(''), useRef('')];

  const passwordInputRef = useRef<TextInput>();
  const queryClient = useQueryClient();

  return (
    <View style={styles.container}>
      <CenterBox title="Login">
        <Formik
          initialValues={{username: '', password: ''}}
          onSubmit={async ({username, password}) => {
            try {
              await login(
                {
                  username,
                  password,
                },
                setSession,
                queryClient,
              );
              navigation.navigate('Drawer');
            } catch (e) {
              // Log the stack trace
              console.log(e);
            }
          }}>
          {({handleBlur, handleChange, handleSubmit, isSubmitting}) => (
            <View>
              <View>
                <Text style={{color: textColor}}>Username</Text>
                <TextInput
                  value={usernameRef.current}
                  textContentType="username"
                  placeholder="username"
                  placeholderTextColor={colors.gray[600]}
                  style={[styles.input, {color: textColor}]}
                  onBlur={handleBlur('username')}
                  onChangeText={text => {
                    usernameRef.current = text;
                    handleChange('username')(text);
                  }}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />
                {/* {form.errors.username && form.touched.username && (
                    <Text style={styles.errorText}>{form.errors.username}</Text>
                  )} */}
              </View>
              <View>
                <Text style={{color: textColor}}>Password</Text>
                <TextInput
                  ref={passwordInputRef as any}
                  value={passwordRef.current}
                  secureTextEntry={true}
                  textContentType="password"
                  placeholder="password"
                  placeholderTextColor={colors.gray[600]}
                  style={[styles.input, {color: textColor}]}
                  onBlur={handleBlur('password')}
                  onChangeText={text => {
                    passwordRef.current = text;
                    handleChange('password')(text);
                  }}
                  onSubmitEditing={() => handleSubmit()}
                  // secureTextEntry={!showPassword}
                />
                {/* {form.errors.password && form.touched.password && (
                    <Text style={styles.errorText}>{form.errors.password}</Text>
                  )} */}
              </View>
              {/* {loginError && <Text style={styles.errorText}>{loginError}</Text>} */}
              <PrimaryButton
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                label="Login"
              />
            </View>
          )}
        </Formik>
        <Text
          style={styles.link}
          onPress={() => {
            /* Navigate to Signup */
          }}>
          Create an Account
        </Text>
      </CenterBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
  },
  link: {
    color: colors.blue[400],
    marginTop: 15,
    textAlign: 'center',
  },
});
