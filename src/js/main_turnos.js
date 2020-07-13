const urlp = 'https://turno-paciente.herokuapp.com/api/paciente/';
const urlt = 'https://turno-paciente.herokuapp.com/api/turno/';
const urle = 'https://hospitalizacion.herokuapp.com/api/especialidad/';
const urlm = 'https://hospitalizacion.herokuapp.com/api/medico/especialidad/';

var buscar = document.getElementById('buscar');
var formNuevoPaciente = document.getElementById('formNuevoPaciente');
var formEditarPaciente = document.getElementById('formEditarPaciente');
var formTurno = document.getElementById('formTurno');
var mostrarPaciente = document.getElementById('mostrarPaciente');
var modificar = document.getElementById('modificar');
var edicion = document.getElementById('edicion');
var turnosSelect = document.getElementById('turnos');
var medicoSelect = document.getElementById('id-medico');
var fechaTurno = document.getElementById('datepicker');
const especialidadSelect = document.getElementById('id-especialidad');

var idGlobal = null;

function obtenerPaciente() {
    var datos = new FormData(buscar);
    var ced = "cedula/" + datos.get('cedula');
    var urlE = `${urlp}` + ced;
    console.log(urlE);
    $.getJSON(urlE, function (json) {
        if (json.length == 0) {
            console.log("NO DATA")
            mostrarPaciente.innerHTML = ``
        }
    })
    fetch(urlE)
        .then(response => response.json()) // or res.json()
        .then(data => {
            for (let valor of data) {
                mostrarPaciente.innerHTML = `
                <tr>
                <td>${valor.id}</td>
                <td>${valor.cedula}</td>
                <td>${valor.nombre}</td>
                <td>${valor.direccion}</td>
                <td>${valor.telefono}</td>
                <td>${valor.fecha_nacimiento}</td>
                <td>${valor.nacionalidad}</td>
              </tr>
                `
            }
        })
        .catch(err => console.log(err))
}

