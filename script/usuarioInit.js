// Formatação inicial da tela de usuarios
import {
  getSavedData,
  usuarioNome,
  usuarioEmail,
  usuarioSenha,
} from "./shared.js";

export const confirmButton = document.getElementById("confirm-dialog-button");
export const cancelButton = document.getElementById("cancel-dialog-button");
export const confirmDialog = document.getElementById("confirm-dialog");
export let senhaEscondida = "";
export let senhaVista = "";
export let usuarios = [];
export let indexUsuario = 0;

// Recupera dados do usuario logado
export function getUsuario() {
  let usuarioDado = localStorage.getItem("usuarioLogado");
  usuarioDado = JSON.parse(usuarioDado);
  return usuarioDado && usuarioDado ? usuarioDado : 0;
}

// Preenche os campos com as informações de cadastro
(() => {
  usuarioNome.value = getUsuario().nome;
  usuarioEmail.value = getUsuario().email;
  senhaVista = getUsuario().senha;
  // Esconde visualmente a senha
  for (let i = 0; i < getUsuario().senha.length; i++) {
    senhaEscondida += "*";
  }
  usuarioSenha.value = senhaEscondida;

  // Adiciona todos os usuarios salvos ao array retornando o index do atual logado
  getSavedData().forEach((data) => {
    usuarios.push(data);
  });
  indexUsuario = usuarios.findIndex(
    (usuario) => usuario.nome === getUsuario().nome
  );
})();
