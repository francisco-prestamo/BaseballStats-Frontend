import axios from "axios";
import { Serie } from "../../../models/crud/Series";

const API_BASE_URL = "http://your-api-endpoint.com/api/series"; // Replace with your actual API endpoint

const adminSerieService = {
  /**
   * Fetch all series from the server.
   * @returns {Promise<Serie[]>} A list of series.
   */
  async getSeries(): Promise<Serie[]> {
    try {
      const response = await axios.get<Serie[]>(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching series:", error);
      throw error;
    }
  },

  /**
   * Create a new series.
   * @param {Serie} newSerie - The new series to create.
   * @returns {Promise<void>}
   */
  async createSerie(newSerie: Serie): Promise<void> {
    try {
      await axios.post(API_BASE_URL, newSerie);
    } catch (error) {
      console.error("Error creating series:", error);
      throw error;
    }
  },

  /**
   * Update an existing series.
   * @param {Serie} updatedSerie - The series with updated data.
   * @returns {Promise<void>}
   */
  async updateSerie(updatedSerie: Serie): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/${updatedSerie.id}`, updatedSerie);
    } catch (error) {
      console.error("Error updating series:", error);
      throw error;
    }
  },

  /**
   * Delete a series by ID.
   * @param {number} serieId - The ID of the series to delete.
   * @returns {Promise<void>}
   */
  async deleteSerie(serieId: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${serieId}`);
    } catch (error) {
      console.error("Error deleting series:", error);
      throw error;
    }
  },
};

export default adminSerieService;
