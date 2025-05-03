import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
      <Text>Número do Contrato: {item.numeroContrato}</Text>
      <Text>Cidade: {item.cidade}</Text>
      <Text>Técnico: {item.tecnico}</Text>
      <Text>Supervisor: {item.supervisor}</Text>
      <Text>Data Limite: {item.dataFinal}</Text>
      <Text>Observação: {item.observacao}</Text>
      <Text>Status: {item.status ? 'Concluído' : 'Pendente'}</Text>
      {!item.status && ( // Exibe o botão apenas se o status for "Pendente"
        <Button title="Mudar Status" onPress={() => toggleStatus(index)} />
      )}
    </View>
  );

  const tarefasFiltradas = aplicarFiltros(ordenarTarefas(tarefas));

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontSize: 24 }}>Lista de Tarefas</Text>
        <Button
          title="Adicionar Tarefa"
          onPress={() => navigation.navigate('Tarefas')}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text>Filtros</Text>
        <Picker
          selectedValue={filtros.status}
          onValueChange={(value) => setFiltros({ ...filtros, status: value })}
        >
          <Picker.Item label="Todos" value="" />
          {opcoesFiltros.status.map((status, index) => (
            <Picker.Item key={index} label={status.charAt(0).toUpperCase() + status.slice(1)} value={status} />
          ))}
        </Picker>

        <Picker
          selectedValue={filtros.cidade}
          onValueChange={(value) => setFiltros({ ...filtros, cidade: value })}
        >
          <Picker.Item label="Todas" value="" />
          {opcoesFiltros.cidade.map((cidade, index) => (
            <Picker.Item key={index} label={cidade} value={cidade} />
          ))}
        </Picker>

        <Picker
          selectedValue={filtros.tecnico}
          onValueChange={(value) => setFiltros({ ...filtros, tecnico: value })}
        >
          <Picker.Item label="Todos" value="" />
          {opcoesFiltros.tecnico.map((tecnico, index) => (
            <Picker.Item key={index} label={tecnico} value={tecnico} />
          ))}
        </Picker>

        <Picker
          selectedValue={filtros.supervisor}
          onValueChange={(value) => setFiltros({ ...filtros, supervisor: value })}
        >
          <Picker.Item label="Todos" value="" />
          {opcoesFiltros.supervisor.map((supervisor, index) => (
            <Picker.Item key={index} label={supervisor} value={supervisor} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tarefasFiltradas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onRefresh={fetchTarefas} // Função de pull-to-refresh
          refreshing={loading} // Estado de carregamento
        />
      )}
    </View>
  );
}
