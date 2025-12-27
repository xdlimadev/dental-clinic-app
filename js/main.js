"use strict";

const STORAGE_KEY = 'citas_dental_clinic';

class Cita {
    constructor(id, fechaCita, horaCita, nombre, apellido1, apellido2, dni, telefono, fechaNacimiento, observaciones) {
        this.id = id;
        this.fechaCita = fechaCita;
        this.horaCita = horaCita;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.dni = dni;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.observaciones = observaciones;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarReloj();

    const formCita = document.getElementById('formCita');
    if (formCita) {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit');

        if (editId) {
            const listado = obtenerCitas();
            const encontrada = listado.find(c => c.id == editId);
            if (encontrada) {
                document.getElementById('tituloAddModif').innerHTML = '<i class="bi bi-calendar-plus me-2"></i>Editar Cita Médica';
                document.getElementById('fechaCita').value = encontrada.fechaCita + "T" + encontrada.horaCita;
                document.getElementById('dni').value = encontrada.dni;
                document.getElementById('nombre').value = encontrada.nombre;
                document.getElementById('apellido1').value = encontrada.apellido1;
                document.getElementById('apellido2').value = encontrada.apellido2;
                document.getElementById('telefono').value = encontrada.telefono;
                document.getElementById('fechaNacimiento').value = encontrada.fechaNacimiento;
                document.getElementById('observaciones').value = encontrada.observaciones;

                const btnSubmit = formCita.querySelector('button[type="submit"]');
                if (btnSubmit) btnSubmit.textContent = "Guardar Cambios";
            }
        }

        formCita.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validarFormulario()) {
                const rawFecha = document.getElementById('fechaCita').value;
                const fechaHora = rawFecha.split('T');

                const registro = new Cita(
                    editId ? parseInt(editId) : Date.now(),
                    fechaHora[0],
                    fechaHora[1],
                    document.getElementById('nombre').value,
                    document.getElementById('apellido1').value,
                    document.getElementById('apellido2').value,
                    document.getElementById('dni').value,
                    document.getElementById('telefono').value,
                    document.getElementById('fechaNacimiento').value,
                    document.getElementById('observaciones').value
                );

                let almacenamiento = obtenerCitas();
                if (editId) {
                    const idx = almacenamiento.findIndex(c => c.id == editId);
                    almacenamiento[idx] = registro;
                } else {
                    almacenamiento.push(registro);
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(almacenamiento));

                mostrarMensaje('Los datos se han guardado correctamente.', 'success');
                setTimeout(() => {
                    window.location.href = 'listado-citas.html';
                }, 1500);
            }
        });
    }

    const tablaListado = document.getElementById('tablaCitasBody');
    if (tablaListado) {
        let citas = obtenerCitas();
        const ahora = new Date();
        const  inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

        citas = citas.filter(cita => {
            const fechaCita = new Date(`${cita.fechaCita}T${cita.horaCita}`);
            return fechaCita >= inicioDia;
        });

        tablaListado.innerHTML = '';

        if (citas.length === 0) {
            const filaVacia = document.createElement('tr');
            filaVacia.innerHTML = '<td colspan="7" class="text-center py-4">No hay listado de citas</td>';
            tablaListado.appendChild(filaVacia);
        } else {

            citas.sort((a, b) => {
                const fechaA = new Date(`${a.fechaCita}T${a.horaCita}`);
                const fechaB = new Date(`${b.fechaCita}T${b.horaCita}`);
                return fechaA - fechaB;
            });
            citas.forEach((item, i) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-center">${i + 1}</td>
                    <td>${item.fechaCita.split('-').reverse().join('/')} ${item.horaCita}</td>
                    <td>${item.nombre} ${item.apellido1}</td>
                    <td>${item.dni}</td>
                    <td>${item.telefono}</td>
                    <td class="text-truncate" style="max-width: 150px;">${item.observaciones}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-danger" onclick="borrarCita(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                        <a href="crear-cita.html?edit=${item.id}" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-pencil"></i>
                        </a>
                    </td>
                `;
                tablaListado.appendChild(tr);
            });
        }
    }
});

function obtenerCitas() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
}

function validarFormulario() {
    let check = true;
    const obligatorios = ['nombre', 'dni', 'apellido1', 'telefono', 'fechaCita'];
    const inputs = document.querySelectorAll('.form-control');

    inputs.forEach(input => input.classList.remove('is-invalid'));

    const tel = document.getElementById('telefono');
    if (isNaN(tel.value) || tel.value.trim() === "") {
        tel.classList.add('is-invalid');
        check = false;
    }

    obligatorios.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
            el.classList.add('is-invalid');
            check = false;
        }
    });

    return check;
}

function borrarCita(identificador) {
    if (confirm('¿Confirmar eliminación de la cita?')) {
        let actual = obtenerCitas();
        actual = actual.filter(obj => obj.id !== identificador);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(actual));
        mostrarMensaje('Cita eliminada del sistema local.', 'danger');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById('contenedor-alerta');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${texto}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        setTimeout(() => {
            contenedor.innerHTML = '';
        }, 3000);
    }
}

function actualizarReloj() {
    const ahora = new Date();
    const fAct = document.getElementById('fecha-actual');
    const hAct = document.getElementById('hora-actual');
    if (fAct && hAct) {
        fAct.textContent = ahora.toLocaleDateString('es-ES');
        hAct.textContent = ahora.toLocaleTimeString('es-ES');
    }
}
setInterval(actualizarReloj, 1000);