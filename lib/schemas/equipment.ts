import { z } from "zod";

export const EquipmentSchema = z.object({
  code: z.string().min(3, "รหัสอุปกรณ์ต้องมีอย่างน้อย 3 ตัวอักษร"),
  name: z.string().min(3, "ชื่ออุปกรณ์ต้องมีอย่างน้อย 3 ตัวอักษร"),
  priceDay: z.number().positive("ราคาต่อวันต้องมากกว่า 0"),
  stock: z.number().int().min(0, "Stock ต้องไม่น้อยกว่า 0"),
});