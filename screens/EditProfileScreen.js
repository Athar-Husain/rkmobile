import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '../theme/ThemeProvider'
import { COLORS, SIZES, icons, images } from '../constants'

// Assuming you have a utility for image picking
// For Expo: import * as ImagePicker from 'expo-image-picker';
// For bare RN: import { launchImageLibrary } from 'react-native-image-picker';

const EditProfileScreen = ({ navigation }) => {
    const { dark, colors } = useTheme()
    const [image, setImage] = useState(images.user1) // Default avatar

    const pickImage = async () => {
        // Implement your image picker logic here
        // Example using expo-image-picker (make sure it's installed):
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //     Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        //     return;
        // }
        // const result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //     allowsEditing: true,
        //     aspect: [1, 1],
        //     quality: 1,
        // });
        // if (!result.canceled) {
        //     setImage({ uri: result.assets[0].uri });
        // }

        // For now, a placeholder alert
        alert('Image picker would open here!')
    }

    /**
     * Render Header for Edit Profile
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.backButton,
                        {
                            borderColor: dark
                                ? COLORS.dark3
                                : COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icons.back} // Ensure this icon is available
                        resizeMode="contain"
                        style={[
                            styles.backIcon,
                            {
                                tintColor: dark
                                    ? COLORS.white
                                    : COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        { color: dark ? COLORS.white : COLORS.greyscale900 },
                    ]}
                >
                    Edit Profile
                </Text>
                <View style={{ width: 46 }} /> {/* Spacer */}
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[styles.area, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View>
                            <Image
                                source={image}
                                resizeMode="cover"
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.picContainer}
                            >
                                <MaterialIcons
                                    name="edit"
                                    size={16}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={[
                                styles.nameText,
                                {
                                    color: dark
                                        ? COLORS.secondaryWhite
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            Nathalie Erneson
                        </Text>
                        <Text
                            style={[
                                styles.emailText,
                                {
                                    color: dark
                                        ? COLORS.secondaryWhite
                                        : COLORS.greyscale900,
                                },
                            ]}
                        >
                            nathalie_erneson@gmail.com
                        </Text>

                        {/* You can add more editable fields here, e.g., TextInput */}
                        {/*
                        <TextInput
                            style={[styles.inputField, { color: dark ? COLORS.white : COLORS.greyscale900, borderColor: dark ? COLORS.dark3 : COLORS.grayscale200 }]}
                            placeholder="Full Name"
                            value="Nathalie Erneson"
                            placeholderTextColor={dark ? COLORS.grayscale700 : COLORS.grayscale500}
                        />
                        */}

                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>
                                Save Changes
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
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24, // Increased margin for visual separation
    },
    backButton: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 999,
    },
    picContainer: {
        width: 32, // Larger touch target
        height: 32, // Larger touch target
        borderRadius: 999, // Circular
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        position: 'absolute',
        right: 0,
        bottom: 0, // Adjusted position
        borderWidth: 2, // Added border for contrast
        borderColor: COLORS.white, // Border color
    },
    nameText: {
        fontSize: 20, // Slightly larger
        fontFamily: 'bold',
        marginTop: 16, // Adjusted spacing
    },
    emailText: {
        fontSize: 16,
        fontFamily: 'medium',
        marginTop: 4,
        color: COLORS.greyscale700, // Make email slightly less prominent
        marginBottom: 20, // Spacing before potential input fields
    },
    inputField: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    saveButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20, // Spacing after fields
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'bold',
    },
})

export default EditProfileScreen
