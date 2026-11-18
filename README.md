# Sistema de Alunos — NoSQL + Firebase

Projeto didático de CRUD (Create, Read, Update e Delete) usando HTML, CSS, JavaScript, Firebase Authentication e Cloud Firestore.

## Arquivos
- `index.html`: tela de login e estrutura do sistema.
- `style.css`: estilos responsivos.
- `script.js`: autenticação e operações CRUD.
- `firestore.rules`: regras de acesso do Firestore.

## 1. Configuração do Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Abra o projeto e confirme que o **Cloud Firestore** está criado.
3. Em **Authentication → Sign-in method**, habilite **E-mail/senha**.
4. Em **Authentication → Users**, crie os usuários que terão permissão para acessar o sistema.
5. Em **Configurações do projeto → Geral → Seus apps**, confira a configuração do aplicativo Web usada em `script.js`.

O site já contém a configuração Web do projeto conectado. A chave de configuração Web identifica o projeto, mas não substitui as regras de segurança. Nunca coloque chaves de conta de serviço ou arquivos privados no repositório.

## 2. Aplicar as regras do Firestore
1. No Firebase Console, abra **Firestore Database → Regras**.
2. Substitua o conteúdo pelas regras do arquivo `firestore.rules`.
3. Clique em **Publicar**.

Essas regras exigem que a pessoa esteja autenticada. Todos os usuários cadastrados no Firebase Authentication terão acesso aos registros desta versão didática. Cadastre somente pessoas autorizadas. Para um sistema real com dados pessoais, restrinja também o acesso por função/perfil e use dados fictícios durante demonstrações em sala.

## 3. Estrutura dos documentos
Coleção: `alunos`

| Campo | Tipo |
|---|---|
| nome | string |
| turma | string |
| dataNascimento | string (AAAA-MM-DD) |
| ativo | boolean |

## 4. Publicar no Render
Este projeto é um site estático e não precisa de servidor Node nem comando de build.
1. Entre no [Render](https://render.com/) e conecte sua conta GitHub.
2. Escolha **New → Static Site** e selecione este repositório.
3. Branch: `main`.
4. Root Directory: deixe vazio.
5. Build Command: deixe vazio.
6. Publish Directory: `.`.
7. Clique em **Deploy**.

Depois de cada commit na branch `main`, o Render normalmente inicia uma nova publicação automática.

## Funcionalidades
- Login com e-mail e senha.
- Sair da conta.
- Cadastrar, listar, editar e excluir alunos.
- Filtrar por turma e data de nascimento.

## Observação
O código ordena os nomes no navegador depois de consultar o Firestore, evitando a necessidade de criar índices compostos para os filtros desta versão.
