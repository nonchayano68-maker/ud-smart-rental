import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "80px auto",
        textAlign: "center",
      }}
    >
      <h1>UD Smart Rental</h1>

      <p>ระบบจัดการเช่าอุปกรณ์</p>

      <div style={{ marginTop: "30px" }}>
        <Link href="/login">
          <button>เข้าสู่ระบบ</button>
        </Link>

        {" "}

        <Link href="/register">
          <button>สมัครสมาชิก</button>
        </Link>
      </div>
    </main>
  );
}