import axios from "axios";

export interface CreateTeamPayload {
  name: string;
  description: string;
  userIds: string[]; // UUID
}

export const createTeam = async (data: CreateTeamPayload) => {
  const response = await axios.post("/api/v1/teams/create", data);
  return response.data;
};
