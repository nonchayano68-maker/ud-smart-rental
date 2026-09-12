"use client";

import { useState, useEffect } from "react";

interface Equipment {
  id: number;
  code: string;
  name: string;
  priceDay: number;
  stock: number;
}

export default function RentalsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/equipments")
      .then((res) => res.json())
      .then((data) => setEquipments(data))
      .catch(() => setError("ไม่สามารถดึงข้อมูลอุปกรณ์ได้"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนทำรายการเช่า");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              equipmentId: Number(selectedEquipment),
              quantity: Number(quantity),
              days: Number(days),
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการเช่าอุปกรณ์");
      }

      alert("สร้างรายการเช่าเรียบร้อยแล้ว!");
      setSelectedEquipment("");
      setQuantity(1);
      setDays(1);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">ทำรายการเช่าอุปกรณ์ (Rent Equipment)</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เลือกอุปกรณ์
            </label>
            <select
              required
              className="w-full border rounded-md p-2 text-gray-900"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(Number(e.target.value))}
            >
              <option value="">--เลือกอุปกรณ์--</option>
              {equipments.map((item) => (
                <option key={item.id} value={item.id} disabled={item.stock === 0}>
                  {item.name} ({item.priceDay} บาท/วัน) - คงเหลือ {item.stock} ชิ้น
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวน (ชิ้น)
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full border rounded-md p-2 text-gray-900"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวนวันเช่า
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full border rounded-md p-2 text-gray-900"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedEquipment}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "ยืนยันการเช่า"}
          </button>
        </form>
      </div>
    </div>
  );
}