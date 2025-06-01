
# LOOL – Gerenciamento Inteligente de Ordens de Serviço

LOOL é uma aplicação moderna voltada para **gestão de tarefas** e **geração digital de ordens de serviço**, com controle hierárquico entre **supervisores** e **técnicos**. O nome faz referência à sequência binária **1001**, trazendo consigo um conceito elegante e tecnológico que está refletido na identidade visual da marca.

## 📱 Funcionalidades

- Cadastro de usuários com diferentes funções (supervisor, técnico)
- Criação e acompanhamento de ordens de serviço
- Histórico de atendimentos e tarefas
- Registro de imagens, assinaturas e dados da OS em PDF
- Geração de relatórios personalizados
- Acesso por níveis hierárquicos (perfis com permissões distintas)

## 💼 Público-alvo

- Empresas prestadoras de serviços técnicos
- Supervisores de campo
- Equipes de manutenção
- Terceirizadas de facilities ou manutenção predial

## 🧠 Conceito do Logotipo

O logotipo foi inspirado na sequência binária **1001**, que representa:
- **1**: Presença, início, ação
- **0**: Espaço, dado, processo
- **1001**: Um número binário palíndromo, remetendo à ideia de continuidade, retorno e estrutura simétrica.

Foram exploradas diferentes abordagens visuais:
- Estilo minimalista, institucional e moderno
- Versões com traços robustos, curvas suaves e variações de contraste
- Aplicações em dark mode e fundo claro

## 🛠️ Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot
- Spring Security (com roles como `ADMIN`, `SUPERVISOR`, `TECNICO`)
- PostgreSQL
- Docker + Docker Compose
- iText PDF (para geração de PDFs estilizados)

### Frontend
- React Native com Expo
- Axios para integração com API
- AsyncStorage para autenticação local
- Componentes customizados para UI responsiva

## 📦 Estrutura dos Repositórios

- [`Basic_backend`](https://github.com/SEU_USUARIO/Basic_backend) – API REST com autenticação, roles e geração de PDF
- [`Basic_mobile`](https://github.com/SEU_USUARIO/Basic_mobile) – Aplicativo mobile em React Native

## 🧾 Layout dos PDFs

- Logotipo LOOL em destaque no topo
- Moldura arredondada para campos da OS
- Assinatura centralizada em caixa branca
- Fotos anexadas com bordas e legendas

## 📸 Identidade Visual

Todas as versões do logotipo exploram o número **1001** com variações:
- Moderno e elegante
- Criativo e conceitual (ex: elemento em forma de lente)
- Retro-futurista (para identidade digital com personalidade)

## 🔐 Acesso e Segurança

- Autenticação JWT
- Controle de acesso por perfil
- Validações robustas no backend com DTOs

## ✨ Próximos Passos

- Melhorias na responsividade mobile
- Integração com notificações push
- Dashboard para supervisores
- Filtro por status das ordens

---

## 📧 Contato

Desenvolvido por **Lineker Henrique Xavier**  
Email: eng.linekerx@gmail.com  
LinkedIn: [linkedin.com/in/lineker-henrique-xavier-3a568717b](https://www.linkedin.com/in/lineker-henrique-xavier-3a568717b/)

---

© 2025 LOOL – Todos os direitos reservados.
