"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const validEmails = ["admin@test.com", "staff@test.com", "customer@test.com"];

    if (validEmails.includes(email) && password === "12345678") {
      let role = "CUSTOMER";
      let name = "Somchai Customer";

      if (email === "admin@test.com") {
        role = "ADMIN";
        name = "Somchai Admin";
      } else if (email === "staff@test.com") {
        role = "STAFF";
        name = "Somchai Staff";
      }

      localStorage.setItem("token", "mock-token-123456");
      localStorage.setItem(
        "user",
        JSON.stringify({ id: 1, name, email, role })
      );

      router.push("/dashboard");
    } else {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  }

  return (
    <main
      style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}
      suppressHydrationWarning
    >
      <h1>UD Smart Rental - เข้าสู่ระบบ</h1>

      {error && (
        <div style={{ color: "red", padding: "10px", border: "1px solid red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} suppressHydrationWarning>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            suppressHydrationWarning
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
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            suppressHydrationWarning
          />
        </div>

        <br />

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
          เข้าสู่ระบบ
        </button>
      </form>

      <br />
      <Link href="/register">ยังไม่มีบัญชี? สมัครสมาชิก</Link>
    </main>
  );
}