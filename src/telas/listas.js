import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Text,
  ActivityIndicator,
  Modal,
  Portal
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../telas/config';

export default function Listas() {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tarefas`);
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
    const cidades = [...new Set(tarefas.map(t => t.cidade))];
    const tecnicos = [...new Set(tarefas.map(t => t.tecnico))];
    const supervisores = [...new Set(tarefas.map(t => t.supervisor))];
    setOpcoesFiltros(prev => ({
      ...prev,
      cidade: cidades,
      tecnico: tecnicos,
      supervisor: supervisores
    }));
  };

  const toggleStatus = async (index) => {
    const tarefa = tarefas[index];
    const novoStatus = !tarefa.status;

    try {
      const response = await fetch(`${API_BASE_URL}/tarefas/${tarefa.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoStatus),
      });

      if (response.ok) {
        fetchTarefas();
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

  const getBorderColor = (item) => {
    const hoje = new Date();
    const dataFinal = new Date(item.dataFinal);
    if (item.status) return 'green';
    if (!item.status && dataFinal >= hoje) return 'orange';
    return 'red';
  };

  const renderItem = ({ item, index }) => (
    <Card
      style={[
        styles.card,
        { borderLeftWidth: 6, borderLeftColor: getBorderColor(item) }
      ]}
      mode="outlined"
    >
      <Card.Content>
        <Text style={styles.cardText}>Número do Contrato: {item.numeroContrato}</Text>
        <Text style={styles.cardText}>Cidade: {item.cidade}</Text>
        <Text style={styles.cardText}>Técnico: {item.tecnico}</Text>
        <Text style={styles.cardText}>Supervisor: {item.supervisor}</Text>
        <Text style={styles.cardText}>Data Limite: {item.dataFinal}</Text>
        <Text style={styles.cardText}>Observação: {item.observacao}</Text>
        <Text style={styles.cardText}>Status: {item.status ? 'Concluído' : 'Pendente'}</Text>
        {!item.status && (
          <Button
            mode="contained"
            onPress={() => toggleStatus(index)}
            style={{ marginTop: 10 }}
          >
            Mudar Status
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  const tarefasFiltradas = aplicarFiltros(ordenarTarefas(tarefas));

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={tarefasFiltradas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            onRefresh={fetchTarefas}
            refreshing={loading}
            contentContainerStyle={styles.container}
            ListHeaderComponent={
              <>
                <View style={styles.header}>
                  <Title style={styles.titulo}>Lista de Tarefas</Title>
                  <View style={styles.buttonsRow}>
                    <Button mode="contained" icon="filter" onPress={() => setModalVisible(true)}>
                      Filtros
                    </Button>
                    <Button mode="contained" icon="plus" onPress={() => navigation.navigate('Tarefas')}>
                      Nova Tarefa
                    </Button>
                  </View>
                </View>
              </>
            }
          />

          {/* Modal de Filtros */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <Card>
                <Card.Title title="Filtrar Tarefas" />
                <Card.Content>
                  {['status', 'cidade', 'tecnico', 'supervisor'].map((campo, i) => (
                    <View key={i} style={styles.pickerContainer}>
                      <Text style={styles.label}>
                        {campo.charAt(0).toUpperCase() + campo.slice(1)}:
                      </Text>
                      <Picker
                        selectedValue={filtros[campo]}
                        onValueChange={(value) => setFiltros({ ...filtros, [campo]: value })}
                        style={styles.picker}
                        dropdownIconColor="#000"
                      >
                        <Picker.Item label="Todos" value="" />
                        {opcoesFiltros[campo].map((op, index) => (
                          <Picker.Item key={index} label={String(op)} value={op} />
                        ))}
                      </Picker>
                    </View>
                  ))}
                  <Button mode="contained" onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                    Aplicar Filtros
                  </Button>
                </Card.Content>
              </Card>
            </Modal>
          </Portal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  cardText: {
    color: '#000',
  },
  pickerContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  picker: {
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});