//Al hacer click en el boton Insertar pacietne
formNuevoPaciente.addEventListener('submit', function (e) {
    e.preventDefault();
    const cedula = e.target.cedula.value;
    const urlCed = `https://turno-paciente.herokuapp.com/api/paciente/cedula/${cedula}`;
    $.getJSON(urlCed, function (json) {
        if (json.length == 0) {
            console.log("NO DATA!")
            fetch(urlp, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "cedula": `${e.target.cedula.value}`,
                    "nombre": `${e.target.nombre.value}`,
                    "direccion": `${e.target.direccion.value}`,
                    "telefono": `${e.target.telefono.value}`,
                    "fecha_nacimiento": `${e.target.fecha_nacimiento.value}`,
                    "nacionalidad": `${e.target.nacionalidad.value}`,
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
            obtNuevo();
            limpiar();
        } else {
            alert("Ya existe un paciente con el numero de cedula ingresado");
        }
    });
})


//Metodo para listar personas con fetch
function obtenerTodos() {
    fetch(urlp)
        .then(response => response.json())
        .then(data => {

            for (let valor of data) {
                mostrarPaciente.innerHTML += `
                <tr>
                <td>${valor.id}</td>
                <td>${valor.cedula}</td>
                <td>${valor.nombre}</td>
                <td>${valor.direccion}</td>
                <td>${valor.telefono}</td>
                <td>${valor.fecha_nacimiento}</td>
                <td>${valor.nacionalidad}</td>
              </tr>
                `
            }
        })
        .catch(err => console.log(err))
}

edicion.addEventListener('click', (e) => {
    e.preventDefault();
    var cols = mostrarPaciente.getElementsByTagName("td");
    idGlobal = cols[0].innerHTML;
    var cedula = cols[1].innerHTML;
    var nombre = cols[2].innerHTML;
    var direccion = cols[3].innerHTML;
    var telefono = cols[4].innerHTML;
    var fecha_nacimiento = cols[5].innerHTML;
    var nacionalidad = cols[6].innerHTML;
    document.getElementById('aced').value = cedula;
    document.getElementById('anom').value = nombre;
    document.getElementById('adir').value = direccion;
    document.getElementById('atel').value = telefono;
    document.getElementById('afec').value = fecha_nacimiento;
    document.getElementById('anac').value = nacionalidad;
})

//Al hacer click en el boton Actualizar
formEditarPaciente.addEventListener('submit', function (e) {
    e.preventDefault();
    const cedula = e.target.cedula.value;
    const urlCed = `https://turno-paciente.herokuapp.com/api/paciente/cedula/${cedula}`;
    $.getJSON(urlCed, function (json) {
        if (json.length == 0) {
            fetch(urlp, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": `${idGlobal}`,
                    "cedula": `${e.target.cedula.value}`,
                    "nombre": `${e.target.nombre.value}`,
                    "direccion": `${e.target.direccion.value}`,
                    "telefono": `${e.target.telefono.value}`,
                    "fecha_nacimiento": `${e.target.fecha_nacimiento.value}`,
                    "nacionalidad": `${e.target.nacionalidad.value}`,
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
        } else {
            alert("Ya existe un paciente con el numero de cedula ingresado");
        }
    })
})

//Metodo para eliminar una persona con fetch
function eliminar() {
    var id = mostrarPaciente.getElementsByTagName("td")[0].innerHTML;
    var urlE = `${urlp}` + id;
    console.log(urlE);
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(urlE, options)
        .then(res => res.json()) // or res.json()
        .then(res => console.log(res))
}

const obtenerEspecialidades = async () => {
    const request = await fetch(urle);
    return await request.json();
}

const listarEspecialidad = () => {
    obtenerEspecialidades().then(response => {
        if (response.length > 0) {
            response.map((item) => {
                const { idEspecialidad, nombre } = item;
                return especialidadSelect.options.add(new Option(nombre, idEspecialidad));
            })
        }
    })
}

listarEspecialidad();

especialidadSelect.addEventListener("change", (e) => {
    const id = e.target.value;
    if (id !== "") {
        (async () => {
            const url = urlm + id;
            const request = await fetch(url);
            const response = await request.json();
            console.log(id)
            if (response) {
                console.log(response);
                response.map((item) => {
                    const { idPersona, nombre, apellido } = item;
                    console.log(idPersona, nombre)
                    medicoSelect.options.add(new Option("Dr. " + nombre + " " + apellido, idPersona));
                })
            }
        })();
    }
})

function obtenerDia() {
    var datos = new FormData(formTurno);
    var dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    var fecha = new Date(datos.get('fechaTurno'));
    return dias[fecha.getUTCDay() - 1];
}

function obtenerTurnos() {
    var datos = new FormData(formTurno);
    const id = datos.get('idMedico');
    console.log(id);
    const dia = obtenerDia();
    var horaInicio = new Date(datos.get('fechaTurno') + "T" + "09:00");
    var horaFinal = new Date(datos.get('fechaTurno') + "T" + "12:00");
    var horaDispo = horaInicio;
    console.log(horaInicio < horaFinal);
    var aux = true;
    while (horaDispo < horaFinal) {
        horaDispo.setMinutes(horaDispo.getMinutes() + 15);
        if (horaDispo.getMinutes() == 0) {
            var minutos = "00";
        } else {
            var minutos = horaDispo.getMinutes();
        }
        turnosSelect.options.add(new Option(horaDispo.getHours() + ":" + minutos));
    }
    if (id !== "" && dia !== "") {
        (async () => {
            const url = urlh + id + "/" + dia;
            const request = await fetch(url);
            const response = await request.json();
            console.log(id)
            if (response) {
                const { id, nombre } = response;
                medicoSelect.options.length = 1;
                medicoSelect.options.add(new Option(nombre, id));
            }
        })();
    }
    return false;
}

function ingresarTurno() {
    var datos = new FormData(formTurno);
    var cols = mostrarPaciente.getElementsByTagName("td");
    idGlobal = cols[0].innerHTML;
    var cedula = cols[1].innerHTML;
    var nombre = cols[2].innerHTML;
    var direccion = cols[3].innerHTML;
    var telefono = cols[4].innerHTML;
    var fecha_nacimiento = cols[5].innerHTML;
    var nacionalidad = cols[6].innerHTML;
    const fecha = datos.get('fechaTurno');
    const hora = datos.get('horaTurno');
    const idMed = datos.get('idMedico');
    const idEsp = datos.get('idEspecialidad')
    console.log(cedula);
    console.log(fecha);
    console.log(hora);
    var cont = 0;
    const urlf = `https://facturacionbases.herokuapp.com/api/facturas/idpaciente/${idGlobal}`;
    $.getJSON(urlf, function (json) {
        if (json.length !== 0) {
            json.map((item) => {
                const { id, estado } = item;
                if (estado == "NO PAGADA") {
                    cont++;
                }
            })
        }
    });
    if (cont > 0) {
        alert.log("No se pudo registrar el turno: ¡El Paciente tiene deudas pendientes!")
    } else {
        const url = `https://turno-paciente.herokuapp.com/api/turno/fecha/${cedula}/${fecha}/${hora}`;
        $.getJSON(url, function (json) {
            if (json.length == 0) {
                console.log("NO DATA!");
                fetch(urlt, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id_medico": `${idMed}`,
                        "id_especialidad": `${idEsp}`,
                        "costo_consulta": 20.00,
                        "fecha": `${fecha}`,
                        "hora": `${hora}`,
                        "confirmacion": true,
                        "paciente": {
                            "id": `${idGlobal}`,
                            "cedula": `${cedula}`,
                            "nombre": `${nombre}`,
                            "direccion": `${direccion}`,
                            "telefono": `${telefono}`,
                            "fecha_nacimiento": `${fecha_nacimiento}`,
                            "nacionalidad": `${nacionalidad}`
                        }
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                    })
                alert("Turno Ingresado Correctamente!")
                location.reload();
            } else {
                alert("El paciente ya tiene un turno a la hora requerida");
            }
        });
    }
}

function limpiar() {
    document.getElementById("formNuevoPaciente").reset();
}

function obtNuevo() {
    var datos = new FormData(formNuevoPaciente);
    var ced = "cedula/" + datos.get('cedula');
    var urlE = `${urlp}` + ced;
    console.log(urlE);
    $.getJSON(urlE, function (json) {
        if (json.length == 0) {
            console.log("NO DATA")
            mostrarPaciente.innerHTML = ``
        }
    })
    fetch(urlE)
        .then(response => response.json()) // or res.json()
        .then(data => {
            for (let valor of data) {
                mostrarPaciente.innerHTML = `
                <tr>
                <td>${valor.id}</td>
                <td>${valor.cedula}</td>
                <td>${valor.nombre}</td>
                <td>${valor.direccion}</td>
                <td>${valor.telefono}</td>
                <td>${valor.fecha_nacimiento}</td>
                <td>${valor.nacionalidad}</td>
              </tr>
                `
            }
            console.log(data)
        })
        .catch(err => console.log(err))
    alert("Paciente Ingresado Correctamente!")
}

/*medicoSelect.addEventListener("change", (e) =>{
    const id = e.target.value;
    const dia = obtenerDia();
    if(id !== ""){
        (async() =>{
            const url = urlp + id;
            const request = await fetch(url);
            const response = await request.json();
            if(response){}
        })();
    }
})*/


