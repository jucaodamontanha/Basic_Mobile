import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>Bem-vindo ao Dashboard</Text>
      <View style={{ width: '80%', gap: 16 }}>
        <Button title="Criar Tarefa" onPress={() => navigation.navigate('Tarefas')} />
        <Button title="Lista de Tarefas" onPress={() => navigation.navigate('Listas')} />
        <Button title="Gerar Ordem de Serviço" onPress={() => navigation.navigate('OrdemServico')} />
      </View>
    </View>
  );
}
