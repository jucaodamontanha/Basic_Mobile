import React, { useRef, useState } from 'react';
import { NativeBaseProvider, Box, Input, Button, VStack, Text, Select, TextArea, ScrollView } from 'native-base';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';

export default function OrdemServico() {
  const [nomeCliente, setNomeCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [numeroContrato, setNumeroContrato] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [nomeAtendente, setNomeAtendente] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [observacao, setObservacao] = useState('');
  const [fotos, setFotos] = useState([]);
  const [assinatura, setAssinatura] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true); // Estado para controlar a rolagem

  const webViewRef = useRef(null);

  const handleSalvarOrdem = () => {
    if (!nomeCliente || !endereco || !numero || !cidade || !numeroContrato || !emailCliente || !nomeAtendente || !tipoAtendimento || !supervisor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const ordemServico = {
      nomeCliente,
      endereco,
      numero,
      cidade,
      numeroContrato,
      emailCliente,
      nomeAtendente,
      tipoAtendimento,
      supervisor,
      observacao,
      fotos,
      assinatura,
    };

    console.log('Ordem de Serviço:', ordemServico);
    Alert.alert('Sucesso', 'Ordem de serviço salva com sucesso!');
  };

  const handleAdicionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGES], // Atualizado para usar MediaType
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFotos([...fotos, result.uri]);
    }
  };

  const handleSignature = (data) => {
    setAssinatura(data); // Salva a assinatura como base64
    Alert.alert('Sucesso', 'Assinatura salva com sucesso!');
  };

  const handleClearSignature = () => {
    webViewRef.current.postMessage('clear');
  };

  const handleSaveSignature = () => {
    webViewRef.current.postMessage('save');
  };
  const signatureHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden; /* Desativa a rolagem */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .signature-pad {
          border: 1px solid #000;
          width: 100%;
          height: 300px;
        }
      </style>
    </head>
    <body>
      <canvas id="signature-pad" class="signature-pad"></canvas>
      <script>
        const canvas = document.getElementById('signature-pad');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = 300;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let drawing = false;

        function startDrawing(event) {
          drawing = true;
          draw(event);
        }

        function stopDrawing() {
          drawing = false;
          ctx.beginPath();
        }

        function draw(event) {
          if (!drawing) return;
          const rect = canvas.getBoundingClientRect();
          const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
          const y = (event.touches ? event.touches[0].clientY : event.clientY) - rect.top;

          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'black';
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchmove', draw);

        function clearSignature() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function saveSignature() {
          const dataURL = canvas.toDataURL('image/png');
          window.ReactNativeWebView.postMessage(dataURL);
        }

        window.addEventListener('message', (event) => {
          if (event.data === 'clear') {
            clearSignature();
          } else if (event.data === 'save') {
            saveSignature();
          }
        });
      </script>
    </body>
  </html>
`;

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled} // Controla a rolagem
        >
          <Box safeArea p="4">
            <Text fontSize="2xl" mb="4">Criar Ordem de Serviço</Text>
            <VStack space={4}>
              <Input placeholder="Nome do Cliente" value={nomeCliente} onChangeText={setNomeCliente} isRequired />
              <Input placeholder="Endereço" value={endereco} onChangeText={setEndereco} isRequired />
              <Input placeholder="Número" value={numero} onChangeText={setNumero} isRequired />
              <Input placeholder="Cidade" value={cidade} onChangeText={setCidade} isRequired />
              <Input placeholder="Número do Contrato" value={numeroContrato} onChangeText={setNumeroContrato} isRequired />
              <Input placeholder="Email do Cliente" value={emailCliente} onChangeText={setEmailCliente} isRequired />
              <Input placeholder="Nome de Quem Atendeu" value={nomeAtendente} onChangeText={setNomeAtendente} isRequired />
              <Select
                selectedValue={tipoAtendimento}
                minWidth="200"
                placeholder="Tipo de Atendimento"
                onValueChange={setTipoAtendimento}
                isRequired
              >
                <Select.Item label="Instalação" value="instalacao" />
                <Select.Item label="Manutenção" value="manutencao" />
                <Select.Item label="Outro" value="outro" />
              </Select>
              <Input placeholder="Supervisor" value={supervisor} onChangeText={setSupervisor} isRequired />
              <TextArea placeholder="Observação" value={observacao} onChangeText={setObservacao} />

              <Text fontSize="md" mt="4">Assinatura do Cliente:</Text>
              <Box height="300px" borderWidth={1} borderColor="gray.300">
  <WebView
    ref={webViewRef}
    originWhitelist={['*']}
    source={{ html: signatureHTML }}
    onMessage={(event) => handleSignature(event.nativeEvent.data)}
    style={{ height: 300 }}
    onTouchStart={() => {
      if (scrollEnabled) setScrollEnabled(false); // Atualiza apenas se necessário
    }}
    onTouchEnd={() => {
      if (!scrollEnabled) setScrollEnabled(true); // Atualiza apenas se necessário
    }}
  />
</Box>
              <Button onPress={handleClearSignature} colorScheme="red" mt="2">
                Limpar Assinatura
              </Button>
              <Button onPress={handleSaveSignature} colorScheme="blue" mt="2">
                Salvar Assinatura
              </Button>

              <Text fontSize="md" mt="4">Fotos do Atendimento:</Text>
              <Button onPress={handleAdicionarFoto} colorScheme="blue">
                Adicionar Foto
              </Button>
              {fotos.map((foto, index) => (
                <Text key={index} mt="2">Foto {index + 1}: {foto}</Text>
              ))}

              <Button onPress={handleSalvarOrdem} colorScheme="green" mt="4">
                Salvar Ordem de Serviço
              </Button>
            </VStack>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}