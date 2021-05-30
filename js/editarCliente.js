import UI from "./UI.js";
const ui = new UI();
(function () {
	let db = null;
	let dataCliente;
	const queryString = window.location.search;
	const usp = new URLSearchParams(queryString);
	const dataID = Number(usp.get("id"));
	// Selectores
	const formulario = document.querySelector("#form");
	const inputNombre = formulario.querySelector("#nombre");
	const inputCorreo = formulario.querySelector("#correo");
	const inputTelefono = formulario.querySelector("#telefono");
	const inputEmpresa = formulario.querySelector("#empresa");
	// Functions
	const setValue = (e) => {
		const clave = e.target.id;
		const value = e.target.value;
		dataCliente[clave] = value;
	};
	const llenarForm = (cliente) => {
		const { nombre, correo, telefono, empresa, id } = cliente;
		inputNombre.value = nombre;
		inputCorreo.value = correo;
		inputTelefono.value = telefono;
		inputEmpresa.value = empresa;
		// Llenar obj
		dataCliente.nombre = nombre;
		dataCliente.correo = correo;
		dataCliente.telefono = telefono;
		dataCliente.empresa = empresa;
		dataCliente.id = id;
	};
	// DB
	const getDataDB = (dataID) => {
		const tx = db.transaction("clientes");
		const clientesObjectStore = tx.objectStore("clientes");
		const request = clientesObjectStore.get(dataID);
		request.onsuccess = (e) => {
			dataCliente = e.target.result;
			if (dataCliente) {
				llenarForm(dataCliente);
			} else {
				window.location.href = "index.html";
			}
		};
	};
	const openDB = () => {
		const request = window.indexedDB.open("clientesDB", 1);
		request.onsuccess = (e) => {
			db = e.target.result;
			getDataDB(dataID);
		};
		request.onupgradeneeded = (e) => {
			db = e.target.result;
			const clientesObjectStore = db.createObjectStore("clientes", {
				keyPath: "id",
			});
			clientesObjectStore.createIndex("nombre", "nombre", { unique: false });
			clientesObjectStore.createIndex("correo", "correo", { unique: true });
			clientesObjectStore.createIndex("telefono", "telefono", {
				unique: false,
			});
			clientesObjectStore.createIndex("empresa", "empresa", {
				unique: false,
			});
			clientesObjectStore.createIndex("id", "id", {
				unique: true,
			});
		};
	};
	const modificarDataDB = (e) => {
		e.preventDefault();
		const { nombre, correo, telefono, empresa } = dataCliente;
		if (nombre === "" || correo === "" || telefono === "" || empresa === "") {
			ui.mostrarAlerta("Todos los campos son obligatorios", "error");
			return;
		}
		const tx = db.transaction("clientes", "readwrite");
		const clientesObjectStore = tx.objectStore("clientes");
		const request = clientesObjectStore.put(dataCliente);
		request.onsuccess = () => {
			ui.mostrarAlerta("Cliente modificado correctamente");
		};
		tx.oncomplete = () => {
			setTimeout(() => {
				window.location.replace("index.html");
			}, 2500);
		};
	};
	window.addEventListener("load", openDB);

	// Eventos del formulario
	inputNombre.addEventListener("input", setValue);
	inputCorreo.addEventListener("input", setValue);
	inputTelefono.addEventListener("input", setValue);
	inputEmpresa.addEventListener("input", setValue);
	// submit
	formulario.addEventListener("submit", modificarDataDB);
})();
