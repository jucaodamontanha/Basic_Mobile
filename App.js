import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { TarefaProvider } from './src/telas/contextApi';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import Login from './src/telas/login';
import Cadastro from './src/telas/cadastro';
import Listas from './src/telas/listas';
import Tarefas from './src/telas/tarefas';
import Dashboard from './src/telas/Dashboard';
import OrdemServico from './src/telas/OrdemServico';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Atualização disponível',
            'O app será reiniciado para aplicar as correções.',
            [{ text: 'OK', onPress: () => Updates.reloadAsync() }]
          );
        }
      } catch (e) {
        console.log('Erro ao verificar atualizações:', e);
      }
    }

    checkForUpdates();
  }, []);

  return (
    <PaperProvider>
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
    </PaperProvider>
  );
}
