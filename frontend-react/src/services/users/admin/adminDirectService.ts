import apiClient from "../../config/apiClient";

// Define the URL for the directs resource
const DIRECT_URL = "/direct";

const adminDirectService = {
  // Get all directs
  getDirects: async (): Promise<
    { teamId: number; directionMemberId: number }[]
  > => {
    const response = await apiClient.get(DIRECT_URL);
    return response.data;
  },

  // Create a new direct
  createDirect: async (directData: {
    teamId: number;
    directionMemberId: number;
  }): Promise<{ teamId: number; directionMemberId: number }> => {
    const response = await apiClient.post(DIRECT_URL, directData);
    return response.data;
  },

  // Update an existing direct
  updateDirect: async (direct: {
    teamId: number;
    directionMemberId: number;
  }): Promise<{ teamId: number; directionMemberId: number }> => {
    const response = await apiClient.put(
      `${DIRECT_URL}/${direct.teamId}/${direct.directionMemberId}`,
      direct
    );
    return response.data;
  },

  // Delete a direct
  deleteDirect: async (direct: {
    teamId: number;
    directionMemberId: number;
  }): Promise<void> => {
    await apiClient.delete(
      `${DIRECT_URL}/${direct.teamId}/${direct.directionMemberId}`
    );
  },
};

export default adminDirectService;
