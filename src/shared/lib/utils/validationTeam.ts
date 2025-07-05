import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(1, "Название команды обязательно"),
  description: z.string().optional(),
  userIds: z.array(z.string()).min(1, "Добавьте хотя бы одного участника"),
});

export type TeamFormValues = z.infer<typeof teamSchema>;
