import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'
import { useRegisterPushTokenMutation } from '../store/api/notificationsApi'
import { useAuth } from './useAuth'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const useNotifications = () => {
  const { isAuthenticated } = useAuth()
  const [registerPushToken] = useRegisterPushTokenMutation()

  useEffect(() => {
    if (!isAuthenticated) return

    const register = async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') return

      const tokenData = await Notifications.getExpoPushTokenAsync()
      await registerPushToken({ token: tokenData.data })
    }

    register().catch(console.error)
  }, [isAuthenticated])
}
