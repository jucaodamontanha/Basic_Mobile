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
} from "native-base";
import Signature from "react-native-signature-canvas";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import API_BASE_URL from './config'; // Importação correta da constante

export default function OrdemServico() {
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
  const [scrollEnabled, setScrollEnabled] = useState(true); // Adicionado o estado scrollEnabled
  const signatureRef = useRef(null);

  const handleSignature = (signature) => {
    console.log("handleSignature chamado com assinatura:", signature);
    if (signature) {
      setAssinatura(signature);
      console.log("Assinatura capturada:", signature);
    } else {
      console.error("Nenhuma assinatura foi capturada.");
    }
  };

  const handleSalvarAssinatura = () => {
    console.log("Estado atual de assinatura no botão Salvar:", assinatura);
    if (assinatura) {
      setAssinaturaSalva(true);
      alert("Assinatura salva com sucesso!");
    } else {
      alert("Por favor, assine antes de salvar.");
    }
  };

  const handleClearSignature = () => {
    signatureRef.current.clearSignature();
    setAssinatura(null);
    setAssinaturaSalva(false);
    console.log("Assinatura limpa.");
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
      const resizedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG });
      setFotos((prevFotos) => [...prevFotos, resizedImage.uri]);
    }
  };

  const handleSubmit = async () => {
    if (!nomeCliente || !endereco || !numero || !cidade || !numeroContrato || !emailCliente || !nomeAtendente || !supervisor || !tipoAtendimento) {
      alert("Preencha todos os campos obrigatórios.");
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
  
    console.log("Dados enviados:", formData);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/os`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        alert("Ordem de serviço criada com sucesso!");
      } else {
        console.error("Erro no servidor:", response.data);
        alert("Erro ao criar ordem de serviço.");
      }
    } catch (error) {
      console.error("Erro ao enviar ordem de serviço:", error.message);
      alert("Erro ao enviar ordem de serviço. Verifique sua conexão com a internet.");
    }
  };
  return (
    <NativeBaseProvider>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled} // Controla o scroll com base no estado
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
                  webStyle={`...`}
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
                <Button onPress={handleSalvarAssinatura} colorScheme="blue" mt="2">
                  Salvar Assinatura
                </Button>
                <Button onPress={handleClearSignature} colorScheme="red" mt="2">
                  Limpar Assinatura
                </Button>
              </>
            )}

            <Button onPress={handleAdicionarFoto} colorScheme="blue" mt="4">Adicionar Foto</Button>
            <Button onPress={handleSubmit} colorScheme="green" mt="4">Enviar Ordem de Serviço</Button>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}