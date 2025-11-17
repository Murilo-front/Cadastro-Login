import {
  getSavedData,
  usuarioNome,
  usuarioSenha,
  inputs,
  fecharDialogBtn,
  dialog,
  cadastroBtn,
  loguinBtn,
  body,
} from "./shared.js";

import verificaUsuario from "./shared.js";

const esqueceuSenhaBtn = document.getElementById("esqueceu-senha-btn");
const loguinForm = document.getElementById("loguinForm");

loguinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let nomeValor = usuarioNome.value;
  let senhaValor = usuarioSenha.value;
  // Envia informações para realizar validação das mesmas pela promisse
  verificaUsuario(nomeValor, senhaValor)
    .then((res) => {
      if (!res.ok) {
        throw Error("Erro ao fazer loguin");
      }
      let dados = res.json();
      return dados;
    })
    .then((loguinInfo) => {
      let usuarioInfo = loguinInfo.usuario;
      // Manda informações do objeto para função que confirma se o cadastro já existe
      let cadastrado = confereCadastro(usuarioInfo);
      if (cadastrado) {
        // Função que formata elementos visuais caso loguin efetuado
        cadastroFeito();
      }
    })
    .catch((error) => console.log("Erro: ", error.message))
    .finally(() => {
      // Independente se o loguin é realizado ou não zera o valor dos inputs
      usuarioNome.value = "";
      usuarioSenha.value = "";
      usuarioNome.focus();
    });
});

// Função que retorna booleano para confrimar se cadastro existe
function confereCadastro(usuarioInfo) {
  let confirmaCadastro = false;
  let divergencia = "";
  // Confere se tem informações salvas
  if (getSavedData().length) {
    const dados = getSavedData();
    dados.forEach((dado) => {
      // Confere se pelo menos alguma das informações digitadas coincide com as armazenadas
      if (dado.nome == usuarioInfo.nome && dado.senha != usuarioInfo.senha) {
        divergencia = "senha";
      } else if (
        dado.nome == usuarioInfo.nome &&
        dado.senha == usuarioInfo.senha
      ) {
        divergencia = "nenhuma";
        confirmaCadastro = true;
      }
    });
    // Caso nennhuma informação coincida informa que a divergencia é o usuario
    if (divergencia == "") {
      divergencia = "usuario";
    }
    switch (divergencia) {
      case "senha":
        alert("Senha incorreta");
        break;
      case "usuario":
        alert("Usuário não cadastrado");
        break;
    }
    return confirmaCadastro;
  } else {
    alert("Nenhum usuário cadastrado");
    return confirmaCadastro;
  }
}

// Função para mostrar o dialog caso cadastro foi realizado
function cadastroFeito() {
  dialog.style.display = "block";
  body.style.setProperty("--display_after_body", "flex");
  // Desabilita o botões e links, assim como os inputs
  cadastroBtn.removeAttribute("href");
  esqueceuSenhaBtn.removeAttribute("href");
  loguinBtn.disabled = true;
  inputs.forEach((input) => {
    input.disabled = true;
  });

  // Cria event listner de click para o botão de fechar o dialog
  fecharDialogBtn.addEventListener(
    "click",
    () => {
      // Remove todas as propriedades e formatações acrescentadas
      dialog.style.display = "none";
      body.style.removeProperty("--display_after_body");
      // Abilita novamente os botões e os inputs
      inputs.forEach((input) => {
        input.disabled = false;
      });
      usuarioNome.focus();
      cadastroBtn.setAttribute("href", "index.html");
      esqueceuSenhaBtn.setAttribute("href", "#");
      loguinBtn.disabled = false;
    },
    { once: true }
  );
}
