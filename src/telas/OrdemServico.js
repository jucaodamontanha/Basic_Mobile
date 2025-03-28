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
import { API_BASE_URL } from "../telas/config"; // Importa a URL base do back-end
import axios from "axios";

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
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const signatureRef = useRef(null);

  // Captura a assinatura
  const handleSignature = (signature) => {
    console.log("handleSignature chamado com assinatura:", signature);
    if (signature) {
      setAssinatura(signature); // Salva a assinatura como Base64
      console.log("Assinatura capturada:", signature);
    } else {
      console.error("Nenhuma assinatura foi capturada.");
    }
  };

  // Salva a assinatura
  const handleSalvarAssinatura = () => {
    console.log("Estado atual de assinatura no botão Salvar:", assinatura);
    if (assinatura) {
      setAssinaturaSalva(true); // Desativa o campo de assinatura
      alert("Assinatura salva com sucesso!");
    } else {
      alert("Por favor, assine antes de salvar.");
    }
  };

  // Limpa a assinatura
  const handleClearSignature = () => {
    signatureRef.current.clearSignature(); // Limpa o campo de assinatura
    setAssinatura(null);
    setAssinaturaSalva(false);
    console.log("Assinatura limpa.");
  };

  // Adiciona uma foto
  const handleAdicionarFoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão para acessar a galeria é necessária!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setFotos((prevFotos) => [...prevFotos, uri]);
        console.log("Foto adicionada:", uri);
      } else {
        console.log("Nenhuma foto foi selecionada.");
      }
    } catch (error) {
      console.error("Erro ao adicionar foto:", error);
      alert("Ocorreu um erro ao tentar acessar a galeria.");
    }
  };

  // Envia a ordem de serviço
  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
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
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const ordemDeServico = {
      nomeCliente,
      endereco,
      numero: parseInt(numero, 10), // Converte para número
      cidade,
      numeroContrato: parseInt(numeroContrato, 10), // Converte para número
      emailCliente,
      nomeAtendente,
      supervisor,
      tipoAtendimento,
      observacao,
      assinatura,
      fotos,
    };

    console.log("Enviando ordem de serviço para:", `${API_BASE_URL}/os`);
    console.log("Dados enviados:", ordemDeServico);

    try {
      const response = await axios.post(`${API_BASE_URL}/os`, ordemDeServico, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Ordem de serviço criada com sucesso!");
      } else {
        console.error("Erro no servidor:", response.data);
        alert("Erro ao criar ordem de serviço.");
      }
    } catch (error) {
      console.error("Erro ao enviar ordem de serviço:", error);
      alert(
        "Erro ao enviar ordem de serviço. Verifique sua conexão com a internet."
      );
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
          <Text fontSize="2xl" mb="4">
            Criar Ordem de Serviço
          </Text>
          <VStack space={4}>
            {/* Campos de Entrada */}
            <Input
              placeholder="Nome do Cliente"
              value={nomeCliente}
              onChangeText={setNomeCliente}
            />
            <Input
              placeholder="Endereço"
              value={endereco}
              onChangeText={setEndereco}
            />
            <Input
              placeholder="Número"
              value={numero}
              onChangeText={setNumero}
            />
            <Input
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
            />
            <Input
              placeholder="Número do Contrato"
              value={numeroContrato}
              onChangeText={setNumeroContrato}
            />
            <Input
              placeholder="Email do Cliente"
              value={emailCliente}
              onChangeText={setEmailCliente}
            />
            <Input
              placeholder="Nome de Quem Atendeu"
              value={nomeAtendente}
              onChangeText={setNomeAtendente}
            />
            <Input
              placeholder="Supervisor"
              value={supervisor}
              onChangeText={setSupervisor}
            />

            {/* Campo de Seleção */}
            <Select
              placeholder="Tipo de Atendimento"
              selectedValue={tipoAtendimento}
              onValueChange={(value) => setTipoAtendimento(value)}
            >
              <Select.Item label="Instalação" value="instalacao" />
              <Select.Item label="Manutenção" value="manutencao" />
              <Select.Item label="Outro" value="outro" />
            </Select>

            {/* Campo de Observação */}
            <TextArea
              placeholder="Observação"
              value={observacao}
              onChangeText={setObservacao}
            />

            {/* Campo de Assinatura */}
            <Text fontSize="md" mt="4">
              Assinatura do Cliente:
            </Text>
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
                      border: none; 
                    }
                    .m-signature-pad--body {
                      border: none;
                    }
                    .m-signature-pad--footer {
                      display: none; 
                      margin: 0px;
                    }
                    body, html {
                      width: 100%; 
                      height: 100%; 
                      margin: 0; 
                      padding: 0; 
                      overflow: hidden;
                    }
                    canvas {
                      width: 100%;
                      height: 100%;
                    }
                  `}
                  onBegin={() => setScrollEnabled(false)}
                  onEnd={() => setScrollEnabled(true)}
                />
              </Box>
            ) : (
              <Box mt="4" alignItems="center">
                <Text fontSize="md" mb="2">
                  Assinatura Salva:
                </Text>
                <Image
                  source={{ uri: `data:image/png;base64,${assinatura}` }}
                  alt="Assinatura do Cliente"
                  style={{
                    width: 300,
                    height: 150,
                    borderWidth: 1,
                    borderColor: "gray",
                  }}
                />
              </Box>
            )}

            {!assinaturaSalva && (
              <Button
                onPress={handleSalvarAssinatura}
                colorScheme="blue"
                mt="2"
              >
                Salvar Assinatura
              </Button>
            )}
            {!assinaturaSalva && (
              <Button onPress={handleClearSignature} colorScheme="red" mt="2">
                Limpar Assinatura
              </Button>
            )}

            {/* Exibição das Fotos Selecionadas */}
            <Text fontSize="md" mt="4">
              Fotos Adicionadas:
            </Text>
            {fotos.map((foto, index) => (
              <Box key={index} mt="2">
                <Image
                  source={{ uri: foto }}
                  alt={`Foto ${index + 1}`}
                  style={{
                    width: 300,
                    height: 150,
                    borderWidth: 1,
                    borderColor: "gray",
                    marginBottom: 8,
                  }}
                />
                <Text>Foto {index + 1}</Text>
              </Box>
            ))}

            {/* Botões Adicionais */}
            <Button onPress={handleAdicionarFoto} colorScheme="blue" mt="4">
              Adicionar Foto
            </Button>
            <Button onPress={handleSubmit} colorScheme="green" mt="4">
              Enviar Ordem de Serviço
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}