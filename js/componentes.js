"use strict";

async function cargarComponentes() {
    const headerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <img src="assets/img/logo.png" alt="Logo Dental Clinic" style="height: 40px;" class="me-2">
                <span class="fw-bold fs-4 text-primary">Dental</span>
                <span class="fw-light fs-4 text-secondary ms-1">Clinic</span>
            </a>
            <div class="ms-auto">
                <a class="btn btn-outline-primary btn-sm me-2" href="crear-cita.html">Nueva Cita</a>
                <a class="btn btn-outline-secondary btn-sm" href="listado-citas.html">Listado</a>
            </div>
        </div>
    </nav>`;

    const footerHTML = `
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-4 text-center text-md-start">
                <span class="fw-bold text-primary">App de gestión de citas.</span>
            </div>
            <div class="col-md-4 text-center my-3 my-md-0">
                <img src="assets/img/logo.png" alt="Logo" style="height: 45px;">
            </div>
            <div class="col-md-4 text-center text-md-end">
                <div id="fecha-actual" class="fw-bold text-dark"></div>
                <div id="hora-actual" class="text-primary small"></div>
            </div>
        </div>
    </div>`;

    const headerElement = document.getElementById('main-header');
    const footerElement = document.getElementById('main-footer');

    if (headerElement) headerElement.innerHTML = headerHTML;
    if (footerElement) footerElement.innerHTML = footerHTML;
}

document.addEventListener('DOMContentLoaded', cargarComponentes);