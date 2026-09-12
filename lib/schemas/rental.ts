import { z } from "zod";

export const RentalSchema = z.object({
  items: z.array(
    z.object({
      equipmentId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      days: z.number().int().min(1),
    })
  ).min(1, "ต้องมีอุปกรณ์อย่างน้อย 1 รายการ"),
});