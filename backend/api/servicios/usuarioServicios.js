
const API_URL = 'http://localhost:3000/api/usuarios';



// Registrar nuevo usuario
const registrarUsuario = async (usuarioData) => {
  try {
    const res = await axios.post('http://localhost:3000/postUsuarios', usuarioData);
    return res.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async () => {
    console.log(usuarios);
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Cambiar estado del usuario (activo/inactivo)
const cambiarEstadoUsuario = async (id, nuevoEstado) => {
      console.log('Estado cambiado', res);
  try {
    const res = await axios.put(`${API_URL}/${id}/estado`, { estado: nuevoEstado });
    return res.data;
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    throw error;
  }
};

// Cambiar rol del usuario
const cambiarRolUsuario = async (id, nuevoRol) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/rol`, { rol: nuevoRol });
    return res.data;
  } catch (error) {
    console.error('Error al cambiar rol:', error);
    throw error;
  }
};

// Eliminar usuario
const eliminarUsuario = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// Login de usuario (usando GET como tu compañero)
const loginUsuario = async (correo, contrasenna) => {
  try {
    const res = await axios.get('http://localhost:3000/login', {
      params: { correo, contrasenna }
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return {
        resultado: false,
        mensaje: 'Error de red o del servidor.'
      };
    }
  }
};
