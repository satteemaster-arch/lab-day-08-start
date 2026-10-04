"use client";

export default function DashboardPanel({ user }) {
  if (!user) return null; // "ป้องกัน" แบบเดียวกับ <ProtectedRoute> ของ Rev 3

  const SECRET_REVENUE =
    "ยอดขายทั้งปีนี้: 12,400,000 บาท (ห้ามพนักงานทั่วไปเห็น)";
  return (
    <div className="p-4 border rounded bg-yellow-50">{SECRET_REVENUE}</div>
  );
}
