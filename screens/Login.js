import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import SocialButton from '../components/SocialButton'
import OrSeparator from '../components/OrSeparator'
import { useTheme } from '../theme/ThemeProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
    loginCustomer,
    resetCustomerState,
} from '../redux/features/Customers/CustomerSlice'

const isTestMode = false

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
    },
    inputValidities: {
        email: isTestMode ? true : false,
        password: isTestMode ? true : false,
    },
    formIsValid: isTestMode ? true : false,
}

const Login = ({ navigation }) => {
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isChecked, setChecked] = useState(false)
    const { colors, dark } = useTheme()

    const dispatch = useDispatch()
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.customer
    )

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    useEffect(() => {
        // This effect runs after a successful or failed login attempt
        if (isSuccess && !isLoading) {
            // Reset navigation stack to prevent going back to login screen
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainStack' }],
                })
            )
            dispatch(resetCustomerState())
        }

        if (isError) {
            Alert.alert('Login Failed', message)
            dispatch(resetCustomerState())
        }
    }, [isSuccess, isError, isLoading, message, navigation, dispatch])

    const loginHandler = async () => {
        if (!formState.formIsValid) {
            Alert.alert(
                'Invalid Input',
                'Please check your email and password.',
                [{ text: 'Okay' }]
            )
            return
        }

        const { email, password } = formState.inputValues

        // Dispatch the loginCustomer thunk
        // The Redux slice will handle API calls, token saving, and state updates
        dispatch(loginCustomer({ email, password }))
    }

    // implementing apple authentication
    const appleAuthHandler = () => {
        console.log('Apple Authentication')
    }

    // implementing facebook authentication
    const facebookAuthHandler = () => {
        console.log('Facebook Authentication')
    }

    // Implementing google authentication
    const googleAuthHandler = () => {
        console.log('Google Authentication')
    }

    return (
        <SafeAreaView
            style={[
                styles.area,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Header />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: dark ? COLORS.white : COLORS.black,
                            },
                        ]}
                    >
                        Login to Your Account
                    </Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="Email"
                        placeholderTextColor={
                            dark ? COLORS.grayTie : COLORS.black
                        }
                        icon={icons.email}
                        keyboardType="email-address"
                        initialValue={formState.inputValues.email}
                    />
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        autoCapitalize="none"
                        id="password"
                        placeholder="Password"
                        placeholderTextColor={
                            dark ? COLORS.grayTie : COLORS.black
                        }
                        icon={icons.padlock}
                        secureTextEntry={true}
                        initialValue={formState.inputValues.password}
                    />
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={
                                    isChecked
                                        ? COLORS.primary
                                        : dark
                                          ? COLORS.primary
                                          : 'gray'
                                }
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.privacy,
                                        {
                                            color: dark
                                                ? COLORS.white
                                                : COLORS.black,
                                        },
                                    ]}
                                >
                                    Remember me
                                </Text>
                            </View>
                        </View>
                    </View>

                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                            style={styles.button}
                        />
                    ) : (
                        <Button
                            title="Login"
                            filled
                            onPress={loginHandler}
                            style={styles.button}
                            disabled={!formState.formIsValid}
                        />
                    )}

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ForgotPasswordMethods')
                        }
                    >
                        <Text style={styles.forgotPasswordBtnText}>
                            Forgot the password?
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.bottomContainer}>
                        <Text
                            style={[
                                styles.bottomLeft,
                                {
                                    color: dark ? COLORS.white : COLORS.black,
                                },
                            ]}
                        >
                            Don't have an account ?
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signup')}
                        >
                            <Text style={styles.bottomRight}>
                                {'  '}Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 100,
        height: 100,
        // tintColor: COLORS.primary
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    privacy: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: 'medium',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 26,
    },
    socialBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 18,
        // position: 'absolute',
        // bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'black',
    },
    bottomRight: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30,
    },
    forgotPasswordBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 12,
    },
})

export default Login
