import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Box, Button, Text, VStack, Input, Select } from 'native-base';
import { useTarefa } from './contextApi'; // Ajuste o caminho conforme necessário

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

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await fetch('http://localhost:8080//tecnicos');
        const data = await response.json();
        setTecnicos(data);
      } catch (error) {
        console.error('Erro ao buscar técnicos:', error);
      }
    };

    fetchTecnicos();
  }, []);

  const handleAdicionarTarefa = async () => {
    if (!numeroContrato || !cidade || !tecnico || !supervisor || !dataLimite) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novaTarefa = {
      numeroContrato,
      cidade,
      tecnico,
      supervisor,
      dataLimite,
      observacao,
      status,
    };

    try {
      const response = await fetch('http://localhost:8080/tarefa', {
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
        alert('Erro ao adicionar tarefa.');
      }
    } catch (error) {
      alert('Erro ao conectar com a API.');
    }
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
            {tecnicos.map((tec) => (
              <Select.Item key={tec.id} label={tec.nome} value={tec.id} />
            ))}
          </Select>
          <Input 
            placeholder="Supervisor" 
            value={supervisor} 
            onChangeText={setSupervisor} 
            isRequired 
          />
          <Input 
            placeholder="Data Limite" 
            value={dataLimite} 
            onChangeText={setDataLimite} 
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