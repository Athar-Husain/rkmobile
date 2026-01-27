import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Clipboard,
    Alert,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import Icon from 'react-native-vector-icons/Ionicons'

// Mock data for the user's referral info
const mockReferralData = {
    referralCode: 'MWFIBER2024',
    referralRewards: [
        { id: '1', name: 'John Doe', status: 'Signed Up', reward: '+₹250' },
        { id: '2', name: 'Jane Smith', status: 'Active Plan', reward: '+₹500' },
        { id: '3', name: 'Alice Brown', status: 'Pending', reward: 'Pending' },
    ],
}

const ReferralsScreen = () => {
    const { dark } = useTheme()

    const handleCopyCode = () => {
        Clipboard.setString(mockReferralData.referralCode)
        Alert.alert(
            'Copied!',
            'Your referral code has been copied to the clipboard.'
        )
    }

    const handleShare = () => {
        // In a real app, you would use a library like 'expo-sharing' or 'react-native-share'
        // to open the native share dialog.
        // Example with mock data:
        // const shareMessage = `Join MWFiberNet and get 50% off your first month! Use my code: ${mockReferralData.referralCode}`;
        // Share.open({ message: shareMessage });
        Alert.alert('Share', 'This button would open the native share dialog.')
    }

    const renderRewardItem = (item) => (
        <View
            key={item.id}
            style={[
                styles.rewardItem,
                { borderBottomColor: dark ? '#333' : '#E0E0E0' },
            ]}
        >
            <View style={styles.rewardIcon}>
                <Icon
                    name={
                        item.status === 'Pending'
                            ? 'hourglass-outline'
                            : 'checkmark-circle-outline'
                    }
                    size={24}
                    color={item.status === 'Pending' ? '#FFD166' : '#14C9A0'}
                />
            </View>
            <View style={styles.rewardDetails}>
                <Text
                    style={[
                        styles.rewardName,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    {item.name}
                </Text>
                <Text
                    style={[
                        styles.rewardStatus,
                        { color: dark ? '#999' : '#666' },
                    ]}
                >
                    Status: {item.status}
                </Text>
            </View>
            <Text
                style={[
                    styles.rewardAmount,
                    { color: dark ? '#EAEAEA' : '#333' },
                ]}
            >
                {item.reward}
            </Text>
        </View>
    )

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: dark ? '#000' : '#F4F5F7' },
            ]}
        >
            <View
                style={[
                    styles.header,
                    { borderBottomColor: dark ? '#333' : '#E0E0E0' },
                ]}
            >
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? '#EAEAEA' : '#333' },
                    ]}
                >
                    Refer & Earn
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Referral Hero Card */}
                <View
                    style={[
                        styles.referralCard,
                        { backgroundColor: dark ? '#1C1C1E' : '#FFFFFF' },
                    ]}
                >
                    <Text
                        style={[
                            styles.cardTitle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        Refer a friend and get a reward!
                    </Text>
                    <Text
                        style={[
                            styles.cardDescription,
                            { color: dark ? '#999' : '#666' },
                        ]}
                    >
                        Share your unique code to give your friends a discount
                        and earn a reward for yourself.
                    </Text>
                    <View style={styles.codeContainer}>
                        <Text
                            style={[
                                styles.referralCode,
                                { color: dark ? '#EAEAEA' : '#333' },
                            ]}
                        >
                            {mockReferralData.referralCode}
                        </Text>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={handleCopyCode}
                        >
                            <Icon
                                name="copy-outline"
                                size={20}
                                color="#335EF7"
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={handleShare}
                    >
                        <Icon
                            name="share-social-outline"
                            size={18}
                            color="#FFFFFF"
                        />
                        <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* Referral History Section */}
                <View style={styles.historyContainer}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: dark ? '#EAEAEA' : '#333' },
                        ]}
                    >
                        Referral Status
                    </Text>
                    {mockReferralData.referralRewards.map(renderRewardItem)}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    scrollContainer: {
        padding: 16,
    },
    referralCard: {
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        marginBottom: 15,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
    },
    referralCode: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    copyButton: {
        padding: 5,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#335EF7',
        paddingVertical: 12,
        borderRadius: 10,
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    historyContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    rewardIcon: {
        marginRight: 15,
    },
    rewardDetails: {
        flex: 1,
    },
    rewardName: {
        fontSize: 16,
        fontWeight: '500',
    },
    rewardStatus: {
        fontSize: 12,
    },
    rewardAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default ReferralsScreen
