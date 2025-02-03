import apiClient from "../../config/apiClient";
import { Serie } from "../../../models/crud/Series";

// Define the URL for series
const SERIES_URL = "/series";

const adminSerieService = {
  // Get all series
  getSeries: async (): Promise<Serie[]> => {
    const response: {data: Serie[]} = await apiClient.get(SERIES_URL);
    for (const serie of response.data)
    {
      serie.startDate = new Date(serie.startDate);
      serie.endDate = new Date(serie.endDate);
    }
    return response.data;
  },

  // Create a new series
  createSerie: async (serieData: Serie): Promise<Serie> => {
    const response = await apiClient.post(SERIES_URL, serieData);
    return response.data;
  },

  // Update an existing series
  updateSerie: async (serie: Serie): Promise<Serie> => {
    const response = await apiClient.put(
      `${SERIES_URL}/${serie.idSeason}/${serie.id}`,
      serie
    );

    response.data.startDate = new Date(response.data.serie.startDate);
    response.data.endDate = new Date(response.data.serie.endDate);

    return response.data;
  },

  // Delete a series
  deleteSerie: async (serie: Serie): Promise<void> => {
    await apiClient.delete(`${SERIES_URL}/${serie.idSeason}/${serie.id}`);
  },
};

export default adminSerieService;
