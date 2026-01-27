import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { icons, COLORS } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';

// Sample data for a user with multiple connections
const userConnections = [
    { id: '1', name: 'Home WiFi', location: '123 Main St', isPrimary: true },
    { id: '2', name: 'Office', location: '456 Business Blvd', isPrimary: false },
    { id: '3', name: 'Vacation Home', location: '789 Lake Rd', isPrimary: false },
];

const ConnectionsScreen = ({ navigation, route }) => {
    const { dark } = useTheme();
    const [connections, setConnections] = useState(userConnections);

    // This function will be called when a user selects a new primary connection
    const handleSelectConnection = (selectedId) => {
        const updatedConnections = connections.map(conn => ({
            ...conn,
            isPrimary: conn.id === selectedId,
        }));
        setConnections(updatedConnections);

        // Call the callback function from the Home screen to update its state
        const selectedConnection = updatedConnections.find(conn => conn.id === selectedId);
        route.params.onConnectionSelected(selectedConnection.name);

        // Navigate back to the Home screen
        navigation.goBack();
    };

    const renderConnectionItem = (item) => (
        <TouchableOpacity 
            style={[styles.connectionItem, {
                backgroundColor: dark ? '#1C1C1E' : '#FFFFFF',
                borderColor: item.isPrimary ? COLORS.primary : (dark ? '#333' : '#E0E0E0'),
            }]}
            onPress={() => handleSelectConnection(item.id)}
            disabled={item.isPrimary}
        >
            <View style={styles.connectionInfo}>
                <Icon
                    name={item.isPrimary ? "wifi" : "wifi-outline"}
                    size={24}
                    color={item.isPrimary ? COLORS.primary : (dark ? COLORS.white : COLORS.greyscale700)}
                    style={styles.icon}
                />
                <View>
                    <Text style={[styles.connectionName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                        {item.name}
                    </Text>
                    <Text style={[styles.connectionLocation, { color: dark ? COLORS.greyscale700 : COLORS.greyscale700 }]}>
                        {item.location}
                    </Text>
                </View>
            </View>
            
            <View style={styles.statusContainer}>
                {item.isPrimary ? (
                    <Text style={styles.primaryText}>Current</Text>
                ) : (
                    <TouchableOpacity style={styles.selectButton} onPress={() => handleSelectConnection(item.id)}>
                        <Text style={styles.selectButtonText}>Select</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.greyscale100 }]}>
            <View style={[styles.header, { borderBottomColor: dark ? '#333' : '#E0E0E0' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={dark ? COLORS.white : COLORS.black} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.black }]}>
                    Manage Connections
                </Text>
            </View>
            
            <View style={styles.listContainer}>
                {connections.map(renderConnectionItem)}
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    connectionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    connectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 15,
    },
    connectionName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    connectionLocation: {
        fontSize: 12,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    primaryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    selectButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    selectButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default ConnectionsScreen;