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
    Share, // Added native share
    StatusBar,
} from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { Feather } from '@expo/vector-icons'
import { COLORS } from '../constants'
import { useNavigation } from '@react-navigation/native'

const mockReferralData = {
    referralCode: 'MWFIBER2024',
    referralRewards: [
        {
            id: '1',
            name: 'John Doe',
            status: 'Signed Up',
            reward: '+₹250',
            date: 'Oct 24',
        },
        {
            id: '2',
            name: 'Jane Smith',
            status: 'Active Plan',
            reward: '+₹500',
            date: 'Oct 22',
        },
        {
            id: '3',
            name: 'Alice Brown',
            status: 'Pending',
            reward: 'Pending',
            date: 'Oct 20',
        },
    ],
}

const ReferralsScreen = () => {
    const { dark } = useTheme()
    const navigation = useNavigation()

    const handleCopyCode = () => {
        Clipboard.setString(mockReferralData.referralCode)
        Alert.alert('Copied!', 'Referral code copied to clipboard.')
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Upgrade your home internet with MWFiberNet! Use my code ${mockReferralData.referralCode} to get exclusive rewards: [Link]`,
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    const renderRewardItem = (item, index) => (
        <View
            key={item.id}
            style={[
                styles.rewardRow,
                {
                    borderBottomWidth:
                        index === mockReferralData.referralRewards.length - 1
                            ? 0
                            : StyleSheet.hairlineWidth,
                },
            ]}
        >
            <View
                style={[
                    styles.statusDot,
                    {
                        backgroundColor:
                            item.status === 'Pending' ? '#FFCC00' : '#34C759',
                    },
                ]}
            />
            <View style={styles.rewardInfo}>
                <Text
                    style={[
                        styles.rewardName,
                        { color: dark ? COLORS.white : '#1C1C1E' },
                    ]}
                >
                    {item.name}
                </Text>
                <Text style={styles.rewardDate}>
                    {item.date} • {item.status}
                </Text>
            </View>
            <Text
                style={[
                    styles.rewardAmount,
                    {
                        color:
                            item.status === 'Pending' ? '#8E8E93' : '#34C759',
                    },
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
                { backgroundColor: dark ? COLORS.black : '#F2F2F7' },
            ]}
        >
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

            {/* Premium Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Feather
                        name="arrow-left"
                        size={24}
                        color={dark ? COLORS.white : COLORS.black}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.black },
                    ]}
                >
                    Refer & Earn
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Visual Graphic Area */}
                <View style={styles.illustrationArea}>
                    <View style={styles.iconCircle}>
                        <Feather name="gift" size={40} color={COLORS.primary} />
                    </View>
                    <Text
                        style={[
                            styles.heroTitle,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Get ₹500 for every friend
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Your friends get a 20% discount on their first month and
                        you earn rewards.
                    </Text>
                </View>

                {/* Referral Code Card */}
                <View
                    style={[
                        styles.glassCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    <Text style={styles.label}>YOUR REFERRAL CODE</Text>
                    <View
                        style={[
                            styles.codeBox,
                            { backgroundColor: dark ? '#2C2C2E' : '#F9F9F9' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.codeText,
                                { color: dark ? COLORS.white : COLORS.black },
                            ]}
                        >
                            {mockReferralData.referralCode}
                        </Text>
                        <TouchableOpacity
                            onPress={handleCopyCode}
                            style={styles.copyBadge}
                        >
                            <Feather
                                name="copy"
                                size={16}
                                color={COLORS.primary}
                            />
                            <Text style={styles.copyText}>Copy</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.mainShareBtn}
                        onPress={handleShare}
                    >
                        <Feather
                            name="share-2"
                            size={18}
                            color={COLORS.white}
                        />
                        <Text style={styles.mainShareText}>Send Invite</Text>
                    </TouchableOpacity>
                </View>

                {/* History Section */}
                <View style={styles.historyHeader}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                    >
                        Recent Referrals
                    </Text>
                    <TouchableOpacity>
                        <Text
                            style={{ color: COLORS.primary, fontWeight: '600' }}
                        >
                            View All
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={[
                        styles.historyCard,
                        { backgroundColor: dark ? '#1C1C1E' : COLORS.white },
                    ]}
                >
                    {mockReferralData.referralRewards.map((item, index) =>
                        renderRewardItem(item, index)
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
    },
    headerTitle: { fontSize: 18, fontFamily: 'bold' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    // Hero Area
    illustrationArea: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 22,
        fontFamily: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },

    // Code Card
    glassCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    label: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 12,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#8E8E9320',
        marginBottom: 20,
    },
    codeText: { fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
    copyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 5,
    },
    copyText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
    mainShareBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        borderRadius: 18,
        gap: 10,
    },
    mainShareText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },

    // History
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    historyCard: {
        borderRadius: 20,
        paddingHorizontal: 16,
        overflow: 'hidden',
    },
    rewardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomColor: '#8E8E9320',
    },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
    rewardInfo: { flex: 1 },
    rewardName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    rewardDate: { fontSize: 12, color: '#8E8E93' },
    rewardAmount: { fontSize: 15, fontWeight: 'bold' },
})

export default ReferralsScreen
