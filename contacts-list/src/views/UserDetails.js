import React from "react";
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../redux/usersSlice";

const UserDetails = ({ route, navigation }) => {
    const { user } = route.params;
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.users);

    const handleDelete = () => {
        Alert.alert(
            "Confirmação",
            "Tem certeza que deseja apagar este contato?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Apagar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await dispatch(deleteUser(user.id));
                            Alert.alert("Sucesso", "Contato apagado com sucesso!", [
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate("UserList"),
                                },
                            ]);
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível apagar o contato.");
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const formatPhone = (phone) => {
        if (!phone) return "";
        const cleaned = phone.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user.name}</Text>

            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{user.email}</Text>

            <Text style={styles.label}>Telefone</Text>
            <Text style={styles.value}>{formatPhone(user.phone)}</Text>

            <View style={styles.buttonsContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed ? styles.buttonPressed : null,
                    ]}
                    onPress={() => navigation.navigate("UserForm", { user })}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        styles.deleteButton,
                        pressed ? styles.buttonPressed : null,
                    ]}
                    onPress={handleDelete}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Apagar</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    value: {
        fontSize: 14,
        color: "#333",
        marginBottom: 16,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        gap: 16,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#007BFF",
    },
    deleteButton: {
        backgroundColor: "#FF6B6B",
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default UserDetails;
