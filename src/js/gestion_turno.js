const urlt = 'https://turno-paciente.herokuapp.com/api/turno';
const urlp = 'https://turno-paciente.herokuapp.com/api/paciente/';
const urle = 'https://hospitalizacion.herokuapp.com/api/especialidad/';
const urlm = 'https://hospitalizacion.herokuapp.com/api/medico/especialidad/';

var buscar = document.getElementById('buscar');
var formNuevoTurno = document.getElementById('formNuevoTurno ');
var mostrarTurno = document.getElementById('mostrarTurno');
var modificar=document.getElementById('formTurno');
var turnosSelect = document.getElementById('turnos');
var medicoSelect = document.getElementById('id-medico');
var fechaTurno = document.getElementById('datepicker');
const especialidadSelect = document.getElementById('id-especialidad');
var aux = null;
var idGlobal = null;
var idTurnoG = null;
var cedGlobal = null;

const obtenerPaciente = async () => {
    var datos = new FormData(buscar);
    var ced = "cedula/"+datos.get('cedula');
    var urlE = `${urlp}` + ced;
    $.getJSON(urlE,function(json){
        if ( json.length == 0 ) {
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
    const request = await fetch(urlE);
    return await request.json();
}

function obtenerTurno() {
    var datos = new FormData(buscar);
    var ced = "/cedula/"+datos.get('cedula');
    var urlE = `${urlt}` + ced;
    mostrarTurno.innerHTML = ``
    obtenerPaciente().then(response => {
        if (response.length > 0) {
            response.map((item) => {
                const { id, cedula } = item;
                aux=id;
                cedGlobal=cedula;
            })
        }
    })
    console.log(aux);
    $.getJSON(urlE,function(json){
        if ( json.length == 0 ) {
            console.log("NO DATA")
            mostrarTurno.innerHTML = ``
        }
    })
    fetch(urlE)
        .then(response => response.json()) // or res.json()
        .then(data => {
            for (let valor of data) {
                mostrarTurno.innerHTML += `
                <tr>
                <td>${valor.id}</td>
                <td>${valor.id_medico}</td>
                <td>${valor.id_especialidad}</td>
                <td>${valor.fecha}</td>
                <td>${valor.hora}</td>
                <td>${valor.confirmacion}</td>
                <td>
                <button class="btn btn-outline-danger w-20">Reagendar</button>
                <button class="btn btn-outline-success w-20">Eliminar</button>
                </td>
              </tr>
                `
                
            }
        })
        .catch(err => console.log(err))

}

//Cuando se presion sobre los botones Reagendar y Eliminar
mostrarTurno.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.innerHTML === 'Reagendar') {
        var id = e.path[2].childNodes[1].innerHTML;
        idTurnoG = e.path[2].childNodes[1].innerHTML;
        var id_medico = e.path[2].childNodes[3].innerHTML;
        var id_especialidad = e.path[2].childNodes[5].innerHTML;
        var fecha = e.path[2].childNodes[7].innerHTML;
        var hora = e.path[2].childNodes[9].innerHTML;
        var confimacion = e.path[2].childNodes[11].innerHTML;
        (async () => {
            const url = urlm + id_especialidad;
            const request = await fetch(url);
            const response = await request.json();
            if (response) {
                console.log(response);
                response.map((item) => {
                    const { idPersona, nombre, apellido } = item;
                    console.log(idPersona, nombre)
                    medicoSelect.options.add(new Option("Dr. "+nombre+" "+apellido, idPersona));
                })
            }
        })();
        document.getElementById('id-especialidad').value = id_especialidad;
        document.getElementById('id-medico').value = id_medico;
        document.getElementById('datepicker').value = fecha;
        document.getElementById('turnos').value = hora;
        var datosModificar = new FormData(modificar);
        var check = datosModificar.get('check');
        console.log(confimacion)
        if(confimacion){
                console.log("si")
                document.getElementById('check').click();
        }
    }
    if (e.target.innerHTML === 'Eliminar') {
        var id = e.path[2].childNodes[1].innerHTML
        eliminar(id);
        mostrarTurno.innerHTML = ``;
    }
})

//Al hacer click en el boton Editar
function editar_turno(){
    var cols = mostrarPaciente.getElementsByTagName("td");
    idGlobal = cols[0].innerHTML;
    var cedula = cols[1].innerHTML;
    var nombre = cols[2].innerHTML;
    var direccion = cols[3].innerHTML;
    var telefono = cols[4].innerHTML;
    var fecha_nacimiento = cols[5].innerHTML;
    var nacionalidad = cols[6].innerHTML;
    var datosModificar = new FormData(modificar);
    var mid_especialidad = datosModificar.get('idEspecialidad');
    var mid_medico = datosModificar.get('idMedico');
    var mfecha = datosModificar.get('fechaTurno');
    var mhora= datosModificar.get('horaTurno');
    var check = datosModificar.get('check');
    if(check==="on"){
        mconfir=true;
    }else{
        mconfir=false;
    }
    const url = `https://turno-paciente.herokuapp.com/api/turno/fecha/${cedula}/${mfecha}/${mhora}`;
    $.getJSON(url, function (json) {
        if (json.length == 0) {
            console.log("NO DATA!");    
                fetch(urlt, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "id":`${idTurnoG}`,
                        "id_medico": `${mid_medico}`,
                        "id_especialidad": `${mid_especialidad}`,
                        "costo_consulta": 20.00,
                        "fecha": `${mfecha}`,
                        "hora": `${mhora}`,
                        "confirmacion": `${mconfir}`,
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
        }else {
            alert("El paciente ya tiene un turno a la hora requerida");
        }
    });
}

//Función Eliminar
function eliminar(id) {
    var urlE = `${urlt}` +"/"+ id;
    console.log(urlt);
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }
    fetch(urlE, options)
        .then(res => res.json()) // or res.json()
        .then(res => console.log(res))
        alert("Turno Eliminado Correctamente");
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
                    medicoSelect.options.add(new Option("Dr. "+nombre+" "+apellido, idPersona));
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
    var horaFinal = new Date(datos.get('fechaTurno') + "T" + "11:00");
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