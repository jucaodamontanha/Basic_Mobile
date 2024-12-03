import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, Text, VStack } from 'native-base';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (email === 'root' && senha === 'root') {
      navigation.navigate('Cadastro'); // Redireciona para a tela de cadastro
      return;
    }

    if (email && senha) {
      try {
        const response = await fetch('URL_DA_SUA_API', {
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
          const data = await response.json();
          if (data.success) {
            navigation.navigate('Listas'); // Redireciona para a tela de listas
          } else {
            console.log('Login inválido');
          }
        } else {
          console.log('Erro ao realizar login');
        }
      } catch (error) {
        console.log('Erro ao conectar com a API');
      }
    } else {
      console.log('Por favor, preencha todos os campos');
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