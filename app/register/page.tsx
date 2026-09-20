"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    // กรณีที่ 1: เช็กฟิลด์ว่าง
    if (!name || !email || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    // กรณีที่ 2: เช็กรหัสผ่านน้อยกว่า 8 ตัว
    if (password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    // กรณีที่ 3: เช็กรหัสผ่านไม่ตรงกัน
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // กรณีที่ 4: ข้อมูลถูกต้องทั้งหมด
    setMessage("ข้อมูลถูกต้อง สามารถส่งไปยัง API ได้แล้ว");
  }

  return (
    <main
      style={{
        maxWidth: "400px",
        margin: "50px auto",
      }}
    >
      <h1>สมัครสมาชิก</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่อ</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="กรอกชื่อ"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 8 ตัวอักษร"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <br />

        <div>
          <label>Confirm Password</label>
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          สมัครสมาชิก
        </button>
      </form>

      <br />

      <Link href="/login">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Link>
    </main>
  );
}