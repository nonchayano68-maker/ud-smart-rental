import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const { code, name, priceDay, stock } = body;

    if (!code || !name || !priceDay || stock === undefined) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.create({
      data: {
        code,
        name,
        priceDay: Number(priceDay),
        stock: Number(stock),
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างอุปกรณ์", error: String(error) },
      { status: 500 }
    );
  }
}