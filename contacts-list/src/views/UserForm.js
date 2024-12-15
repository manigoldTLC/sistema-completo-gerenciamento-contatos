import React from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInputMask } from "react-native-masked-text";
import { useDispatch } from "react-redux";
import { addUser, editUser } from "../redux/usersSlice";

const UserForm = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { user } = route.params || {};

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, "O nome deve ter pelo menos 3 caracteres")
            .required("O nome é obrigatório"),
        email: Yup.string()
            .email("Digite um e-mail válido")
            .required("O e-mail é obrigatório"),
        phone: Yup.string()
            .required("O telefone é obrigatório")
    });

    const handleSubmit = async (values) => {
        try {
            const cleanPhone = values.phone.replace(/\D/g, "");

            const userData = {
                name: values.name,
                email: values.email,
                phone: cleanPhone,
            };

            if (user) {
                await dispatch(editUser({ ...userData, id: user.id })).unwrap();
                Alert.alert("Sucesso", "Contato atualizado com sucesso!", [
                    { text: "OK", onPress: () => navigation.navigate("UserList") },
                ]);
            } else {
                await dispatch(addUser(userData)).unwrap();
                Alert.alert("Sucesso", "Contato criado com sucesso!", [
                    { text: "OK", onPress: () => navigation.navigate("UserList") },
                ]);
            }
        } catch (error) {
            console.log("Erro no envio:", error.response?.data || error.message);
            Alert.alert("Erro", `Erro ao salvar contato: ${error.response?.data?.message || error.message}`);
        }
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: user ? "Editar Contato" : "Novo Contato",
        });
    }, [navigation, user]);

    return (
        <Formik
            initialValues={{
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={[styles.input, touched.name && errors.name ? styles.errorInput : null]}
                        placeholder="Digite o nome"
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                    />
                    {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, touched.email && errors.email ? styles.errorInput : null]}
                        placeholder="Digite o e-mail"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        keyboardType="email-address"
                    />
                    {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    <Text style={styles.label}>Telefone</Text>
                    <TextInputMask
                        type={"cel-phone"}
                        options={{
                            maskType: "BRL",
                            withDDD: true,
                            dddMask: "(99) ",
                        }}
                        style={[styles.input, touched.phone && errors.phone ? styles.errorInput : null]}
                        placeholder="Digite o telefone"
                        onChangeText={(text) => setFieldValue("phone", text)}
                        onBlur={handleBlur("phone")}
                        value={values.phone}
                    />
                    {touched.phone && errors.phone && (
                        <Text style={styles.errorText}>{errors.phone}</Text>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 12,
        marginBottom: 8,
    },
    errorInput: {
        borderColor: "#ff6b6b",
    },
    errorText: {
        color: "#ff6b6b",
        fontSize: 12,
        marginBottom: 8,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default UserForm;
