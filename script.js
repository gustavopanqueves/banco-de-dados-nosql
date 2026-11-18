import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, where, orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 1. Substitua os valores abaixo pelas configurações do seu app Web no Firebase.
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const alunosRef = collection(db, "alunos");

const form = document.querySelector("#formAluno");
const lista = document.querySelector("#lista");
const mensagem = document.querySelector("#mensagem");
const tituloForm = document.querySelector("#titulo-form");
const btnSalvar = document.querySelector("#btnSalvar");
const btnCancelar = document.querySelector("#btnCancelar");

function avisar(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

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
    avisar("Não foi possível salvar. Confira a configuração e as regras do Firestore.", true);
  } finally {
    btnSalvar.disabled = false;
  }
});

async function listarAlunos() {
  lista.replaceChildren();
  const turma = document.querySelector("#filtroTurma").value.trim().toUpperCase();
  const data = document.querySelector("#filtroData").value;

  try {
    const filtros = [];
    if (turma) filtros.push(where("turma", "==", turma));
    if (data) filtros.push(where("dataNascimento", "==", data));
    filtros.push(orderBy("nome"));

    const consulta = query(alunosRef, ...filtros);
    const resultado = await getDocs(consulta);

    if (resultado.empty) {
      const vazio = document.createElement("p");
      vazio.className = "vazio";
      vazio.textContent = "Nenhum aluno encontrado.";
      lista.append(vazio);
      return;
    }

    resultado.forEach((registro) => {
      const aluno = registro.data();
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
      editar.addEventListener("click", () => iniciarEdicao(registro.id, aluno));

      const excluir = document.createElement("button");
      excluir.className = "perigo";
      excluir.textContent = "Excluir";
      excluir.addEventListener("click", () => excluirAluno(registro.id));

      botoes.append(editar, excluir);
      card.append(dados, botoes);
      lista.append(card);
    });
  } catch (error) {
    console.error(error);
    const aviso = document.createElement("p");
    aviso.className = "vazio";
    aviso.textContent = "Erro ao carregar. Verifique a configuração, as permissões e os índices do Firestore.";
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
  if (!confirm("Deseja realmente excluir este aluno?")) return;
  try {
    await deleteDoc(doc(db, "alunos", id));
    avisar("Aluno excluído com sucesso.");
    await listarAlunos();
  } catch (error) {
    console.error(error);
    avisar("Não foi possível excluir o aluno. Confira as regras do Firestore.", true);
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

listarAlunos();
