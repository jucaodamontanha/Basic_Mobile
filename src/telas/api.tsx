import axios from 'axios';
import { Alert } from 'react-native';
import API_BASE_URL from '../telas/config'; // Importa o endereço base da API

const api = axios.create({
  baseURL: API_BASE_URL, // Usa o endereço centralizado
});

export async function fetchCadastro({ nomeCompleto, login, senha, email, funcao, navigation }) {
  console.log('Entrou na função fetchCadastro');
  console.log('Dados enviados:', { nomeCompleto, login, senha, email, funcao });
  try {
    const response = await api.post('/cadastro', {
      nomeCompleto,
      login,
      senha,
      email,
      funcao,
    });
    console.log('Requisição enviada para /cadastro');
    console.log('Resposta recebida:', response);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    if (response.status === 200 || response.status === 201) {
      const dados = response.data;

      Alert.alert("Sucesso", "Conta registrada com sucesso", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ], { cancelable: false });

      return { nomeCompleto, email, login, senha, funcao };
    } else {
      throw new Error('Erro ao fazer o cadastro');
    }

  } catch (error) {
    console.error('Erro durante a requisição:', error);
    Alert.alert("Erro", "Erro ao conectar com a API");
    throw error;
  }
}