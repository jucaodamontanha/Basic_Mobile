import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Button, Text, FlatList, Icon, Select, VStack, Spinner, Accordion, HStack } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../telas/config'; // Importa o endereço base da API


export default function Listas() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    status: '',
    cidade: '',
    tecnico: '',
    supervisor: ''
  });
  const [opcoesFiltros, setOpcoesFiltros] = useState({
    status: ['pendente', 'concluido'],
    cidade: [],
    tecnico: [],
    supervisor: []
  });
  const navigation = useNavigation();

  const fetchTarefas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tarefas`); // Usa o endereço centralizado
      const data = await response.json();
      setTarefas(data);
      atualizarOpcoesFiltros(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarOpcoesFiltros = (tarefas) => {
    const cidades = [...new Set(tarefas.map(tarefa => tarefa.cidade))];
    const tecnicos = [...new Set(tarefas.map(tarefa => tarefa.tecnico))];
    const supervisores = [...new Set(tarefas.map(tarefa => tarefa.supervisor))];
    setOpcoesFiltros({
      ...opcoesFiltros,
      cidade: cidades,
      tecnico: tecnicos,
      supervisor: supervisores
    });
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const toggleStatus = async (index) => {
    const novaLista = [...tarefas];
    const tarefa = novaLista[index];
    const novoStatus = !tarefa.status; // Inverte o status atual

    console.log('Atualizando status da tarefa:', tarefa); // Adicione este log

    try {
      const response = await fetch(`${API_BASE_URL}/tarefas/${tarefa.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoStatus),
      });

      if (response.ok) {
        await fetchTarefas(); // Atualiza a lista de tarefas no estado
      } else {
        console.error('Erro ao atualizar status da tarefa');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API', error);
    }
  };

  const ordenarTarefas = (tarefas) => {
    return tarefas.sort((a, b) => {
      if (a.status === b.status) {
        return new Date(a.dataFinal) - new Date(b.dataFinal);
      }
      return a.status ? 1 : -1;
    });
  };

  const aplicarFiltros = (tarefas) => {
    return tarefas.filter(tarefa => {
      return (
        (filtros.status ? tarefa.status === (filtros.status === 'concluido') : true) &&
        (filtros.cidade ? tarefa.cidade === filtros.cidade : true) &&
        (filtros.tecnico ? tarefa.tecnico === filtros.tecnico : true) &&
        (filtros.supervisor ? tarefa.supervisor === filtros.supervisor : true)
      );
    });
  };

  const renderItem = ({ item, index }) => (
    <Box borderWidth={1} borderColor="gray.300" p={4} borderRadius="md" mb={2}>
      <Text>Número do Contrato: {item.numeroContrato}</Text>
      <Text>Cidade: {item.cidade}</Text>
      <Text>Técnico: {item.tecnico}</Text>
      <Text>Supervisor: {item.supervisor}</Text>
      <Text>Data Limite: {item.dataFinal}</Text>
      <Text>Observação: {item.observacao}</Text>
      <Text>Status: {item.status ? 'Concluído' : 'Pendente'}</Text>
      {!item.status && ( // Exibe o botão apenas se o status for "Pendente"
        <Button onPress={() => toggleStatus(index)} mt={2}>
          Mudar Status
        </Button>
      )}
    </Box>
  );

  const tarefasFiltradas = aplicarFiltros(ordenarTarefas(tarefas));

  return (
    <NativeBaseProvider>
      <Box safeArea p="2" py="8" w="90%" mx="auto">
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="2xl">Lista de Tarefas</Text>
          <Button
            onPress={() => navigation.navigate('Tarefas')}
            size="sm"
            colorScheme="teal"
            borderRadius="full"
            leftIcon={<Icon as={AntDesign} name="plus" size="sm" />}
          />
        </HStack>
        <Accordion allowMultiple>
          <Accordion.Item>
            <Accordion.Summary _expanded={{ backgroundColor: "gray.200" }}>
              <Text>Filtros</Text>
              <Accordion.Icon />
            </Accordion.Summary>
            <Accordion.Details>
              <VStack space={4} mb={4}>
                <Select
                  selectedValue={filtros.status}
                  minWidth="200"
                  placeholder="Status"
                  onValueChange={(value) => setFiltros({ ...filtros, status: value })}
                >
                  <Select.Item label="Todos" value="" />
                  {opcoesFiltros.status.map((status, index) => (
                    <Select.Item key={index} label={status.charAt(0).toUpperCase() + status.slice(1)} value={status} />
                  ))}
                </Select>
                <Select
                  selectedValue={filtros.cidade}
                  minWidth="200"
                  placeholder="Cidade"
                  onValueChange={(value) => setFiltros({ ...filtros, cidade: value })}
                >
                  <Select.Item label="Todas" value="" />
                  {opcoesFiltros.cidade.map((cidade, index) => (
                    <Select.Item key={index} label={cidade} value={cidade} />
                  ))}
                </Select>
                <Select
                  selectedValue={filtros.tecnico}
                  minWidth="200"
                  placeholder="Técnico"
                  onValueChange={(value) => setFiltros({ ...filtros, tecnico: value })}
                >
                  <Select.Item label="Todos" value="" />
                  {opcoesFiltros.tecnico.map((tecnico, index) => (
                    <Select.Item key={index} label={tecnico} value={tecnico} />
                  ))}
                </Select>
                <Select
                  selectedValue={filtros.supervisor}
                  minWidth="200"
                  placeholder="Supervisor"
                  onValueChange={(value) => setFiltros({ ...filtros, supervisor: value })}
                >
                  <Select.Item label="Todos" value="" />
                  {opcoesFiltros.supervisor.map((supervisor, index) => (
                    <Select.Item key={index} label={supervisor} value={supervisor} />
                  ))}
                </Select>
              </VStack>
            </Accordion.Details>
          </Accordion.Item>
        </Accordion>
        {loading ? (
          <Spinner />
        ) : (
          <FlatList
            data={tarefasFiltradas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            onRefresh={fetchTarefas} // Função de pull-to-refresh
            refreshing={loading} // Estado de carregamento
          />
        )}
      </Box>
    </NativeBaseProvider>
  );
}