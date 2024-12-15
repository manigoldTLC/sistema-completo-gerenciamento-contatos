import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import UserList from './src/views/UserList';
import UserDetails from './src/views/UserDetails';
import UserForm from './src/views/UserForm';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="UserList">
                    <Stack.Screen
                        name="UserList"
                        component={UserList}
                        options={{
                            headerShown: true,
                            headerTitle: "Meus Contatos",
                            headerBackVisible: false,
                        }}
                    />
                    <Stack.Screen
                        name="UserForm"
                        component={UserForm}
                        options={{ title: 'Cadastrar Contato' }}
                    />
                    <Stack.Screen
                        name="UserDetails"
                        component={UserDetails}
                        options={{ title: 'Perfil' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
