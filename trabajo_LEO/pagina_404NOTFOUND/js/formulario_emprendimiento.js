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
    descripEmprendimiento:(input)=>/^[a-zA-Z0-9\s]+$/.test(input.value.trim()) ? true : "Ingrese una descripcion valida.",
    linkImagen: (input) => /^https?:\/\/.*\.(jpg|jpeg|png)$/i.test(input.value.trim()) ? true : "Ingrese un enlace válido de imagen (.jpg, .jpeg o .png).",
    redesSociales: (input) => {
        if (input.value.trim() === "") return true; // Si está vacío, lo aceptamos (opcional)
        return /^https?:\/\/[^\s]+$/i.test(input.value.trim()) ? true : "Ingrese una URL válida para redes sociales."}
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

// Listener para el boton de "Enviar"

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Botón de inicio clickeado"); 
    const error = ValidarFormulario(); 
    if (error) {
        console.warn("Hay errores:", error); 
        Swal.fire({
            title: "Error en campos obligatorios.",
            text: error.mensaje,
            icon: "error"
        });
    } else {
        console.log("Formulario válido, mostrando mensaje de éxito"); 
        Swal.fire({
            title: "Solicitud exitosa",
            text: "Su solicitud ha sido enviada exitosamente",
            icon: "success",
        });
        form.reset();
    }
});