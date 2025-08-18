// Menú responsive
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuCambio");
    const menu = document.getElementById("menu");

    if (menuToggle && menu) {
        // Abrir/cerrar menú al hacer clic en el icono
        menuToggle.addEventListener("click", function (e) {
            e.stopPropagation(); // Evita que el clic se propague y lo cierre inmediatamente
            menu.classList.toggle("active");
        });

        // Evitar que clics dentro del menú lo cierren
        menu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        // Cerrar si se hace clic fuera
        document.addEventListener("click", function () {
            menu.classList.remove("active");
        });
    }
});

//Referencias al los elementos del DOM
const form = document.getElementById("formularioSolicitud");
const btnEnviar = document.getElementById("btnEnviarRegistro");

//referencias a los inputs del formulario
const inputs ={
    nombreCompleto:document.getElementById("nombreCompleto"),
    correo:document.getElementById("correo"),
    numTel:document.getElementById("numTel"),
    tipoEmprendimiento:document.getElementById("tipoEmprendimiento"),
    nomEmprendimiento:document.getElementById("nomEmprendimiento"),
    descripEmprendimiento:document.getElementById("descripEmprendimiento"),
    linkImagen:document.getElementById("linkImagen"),
    redesSociales:document.getElementById("redesSociales"),
};

//logica de validacion
const validations = {
    nombreCompleto: (input)=> /^[a-zA-ZáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim()) ? true : "El nombre solo puede contener letras.",

    correo:(input)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) ? true : "El formato de correo no es valido.",

    numTel: (input) => /^\d{8}$/.test(input.value.replace(/[\s-]/g, '')) ? true : "El número telefónico debe ser de 8 dígitos y solo contener números.",

    tipoEmprendimiento: (input) => input.value !== "" ? true : "Debe seleccionar una categoría de emprendimiento.",

    nomEmprendimiento:(input)=>/^[a-zA-Z0-9\s]+$/.test(input.value.trim()) ? true : "Ingrese un nombre valido.",

    descripEmprendimiento: (input) =>
    /^[\w\s.,áéíóúÁÉÍÓÚñÑ¡¿!@#$%&()*+\-:;'"/\\?]+$/.test(input.value.trim()) && input.value.trim().length <= 180 ? true : "Ingrese una descripción válida (máximo 180 caracteres, puede incluir letras, números y algunos caracteres especiales).",

    linkImagen: (input) =>
        /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico|.*)$/.test(
            input.value.trim()
        )
            ? true
            : "Ingrese un enlace válido de imagen.",

    redesSociales: (input) => {
        if (input.value.trim() === "") return true; // Si está vacío, lo aceptamos (opcional)
        return /^https?:\/\/[^\s]+$/.test(input.value.trim()) ? true : "Ingrese una URL válida para redes sociales."}
};

//Funcion para mostrar u ocultar errores en el span correspondiente
const mostrarError = (input,mensaje)=>{
    const errorSpan = input.nextElementSibling;
    if(mensaje){
        input.classList.add("error");
        
        errorSpan.textContent = mensaje;
       
    }else{
        input.classList.remove('error');
        
        errorSpan.textContent ="";
        
    }
};

//Funcion principal para validar el formulario
const ValidarFormulario =()=>{
    let primerError = null;

    for (const clave in validations){
        const referenciaHTML = inputs[clave];
        console.log(referenciaHTML);

        if(referenciaHTML){
            const resultado = validations[clave](referenciaHTML);
            console.log(resultado);
            if(resultado != true){
                mostrarError(referenciaHTML,resultado);
                if(!primerError){
                    primerError = {referenciaHTML,mensaje:resultado};
                }
            }else{
                mostrarError(referenciaHTML,null);
            }
            
        }
    }
    return primerError;
};




form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const error = ValidarFormulario(); 
    
    if (error) {
        console.warn("Hay errores:", error); 
        Swal.fire({
            title: "Error en campos obligatorios.",
            text: error.mensaje,
            icon: "error"
        });
    } else {
        const data = {
            nombreCompleto: inputs.nombreCompleto.value.trim(),
            correo: inputs.correo.value.trim(),
            numTel: inputs.numTel.value.trim(),
            tipoEmprendimiento: inputs.tipoEmprendimiento.value,
            nomEmprendimiento: inputs.nomEmprendimiento.value.trim(),
            descripEmprendimiento: inputs.descripEmprendimiento.value.trim(),
            linkImagen: inputs.linkImagen.value.trim(),
            redesSociales: inputs.redesSociales.value.trim()
        };


        fetch('http://localhost:3000/solicitud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {

            if (result.resultado === "true") {
                Swal.fire({
                    title: "Solicitud exitosa",
                    text: "Su solicitud ha sido enviada exitosamente",
                    icon: "success"
                });
                form.reset();
            } else {
                Swal.fire({
                    title: "Error",
                    text: result.mensaje || "No se pudo enviar la solicitud",
                    icon: "error"
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: "Error",
                text: "No se pudo conectar con el servidor. Intente más tarde.",
                icon: "error"
            });
        });
    }
});
