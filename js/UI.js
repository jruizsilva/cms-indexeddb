export default class UI {
	constructor() {}
	mostrarAlerta(msj, tipo) {
		const formulario = document.querySelector("#form");
		const templateAlerta = document.querySelector("#template-alerta").content;
		templateAlerta.querySelector("#alerta__p").textContent = msj;
		if (tipo === "error") {
			templateAlerta.querySelector("#alerta").classList.remove("bg-green");
		} else {
			templateAlerta.querySelector("#alerta").classList.add("bg-green");
		}
		const clone = templateAlerta.cloneNode(true);
		if (document.querySelectorAll("#alerta").length === 0) {
			formulario.appendChild(clone);
		}
		setTimeout(() => {
			formulario.querySelector("#alerta").remove();
		}, 3000);
	}
}
