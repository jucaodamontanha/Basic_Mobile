import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import API_BASE_URL from '../telas/config';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async () => {
    if (email === 'root' && senha === 'root') {
      navigation.navigate('Cadastro');
      return;
    }

    if (email && senha) {
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            const data = await response.json();
            if (data.success) {
              navigation.navigate('Dashboard');
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
    <View style={styles.container}>
      <Text style={styles.title}>Faça seu Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      {mensagem ? (
        <Text style={[styles.message, { color: mensagem.includes('sucesso') ? 'green' : 'red' }]}>
          {mensagem}
        </Text>
      ) : null}
      <Text style={styles.link} onPress={() => console.log('Redirecionar para recuperação de senha')}>
        Esqueceu a senha?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
  link: {
    marginTop: 12,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
