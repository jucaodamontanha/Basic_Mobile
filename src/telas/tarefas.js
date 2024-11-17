import React, { useState } from 'react';
import { NativeBaseProvider, Box, Button, Text, VStack, Input, Select } from 'native-base';
import { useTarefa } from './contextApi'; // Ajuste o caminho conforme necessário

const tecnicos = [
  { id: '1', nome: 'Técnico 1' },
  { id: '2', nome: 'Técnico 2' },
  { id: '3', nome: 'Técnico 3' },
];

export default function Tarefa({ navigation }) {
  const { adicionarTarefa } = useTarefa();
  const [numeroContrato, setNumeroContrato] = useState('');
  const [cidade, setCidade] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [dataLimite, setDataLimite] = useState('');
  const [observacao, setObservacao] = useState('');
  const [status, setStatus] = useState('pendente');

  const handleAdicionarTarefa = () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
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

    adicionarTarefa(novaTarefa); // Adiciona a nova tarefa ao contexto
    navigation.goBack(); // Volta para a lista de tarefas
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