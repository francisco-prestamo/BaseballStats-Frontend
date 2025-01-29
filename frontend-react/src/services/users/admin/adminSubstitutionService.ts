import apiClient from "../../config/apiClient";
import { Substitution } from "../../../models/crud/Substitution.ts";

const SUBSTITUTIONS_URL = "/substitutions";

const adminSubstitutionService = {
  getSubstitutions: async (): Promise<Substitution[]> => {
    const response = await apiClient.get(SUBSTITUTIONS_URL);
    return response.data;
  },
  createSubstitution: async (substitution: Substitution): Promise<Substitution> => {
    const response = await apiClient.post(SUBSTITUTIONS_URL, substitution);
    return response.data;
  },

  updateSubstitution: async (substitution: Substitution): Promise<Substitution> => {
    const response = await apiClient.put(`${SUBSTITUTIONS_URL}/${substitution.id}`, substitution);
    return response.data;
  },

  deleteSubstitution: async (substitutionId: number): Promise<void> => {
    await apiClient.delete(`${SUBSTITUTIONS_URL}/${substitutionId}`);
  },
};

export default adminSubstitutionService;
