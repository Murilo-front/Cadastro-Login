import {
  usuarioNome,
  usuarioEmail,
  usuarioSenha,
  setNewData,
  setNewUsuario,
  fecharDialogBtn,
  dialog,
  body,
  loguinBtn,
} from "./shared.js";

import usuarioAutalizado from "./shared.js";

import {
  senhaVista,
  senhaEscondida,
  usuarios,
  indexUsuario,
  getUsuario,
  confirmButton,
  cancelButton,
  confirmDialog,
} from "./usuarioInit.js";

import { input } from "./usuarioMain.js";

let novaSenhaVista = "";
let novaSenhaEscondida = "";
export const eyeIcon = document.querySelector("img[alt='eye icon']");
const eyeBlockedIcon = document.querySelector("img[alt='eye-blocked icon']");
const confirmMsg = document.getElementById("confirm-dialog-msg");
const deleteMsg = document.getElementById("delete-dialog-msg");
export const deleteBtn = document.getElementById("deleteBtn");

export function eventoChange() {
  let input = this;
  let nameInput = input.getAttribute("name");
  formataInputs(nameInput);
  formataDefault(input);
}

export function eventoBlur() {
  let input = this;
  formataDefault(input);
}

export function eventoConfirm() {
  // Remove demais ouvintes para evitar que sejam executados
  input.removeEventListener("change", eventoChange);
  input.removeEventListener("blur", eventoBlur);
  // Mostra caixa de dialogo e eventlistner para ambas opições
  abrirConfirmDialog();
  confirmButton.focus();
  confirmButton.addEventListener("click", alteracaoConfirmada);
  cancelButton.addEventListener("click", alteracaoCancelada);
}

function formataInputs(nameInput, valorDigitado) {
  // Caso confirmado alteração, atualiza inputs
  if (valorDigitado) {
    switch (nameInput) {
      case "nome":
        usuarioNome.value = valorDigitado;
        break;
      case "email":
        usuarioEmail.value = valorDigitado;
        break;
      case "senha":
        novaSenhaVista = valorDigitado;
        // Esconde a senha dependendo da sitação do icone de olho
        if (eyeIcon.style.display != "none") {
          novaSenhaEscondida = "";
          for (let i = 0; i < valorDigitado.length; i++) {
            novaSenhaEscondida += "*";
          }
          usuarioSenha.value = novaSenhaEscondida;
        } else {
          usuarioSenha.value = valorDigitado;
        }
        break;
    }
  } else {
    // Caso valor alterado mas não confirmado a alteração retorna valores originais
    switch (nameInput) {
      case "nome":
        usuarioNome.value = getUsuario().nome;
        break;
      case "email":
        usuarioEmail.value = getUsuario().email;
        break;
      case "senha":
        if (eyeIcon.style.display != "none") {
          novaSenhaEscondida = "";
          for (let i = 0; i < getUsuario().senha.length; i++) {
            novaSenhaEscondida += "*";
          }
          usuarioSenha.value = novaSenhaEscondida;
        } else {
          usuarioSenha.value = getUsuario().senha;
        }
        break;
    }
  }
}

// Volta a formatação original
function formataDefault(input) {
  let editIcon = input.nextElementSibling;
  if (editIcon.nodeName == "SPAN") {
    editIcon = editIcon.firstElementChild;
  }

  let confirmIcon = editIcon.nextElementSibling;
  editIcon.style.display = "block";
  confirmIcon.style.display = "none";
  input.disabled = true;

  confirmIcon.removeEventListener("mousedown", eventoConfirm);
  confirmButton.removeEventListener("click", alteracaoConfirmada);
  cancelButton.addEventListener("click", alteracaoCancelada);
  input.removeEventListener("change", eventoChange);
  input.removeEventListener("blur", eventoBlur);
  input.removeEventListener("keydown", eventoEnter);
}

// Função assincrona que simula requisição pelo metodo PATCH
async function atualizaCadastro(nameInput) {
  let infoAtualizada = "";
  try {
    let usuario = "";
    if (!novaSenhaVista) {
      novaSenhaVista = senhaVista;
    }
    // Aproveita do metodo POST para criar objeto, o qual seria retornado pelo meotodo PACTH
    await usuarioAutalizado(
      usuarioNome.value,
      novaSenhaVista,
      usuarioEmail.value
    )
      .then((data) => {
        let dataUsuario = data.json();
        return dataUsuario;
      })
      .then((dataUsuario) => {
        usuario = dataUsuario.usuario;
      });

    // Identifica qual o campo alterado e o valor digitado
    switch (nameInput) {
      case "nome":
        infoAtualizada = usuarioNome.value;
        break;
      case "email":
        infoAtualizada = usuarioEmail.value;
        break;
      case "senha":
        infoAtualizada = novaSenhaVista;
        break;
    }

    // Atauliza no array as informações do usuario
    usuarios[indexUsuario][nameInput] = infoAtualizada;

    // Requisição, simulada, pelo metodo PATCH
    let nome = usuarioNome.value;
    let res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${nome}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          [nameInput]: infoAtualizada,
        }),
      }
    );
    if (!res.ok) {
      throw Error("Erro ao atualizar as informações");
    }
    let dados = await res.json();

    // Atualiza informações salvas no local storege
    setNewUsuario(usuario);
    setNewData(usuarios);

    return usuario;
  } catch (e) {
    console.log("Erro: ", e);
  }
}

