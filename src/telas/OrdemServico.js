import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import API_BASE_URL from './config';

export default function OrdemServico({ navigation }) {
  const [supervisor, setSupervisor] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState('');
  const [assinatura, setAssinatura] = useState(null);
  const [assinaturaSalva, setAssinaturaSalva] = useState(false);
  const [assinaturaEditando, setAssinaturaEditando] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [fotos, setFotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nomeCliente, setNomeCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [nomeAtendente, setNomeAtendente] = useState('');
  const [observacao, setObservacao] = useState('');

  const signatureRef = useRef(null);

  const handleSignature = (signature) => {
    setAssinatura(signature);
    setAssinaturaSalva(true);
    setAssinaturaEditando(false);
    setScrollEnabled(true);
    Alert.alert('Assinatura salva com sucesso!');
  };

  const handleClearSignature = () => {
    signatureRef.current.clearSignature();
    setAssinatura(null);
    setAssinaturaSalva(false);
    setAssinaturaEditando(true);
  };

  const handleAdicionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      setFotos((prev) => [...prev, resized.uri]);
    }
  };

  const handleSubmit = async () => {
    if (
      !nomeCliente ||
      !endereco ||
      !numero ||
      !cidade ||
      !numeroContrato ||
      !emailCliente ||
      !nomeAtendente ||
      !supervisor ||
      !tipoAtendimento
    ) {
      Alert.alert('Preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    let tamanhoTotal = 0;

    if (assinatura) {
      const assinaturaSize = new Blob([assinatura]).size;
      tamanhoTotal += assinaturaSize;
    }

    for (const fotoUri of fotos) {
      const response = await fetch(fotoUri);
      const blob = await response.blob();
      tamanhoTotal += blob.size;
    }

    const limiteMB = 10;
    if (tamanhoTotal > limiteMB * 1024 * 1024) {
      Alert.alert(`O tamanho total dos arquivos excede o limite de ${limiteMB} MB.`);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(
      'dados',
      JSON.stringify({
        nomeCliente,
        endereco,
        numero,
        cidade,
        numeroContrato,
        emailCliente,
        nomeAtendente,
        supervisor,
        tipoAtendimento,
        observacao,
        assinatura,
      })
    );

    fotos.forEach((fotoUri, index) => {
      formData.append('fotos', {
        uri: fotoUri,
        name: `foto_${index + 1}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/os`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        Alert.alert('Ordem de serviço criada com sucesso!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Erro ao criar ordem de serviço.');
      }
    } catch (error) {
      Alert.alert('Erro ao enviar ordem de serviço.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} scrollEnabled={scrollEnabled}>
      <Text style={styles.title}>Criar Ordem de Serviço</Text>

      <TextInput placeholder="Nome do Cliente" style={styles.input} value={nomeCliente} onChangeText={setNomeCliente} />
      <TextInput placeholder="Endereço" style={styles.input} value={endereco} onChangeText={setEndereco} />
      <TextInput placeholder="Número" style={styles.input} value={numero} onChangeText={setNumero} />
      <TextInput placeholder="Cidade" style={styles.input} value={cidade} onChangeText={setCidade} />
      <TextInput placeholder="Número do Contrato" style={styles.input} value={numeroContrato} onChangeText={setNumeroContrato} />
      <TextInput placeholder="Email do Cliente" style={styles.input} value={emailCliente} onChangeText={setEmailCliente} />
      <TextInput placeholder="Nome de Quem Atendeu" style={styles.input} value={nomeAtendente} onChangeText={setNomeAtendente} />

      <TextInput placeholder="Supervisor" style={styles.input} value={supervisor} onChangeText={setSupervisor} />

      <Text style={styles.label}>Tipo de Atendimento:</Text>
      <View style={styles.pickerWrapper}>
        <TextInput
          placeholder="Instalação / Manutenção / Outro"
          style={styles.input}
          value={tipoAtendimento}
          onChangeText={setTipoAtendimento}
        />
      </View>

      <TextInput
        placeholder="Observação"
        value={observacao}
        onChangeText={setObservacao}
        multiline
        style={[styles.input, { height: 100 }]}
      />

      <Text style={{ marginTop: 16 }}>Assinatura do Cliente:</Text>

      {assinaturaEditando ? (
        <>
          <View style={{ height: 300, borderColor: 'gray', borderWidth: 1 }}>
            <Signature
              ref={signatureRef}
              onOK={handleSignature}
              onBegin={() => setScrollEnabled(false)}
              descriptionText="Assine aqui"
              webStyle={`.button { display: none; }`}
            />
          </View>
          <Button title="Salvar Assinatura" onPress={() => signatureRef.current.readSignature()} />
        </>
      ) : (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <Image source={{ uri: assinatura }} style={{ width: 300, height: 150}} />
          <Button title="Limpar Assinatura" onPress={handleClearSignature} style={{marginTop:8}} />
        </View>
      )}

      <Button title="Adicionar Foto" onPress={handleAdicionarFoto} />
      <ScrollView horizontal contentContainerStyle={{ marginVertical: 12 }}>
        {fotos.map((foto, index) => (
          <Image key={`foto-${index}`} source={{ uri: foto }} style={{ width: 100, height: 100, marginRight: 8 }} />
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Enviar Ordem de Serviço" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 44,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 4,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginTop: 8,
  },
});
