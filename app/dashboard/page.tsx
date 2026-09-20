"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const timer = setTimeout(() => {
      setUser(JSON.parse(userData));
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (!user) {
    return <p>กำลังโหลด...</p>;
  }

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
      }}
      suppressHydrationWarning
    >
      <h1>Dashboard</h1>

      <hr />

      <h2>ยินดีต้อนรับ {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <hr />

      {/* เมนูสำหรับ ADMIN */}
      {user.role === "ADMIN" && (
        <div style={{ margin: "20px 0" }}>
          <h3>เมนู ADMIN</h3>
          <button style={{ marginRight: "10px", padding: "8px 12px" }}>
            จัดการผู้ใช้งาน
          </button>
          <button style={{ marginRight: "10px", padding: "8px 12px" }}>
            จัดการอุปกรณ์
          </button>
          <button style={{ padding: "8px 12px" }}>จัดการรายการเช่า</button>
        </div>
      )}

      {/* เมนูสำหรับ STAFF */}
      {user.role === "STAFF" && (
        <div style={{ margin: "20px 0" }}>
          <h3>เมนู STAFF</h3>
          <button style={{ marginRight: "10px", padding: "8px 12px" }}>
            เพิ่มอุปกรณ์
          </button>
          <button style={{ marginRight: "10px", padding: "8px 12px" }}>
            แก้ไขอุปกรณ์
          </button>
          <button style={{ padding: "8px 12px" }}>จัดการสถานะการเช่า</button>
        </div>
      )}

      {/* เมนูสำหรับ CUSTOMER */}
      {user.role === "CUSTOMER" && (
        <div style={{ margin: "20px 0" }}>
          <h3>เมนู CUSTOMER</h3>
          <button style={{ marginRight: "10px", padding: "8px 12px" }}>
            ดูอุปกรณ์
          </button>
          <button style={{ marginRight: "10px", padding: "8px 12px" }}>
            เช่าอุปกรณ์
          </button>
          <button style={{ padding: "8px 12px" }}>รายการเช่าของฉัน</button>
        </div>
      )}

      <hr style={{ marginTop: "20px" }} />

      <button
        onClick={logout}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ออกจากระบบ
      </button>
    </main>
  );
}