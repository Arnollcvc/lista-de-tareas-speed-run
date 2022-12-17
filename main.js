const contenido = document.getElementById("content");
const taskList = document.getElementById("lista");
const form = document.getElementById("formListaLoL"); 
let lista = JSON.parse(localStorage.getItem("items")) || [];
let element = (data) => {
  return String.raw`
    <li class="item-lol">
      <input class="rm-btn btn" type="submit" value="eliminar">
      <input type="submit" class="btn update-btn" value="editar">
      <p>${data}</p>
    </li>
  `;
};

function showItems() {
  taskList.innerHTML = "";
  const lista = JSON.parse(localStorage.getItem("items")) || [];
  if (lista.length === 0) {
    let noTieneNotas = String.raw`
    <li class="item-lol">
      <p style="text-align:center;">Lista vacía</p>
    </li>
  `;
    return taskList.insertAdjacentHTML(
      "beforeend",
      noTieneNotas
    );
  }

  lista.reverse().forEach((item) => {
    const elementos = String.raw`
    ${item.completado ? '<label for="item-lol" class="labelol-completado">Completado</label>' : '<label for="item-lol" class="labelol-pendiente">Pendiente</label>'}
      <li class="item-lol" data-id="${item.id}">
        <input class="rm-btn btn" type="submit" value="eliminar" data-id="${item.id}">
        <input type="submit" class="btn update-btn" value="editar" data-id="${item.id}">
        <input type="submit" class="btn complete-btn" value="Listo" data-id="${item.id}">

        <p id="edit-modal">${item.msg}</p>
      </li>
    `;
    taskList.insertAdjacentHTML("beforeend", elementos);
  });
}

let addItem = document.querySelectorAll(".add-item")
addItem.forEach((item) => {
  item.addEventListener("submit", (e) => {
    e.stopPropagation();
    if (contenido.value.trim().length === 0) return;
  
    lista.push({
      id: lista.length + 1,
      msg: contenido.value,
      completado: false,
    });
  
    localStorage.setItem("items", JSON.stringify(lista));
    contenido.value = "";
    showItems()
  })
});

let actionItem = document.querySelectorAll(`ul`);
actionItem.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.className.includes("rm-btn")) {
      lista = lista.filter((i) => i.id != e.target.dataset.id);
      localStorage.setItem("items", JSON.stringify(lista));
    } else if (e.target.className.includes("update-btn")) {

      const taskIndex = lista.findIndex(i => i.id == e.target.dataset.id)

      showStakEdit(lista[taskIndex].msg);
      editItem(taskIndex)

    } else if (e.target.className.includes("complete-btn")) {
      const taskIndex = lista.findIndex(i => i.id == e.target.dataset.id)
      if (lista[taskIndex].completado) return;
      lista[taskIndex].completado = true
      localStorage.setItem("items", JSON.stringify(lista))
      showItems();
    }
    showItems();
  });
});

let showStakEdit = (msg) => {

  let body = document.getElementById("edit-lol");
  let datas = String.raw`
    <div class="edit-task" id="edit-task">
      <div class="edit-task-content">
        <h3>Edita tu Tarea</h3>
        <input type="text" name="editar" id="edit-task-input" value="${msg}">
        <input class="btn ok-btn" id="btn-ok" type="submit" value="ok">
      <div/>
    </div>
  `;

  body.insertAdjacentHTML("beforebegin", datas)
}

let editItem = (index) => {
  let boton = document.getElementById("btn-ok");
  boton.addEventListener("click", (e) => {
    e.stopPropagation()
    let nuevoMsg = document.getElementById("edit-task-input");
    let panelEditor = document.getElementById("edit-task");
    if (nuevoMsg.value.trim().length == 0) return;
    lista[index].msg = nuevoMsg.value
    lista[index].completado = false
    localStorage.setItem("items", JSON.stringify(lista))
    panelEditor.remove()
    showItems()
  })
}


// window.addEventListener("keydown", () => contenido.focus())
window.addEventListener("load", () => contenido.focus());
form.addEventListener("submit", (e) => {
  e.preventDefault()
  addItem
});
showItems();
