export const usuarioNome = document.getElementById("input-nome");
export const usuarioSenha = document.getElementById("input-senha");
export const inputs = document.querySelectorAll("input");
export const fecharDialogBtn = document.getElementById("fechar-dialog");
export const dialog = document.getElementById("dialog");
export const body = document.querySelector("body");
export const cadastroBtn = document.getElementById("cadastroBtn");
export const loguinBtn = document.getElementById("loguinBtn");

export function getSavedData() {
  let usuariosDados = localStorage.getItem("usuarios");
  usuariosDados = JSON.parse(usuariosDados);
  return usuariosDados && usuariosDados.length ? usuariosDados : 0;
}

// Função assincrona que recebe informações do form e simula o envio delas para uma API
export default async function (nomeValor, senhaValor, emailValor) {
  // Cria objeto, o qual, se tiver informação de email acrescenta
  let usuario = {};
  if (emailValor) {
    usuario = {
      nome: nomeValor,
      email: emailValor,
      senha: senhaValor,
    };
  } else {
    usuario = {
      nome: nomeValor,
      senha: senhaValor,
    };
  }
  // Envia, pelo metodo POST, um objeto com informações do form para uma fake API
  let res = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    body: JSON.stringify({ usuario }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return res;
}
