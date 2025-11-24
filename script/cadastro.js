<<<<<<< HEAD
import {
  getSavedData,
  usuarioNome,
  usuarioEmail,
  usuarioSenha,
  inputs,
  fecharDialogBtn,
  dialog,
  cadastroBtn,
  loguinBtn,
  body,
  setNewData,
} from "./shared.js";

import cadastraUsuario from "./shared.js";

const cadastroForm = document.getElementById("cadastroForm");
let usuarios = [];

(() => {
  if (getSavedData().length >= 0) {
    getSavedData().forEach((usuario) => {
      // Da o push apenas do objeto usuario criado na promisse
      usuarios.push(usuario);
    });
  }
})();

// Cria event listner de input para inpedir que o usuário coloque espaço em qualquer input
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let valorDigitado = e.target.value;
    let achaEspaco = valorDigitado.indexOf(" ");
    if (achaEspaco >= 0) {
      input.value = valorDigitado.replace(" ", "");
    }
  });
});

cadastroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let nomeValor = usuarioNome.value;
  let emailValor = usuarioEmail.value;
  let senhaValor = usuarioSenha.value;
  // Evnia informações dos inputs para função que realiza a promisse
  cadastraUsuario(nomeValor, senhaValor, emailValor)
    .then((res) => {
      if (!res.ok) {
        throw Error("Erro ao cadastrar usário");
      }
      let dados = res.json();
      return dados;
    })
    .then((cadastroInfo) => {
      let usuarioInfo = cadastroInfo.usuario;
      let cadastroNovo = true;
      if (usuarios.length) {
        // Manda informações do objeto para função que confirma se o cadastro já existe
        cadastroNovo = disponibilidadeCadastro(usuarioInfo);
      }
      // Caso não exista o cadastro:
      // Acrescenta objeto dentro do array usuarios
      // Atualiza informações do local storege
      // Ativa função que mostra o dialog, confirmando que o cadastro foi realizado ao usuario
      if (cadastroNovo) {
        usuarios.push(usuarioInfo);
        setNewData(usuarios);
        cadastroFeito();
      }
    })
    .catch((error) => console.log("Erro: ", error.message))
    .finally(() => {
      // Independente se o cadastro é novo ou não zera o valor dos inputs
      usuarioNome.value = "";
      usuarioEmail.value = "";
      usuarioSenha.value = "";
      usuarioNome.focus();
    });
});

// Função que verifica se o cadastro já existe
function disponibilidadeCadastro(cadastroInfo) {
  let confirmaDisponibilidade = true;
  let igualdade = "";
  // Confirma qual das informações já tem cadastro: email ou nome de usuario (com prioridade no email)
  // Atribui texto a variavel igualdade para indicar qual dos campos estão já existe
  usuarios.forEach((usuario) => {
    if (usuario.email == cadastroInfo.email) {
      igualdade = "email";
      confirmaDisponibilidade = false;
    } else if (usuario.nome == cadastroInfo.nome && igualdade != "email") {
      igualdade = "nome";
      confirmaDisponibilidade = false;
    }
  });

  if (!confirmaDisponibilidade) {
    switch (igualdade) {
      case "email":
        alert("Já existe um usuário com esse email!");
        break;
      case "nome":
        alert("Já existe um usuário com esse nome");
        break;
    }
  }
  // Retorna variavel boleana que indica se o cadastro é novo ou não
  return confirmaDisponibilidade;
}

// Função para mostrar o dialog caso cadastro foi realizado
function cadastroFeito() {
  dialog.style.display = "block";
  body.style.setProperty("--display_after_body", "flex");
  // Desabilita o botões e links, assim como os inputs
  loguinBtn.removeAttribute("href");
  cadastroBtn.disabled = true;
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
      loguinBtn.setAttribute("href", "loguin.html");
      cadastroBtn.disabled = false;
    },
    { once: true }
  );
}
=======
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

import cadastraUsuario from "./shared.js";

const usuarioEmail = document.getElementById("input-email");
const cadastroForm = document.getElementById("cadastroForm");
let usuarios = [];

(() => {
  if (getSavedData().length >= 0) {
    getSavedData().forEach((usuario) => {
      // Da o push apenas do objeto usuario criado na promisse
      usuarios.push(usuario);
    });
  }
  console.log(usuarios);
})();

// Cria event listner de input para inpedir que o usuário coloque espaço em qualquer input
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    let valorDigitado = e.target.value;
    let achaEspaco = valorDigitado.indexOf(" ");
    if (achaEspaco >= 0) {
      input.value = valorDigitado.replace(" ", "");
    }
  });
});

cadastroForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let nomeValor = usuarioNome.value;
  let emailValor = usuarioEmail.value;
  let senhaValor = usuarioSenha.value;
  // Evnia informações dos inputs para função que realiza a promisse
  cadastraUsuario(nomeValor, senhaValor, emailValor)
    .then((res) => {
      if (!res.ok) {
        throw Error("Erro ao cadastrar usário");
      }
      let dados = res.json();
      return dados;
    })
    .then((cadastroInfo) => {
      let usuarioInfo = cadastroInfo.usuario;
      let cadastroNovo = true;
      if (usuarios.length) {
        // Manda informações do objeto para função que confirma se o cadastro já existe
        cadastroNovo = disponibilidadeCadastro(usuarioInfo);
      }
      // Caso não exista o cadastro:
      // Acrescenta objeto dentro do array usuarios
      // Atualiza informações do local storege
      // Ativa função que mostra o dialog, confirmando que o cadastro foi realizado ao usuario
      if (cadastroNovo) {
        usuarios.push(usuarioInfo);
        setNewData();
        cadastroFeito();
      }
    })
    .catch((error) => console.log("Erro: ", error.message))
    .finally(() => {
      // Independente se o cadastro é novo ou não zera o valor dos inputs
      usuarioNome.value = "";
      usuarioEmail.value = "";
      usuarioSenha.value = "";
      usuarioNome.focus();
    });
});

function setNewData() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Função que verifica se o cadastro já existe
function disponibilidadeCadastro(cadastroInfo) {
  let confirmaDisponibilidade = true;
  let igualdade = "";
  // Confirma qual das informações já tem cadastro: email ou nome de usuario (com prioridade no email)
  // Atribui texto a variavel igualdade para indicar qual dos campos estão já existe
  usuarios.forEach((usuario) => {
    if (usuario.email == cadastroInfo.email) {
      igualdade = "email";
      confirmaDisponibilidade = false;
    } else if (usuario.nome == cadastroInfo.nome && igualdade != "email") {
      igualdade = "nome";
      confirmaDisponibilidade = false;
    }
  });

  if (!confirmaDisponibilidade) {
    switch (igualdade) {
      case "email":
        alert("Já existe um usuário com esse email!");
        break;
      case "nome":
        alert("Já existe um usuário com esse nome");
        break;
    }
  }
  // Retorna variavel boleana que indica se o cadastro é novo ou não
  return confirmaDisponibilidade;
}

// Função para mostrar o dialog caso cadastro foi realizado
function cadastroFeito() {
  dialog.style.display = "block";
  body.style.setProperty("--display_after_body", "flex");
  // Desabilita o botões e links, assim como os inputs
  loguinBtn.removeAttribute("href");
  cadastroBtn.disabled = true;
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
      loguinBtn.setAttribute("href", "loguin.html");
      cadastroBtn.disabled = false;
    },
    { once: true }
  );
}
>>>>>>> de01902203c9ad1b75bd23f924ec1b7f055f9092
