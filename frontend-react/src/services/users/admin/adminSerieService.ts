import apiClient from "../../config/apiClient";
import { Serie } from "../../../models/crud/Series";

// Define the base URL for series
const SERIES_URL = "/series";

const adminSerieService = {
  /**
   * @returns {Promise<Serie[]>}
   */
  getSeries: async (): Promise<Serie[]> => {
    const response = await apiClient.get(SERIES_URL);
    return response.data;
  },

  /**
   * Create a new series.
   * @param {Serie} newSerie - The new series to create.
   * @returns {Promise<Serie>} The created series.
   */
  createSerie: async (newSerie: Omit<Serie, "id">): Promise<Serie> => {
    const response = await apiClient.post(SERIES_URL, newSerie);
    return response.data;
  },

  /**
   * Update an existing series.
   * @param {Serie} updatedSerie - The series with updated data.
   * @returns {Promise<Serie>} The updated series.
   */
  updateSerie: async (updatedSerie: Serie): Promise<Serie> => {
    const response = await apiClient.put(
      `${SERIES_URL}/${updatedSerie.id}`,
      updatedSerie
    );
    return response.data;
  },

  /**
   * Delete a series by ID.
   * @param {number} serieId - The ID of the series to delete.
   * @returns {Promise<void>}
   */
  deleteSerie: async (serieId: number): Promise<void> => {
    await apiClient.delete(`${SERIES_URL}/${serieId}`);
  },
};

export default adminSerieService;
