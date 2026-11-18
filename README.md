# Sistema de Alunos — NoSQL + Firebase

Projeto didático de CRUD (Create, Read, Update e Delete) usando HTML, CSS, JavaScript e Firebase Cloud Firestore.

## Arquivos
- `index.html`: estrutura da página.
- `style.css`: estilos responsivos.
- `script.js`: conexão com Firestore e operações CRUD.

## 1. Configurar o Firebase
1. Acesse https://console.firebase.google.com/ e crie um projeto.
2. Crie um banco **Cloud Firestore**.
3. Registre um aplicativo Web nas configurações do projeto.
4. Copie a configuração do Firebase para o objeto `firebaseConfig` em `script.js`.
5. Confira as regras de segurança do Firestore antes de usar.

O site usa o SDK Web do Firebase. Não coloque chaves de conta de serviço (serviceAccountKey.json) no navegador ou neste repositório.

## 2. Estrutura dos documentos
Coleção: `alunos`

| Campo | Tipo |
|---|---|
| nome | string |
| turma | string |
| dataNascimento | string (AAAA-MM-DD) |
| ativo | boolean |

## 3. Executar localmente
Como o projeto usa módulos JavaScript, abra a pasta com um servidor HTTP local (por exemplo, a extensão Live Server do VS Code). Não abra o HTML diretamente pelo protocolo `file://`.

## 4. Publicar no Render
1. Entre em https://render.com/ e conecte sua conta GitHub.
2. Escolha **New → Static Site** e selecione este repositório.
3. Configure **Build Command** vazio e **Publish Directory** como `.`.
4. Clique em **Deploy**.

## Funcionalidades
- Cadastrar alunos.
- Listar alunos.
- Editar os dados de um aluno.
- Excluir alunos.
- Filtrar por turma e data de nascimento.

## Segurança
A configuração do Firebase para Web identifica o projeto, mas não substitui regras de segurança. Não publique dados pessoais reais de estudantes. Para um sistema real, implemente Firebase Authentication e regras que restrinjam leitura e escrita a usuários autorizados. Não use regras abertas em produção.

## Observação sobre consultas
O Firestore pode solicitar a criação de um índice para determinadas combinações de filtros e ordenação. Se isso acontecer, siga o link de criação indicado no erro do console do navegador.
