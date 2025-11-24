import {
  getSavedData,
  usuarioNome,
  usuarioSenha,
  setNewUsuario,
} from "./shared.js";

import verificaUsuario from "./shared.js";

const loguinForm = document.getElementById("loguinForm");
let usuario = "";

loguinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let nomeValor = usuarioNome.value;
  let senhaValor = usuarioSenha.value;
  // Simula requisição para confirmar se já possui cadastro
  validaUsuario(nomeValor, senhaValor)
    .then((usuario) => {
      if (usuario) {
        // Direciona usuário para pagina com informações de cadastro
        setNewUsuario(usuario);
        window.location.href = "usuario.html";
      }
    })
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
        confirmaCadastro = dado;
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

// Função assincrona que simula requisição para o servidar validar se existe o usuario
async function validaUsuario(nomeValor, senhaValor) {
  try {
    // Mesmo que estejamos usando a nossa fake API a requisição sempre retornará erro
    // Porém pela maneira que estamos construindo o código fariamos a requisição desta maneira
    /*let res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/usuarios?nome=${nome}`
    );

    if (!res.ok) {
      throw Error("Erro ao fazer loguin");
    }
    let dados = res.json();*/

    // Reaproveita metodo post para criar objeto e armazenar no local Storege
    await verificaUsuario(nomeValor, senhaValor)
      .then((data) => {
        let loguinInfo = data.json();
        return loguinInfo;
      })
      .then((loguinInfo) => {
        let usuarioInfo = loguinInfo.usuario;
        // Manda informações do objeto para função que confirma se o cadastro já existe
        usuario = confereCadastro(usuarioInfo);
        return usuario;
      });
    return usuario;
  } catch (e) {
    console.log("Erro: ", e);
  }
}
