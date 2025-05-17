import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTarefa } from './contextApi';
import API_BASE_URL from '../telas/config';

export default function Tarefa({ navigation }) {
  const { adicionarTarefa } = useTarefa();
  const [numeroContrato, setNumeroContrato] = useState('');
  const [cidade, setCidade] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [observacao, setObservacao] = useState('');
  const [status, setStatus] = useState('pendente');
  const [tecnicos, setTecnicos] = useState([]);
  const [supervisores, setSupervisores] = useState([]);

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cadastros/tecnicos`);
        const data = await response.json();
        setTecnicos(data);
      } catch (error) {
        console.error('Erro ao buscar técnicos:', error);
      }
    };

    const fetchSupervisores = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cadastros/supervisores`);
        const data = await response.json();
        setSupervisores(data);
      } catch (error) {
        console.error('Erro ao buscar supervisores:', error);
      }
    };

    fetchTecnicos();
    fetchSupervisores();
  }, []);

  const handleAdicionarTarefa = async () => {
    if (!numeroContrato || !cidade || !tecnico || !supervisor || !dataLimite) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novaTarefa = {
      numeroContrato: parseInt(numeroContrato, 10),
      cidade,
      tecnico,
      supervisor,
      dataFinal: dataLimite,
      observacao,
      status: status === 'pendente' ? false : true,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tarefa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaTarefa),
      });

      if (response.ok) {
        adicionarTarefa(novaTarefa);
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('Erro ao adicionar tarefa:', errorData);
        Alert.alert('Erro', 'Erro ao adicionar tarefa.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      Alert.alert('Erro', 'Erro ao conectar com a API.');
    }
  };

  const formatarData = (data) => {
    const dataFormatada = data
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1');
    setDataLimite(dataFormatada);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Nova Tarefa</Text>

      <TextInput
        style={styles.input}
        placeholder="Número do Contrato"
        placeholderTextColor="#666"
        value={numeroContrato}
        onChangeText={setNumeroContrato}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Cidade"
        placeholderTextColor="#666"
        value={cidade}
        onChangeText={setCidade}
      />

      <Text style={styles.label}>Técnico</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tecnico}
          onValueChange={(itemValue) => setTecnico(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Selecione um técnico" value="" color="#999" />
          {tecnicos.map((tec, index) => (
            <Picker.Item
              key={index}
              label={tec.nomeCompleto}
              value={tec.nomeCompleto}
              color="#000"
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Supervisor</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={supervisor}
          onValueChange={(itemValue) => setSupervisor(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Selecione um supervisor" value="" color="#999" />
          {supervisores.map((sup, index) => (
            <Picker.Item
              key={index}
              label={sup.nomeCompleto}
              value={sup.nomeCompleto}
              color="#000"
            />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Data Limite (dd/mm/aaaa)"
        placeholderTextColor="#666"
        value={dataLimite}
        onChangeText={formatarData}
      />

      <TextInput
        style={styles.input}
        placeholder="Observação"
        placeholderTextColor="#666"
        value={observacao}
        onChangeText={setObservacao}
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Pendente" value="pendente" color="#000" />
          <Picker.Item label="Concluído" value="concluido" color="#000" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAdicionarTarefa}>
        <Text style={styles.buttonText}>Adicionar Tarefa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 48,
    color: '#000', // cor do texto selecionado
    paddingHorizontal: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
