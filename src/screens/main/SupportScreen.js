import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Linking,
    Alert,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconFA from 'react-native-vector-icons/FontAwesome'

const SupportScreen = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()
    const [submitting, setSubmitting] = useState(false)

    const handleCallManager = () => {
        Linking.openURL('tel:+919876543210').catch((err) =>
            Alert.alert('Error', 'Could not make call')
        )
    }

    const handleWhatsApp = () => {
        const url = 'https://wa.me/919876543210'
        Linking.openURL(url).catch((err) =>
            Alert.alert('Error', 'Could not open WhatsApp')
        )
    }

    const handleEmail = () => {
        Linking.openURL('mailto:support@rkelectronics.com').catch((err) =>
            Alert.alert('Error', 'Could not open email client')
        )
    }

    const onSubmit = async (data) => {
        setSubmitting(true)
        try {
            // Submit ticket API call would go here
            console.log('Ticket data:', data)
            await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
            Alert.alert('Success', 'Support ticket submitted successfully')
            reset()
        } catch (error) {
            Alert.alert('Error', 'Failed to submit ticket. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.time}>9:41</Text>
                <Text style={styles.appTitle}>RK Electronics</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.helpTitle}>We are here to help.</Text>

                {/* Quick Action Buttons */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleCallManager}
                    >
                        <Icon name="person" size={24} color="#3498db" />
                        <Text style={styles.actionText}>Call Shop Manager</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleWhatsApp}
                    >
                        <IconFA name="whatsapp" size={24} color="#25D366" />
                        <Text style={styles.actionText}>Chat on WhatsApp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="help-outline" size={24} color="#9b59b6" />
                        <Text style={styles.actionText}>
                            FAQs & Help Articles
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleEmail}
                    >
                        <Icon name="email" size={24} color="#e74c3c" />
                        <Text style={styles.actionText}>Email Support</Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Contact Form</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Subject</Text>
                        <Controller
                            control={control}
                            name="subject"
                            rules={{ required: 'Subject is required' }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        errors.subject && styles.inputError,
                                    ]}
                                    placeholder="Enter subject"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.subject && (
                            <Text style={styles.errorText}>
                                {errors.subject.message}
                            </Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message</Text>
                        <Controller
                            control={control}
                            name="message"
                            rules={{
                                required: 'Message is required',
                                minLength: {
                                    value: 10,
                                    message: 'Message is too short',
                                },
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        errors.message && styles.inputError,
                                    ]}
                                    placeholder="Describe your issue..."
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                />
                            )}
                        />
                        {errors.message && (
                            <Text style={styles.errorText}>
                                {errors.message.message}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            submitting && styles.buttonDisabled,
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={submitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {submitting ? 'Submitting...' : 'Submit Ticket'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#2c3e50',
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
    },
    time: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    appTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    content: {
        padding: 20,
    },
    helpTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 25,
        textAlign: 'center',
    },
    quickActions: {
        marginBottom: 30,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    actionText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#2c3e50',
        flex: 1,
    },
    formContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 20,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#34495e',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 12,
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})

export default SupportScreen
