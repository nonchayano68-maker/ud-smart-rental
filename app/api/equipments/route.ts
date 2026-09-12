import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EquipmentSchema } from "@/lib/schemas/equipment";

export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(equipments);
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const validation = EquipmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ถูกต้อง", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { code, name, priceDay, stock } = validation.data;

    const existing = await prisma.equipment.findUnique({
      where: { code },
    });
    if (existing) {
      return NextResponse.json(
        { message: "รหัสอุปกรณ์นี้มีในระบบแล้ว" },
        { status: 400 }
      );
    }

    const newEquipment = await prisma.equipment.create({
      data: { code, name, priceDay, stock },
    });

    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", error: String(error) },
      { status: 500 }
    );
  }
}