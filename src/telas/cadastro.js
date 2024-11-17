import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, Text, VStack, Radio } from 'native-base';

export default function Cadastro({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('tecnico');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = () => {
    // Aqui você pode adicionar a lógica para registrar o usuário
    if (nomeCompleto && login && senha && email) {
      // Simulação de cadastro bem-sucedido
      setMensagem('Cadastro realizado com sucesso!');
    } else {
      setMensagem('Por favor, preencha todos os campos.');
    }
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} alignItems="center" justifyContent="center" p={4}>
        <VStack space={4} w="100%">
          <Text fontSize="2xl" mb={4}>Cadastro</Text>
          <Input
            placeholder="Nome Completo"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            variant="filled"
            size="lg"
          />
          <Input
            placeholder="Login"
            value={login}
            onChangeText={setLogin}
            variant="filled"
            size="lg"
          />
          <Input
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            type="password"
            variant="filled"
            size="lg"
          />
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            variant="filled"
            size="lg"
          />
          <Text>Função:</Text>
          <Radio.Group
            name="funcao"
            value={funcao}
            onChange={setFuncao}
            accessibilityLabel="Escolha sua função"
          >
            <Radio value="tecnico" my={1}>
              Técnico
            </Radio>
            <Radio value="supervisor" my={1}>
              Supervisor
            </Radio>
          </Radio.Group>
          <Button onPress={handleCadastro} colorScheme="blue">
            Cadastrar
          </Button>
          {mensagem ? (
            <Text mt={4} color={mensagem.includes('sucesso') ? 'green.500' : 'red.500'}>
              {mensagem}
            </Text>
          ) : null}
          <Button variant="link" onPress={() => navigation.goBack()}>
            Voltar
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}