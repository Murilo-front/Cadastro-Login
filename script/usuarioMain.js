import {
  eventoChange,
  eventoBlur,
  eventoConfirm,
  eventoEnter,
  mostraSenha,
  deletaConta,
  deleteBtn,
  eyeIcon,
} from "./usuarioFunctions.js";

const editIcons = document.querySelectorAll("img[alt='pencil icon']");

export let input = 0; // Variavel global para indicar input selecionado

editIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // Seleciona os icones e inputs por parentesco
    let divPai = icon.parentNode;
    if (divPai.nodeName == "SPAN") {
      divPai = divPai.parentNode;
    }
    input = divPai.querySelector("input");
    let confirmIcon = icon.nextElementSibling;
    input.disabled = false;
    input.focus();
    icon.style.display = "none";
    confirmIcon.style.display = "block";

    // Três opições de evento:
    // Caso o usuário mude a informação mas clique fora do input
    // Caso o usuário não mude nada e só clique fora
    // Caso o usuário mude informação e confirme
    // Caso o ussuario clique no enter
    confirmIcon.addEventListener("mousedown", eventoConfirm, { capture: true });
    input.addEventListener("keydown", eventoEnter);
    input.addEventListener("change", eventoChange);
    input.addEventListener("blur", eventoBlur);
  });
});

// Funcionalidade do simbolo de olho: mostra e esconde a senha
eyeIcon.addEventListener("click", mostraSenha);

// Funcionalidade para o botão de deletar conta
deleteBtn.addEventListener("click", deletaConta);
