import apiClient from "../../config/apiClient";
import { DirectionMember } from "../../../models/crud/DirectionMember";

const DIRECTIONMEMBERS_URL = "/DirectionMembers"; // Cambiar a la URL correspondiente de tu API

class DirectionMemberService {
  async getDirectionMembers(): Promise<DirectionMember[]> {
    const response = await apiClient.get(DIRECTIONMEMBERS_URL);
    return response.data;
  }

  async createDirectionMember(
    directionMember: DirectionMember
  ): Promise<DirectionMember> {
    const response = await apiClient.post(
      DIRECTIONMEMBERS_URL,
      directionMember
    );
    return response.data;
  }

  async updateDirectionMember(
    directionMember: DirectionMember
  ): Promise<DirectionMember> {
    const response = await apiClient.put(
      `${DIRECTIONMEMBERS_URL}/${directionMember.id}`,
      directionMember
    );
    return response.data;
  }

  async deleteDirectionMember(id: number): Promise<void> {
    await apiClient.delete(`${DIRECTIONMEMBERS_URL}/${id}`);
  }
}

export default new DirectionMemberService();
