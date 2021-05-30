import UI from "./UI.js";
(function () {
	const ui = new UI();
	let db = null;

	const cliente = {
		nombre: "",
		correo: "",
		telefono: "",
		empresa: "",
	};

	// Selectores
	const formulario = document.querySelector("#form");
	const nombre = document.querySelector("#nombre");
	const correo = document.querySelector("#correo");
	const telefono = document.querySelector("#telefono");
	const empresa = document.querySelector("#empresa");

	const setValue = (e) => {
		const clave = e.target.id;
		const value = e.target.value;
		cliente[clave] = value;
	};
	const validarForm = (e) => {
		e.preventDefault();
		const { nombre, correo, telefono, empresa } = cliente;
		if (nombre === "" || correo === "" || telefono === "" || empresa === "") {
			ui.mostrarAlerta("Todos los campos son obligatorios", "error");
		} else {
			cliente.id = Date.now();
			agregarCliente(cliente);
		}
	};
	const agregarCliente = (cliente) => {
		const tx = db.transaction("clientes", "readwrite");
		const clientesObjectStore = tx.objectStore("clientes");
		const request = clientesObjectStore.add(cliente);
		request.onsuccess = () => {
			ui.mostrarAlerta("Cliente agregado correctamente");
			resetForm();
			setTimeout(() => {
				console.log(window.location);
				window.location.href = "./index.html";
			}, 2000);
		};
		tx.oncomplete = () => {};
	};
	const abrirDB = () => {
		const request = window.indexedDB.open("clientesDB", 1);
		request.onsuccess = (e) => {
			db = e.target.result;
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
	const resetForm = () => {
		formulario.reset();
		cliente.nombre = "";
		cliente.correo = "";
		cliente.telefono = "";
		cliente.empresa = "";
	};
	const loadEventListeners = () => {
		nombre.addEventListener("input", setValue);
		correo.addEventListener("input", setValue);
		telefono.addEventListener("input", setValue);
		empresa.addEventListener("input", setValue);
		formulario.addEventListener("submit", validarForm);
	};
	const iniciarApp = () => {
		resetForm();
		abrirDB();
		loadEventListeners();
	};
	window.addEventListener("load", iniciarApp);
})();
