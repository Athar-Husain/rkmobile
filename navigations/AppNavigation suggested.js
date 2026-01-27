import NotificationPermissionScreen from '../screens/NotificationPermissionScreen'
import { checkPermission } from '../hooks/NotificationPermission'

const AppNavigation = () => {
    const dispatch = useDispatch()
    const { isLoggedIn, isLoading, hasCompletedOnboarding } = useSelector(
        (state) => state.customer
    )

    const [permissionGranted, setPermissionGranted] = React.useState(true)

    useEffect(() => {
        if (isLoggedIn) {
            ;(async () => {
                const granted = await checkPermission()
                setPermissionGranted(granted)
                if (!granted) {
                    console.log(
                        '⚠️ Notifications not allowed, showing blocking screen'
                    )
                }
            })()
        }
    }, [isLoggedIn])

    if (isLoading || hasCompletedOnboarding === null) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                permissionGranted ? (
                    <>
                        <MainStack />
                        <NotificationsWrapper />
                    </>
                ) : (
                    <NotificationPermissionScreen
                        onGranted={() => setPermissionGranted(true)}
                    />
                )
            ) : hasCompletedOnboarding ? (
                <AuthStack />
            ) : (
                <OnboardingStack />
            )}
        </NavigationContainer>
    )
}