// Caso confirmado pela caixa de dialogo
function alteracaoConfirmada() {
  // Recupera valor digitado e identifica pelo atributo name o input
  let valorDigitado = input.value;
  let nameInput = input.getAttribute("name");

  // Verifica se não existem usuarios cadastrados com a mesma informação digitada
  let disponivel = verificaDisponibilidade(nameInput, valorDigitado);
  let valido = validaInfo(nameInput, valorDigitado);
  if (disponivel && valido) {
    formataDefault(input);

    formataInputs(nameInput, valorDigitado);

    // Mostra caixa de dialogo de alteração confirmada
    confirmDialog.style.display = "none";
    dialog.style.display = "block";
    // Desabilita botões enquanto caixa tiver o dialog
    loguinBtn.removeAttribute("href");
    deleteBtn.disabled = true;
    fecharDialogBtn.focus();
    fecharDialogBtn.addEventListener("click", fecharDialog);

    // Função assincrona que simula requisição pelo metodo PATCH, para alterar informações
    atualizaCadastro(nameInput);
  } else {
    alteracaoCancelada();
  }
}

// Caso cancelado a alteração pela caixa de dialogo
function alteracaoCancelada() {
  // Volta a formatação original
  let nameInput = input.getAttribute("name");
  formataInputs(nameInput);
  formataDefault(input);

  fecharConfirmDialog();
}

function fecharDialog() {
  body.style.setProperty("--display_after_body", "none");
  dialog.style.display = "none";
  loguinBtn.setAttribute("href", "loguin.html");
  deleteBtn.disabled = false;
  fecharDialogBtn.removeEventListener("click", fecharDialog);
}

function abrirConfirmDialog() {
  confirmDialog.style.display = "block";
  body.style.setProperty("--display_after_body", "flex");
  loguinBtn.removeAttribute("href");
  deleteBtn.disabled = true;
}

function fecharConfirmDialog() {
  confirmDialog.style.display = "none";
  body.style.setProperty("--display_after_body", "none");
  loguinBtn.setAttribute("href", "loguin.html");
  deleteBtn.disabled = false;
}

// Caso o usuario clique no enter dispara evento de moseDown
export function eventoEnter(event) {
  let editIcon = input.nextElementSibling;

  if (editIcon.nodeName == "SPAN") {
    editIcon = editIcon.firstElementChild;
  }
  let confirmIcon = editIcon.nextElementSibling;
  if (event.key == "Enter") {
    event.preventDefault();
    const evt = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    confirmIcon.dispatchEvent(evt);
  }
}

// Verifica disponibilidade da informação a ser alterada
function verificaDisponibilidade(nameInput, valorDigitado) {
  let confirmaDisponibilidade = true;
  usuarios.forEach((usuario) => {
    if (nameInput == "email" && usuario.email == valorDigitado) {
      confirmaDisponibilidade = false;
    } else if (nameInput == "nome" && usuario.nome == valorDigitado) {
      confirmaDisponibilidade = false;
    }
  });

  if (!confirmaDisponibilidade) {
    switch (nameInput) {
      case "email":
        alert("Já existe um usuário com esse email!");
        break;
      case "nome":
        alert("Já existe um usuário com esse nome");
        break;
    }
  }
  return confirmaDisponibilidade;
}

// Verificação artificial do campo de email e senha
function validaInfo(nameInput, valorDigitado) {
  let formatoCorreto = true;
  switch (nameInput) {
    case "email":
      let emailValido = valorDigitado.indexOf("@");
      if (emailValido < 0) {
        formatoCorreto = false;
        alert("O email digitado não é valido");
      }
      break;
    case "senha":
      if (valorDigitado.length < 6) {
        formatoCorreto = false;
        alert("A senha deve conter no mínimo 6 caracteres");
      }
  }
  return formatoCorreto;
}

// Função que mostra a senha visualmente
export function mostraSenha() {
  eyeIcon.style.display = "none";
  eyeBlockedIcon.style.display = "block";
  if (!novaSenhaVista) {
    novaSenhaVista = senhaVista;
  }
  usuarioSenha.value = novaSenhaVista;

  eyeBlockedIcon.addEventListener("click", escondeSenha);
}

function escondeSenha() {
  eyeIcon.style.display = "block";
  eyeBlockedIcon.style.display = "none";

  if (!novaSenhaEscondida) {
    novaSenhaEscondida = senhaEscondida;
  }
  usuarioSenha.value = novaSenhaEscondida;
  eyeBlockedIcon.removeEventListener("click", escondeSenha);
}

// Função que abre opição para deletar conta do localStorege
export function deletaConta() {
  confirmMsg.style.display = "none";
  deleteMsg.style.display = "block";
  abrirConfirmDialog();
  confirmButton.focus();
  confirmButton.addEventListener("click", deletarConfirmado);
  cancelButton.addEventListener("click", deletarCancelado);
}

// Simula requisição assincrona pelo metodo delete
async function deletarConfirmado() {
  // Por se tratar de uma fake API sempre dara erro a resposta
  // Porém, selecionando o usuario pelo nome usuariamos esssa nomenclatura:

  /*let nome = usuarioNome.value;
    let res = await fetch(
      `https://jsonplaceholder.typicode.com/usuarios/nome/${nome}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      throw Error("Erro ao atualizar as informações");
    }
    let dados = await res.json();*/

  localStorage.removeItem("usuarioLogado");
  usuarios.splice(indexUsuario, 1);
  setNewData(usuarios);
  confirmButton.removeEventListener("click", deletarConfirmado);
  cancelButton.removeEventListener("click", deletarCancelado);
  window.location.href = "loguin.html";
}

function deletarCancelado() {
  fecharConfirmDialog();
  confirmMsg.style.display = "block";
  deleteMsg.style.display = "none";
  confirmButton.removeEventListener("click", deletarConfirmado);
  cancelButton.removeEventListener("click", deletarCancelado);
}
