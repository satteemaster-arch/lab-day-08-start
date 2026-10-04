// Server Component — 🔴 ห้ามใส่ "use client" ในไฟล์นี้
import AddTaskForm from './AddTaskForm'
import { getTasks } from '@/lib/taskStore'
import { removeTask, toggleTask } from './actions'

export default function TasksPage() {
  const tasks = getTasks()

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Board</h1>

      <AddTaskForm />

      <ul className="space-y-2">
        {tasks.map(t => (
          <li key={t.id} className="flex items-center justify-between border-b pb-2">
            <span className={t.done ? "line-through text-gray-400" : ""}>{t.title}</span>
            <div className="flex gap-2">
              {/* แต่ละปุ่มเป็น <form> ของตัวเอง — ส่ง id ผ่าน hidden input จึงทำงานได้แม้ปิด JS */}
              <form action={toggleTask}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-sm border px-2 py-1 rounded">
                  {t.done ? "ยังไม่เสร็จ" : "ทำเสร็จแล้ว"}
                </button>
              </form>
              <form action={removeTask}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-sm bg-red-600 text-white px-2 py-1 rounded">ลบ</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
