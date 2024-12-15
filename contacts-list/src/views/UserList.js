import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/usersSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserList = ({ navigation }) => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);

    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);


    useEffect(() => {
        const filtered = users.filter(user =>
            user.name?.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchText, users]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Erro ao carregar contatos: {error}</Text>
            </View>
        );
    }

    if (!users.length) {
        return (
            <View style={styles.container}>
                <Text>Nenhum contato adicionado.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBarContainer}>
                <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Buscar contatos..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#888"
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => navigation.navigate("UserDetails", { user: item })}
                    >
                        <Icon name="account-circle" size={40} color="#c4c4c4" style={styles.userIcon} />
                        <Text style={styles.userName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>Nenhum contato encontrado.</Text>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('UserForm')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 16,
        paddingTop: 25,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 40,
        borderColor: '#DDD',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 5,
    },
    searchBar: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007BFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userIcon: {
        marginRight: 10,
    },
});

export default UserList;
