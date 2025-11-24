import axios from './root.service.js';
import { formatPatrimonioData } from '@helpers/formatData.js';

export async function getPatrimonios() {
  try {
    const { data } = await axios.get('/patrimonio/');
    const formattedData = data.data.map(formatPatrimonioData);
    return formattedData;
  } catch (error) {
    return error.response.data;
  }
}

export async function updatePatrimonio(data, id) {
  try {
    const response = await axios.patch(`/patrimonio/detail/?id=${id}`, data);
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function deletePatrimonio(id) {
  try {
    const response = await axios.delete(`/patrimonio/detail/?id=${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export async function registerPatrimonio(data) {
  try {
    const response = await axios.post('/patrimonio/', data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
