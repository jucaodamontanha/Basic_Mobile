import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Button, Text, VStack, Input, Select } from 'native-base';
import { useTarefa } from './contextApi'; // Ajuste o caminho conforme necessário
import API_BASE_URL from '../telas/config'; // Importa o endereço base da API

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
  const [supervisores, setSupervisores] = useState([]); // Novo estado para supervisores

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

    const fetchSupervisores = async () => { // Função para buscar supervisores
      try {
        const response = await fetch(`${API_BASE_URL}/cadastros/supervisores`);
        const data = await response.json();
        setSupervisores(data);
      } catch (error) {
        console.error('Erro ao buscar supervisores:', error);
      }
    };

    fetchTecnicos();
    fetchSupervisores(); // Chama a função para buscar supervisores
  }, []);

  const handleAdicionarTarefa = async () => {
    if (!numeroContrato || !cidade || !tecnico || !supervisor || !dataLimite) {
      alert('Por favor, preencha todos os campos obrigatórios.');
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
        alert('Erro ao adicionar tarefa.');
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Erro ao conectar com a API.');
    }
  };

  const formatarData = (data) => {
    const dataFormatada = data.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1');
    setDataLimite(dataFormatada);
  };

  return (
    <NativeBaseProvider>
      <Box safeArea p="2" py="8" w="90%" mx="auto">
        <Text fontSize="2xl" mb="4">Adicionar Nova Tarefa</Text>
        <VStack space={4}>
          <Input 
            placeholder="Número do Contrato" 
            value={numeroContrato} 
            onChangeText={setNumeroContrato} 
            isRequired 
          />
          <Input 
            placeholder="Cidade" 
            value={cidade} 
            onChangeText={setCidade} 
            isRequired 
          />
          <Select 
            selectedValue={tecnico} 
            minWidth="200" 
            placeholder="Técnico" 
            onValueChange={setTecnico}
            isRequired
          >
            {Array.isArray(tecnicos) && tecnicos.map((tec, index) => (
              <Select.Item key={index} label={tec.nomeCompleto} value={tec.nomeCompleto} />
            ))}
          </Select>
          <Select 
            selectedValue={supervisor} 
            minWidth="200" 
            placeholder="Supervisor" 
            onValueChange={setSupervisor}
            isRequired
          >
            {Array.isArray(supervisores) && supervisores.map((sup, index) => (
              <Select.Item key={index} label={sup.nomeCompleto} value={sup.nomeCompleto} />
            ))}
          </Select>
          <Input 
            placeholder="Data Limite" 
            value={dataLimite} 
            onChangeText={formatarData} 
            isRequired 
          />
          <Input 
            placeholder="Observação" 
            value={observacao} 
            onChangeText={setObservacao} 
          />
          <Select 
            selectedValue={status} 
            minWidth="200" 
            placeholder="Status" 
            onValueChange={setStatus}
          >
            <Select.Item label="Pendente" value="pendente" />
            <Select.Item label="Concluído" value="concluido" />
          </Select>
          <Button onPress={handleAdicionarTarefa} colorScheme="blue">Adicionar Tarefa</Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}