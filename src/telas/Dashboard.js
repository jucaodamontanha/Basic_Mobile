import React from 'react';
import { NativeBaseProvider, Box, Button, VStack, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <NativeBaseProvider>
      <Box safeArea flex={1} justifyContent="center" alignItems="center" p="4">
        <Text fontSize="2xl" mb="6">Bem-vindo ao Dashboard</Text>
        <VStack space={4} w="80%">
          <Button
            colorScheme="blue"
            onPress={() => navigation.navigate('Tarefas')} // Navega para a tela de criar tarefa
          >
            Criar Tarefa
          </Button>
          <Button
            colorScheme="green"
            onPress={() => navigation.navigate('Listas')} // Navega para a tela de lista de tarefas
          >
            Lista de Tarefas
          </Button>
          <Button
            colorScheme="gray"
            onPress={() => navigation.navigate('OrdemServico')} // Navega para a tela de criar tarefa
          >
            Gerar Ordem de Serviço
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}