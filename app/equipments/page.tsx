"use client";

import { useState, useEffect } from "react";

interface Equipment {
  id: number;
  code: string;
  name: string;
  priceDay: number;
  stock: number;
}

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [stock, setStock] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/equipments");
      const data = await res.json();
      if (res.ok) {
        setEquipments(data);
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/equipments");
        const data = await res.json();
        if (res.ok) {
          setEquipments(data);
        } else {
          setError(data.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/equipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          name,
          priceDay: Number(priceDay),
          stock: Number(stock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }

      alert("เพิ่มอุปกรณ์สำเร็จ!");
      setCode("");
      setName("");
      setPriceDay("");
      setStock("");
      fetchEquipments();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">จัดการอุปกรณ์ (Equipment Management)</h1>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">เพิ่มอุปกรณ์ใหม่</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสอุปกรณ์ (Code)</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2 text-gray-900"
              placeholder="EQ001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่ออุปกรณ์</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2 text-gray-900"
              placeholder="กล้อง Canon EOS R6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคาเช่าต่อวัน (บาท)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full border rounded-md p-2 text-gray-900"
              placeholder="500"
              value={priceDay}
              onChange={(e) => setPriceDay(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนคงเหลือ (Stock)</label>
            <input
              type="number"
              required
              min="0"
              className="w-full border rounded-md p-2 text-gray-900"
              placeholder="5"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
            >
              {submitting ? "กำลังบันทึก..." : "บันทึกอุปกรณ์"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">รายการอุปกรณ์ทั้งหมด</h2>
        {loading ? (
          <p className="text-gray-500 text-center py-4">กำลังโหลดข้อมูล...</p>
        ) : equipments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">ยังไม่มีรายการอุปกรณ์</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 font-semibold text-gray-700">รหัส</th>
                  <th className="p-3 font-semibold text-gray-700">ชื่ออุปกรณ์</th>
                  <th className="p-3 font-semibold text-gray-700">ราคา/วัน</th>
                  <th className="p-3 font-semibold text-gray-700">จำนวนคงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono text-gray-800">{item.code}</td>
                    <td className="p-3 text-gray-800">{item.name}</td>
                    <td className="p-3 text-gray-800">{item.priceDay} บาท</td>
                    <td className="p-3 text-gray-800">{item.stock} ชิ้น</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}