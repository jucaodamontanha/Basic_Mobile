import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { fetchCadastro } from '../telas/api'; // Ajuste o caminho conforme necessário


export default function Cadastro({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleCadastro = async () => {
    try {
      const dados = await fetchCadastro({ nomeCompleto, login, senha, email, funcao, navigation });
      setNomeCompleto(dados.nomeCompleto);
      setEmail(dados.email);
      setLogin(dados.login);
      setSenha(dados.senha);
      setFuncao(dados.funcao);
      setMensagem('Conta registrada com sucesso');
    } catch (error) {
      setMensagem('Erro ao fazer o cadastro');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
      />
      <TextInput
        style={styles.input}
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text>Função:</Text>
      <View style={styles.radioContainer}>
        <RadioButton
          value="tecnico"
          status={funcao === 'tecnico' ? 'checked' : 'unchecked'}
          onPress={() => setFuncao('tecnico')}
        />
        <Text>Técnico</Text>
        <RadioButton
          value="supervisor"
          status={funcao === 'supervisor' ? 'checked' : 'unchecked'}
          onPress={() => setFuncao('supervisor')}
        />
        <Text>Supervisor</Text>
      </View>
      <Button title="Cadastrar" onPress={handleCadastro} />
      {mensagem ? (
        <Text style={[styles.message, mensagem.includes('sucesso') ? styles.success : styles.error]}>
          {mensagem}
        </Text>
      ) : null}
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  
});


