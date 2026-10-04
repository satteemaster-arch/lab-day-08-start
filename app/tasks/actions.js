"use server"

import { revalidatePath } from 'next/cache'
import { addTaskToStore, removeTaskFromStore, toggleTaskDone } from '@/lib/taskStore'

// ใช้คู่กับ useActionState — ค่าที่ return จะกลายเป็น state ใหม่ของฟอร์ม
export async function addTask(prevState, formData) {
  const title = formData.get('title')?.trim() ?? ''
  if (title.length === 0) return { error: 'กรุณาใส่ชื่องาน' }
  if (title.length < 2) return { error: 'ชื่องานต้องยาวอย่างน้อย 2 ตัวอักษร' }

  addTaskToStore({ id: Date.now(), title, done: false })
  revalidatePath('/tasks')
  return { error: null }
}

// id มาจาก <input type="hidden" name="id"> — FormData ให้ค่าเป็น string ต้องแปลงเป็น number ก่อนเทียบ
export async function removeTask(formData) {
  const id = Number(formData.get('id'))
  removeTaskFromStore(id)
  revalidatePath('/tasks')
}

export async function toggleTask(formData) {
  const id = Number(formData.get('id'))
  toggleTaskDone(id)
  revalidatePath('/tasks')
}
