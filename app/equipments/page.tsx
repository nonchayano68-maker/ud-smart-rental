"use client";

import { useEffect, useState, FormEvent } from "react";
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

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [priceDay, setPriceDay] = useState("");
  const [stock, setStock] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/equipments");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
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
        setError(data.message || "เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์");
      } else {
        setMessage("เพิ่มอุปกรณ์สำเร็จ!");
        setCode("");
        setName("");
        setPriceDay("");
        setStock("");

        const updatedRes = await fetch("/api/equipments");
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setEquipments(updatedData);
        }
      }
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>จัดการอุปกรณ์</h1>
        <Link href="/dashboard">← กลับหน้า Dashboard</Link>
      </div>

      <section style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
        <h2>เพิ่มอุปกรณ์ใหม่</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>รหัสอุปกรณ์ (Code)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="เช่น EQ001"
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>ชื่ออุปกรณ์</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น โน๊ตบุ๊ค Dell"
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>ราคาเช่า / วัน (บาท)</label>
            <input
              type="number"
              value={priceDay}
              onChange={(e) => setPriceDay(e.target.value)}
              placeholder="เช่น 300"
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>จำนวนคงเหลือ (Stock)</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="เช่น 5"
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}

          <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
            บันทึกอุปกรณ์
          </button>
        </form>
      </section>

      <section>
        <h2>รายการอุปกรณ์ในระบบ</h2>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : equipments.length === 0 ? (
          <p>ยังไม่มีข้อมูลอุปกรณ์</p>
        ) : (
          <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#eee" }}>
                <th>รหัส</th>
                <th>ชื่ออุปกรณ์</th>
                <th>ราคา/วัน</th>
                <th>จำนวนคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((item) => (
                <tr key={item.id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.priceDay} บาท</td>
                  <td>{item.stock} ชิ้น</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}