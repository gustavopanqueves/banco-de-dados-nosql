import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuração do aplicativo Web Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCfNOef9zfZa-yB_906TJwOQ1fNRhBn0Zg",
  authDomain: "nosql123-71837.firebaseapp.com",
  projectId: "nosql123-71837",
  storageBucket: "nosql123-71837.firebasestorage.app",
  messagingSenderId: "902272618611",
  appId: "1:902272618611:web:b7ee976e86136c88f29a06",
  measurementId: "G-KZ8SCGWNJ8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const alunosRef = collection(db, "alunos");

const loginPainel = document.querySelector("#loginPainel");
const areaSistema = document.querySelector("#areaSistema");
const loginForm = document.querySelector("#loginForm");
const mensagemLogin = document.querySelector("#mensagemLogin");
const btnEntrar = document.querySelector("#btnEntrar");
const btnSair = document.querySelector("#btnSair");

const form = document.querySelector("#formAluno");
const lista = document.querySelector("#lista");
const mensagem = document.querySelector("#mensagem");
const tituloForm = document.querySelector("#titulo-form");
const btnSalvar = document.querySelector("#btnSalvar");
const btnCancelar = document.querySelector("#btnCancelar");

function avisarLogin(texto, erro = false) {
  mensagemLogin.textContent = texto;
  mensagemLogin.classList.toggle("erro", erro);
}

function avisar(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function mensagemErroLogin(error) {
  const codigos = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-email": "Informe um e-mail válido.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente novamente.",
    "auth/network-request-failed": "Falha de conexão. Verifique sua internet."
  };
  return codigos[error.code] || "Não foi possível entrar. Confira os dados e tente novamente.";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  btnEntrar.disabled = true;
  avisarLogin("Entrando...");
  try {
    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;
    await signInWithEmailAndPassword(auth, email, senha);
    loginForm.reset();
    avisarLogin("");
  } catch (error) {
    console.error(error);
    avisarLogin(mensagemErroLogin(error), true);
  } finally {
    btnEntrar.disabled = false;
  }
});

btnSair.addEventListener("click", async () => {
  try {
    await signOut(auth);
    limparFormulario();
  } catch (error) {
    console.error(error);
    avisar("Não foi possível sair da conta.", true);
  }
});

onAuthStateChanged(auth, async (usuario) => {
  const conectado = Boolean(usuario);
  loginPainel.classList.toggle("oculto", conectado);
  areaSistema.classList.toggle("oculto", !conectado);
  if (conectado) {
    await listarAlunos();
  } else {
    lista.replaceChildren();
  }
});

function limparFormulario() {
  form.reset();
  document.querySelector("#alunoId").value = "";
  document.querySelector("#ativo").checked = true;
  tituloForm.textContent = "Cadastrar aluno";
  btnSalvar.textContent = "Cadastrar aluno";
  btnCancelar.classList.add("oculto");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!auth.currentUser) return;

  btnSalvar.disabled = true;
  avisar("Salvando...");

  const id = document.querySelector("#alunoId").value;
  const aluno = {
    nome: document.querySelector("#nome").value.trim(),
    turma: document.querySelector("#turma").value.trim().toUpperCase(),
    dataNascimento: document.querySelector("#dataNascimento").value,
    ativo: document.querySelector("#ativo").checked
  };

  try {
    if (id) {
      await updateDoc(doc(db, "alunos", id), aluno);
      avisar("Aluno atualizado com sucesso.");
    } else {
      await addDoc(alunosRef, aluno);
      avisar("Aluno cadastrado com sucesso.");
    }
    limparFormulario();
    await listarAlunos();
  } catch (error) {
    console.error(error);
    avisar("Não foi possível salvar. Confira as regras do Firestore.", true);
  } finally {
    btnSalvar.disabled = false;
  }
});

async function listarAlunos() {
  if (!auth.currentUser) return;

  lista.replaceChildren();
  const turma = document.querySelector("#filtroTurma").value.trim().toUpperCase();
  const data = document.querySelector("#filtroData").value;

  try {
    const filtros = [];
    if (turma) filtros.push(where("turma", "==", turma));
    if (data) filtros.push(where("dataNascimento", "==", data));

    const consulta = filtros.length ? query(alunosRef, ...filtros) : alunosRef;
    const resultado = await getDocs(consulta);
    const alunos = resultado.docs
      .map((registro) => ({ id: registro.id, ...registro.data() }))
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));

    if (alunos.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "vazio";
      vazio.textContent = "Nenhum aluno encontrado.";
      lista.append(vazio);
      return;
    }

    alunos.forEach((aluno) => {
      const card = document.createElement("article");
      card.className = "aluno";

      const dados = document.createElement("div");
      const nome = document.createElement("h3");
      nome.textContent = aluno.nome || "Sem nome";
      const turmaInfo = document.createElement("p");
      turmaInfo.textContent = "Turma: " + (aluno.turma || "-");
      const dataInfo = document.createElement("p");
      dataInfo.textContent = "Nascimento: " + (aluno.dataNascimento || "-");
      const status = document.createElement("p");
      status.textContent = aluno.ativo ? "Situação: Ativo" : "Situação: Inativo";
      dados.append(nome, turmaInfo, dataInfo, status);

      const botoes = document.createElement("div");
      botoes.className = "botoes";
      const editar = document.createElement("button");
      editar.className = "secundario";
      editar.textContent = "Editar";
      editar.addEventListener("click", () => iniciarEdicao(aluno.id, aluno));

      const excluir = document.createElement("button");
      excluir.className = "perigo";
      excluir.textContent = "Excluir";
      excluir.addEventListener("click", () => excluirAluno(aluno.id));

      botoes.append(editar, excluir);
      card.append(dados, botoes);
      lista.append(card);
    });
  } catch (error) {
    console.error(error);
    const aviso = document.createElement("p");
    aviso.className = "vazio";
    aviso.textContent = "Erro ao carregar. Verifique as regras do Firestore e a conexão.";
    lista.append(aviso);
  }
}

function iniciarEdicao(id, aluno) {
  document.querySelector("#alunoId").value = id;
  document.querySelector("#nome").value = aluno.nome || "";
  document.querySelector("#turma").value = aluno.turma || "";
  document.querySelector("#dataNascimento").value = aluno.dataNascimento || "";
  document.querySelector("#ativo").checked = Boolean(aluno.ativo);
  tituloForm.textContent = "Editar aluno";
  btnSalvar.textContent = "Salvar alterações";
  btnCancelar.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirAluno(id) {
  if (!auth.currentUser) return;
  if (!confirm("Deseja realmente excluir este aluno?")) return;
  try {
    await deleteDoc(doc(db, "alunos", id));
    avisar("Aluno excluído com sucesso.");
    await listarAlunos();
  } catch (error) {
    console.error(error);
    avisar("Não foi possível excluir. Confira as regras do Firestore.", true);
  }
}

btnCancelar.addEventListener("click", () => {
  limparFormulario();
  avisar("Edição cancelada.");
});
document.querySelector("#btnAtualizar").addEventListener("click", listarAlunos);
document.querySelector("#btnLimpar").addEventListener("click", () => {
  document.querySelector("#filtroTurma").value = "";
  document.querySelector("#filtroData").value = "";
  listarAlunos();
});
document.querySelector("#filtroTurma").addEventListener("input", listarAlunos);
document.querySelector("#filtroData").addEventListener("change", listarAlunos);
