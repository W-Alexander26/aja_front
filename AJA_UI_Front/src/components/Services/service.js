import axios from "axios";

export async function crear(url, extension, data, token) {
  try {
    const config = {
      header: {
        Autorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post(`${url}/${extension}`, data, config);
    return res.data;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function obtener(url, extension, params = {}, token) {
  try {
    const config = {
      header: {
        Autorization: `Bearer ${token}`,
      },
      params,
    };
    const res = await axios.get(`${url}/${extension}`, config);
    return res.data;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function consultar(url, extension, params = {}, token) {
  try {
    const config = {
      header: {
        Autorization: `Bearer ${token}`,
      },
      params,
    };
    const res = await axios.post(`${url}/${extension}`, data, config);
    return res.data;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function actualizar(url, extension, params = {}, token) {
  try {
    const config = {
      header: {
        Autorization: `Bearer ${token}`,
      },
      params,
    };
    const res = await axios.patch(`${url}/${extension}`, data, config);
    return res.data;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function eliminar(url, extension, params = {}, token) {
  try {
    const config = {
      header: {
        Autorization: `Bearer ${token}`,
      },
      params,
    };
    const res = await axios.delete(`${url}/${extension}`, config);
    return res.data;
  } catch (error) {
    console.error("Error", error);
  }
}
