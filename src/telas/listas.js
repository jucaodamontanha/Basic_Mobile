import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Button, Text, FlatList, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Listas() {
  const [tarefas, setTarefas] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await fetch('http://localhost:8080/tarefas/lista');
        const data = await response.json();
        setTarefas(data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };

    fetchTarefas();
  }, []);

  const toggleStatus = async (index) => {
    const novaLista = [...tarefas];
    const tarefa = novaLista[index];
    tarefa.status = tarefa.status === 'pendente' ? 'concluido' : 'pendente';

    try {
      const response = await fetch(`http://localhost:8080/tarefas/${tarefa.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefa),
      });

      if (response.ok) {
        setTarefas(novaLista);
      } else {
        console.error('Erro ao atualizar status da tarefa');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API');
    }
  };

  const renderItem = ({ item, index }) => (
    <Box borderWidth={1} borderColor="gray.300" p={4} borderRadius="md" mb={2}>
      <Text>Número do Contrato: {item.numeroContrato}</Text>
      <Text>Cidade: {item.cidade}</Text>
      <Text>Técnico: {item.tecnico}</Text>
      <Text>Supervisor: {item.supervisor}</Text>
      <Text>Data Limite: {item.dataLimite}</Text>
      <Text>Observação: {item.observacao}</Text>
      <Text>Status: {item.status}</Text>
      <Button onPress={() => toggleStatus(index)} mt={2}>
        Mudar Status
      </Button>
    </Box>
  );

  return (
    <NativeBaseProvider>
      <Box safeArea p="2" py="8" w="90%" mx="auto">
        <Text fontSize="2xl" mb="4">Lista de Tarefas</Text>
        <FlatList
          data={tarefas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
        <Button
          onPress={() => navigation.navigate('Tarefas')}
          position="absolute"
          bottom={4} // Distância da parte inferior
          right={4}  // Distância da parte direita
          size="lg"
          colorScheme="teal"
          borderRadius="full"
          leftIcon={<Icon as={AntDesign} name="plus" size="sm" />}
        >
          Adicionar Tarefa
        </Button>
      </Box>
    </NativeBaseProvider>
  );
}