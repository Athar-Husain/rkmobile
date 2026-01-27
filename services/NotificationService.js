import notifee, { 
    AndroidImportance, 
    AndroidVisibility, 
    AndroidCategory,
    EventType 
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { NavigationService } from './NavigationService';
import { AnalyticsService } from './AnalyticsService';

class NotificationService {
    constructor() {
        this.isInitialized = false;
        this.permissionStatus = null;
        this.fcmToken = null;
        this.notificationQueue = [];
    }

    // ==========================================
    // INITIALIZATION (Industry Standard)
    // ==========================================
    async initialize() {
        if (this.isInitialized) return;

        try {
            console.log('🔧 Initializing Notification Service...');
            
            // 1. Create notification channels
            await this.createNotificationChannels();
            
            // 2. Request permissions
            await this.requestAllPermissions();
            
            // 3. Get FCM token
            await this.getFCMToken();
            
            // 4. Setup listeners
            this.setupMessageHandlers();
            this.setupBackgroundEventHandler();
            
            // 5. Process any pending notifications
            await this.processPendingNotifications();
            
            this.isInitialized = true;
            console.log('✅ Notification Service initialized successfully');
            
            // Track initialization
            AnalyticsService.track('notification_service_initialized', {
                platform: Platform.OS,
                permission_status: this.permissionStatus
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize notification service:', error);
            AnalyticsService.trackError('notification_init_failed', error);
        }
    }

    // ==========================================
    // CHANNEL MANAGEMENT (Industry Standard)
    // ==========================================
    async createNotificationChannels() {
        const channels = [
            {
                id: 'chat_messages',
                name: 'Chat Messages',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibration: [300, 500, 300],
                lights: [300, 600],
                description: 'Messages from other users',
                category: AndroidCategory.MESSAGE,
                visibility: AndroidVisibility.PUBLIC,
            },
            {
                id: 'system_alerts',
                name: 'System Alerts',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                vibration: [500, 200, 500],
                description: 'Important system notifications',
                category: AndroidCategory.SYSTEM,
            },
            {
                id: 'promotional',
                name: 'Promotional',
                importance: AndroidImportance.DEFAULT,
                sound: 'default',
                description: 'Promotional offers and updates',
                category: AndroidCategory.PROMO,
            },
            {
                id: 'reminders',
                name: 'Reminders',
                importance: AndroidImportance.DEFAULT,
                sound: 'default',
                vibration: [200, 100, 200],
                description: 'Task and event reminders',
                category: AndroidCategory.REMINDER,
            }
        ];

        for (const channel of channels) {
            await notifee.createChannel(channel);
        }
        
        console.log('✅ All notification channels created');
    }

    // ==========================================
    // PERMISSION MANAGEMENT (Industry Standard)
    // ==========================================
    async requestAllPermissions() {
        try {
            // Firebase messaging permissions
            const firebaseStatus = await messaging().requestPermission({
                alert: true,
                badge: true,
                sound: true,
                announcement: true,
                criticalAlert: Platform.OS === 'ios',
            });

            // Notifee permissions
            const notifeeSettings = await notifee.requestPermission({
                alert: true,
                badge: true,
                sound: true,
                announcement: true,
                criticalAlert: Platform.OS === 'ios',
            });

            this.permissionStatus = {
                firebase: firebaseStatus,
                notifee: notifeeSettings.authorizationStatus,
                granted: firebaseStatus >= 1 && notifeeSettings.authorizationStatus >= 1
            };

            if (!this.permissionStatus.granted) {
                this.showPermissionDeniedFallback();
            }

            return this.permissionStatus.granted;
        } catch (error) {
            console.error('Permission request failed:', error);
            return false;
        }
    }

    // ==========================================
    // FCM TOKEN MANAGEMENT (Industry Standard)
    // ==========================================
    async getFCMToken() {
        try {
            // Check for existing token
            this.fcmToken = await AsyncStorage.getItem('fcm_token');
            
            if (!this.fcmToken) {
                this.fcmToken = await messaging().getToken();
                await AsyncStorage.setItem('fcm_token', this.fcmToken);
            }

            // Register token with backend
            await this.registerTokenWithBackend(this.fcmToken);
            
            // Listen for token refresh
            this.setupTokenRefreshListener();
            
            console.log('✅ FCM Token obtained:', this.fcmToken.substring(0, 20) + '...');
            return this.fcmToken;
        } catch (error) {
            console.error('Failed to get FCM token:', error);
            return null;
        }
    }

    async registerTokenWithBackend(token) {
        try {
            // Replace with your API endpoint
            const response = await fetch('YOUR_API_BASE_URL/api/fcm-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await this.getAuthToken()}`
                },
                body: JSON.stringify({
                    token,
                    platform: Platform.OS,
                    app_version: '1.0.0', // Get from app config
                    device_info: await this.getDeviceInfo()
                })
            });

            if (response.ok) {
                console.log('✅ FCM token registered with backend');
            }
        } catch (error) {
            console.error('Failed to register token:', error);
        }
    }

    // ==========================================
    // MESSAGE HANDLERS (Industry Standard)
    // ==========================================
    setupMessageHandlers() {
        // Foreground message handler
        this.unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
            console.log('📱 Foreground message received:', remoteMessage);
            
            AnalyticsService.track('notification_received_foreground', {
                type: remoteMessage.data?.type || 'unknown',
                has_notification: !!remoteMessage.notification
            });

            await this.handleForegroundMessage(remoteMessage);
        });

        // Background app opened
        this.unsubscribeBackgroundOpen = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('📱 Background notification opened app:', remoteMessage);
            
            AnalyticsService.track('notification_opened_background', {
                type: remoteMessage.data?.type || 'unknown'
            });

            this.handleNotificationPress(remoteMessage);
        });

        // App opened from killed state
        messaging().getInitialNotification().then((remoteMessage) => {
            if (remoteMessage) {
                console.log('📱 App opened from killed state:', remoteMessage);
                
                AnalyticsService.track('notification_opened_killed', {
                    type: remoteMessage.data?.type || 'unknown'
                });

                this.handleNotificationPress(remoteMessage);
            }
        });
    }

    setupBackgroundEventHandler() {
        // Notifee background events
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            console.log('📱 Notifee background event:', type);
            
            AnalyticsService.track('notifee_background_event', { type });

            switch (type) {
                case EventType.PRESS:
                    await this.handleNotificationPress(detail);
                    break;
                case EventType.DISMISSED:
                    await this.handleNotificationDismissed(detail);
                    break;
                case EventType.ACTION_PRESS:
                    await this.handleActionPress(detail);
                    break;
            }
        });
    }

    // ==========================================
    // NOTIFICATION DISPLAY (Industry Standard)
    // ==========================================
    async displayNotification(remoteMessage, options = {}) {
        try {
            const { notification, data } = remoteMessage;
            const notificationType = data?.type || 'default';
            
            // Get notification configuration based on type
            const config = this.getNotificationConfig(notificationType);
            
            const title = notification?.title || data?.title || config.defaultTitle;
            const body = notification?.body || data?.message || config.defaultBody;
            
            // Create notification payload
            const notificationPayload = {
                id: data?.id || Date.now().toString(),
                title,
                body,
                data: {
                    ...data,
                    timestamp: Date.now(),
                    notification_id: data?.id
                },
                android: {
                    channelId: config.channelId,
                    importance: config.importance,
                    smallIcon: config.smallIcon,
                    largeIcon: config.largeIcon,
                    color: config.color,
                    sound: config.sound,
                    vibrate: config.vibrate,
                    lights: config.lights,
                    category: config.category,
                    visibility: config.visibility,
                    pressAction: {
                        id: 'default',
                        launchActivity: 'default'
                    },
                    // Add quick actions if needed
                    actions: config.actions || [],
                    // Group notifications if needed
                    groupId: data?.group_id,
                    groupSummary: data?.is_group_summary === 'true',
                },
                ios: {
                    sound: config.sound,
                    categoryId: config.categoryId,
                    attachments: config.attachments || [],
                    foregroundPresentationOptions: {
                        alert: true,
                        badge: true,
                        sound: true
                    }
                }
            };

            // Add image if present
            if (data?.image_url) {
                notificationPayload.android.largeIcon = data.image_url;
                notificationPayload.ios.attachments = [{
                    url: data.image_url,
                    type: 'image'
                }];
            }

            // Display the notification
            await notifee.displayNotification(notificationPayload);
            
            // Track notification display
            AnalyticsService.track('notification_displayed', {
                type: notificationType,
                channel: config.channelId,
                has_image: !!data?.image_url
            });
            
            console.log('✅ Notification displayed successfully');
            
        } catch (error) {
            console.error('❌ Failed to display notification:', error);
            AnalyticsService.trackError('notification_display_failed', error);
        }
    }

    // ==========================================
    // NOTIFICATION CONFIGURATION (Industry Standard)
    // ==========================================
    getNotificationConfig(type) {
        const configs = {
            chat_message: {
                channelId: 'chat_messages',
                importance: AndroidImportance.HIGH,
                smallIcon: 'ic_chat',
                color: '#4CAF50',
                sound: 'chat_sound',
                vibrate: [300, 500, 300],
                lights: [300, 600],
                category: AndroidCategory.MESSAGE,
                visibility: AndroidVisibility.PUBLIC,
                defaultTitle: 'New Message',
                defaultBody: 'You have a new message'
            },
            system_alert: {
                channelId: 'system_alerts',
                importance: AndroidImportance.HIGH,
                smallIcon: 'ic_alert',
                color: '#FF5722',
                sound: 'alert_sound',
                vibrate: [500, 200, 500],
                category: AndroidCategory.SYSTEM,
                defaultTitle: 'System Alert',
                defaultBody: 'Important system notification'
            },
            promotional: {
                channelId: 'promotional',
                importance: AndroidImportance.DEFAULT,
                smallIcon: 'ic_promo',
                color: '#2196F3',
                sound: 'default',
                category: AndroidCategory.PROMO,
                defaultTitle: 'Special Offer',
                defaultBody: 'Check out our latest offers'
            },
            reminder: {
                channelId: 'reminders',
                importance: AndroidImportance.DEFAULT,
                smallIcon: 'ic_reminder',
                color: '#FF9800',
                sound: 'reminder_sound',
                vibrate: [200, 100, 200],
                category: AndroidCategory.REMINDER,
                defaultTitle: 'Reminder',
                defaultBody: 'You have a pending task'
            }
        };

        return configs[type] || configs.system_alert;
    }

    // ==========================================
    // NAVIGATION HANDLING (Industry Standard)
    // ==========================================
    async handleNotificationPress(notificationData) {
        try {
            const data = notificationData.data || notificationData.notification?.data || {};
            
            // Store navigation data for app startup
            await AsyncStorage.setItem('pending_navigation', JSON.stringify({
                type: data.type,
                payload: data,
                timestamp: Date.now()
            }));

            // Navigate immediately if app is open
            NavigationService.handleNotificationNavigation(data);
            
            AnalyticsService.track('notification_pressed', {
                type: data.type || 'unknown',
                has_deep_link: !!data.deep_link
            });
            
        } catch (error) {
            console.error('Failed to handle notification press:', error);
        }
    }

    async handleNotificationDismissed(detail) {
        const data = detail.notification?.data || {};
        
        AnalyticsService.track('notification_dismissed', {
            type: data.type || 'unknown'
        });
    }

    async handleActionPress(detail) {
        const { pressAction, notification } = detail;
        const data = notification?.data || {};
        
        AnalyticsService.track('notification_action_pressed', {
            action: pressAction.id,
            type: data.type || 'unknown'
        });

        // Handle specific actions
        switch (pressAction.id) {
            case 'reply':
                NavigationService.navigateToChat(data.chat_id);
                break;
            case 'mark_read':
                await this.markAsRead(data.message_id);
                break;
            case 'archive':
                await this.archiveNotification(data.notification_id);
                break;
        }
    }

    // ==========================================
    // UTILITY METHODS (Industry Standard)
    // ==========================================
    async processPendingNotifications() {
        try {
            const pendingData = await AsyncStorage.getItem('pending_navigation');
            if (pendingData) {
                const navigationData = JSON.parse(pendingData);
                
                // Check if it's not too old (5 minutes)
                if (Date.now() - navigationData.timestamp < 300000) {
                    NavigationService.handleNotificationNavigation(navigationData.payload);
                }
                
                await AsyncStorage.removeItem('pending_navigation');
            }
        } catch (error) {
            console.error('Failed to process pending notifications:', error);
        }
    }

    async getAuthToken() {
        return await AsyncStorage.getItem('auth_token');
    }

    async getDeviceInfo() {
        // Add device info collection here
        return {
            platform: Platform.OS,
            version: Platform.Version
        };
    }

    showPermissionDeniedFallback() {
        // Show user-friendly message about enabling notifications
        console.log('⚠️ Notifications disabled - showing fallback UI');
    }

    // ==========================================
    // CLEANUP (Industry Standard)
    // ==========================================
    cleanup() {
        if (this.unsubscribeForeground) this.unsubscribeForeground();
        if (this.unsubscribeBackgroundOpen) this.unsubscribeBackgroundOpen();
        if (this.unsubscribeTokenRefresh) this.unsubscribeTokenRefresh();
    }
}

export default new NotificationService();
