import { useEffect } from 'react'
import { Platform, Alert } from 'react-native'
import * as Location from 'expo-location'
import notifee, { AuthorizationStatus } from '@notifee/react-native'

export const checkPermissions = async () => {
  let notifGranted = true
  let locationGranted = true

  // -------- Notifications --------
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const settings = await notifee.getNotificationSettings()
    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      notifGranted = false
    }
  }
  // iOS
  if (Platform.OS === 'ios') {
    const status = await notifee.getNotificationSettings()
    if (status.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      notifGranted = false
    }
  }

  // -------- Location --------
  const { status: locStatus } = await Location.getForegroundPermissionsAsync()
  if (locStatus !== 'granted') {
    locationGranted = false
  }

  return { notifGranted, locationGranted }
}

export const handlePermissionCheck = async () => {
  const { notifGranted, locationGranted } = await checkPermissions()

  if (!notifGranted) {
    Alert.alert(
      'Enable Notifications',
      'To receive updates, please enable notifications in settings.',
      [{ text: 'OK' }]
    )
  }

  if (!locationGranted) {
    Alert.alert(
      'Enable Location',
      'To take orders, please enable location access in settings.',
      [{ text: 'OK' }]
    )
  }
}
