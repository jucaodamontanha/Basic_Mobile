import React, { useRef, useState } from "react";
import {
  NativeBaseProvider,
  Box,
  Button,
  VStack,
  Text,
  ScrollView,
  Image,
  Input,
  Select,
  TextArea,
  Spinner,
} from "native-base";
import Signature from "react-native-signature-canvas";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import API_BASE_URL from './config'; // URL da API

export default function OrdemServico({ navigation }) {
  const [nomeCliente, setNomeCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [nomeAtendente, setNomeAtendente] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState("");
  const [observacao, setObservacao] = useState("");
  const [assinatura, setAssinatura] = useState(null);
  const [assinaturaSalva, setAssinaturaSalva] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Estado para carregamento
  const signatureRef = useRef(null);

  const handleSignature = (signature) => {
    if (signature) {
      setAssinatura(signature); // Salva a assinatura em Base64
      setAssinaturaSalva(true); // Marca a assinatura como salva
      alert("Assinatura salva com sucesso!");
    } else {
      alert("Por favor, desenhe sua assinatura antes de salvar.");
    }
  };

  const handleClearSignature = () => {
    signatureRef.current.clearSignature();
    setAssinatura(null);
    setAssinaturaSalva(false);
  };

  const handleAdicionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const resizedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Redimensiona para largura máxima de 800px
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compacta para 70% da qualidade
      );
      setFotos((prevFotos) => [...prevFotos, resizedImage.uri]);
    }
  };

  const handleSubmit = async () => {
    if (!nomeCliente || !endereco || !numero || !cidade || !numeroContrato || !emailCliente || !nomeAtendente || !supervisor || !tipoAtendimento) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true); // Ativa o estado de carregamento

    // Calcula o tamanho total dos arquivos
    let tamanhoTotal = 0;

    // Calcula o tamanho da assinatura (se existir)
    if (assinatura) {
      const assinaturaSize = new Blob([assinatura]).size; // Converte a assinatura Base64 para Blob
      tamanhoTotal += assinaturaSize;
    }

    // Calcula o tamanho das fotos
    for (const fotoUri of fotos) {
      const response = await fetch(fotoUri);
      const blob = await response.blob();
      tamanhoTotal += blob.size;
    }

    console.log(`Tamanho total dos arquivos: ${(tamanhoTotal / (1024 * 1024)).toFixed(2)} MB`);

    // Verifica se o tamanho total excede um limite (por exemplo, 10 MB)
    const limiteMB = 10;
    if (tamanhoTotal > limiteMB * 1024 * 1024) {
      alert(`O tamanho total dos arquivos excede o limite de ${limiteMB} MB.`);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(
      "dados",
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
        assinatura, // Assinatura em Base64
      })
    );

    fotos.forEach((fotoUri, index) => {
      formData.append("fotos", {
        uri: fotoUri,
        name: `foto_${index + 1}.jpg`,
        type: "image/jpeg",
      });
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/os`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Ordem de serviço criada com sucesso!");
        navigation.navigate("Dashboard"); // Redireciona para o dashboard
      } else {
        console.error("Erro no servidor:", response.data);
        alert("Erro ao criar ordem de serviço.");
      }
    } catch (error) {
      console.error("Erro ao enviar ordem de serviço:", error.message);
      alert("Erro ao enviar ordem de serviço. Verifique sua conexão com a internet.");
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <NativeBaseProvider>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled}
      >
        <Box safeArea p="4">
          <Text fontSize="2xl" mb="4">Criar Ordem de Serviço</Text>
          <VStack space={4}>
            <Input placeholder="Nome do Cliente" value={nomeCliente} onChangeText={setNomeCliente} />
            <Input placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
            <Input placeholder="Número" value={numero} onChangeText={setNumero} />
            <Input placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            <Input placeholder="Número do Contrato" value={numeroContrato} onChangeText={setNumeroContrato} />
            <Input placeholder="Email do Cliente" value={emailCliente} onChangeText={setEmailCliente} />
            <Input placeholder="Nome de Quem Atendeu" value={nomeAtendente} onChangeText={setNomeAtendente} />
            <Input placeholder="Supervisor" value={supervisor} onChangeText={setSupervisor} />
            <Select placeholder="Tipo de Atendimento" selectedValue={tipoAtendimento} onValueChange={setTipoAtendimento}>
              <Select.Item label="Instalação" value="instalacao" />
              <Select.Item label="Manutenção" value="manutencao" />
              <Select.Item label="Outro" value="outro" />
            </Select>
            <TextArea placeholder="Observação" value={observacao} onChangeText={setObservacao} />

            <Text fontSize="md" mt="4">Assinatura do Cliente:</Text>
            {!assinaturaSalva ? (
              <Box height="300px" borderWidth={1} borderColor="gray.300">
                <Signature
                  ref={signatureRef}
                  onOK={handleSignature}
                  descriptionText="Assine aqui"
                  clearText="Limpar"
                  confirmText="Salvar"
                  webStyle={`
                    .m-signature-pad {
                      box-shadow: none;
                      border: 1px solid #ccc;
                    }
                    .m-signature-pad--body {
                      border: none;
                    }
                    .m-signature-pad--footer {
                      display: none;
                    }
                  `}
                  onBegin={() => setScrollEnabled(false)} // Desativa o scroll ao começar a desenhar
                  onEnd={() => setScrollEnabled(true)} // Reativa o scroll ao terminar de desenhar
                />
              </Box>
            ) : (
              <Box mt="4" alignItems="center">
                <Text fontSize="md" mb="2">Assinatura Salva:</Text>
                {assinatura && (
                  <Image
                    source={{ uri: `data:image/png;base64,${assinatura}` }}
                    alt="Assinatura do Cliente"
                    style={{ width: 300, height: 150, borderWidth: 1, borderColor: "gray" }}
                  />
                )}
              </Box>
            )}

            {!assinaturaSalva && (
              <>
                <Button onPress={() => signatureRef.current.readSignature()} colorScheme="blue" mt="2">
                  Salvar Assinatura
                </Button>
                <Button onPress={handleClearSignature} colorScheme="red" mt="2">
                  Limpar Assinatura
                </Button>
              </>
            )}

            <Button onPress={handleAdicionarFoto} colorScheme="blue" mt="4">Adicionar Foto</Button>
            {fotos.length > 0 && (
              <Box mt="4">
                <Text fontSize="md" mb="2">Fotos Selecionadas:</Text>
                {fotos.map((fotoUri, index) => (
                  <Image
                    key={index}
                    source={{ uri: fotoUri }}
                    alt={`Foto ${index + 1}`}
                    style={{ width: 100, height: 100, marginBottom: 8 }}
                  />
                ))}
                <Button
                  onPress={() => setFotos([])} // Limpa todas as fotos selecionadas
                  colorScheme="red"
                  mt="2"
                >
                  Limpar Fotos
                </Button>
              </Box>
            )}

            {isLoading ? (
              <Spinner color="blue.500" size="lg" mt="4" />
            ) : (
              <Button onPress={handleSubmit} colorScheme="green" mt="4">Enviar Ordem de Serviço</Button>
            )}
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}