import React, { useEffect } from 'react';
import { TarefaProvider } from './src/telas/contextApi';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/telas/login';
import Cadastro from './src/telas/cadastro';
import Listas from './src/telas/listas';
import Tarefas from './src/telas/tarefas';
import Dashboard from './src/telas/Dashboard';
import OrdemServico from './src/telas/OrdemServico';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
  
  }, []);

  return (
    <TarefaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="OrdemServico" component={OrdemServico} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Listas" component={Listas} />
          <Stack.Screen name="Tarefas" component={Tarefas} />
        </Stack.Navigator>
      </NavigationContainer>
    </TarefaProvider>
  );
}
