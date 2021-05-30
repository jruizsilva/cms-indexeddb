(function () {
	// Variables
	let db = null;
	// Selectores
	const tableBody = document.querySelector("#table__body");

	// BD
	const crearBD = () => {
		const request = window.indexedDB.open("clientesDB", 1);
		request.onsuccess = (e) => {
			db = e.target.result;
			showDataDB();
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
	const showDataDB = () => {
		console.log("mostrando data");
		limpiarHTML();

		const template = document.querySelector("#template-row").content;
		const fragment = document.createDocumentFragment();
		const tx = db.transaction("clientes");
		const clientes = tx.objectStore("clientes");
		const request = clientes.openCursor();
		request.onsuccess = (e) => {
			const cursor = e.target.result;
			if (cursor) {
				const { nombre, correo, telefono, empresa, id } = cursor.value;
				console.log(cursor.value);
				template.querySelector("#nombre").textContent = nombre;
				template.querySelector("#correo").textContent = correo;
				template.querySelector("#telefono").textContent = telefono;
				template.querySelector("#empresa").textContent = empresa;
				template
					.querySelector("#editar")
					.setAttribute("href", `editar-cliente.html?id=${id}`);
				template.querySelector("#eliminar").setAttribute("data-id", id);

				const clone = template.cloneNode(true);
				fragment.appendChild(clone);
				cursor.continue();
			}
		};
		tx.oncomplete = () => {
			tableBody.appendChild(fragment);
		};
	};
	const limpiarHTML = () => {
		while (tableBody.firstChild) {
			tableBody.removeChild(tableBody.firstChild);
		}
	};
	const eliminarData = (e) => {
		if (e.target.id === "eliminar") {
			const dataID = Number(e.target.getAttribute("data-id"));
			if (confirm("Deseas eliminar este cliente?")) {
				const tx = db.transaction("clientes", "readwrite");
				const clientesObjectStore = tx.objectStore("clientes");
				clientesObjectStore.delete(dataID);
				tx.oncomplete = () => {
					showDataDB();
				};
			}
		}
	};
	document.addEventListener("DOMContentLoaded", crearBD);

	tableBody.addEventListener("click", eliminarData);
})();
