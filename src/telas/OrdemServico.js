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

export default function OrdemServico() {
  const [assinatura, setAssinatura] = useState(null); // Armazena a assinatura
  const [assinaturaSalva, setAssinaturaSalva] = useState(false); // Controla se a assinatura foi salva
  const [scrollEnabled, setScrollEnabled] = useState(true); // Controle do scroll
  const [fotos, setFotos] = useState([]); // Armazena as fotos adicionadas
  const signatureRef = useRef(null);

  const handleSignature = (signature) => {
    setAssinatura(signature); // Salva a assinatura como Base64
    console.log("Assinatura recebida:", signature);
  };

  const handleClearSignature = () => {
    signatureRef.current.clearSignature(); // Limpa a assinatura
    setAssinatura(null);
    setAssinaturaSalva(false); // Permite reativar o campo de assinatura
  };

  const handleSalvarAssinatura = () => {
    if (assinatura) {
      setAssinaturaSalva(true); // Desativa o campo de assinatura
      alert("Assinatura salva com sucesso!");
    } else {
      alert("Por favor, assine antes de salvar.");
    }
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setFotos((prevFotos) => [...prevFotos, uri]);
      console.log("Foto adicionada:", uri);
    } else {
      console.log("Nenhuma foto foi selecionada.");
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
            <Input placeholder="Nome do Cliente" />
            <Input placeholder="Endereço" />
            <Input placeholder="Número" />
            <Input placeholder="Cidade" />
            <Input placeholder="Número do Contrato" />
            <Input placeholder="Email do Cliente" />
            <Input placeholder="Nome de Quem Atendeu" />
            <Input placeholder="Supervisor" />

            {/* Campo de Seleção */}
            <Select placeholder="Tipo de Atendimento">
              <Select.Item label="Instalação" value="instalacao" />
              <Select.Item label="Manutenção" value="manutencao" />
              <Select.Item label="Outro" value="outro" />
            </Select>

            {/* Campo de Observação */}
            <TextArea placeholder="Observação" />

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
                  onBegin={() => setScrollEnabled(false)} // Desativa o scroll ao começar a desenhar
                  onEnd={() => setScrollEnabled(true)} // Reativa o scroll ao terminar de desenhar
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
              <Button onPress={handleSalvarAssinatura} colorScheme="blue" mt="2">
                Salvar Assinatura
              </Button>
            )}
            {!assinaturaSalva && (
              <Button
                onPress={handleClearSignature}
                colorScheme="red"
                mt="2"
              >
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
          </VStack>
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}