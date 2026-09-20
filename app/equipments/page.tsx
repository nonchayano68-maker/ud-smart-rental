"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Equipment {
  id: string;
  code: string;
  name: string;
  priceDay: number;
  stock: number;
}

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ขั้นตอนที่ 7: ดึง Token จาก localStorage ส่ง Authorization Header
        const token = localStorage.getItem("token");

        const res = await fetch("/api/equipments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setEquipments(data);
        }
      } catch (err) {
        console.error("Error fetching equipments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ padding: "20px" }}>
      <h1>จัดการอุปกรณ์</h1>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        <div>
          <p>จำนวนอุปกรณ์ทั้งหมด: {equipments.length} รายการ</p>
          <br />
          <Link href="/dashboard">กลับไปหน้า Dashboard</Link>
        </div>
      )}
    </main>
  );
}