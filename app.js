if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
    console.log("Entre al SW con Exito");
  }
  
  
  // Obtener referencias a los elementos del DOM
  const inputNombre = document.getElementById("nombre");
  const selectTamaño = document.getElementById("tamaño");
  const inputCantidad = document.getElementById("cantidad");
  const inputPrecio = document.getElementById("precio");
  const tabla = document.getElementById("contTabla");
  const tabla2 = document.getElementById("tabla2");
  const inputImagen = document.getElementById("imagenF")
  const inputTotal = document.getElementById("total");
  const muestra = document.getElementById("muestra");
  const imagenPredeterminada = "default.jpeg";
  const imagenProducto = document.getElementById("muestra");
  let filaEditando = null;
  
  var db = new Pouch('tienda');
  
  function agregarDB(nom, tam, cant, prec, data, total){
      let producto = {
          nombre: nom,
          tamaño: tam,
          cantidad: cant,
          data: data,
          precio: prec,
          total: total
      }
  db.post(producto);
  }
  
  function guardar() {
    var files = inputImagen.files;
  
  
          if (files.length > 0) {
            var imagenSeleccionada = files[0];
            convertirImagenABase64(imagenSeleccionada, function (base64Data) {
  
      let nom = inputNombre.value;
      let tamaño = selectTamaño.options[selectTamaño.selectedIndex].text;
      let cantidad = inputCantidad.value;
      let precio = inputPrecio.value;
      let total = inputPrecio.value * inputCantidad.value;
  
      if (filaEditando) {
          filaEditando.cells[0].innerHTML = `<img src="data:image/jpeg;base64,${base64Data}" alt="" style="max-width: 120px;">`;
          filaEditando.cells[1].textContent = nom;
          filaEditando.cells[2].textContent = tamaño;
          filaEditando.cells[3].textContent = cantidad;
          filaEditando.cells[4].textContent = precio;
          filaEditando.cells[5].textContent = total;
          filaEditando.style.display = '';  
          filaEditando = null;
      } else {
          tabla.innerHTML += `
          <tr>
          <td> <img src="data:image/jpeg;base64,${base64Data}" alt="" style="max-width: 120px;"></td>
              <td>${nom}</td>
              <td>${tamaño}</td>
              <td>${cantidad}</td>
              <td>${precio}</td>
              <td>${total}</td>
              <td>
                  <a href="#" class="btn btn-info m-1" onclick="editarFila(this)">Editar</a>
                  <a href="#" class="btn btn-danger m-1" onclick="eliminarFila(this)">Eliminar</a>
              </td>
          </tr>
          `;
          tabla2.style.display = 'block';
      }
  
      agregarDB(nom, tamaño, cantidad, precio, base64Data,total);
  
      limpiar();
  
    });
  }else{
    let nom = inputNombre.value;
      let tamaño = selectTamaño.options[selectTamaño.selectedIndex].text;
      let cantidad = inputCantidad.value;
      let precio = inputPrecio.value;
      let total = precio * cantidad;
  
      if (filaEditando) {
        filaEditando.cells[0].innerHTML = `<img src="${imagenPredeterminada}" alt="" style="max-width: 120px;">`;
        filaEditando.cells[1].textContent = nom;
        filaEditando.cells[2].textContent = tamaño;
        filaEditando.cells[3].textContent = cantidad;
        filaEditando.cells[4].textContent = precio;
        filaEditando.cells[5].textContent = total;
        filaEditando.style.display = '';
        filaEditando = null;
      } else {
        tabla.innerHTML += `
          <tr>
            <td> <img src="${imagenPredeterminada}" alt="" style="max-width: 120px;"></td>
            <td>${nom}</td>
            <td>${tamaño}</td>
            <td>${cantidad}</td>
            <td>${precio}</td>
            <td>${total}</td>
            <td>
              <a href="#" class="btn btn-info m-1" onclick="editarFila(this)">Editar</a>
              <a href="#" class="btn btn-danger m-1" onclick="eliminarFila(this)">Eliminar</a>
            </td>
          </tr>
        `;
        tabla2.style.display = 'block';
      }
  
      agregarDB(nom, tamaño, cantidad, precio, imagenPredeterminada, total);
  
      limpiar();
    }
  }
  
  function editarFila(botonEditar) {
      filaEditando = botonEditar.closest('tr');
      inputNombre.value = filaEditando.cells[1].textContent;
      selectTamaño.value = filaEditando.cells[2].textContent;
      inputCantidad.value = filaEditando.cells[3].textContent;
      inputPrecio.value = filaEditando.cells[4].textContent;
      muestra.src = filaEditando.cells[0].querySelector('img').src;
      
      filaEditando.style.display = 'none';
  }
  
  function eliminarFila(botonEliminar) {
      let filaEliminar = botonEliminar.closest('tr');
      filaEliminar.remove();
  }
  
  function limpiar(){
    inputNombre.value = "";
    inputCantidad.value = "";
    inputPrecio.value = "";
    inputImagen.value = "";
    selectTamaño.value = "Chico";
    imagenProducto.src = imagenPredeterminada;
  }
  
  inputImagen.addEventListener("change", function () {
    const archivo = inputImagen.files[0];
  
    if (archivo) {
      // Si se selecciona un archivo, muestra la imagen seleccionada
      const reader = new FileReader();
      reader.onload = function (e) {
        imagenProducto.src = e.target.result;
      };
      reader.readAsDataURL(archivo);
    } else {
      // Si no se selecciona ningún archivo, vuelve a la imagen predeterminada
      imagenProducto.src = imagenPredeterminada;
    }
  });
  
  function convertirImagenABase64(imagen, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var base64Data = event.target.result.split(",")[1];
      callback(base64Data);
    };
    reader.readAsDataURL(imagen);
  }