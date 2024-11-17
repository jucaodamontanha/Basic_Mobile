import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, Text, VStack } from 'native-base';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    if (email === 'root' && senha === 'root') {
      navigation.navigate('Cadastro'); // Redireciona para a tela de cadastro
    } else if (email && senha) {
      navigation.navigate('Listas'); // Redireciona para a tela de listas
    } else {
      console.log('Login inválido');
    }
  };

  return (
    <NativeBaseProvider>
      <Box 
        safeArea 
        flex={1} // Permite que o Box ocupe toda a altura da tela
        justifyContent="center" // Centraliza verticalmente
        alignItems="center" // Centraliza horizontalmente
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
            textAlign="center" // Centraliza o texto
          >
            Esqueceu a senha?
          </Text>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}