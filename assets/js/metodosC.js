import { subirImagen, eliminarImagen } from "./firebase.js";

import {
  addContacto,
  getContactosCollection,
  deleteContactoCollection,
  getContactoCollection,
  updateContactoCollection,
} from "./firebase.js";

window.miModal = async function (action, cecyloversId = "") {
  try {
    switch (action) {
      case "agregar":
        guardarContacto();
        break;

        case "eliminar":
          // Primero, obtenemos el contacto por su ID para asegurarnos de que tenemos la imagen
          const contactoData = await getContactoCollection(cecyloversId);
          
          if (!contactoData) {
            return Swal.fire("Error", "Contacto no encontrado", "error");
          }
  
          const confirmDelete = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esto no podrá deshacerse.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
          });
  
          if (confirmDelete.isConfirmed) {
            // Eliminar la imagen primero
            if (contactoData.imagen) {
              await eliminarImagen(contactoData.imagen);
            }
  
            // Luego eliminar el contacto
            await deleteContactoCollection(cecyloversId);
            Swal.fire("Eliminado", "Contacto eliminado correctamente", "success");
            recargarTabla();
          }
          break;

        
        
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};


// Función para guardar un nuevo contacto
window.guardarContacto = async function () {
  const nombre = document.getElementById("nombre").value.trim();
  const ap = document.getElementById("ap").value.trim();
  const am = document.getElementById("am").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const imagen = document.getElementById("imagen").value.trim(); // URL de imagen

  if (nombre && ap && am && numero && correo && imagen) {
    // Validación de formato de URL de imagen
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlRegex.test(imagen)) {
      return Swal.fire("Advertencia", "Por favor ingresa una URL de imagen válida", "warning");
    }

    try {
      await addContacto({ nombre, ap, am, numero, correo, imagen });
      Swal.fire("Éxito", "Contacto guardado correctamente", "success");
      document.getElementById("nombre").value = "";
      document.getElementById("ap").value = "";
      document.getElementById("am").value = "";
      document.getElementById("numero").value = "";
      document.getElementById("correo").value = "";
      document.getElementById("imagen").value = ""; // Limpiar URL de imagen
      recargarTabla(); // Actualiza la tabla
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  } else {
    Swal.fire("Advertencia", "Por favor llena todos los campos", "warning");
  }
};

// Función para recargar la tabla



// Función para abrir el modal de edición con los datos del contacto
window.editarContacto = async function (cecyloversId) {
  try {
    const contactoData = await getContactoCollection(cecyloversId);
    if (contactoData) {
      // Poblamos los campos del modal con los datos actuales
      const { nombre, ap, am, numero, correo } = contactoData;
      document.getElementById("editNombre").value = nombre;
      document.getElementById("editAp").value = ap;
      document.getElementById("editAm").value = am;
      document.getElementById("editNumero").value = numero;
      document.getElementById("editCorreo").value = correo;

      // Mostramos el modal para editar
      const modal = new bootstrap.Modal(document.getElementById('editContactos'));
      modal.show();

      // Guardamos el ID para la actualización posterior
      window.currentEditId = cecyloversId;
    } else {
      Swal.fire("Error", "Contacto no encontrado", "error");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

window.guardarEdicion = async function () {
  const nombre = document.getElementById("editNombre").value.trim();
  const ap = document.getElementById("editAp").value.trim();
  const am = document.getElementById("editAm").value.trim();
  const numero = document.getElementById("editNumero").value.trim();
  const correo = document.getElementById("editCorreo").value.trim();
  const imagen = document.getElementById("editImagen").value.trim(); // Nueva URL de imagen

  if (nombre && ap && am && numero && correo && imagen) {
    // Validación de formato de URL de imagen
    const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    if (!urlRegex.test(imagen)) {
      return Swal.fire("Advertencia", "Por favor ingresa una URL de imagen válida", "warning");
    }

    try {
      await updateContactoCollection(window.currentEditId, { nombre, ap, am, numero, correo, imagen });
      Swal.fire("Éxito", "Contacto actualizado correctamente", "success");
      recargarTabla();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  } else {
    Swal.fire("Advertencia", "Por favor llena todos los campos", "warning");
  }
};


async function recargarTabla() {
  const tbody = document.getElementById("tcontactos");
  tbody.innerHTML = ""; // Limpiar la tabla
  try {
    const contactos = await getContactosCollection();
    contactos.forEach((contacto, index) => {
      const { id, nombre, ap, am, numero, correo, imagen } = contacto;
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>
            <img src="${imagen}" alt="Contacto" style="height: 50px;">
          </td>
          <td>${nombre}</td>
          <td>${ap}</td>
          <td>${am}</td>
          <td>${numero}</td>
          <td>${correo}</td>
          <td>
            <button class="btn btn-primary" onclick="editarContacto('${id}')">Editar</button>
            <button class="btn btn-danger" onclick="miModal('eliminar', '${id}')">Eliminar</button>
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error al cargar la tabla:", error);
    Swal.fire("Error", "No se pudo cargar la tabla", "error");
  }
}


// Inicialización de la tabla al cargar la página
recargarTabla();

