"use client";
// ⚠️ เวอร์ชันไม่ปลอดภัยจากเช้านี้ (บล็อก 2.1–2.2) — Lab B ต้องรื้อทิ้ง ไม่ใช่แค่ต่อเติม
import { useAuth } from "@/context/AuthContext";
import DashboardPanel from "./DashboardPanel";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log("user >>", user);

  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      <DashboardPanel user={user} />
    </div>
  );
}
