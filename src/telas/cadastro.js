import React, { useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, Text, VStack, Radio, Alert } from 'native-base';

export default function Cadastro({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [mensagem, setMensagem] = useState('');

 

  const handleCadastro = async () => {
    try {
      const endPoint = 'https://localhost:8080/cadastro';
      console.log('Iniciando requisição para:', endPoint);
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomeCompleto: nomeCompleto,
          login: login,
          senha: senha,
          email: email,
          funcao: funcao,
        }),
      });
      console.log('Resposta recebida:', response);

      const responseText = await response.text();
      console.log('Texto da resposta:', responseText);
      let data;
      try {
        data = responseText.startsWith("{") || responseText.startsWith("[")
          ? JSON.parse(responseText)
          : responseText;
      } catch (jsonError) {
        console.error('Erro ao processar a resposta como JSON:', jsonError);
        throw new Error('Erro ao processar a resposta como JSON:' + jsonError);
      }

      console.log('Response status:', response.status);
      console.log('Response body:', responseText);

      if (response.ok) {
        const json = JSON.parse(responseText);

        const dados = {
          nomeCompleto: json.nomeCompleto,
          login: json.login,
          senha: json.senha,
          email: json.email,
          funcao: json.funcao,
        };

        setNomeCompleto(dados.nomeCompleto);
        setEmail(dados.email);
        setLogin(dados.login);
        setSenha(dados.senha);
        setFuncao(dados.funcao);

        Alert.alert("Sucesso", "Conta registrada com sucesso", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ], { cancelable: false });

      } else {
        throw new Error('Erro ao fazer o cadastro');
      }

    } catch (error) {
      console.error('Erro:', error);
      console.error('Erro durante a requisição:', error);

      setMensagem('Erro ao fazer o cadastro');
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