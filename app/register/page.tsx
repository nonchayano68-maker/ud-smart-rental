"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    // กรณีที่ 1: เช็กฟิลด์ว่าง
    if (!name || !email || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // กรณีที่ 2: เช็กการยืนยันรหัสผ่าน
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // กรณีที่ 3: เช็กรหัสผ่านน้อยกว่า 8 ตัว
    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      // เรียก API Register ตามข้อ 13
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      setMessage("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>สมัครสมาชิก</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <label>ชื่อ-นามสกุล:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Password (อย่างน้อย 8 ตัวอักษร):</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "10px", marginTop: "10px", cursor: "pointer" }}>
          {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
      </form>

      <br />
      <p>
        มีบัญชีอยู่แล้ว? <Link href="/login">เข้าสู่ระบบที่นี่</Link>
      </p>
    </main>
  );
}