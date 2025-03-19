import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, Text, VStack } from 'native-base';
import { Alert } from 'react-native';
import API_BASE_URL from '../telas/config'; // Importa o endereço base da API


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async () => {
    if (email === 'root' && senha === 'root') {
      navigation.navigate('Cadastro'); // Redireciona para a tela de cadastro
      return;
    }

    if (email && senha) {
      try {
        const response = await fetch(`${API_BASE_URL}/login`, { // Substitua pela URL correta da sua API
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            const data = await response.json();
            if (data.success) {
              navigation.navigate('Dashboard'); // Redireciona para o Dashboard
            } else {
              setMensagem(data.message || 'Login inválido');
              Alert.alert('Erro', data.message || 'Login inválido');
            }
          } else {
            setMensagem('Resposta inesperada do servidor');
            Alert.alert('Erro', 'Resposta inesperada do servidor');
          }
        
        } else {
          const errorData = await response.json();
          setMensagem(errorData.message || 'Erro ao realizar login');
          Alert.alert('Erro', errorData.message || 'Erro ao realizar login');
        }
      } catch (error) {
        console.log('Erro ao conectar com a API', error);
        setMensagem('Erro ao conectar com a API');
        Alert.alert('Erro', 'Erro ao conectar com a API');
      }
    } else {
      setMensagem('Por favor, preencha todos os campos');
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
    }
  };

  return (
    <NativeBaseProvider>
      <Box 
        safeArea 
        flex={1} 
        justifyContent="center" 
        alignItems="center" 
        p="2" 
        w="90%" 
        mx="auto"
      >
        <Text fontSize="2xl" mb="4">Faça seu Login</Text>
        <VStack space={4} w="100%">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            placeholder="Senha"
            type="password"
            value={senha}
            onChangeText={setSenha}
          />
          <Button onPress={handleLogin}>Entrar</Button>
          {mensagem ? (
            <Text mt={4} color={mensagem.includes('sucesso') ? 'green.500' : 'red.500'}>
              {mensagem}
            </Text>
          ) : null}
          <Text 
            onPress={() => console.log('Redirecionar para recuperação de senha')} 
            color="blue.500"
            textAlign="center"
          >
            Esqueceu a senha?
          </Text>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}