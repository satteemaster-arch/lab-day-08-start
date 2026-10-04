# `lab-day-08-start` — โปรเจกต์ตั้งต้นของแล็บบ่าย วันที่ 8

โครงตั้งต้นสำหรับ **Lab วันที่ 8 — 🎯 มินิแอป #5: Server Actions + Auth Middleware**
⏱ **Lab A 13:00–13:55 · Lab B 14:00–14:50 · Explain-Back 14:50–15:00**
โจทย์เต็มอยู่ในไฟล์นี้ (หัวข้อ "โจทย์" ด้านล่าง) — โฟลเดอร์นี้คือ**ที่ที่เขียน Lab A และ push ขึ้น GitHub** · **Lab B ทำในอีกโปรเจกต์ `lab-day-08-b-start`** (ไม่ต้องก๊อปอะไรทับ) แล้ว deploy จากโปรเจกต์นั้น

> 🎯 **มินิแอปหมุดหมายชิ้นที่ 5 จาก 5** — คะแนนแล็บวันนี้คูณ **×1.5**
> ✅ **Final Project Checkpoint ส่งฟอร์มออนไลน์ (ไม่มีกำหนดส่ง)** — URL production + repo + คลิปหน้าจอ ≤ 2 นาที + คำตอบ 1 ข้อ · ไม่มีการเดินตรวจระหว่างแล็บ
> 🔴 **13:55 หยุด Lab A แล้ว commit + push ไม่ว่าจะจบหรือไม่** → 14:00 เปิด `lab-day-08-b-start` ทำ Lab B ทันที (บ่ายนี้ไม่มี deploy) · Lab A ที่ยังไม่จบทำต่อหลังคาบแล้วส่งภายใน 5 วันได้
> 🔓 AI ใช้ได้ตามกติกาปกติ — อธิบายทุกบรรทัดได้เมื่อ TA ถาม · ⚠️ AI รุ่นเก่ามักลืม `await cookies()` (Next.js 15)

---

## เริ่มยังไง

```bash
npm install
cp .env.local.example .env.local     # แล้วแก้ค่าเอง — .env.local ไม่เข้า git
npm run dev
```

| ปัญหา | ทางแก้ |
|---|---|
| หัวเว็บขึ้น `(ยังไม่ตั้ง NEXT_PUBLIC_SITE_NAME)` | ยังไม่มี `.env.local` หรือแก้แล้วยังไม่ restart dev server · บน `npm start` = ค่า `NEXT_PUBLIC_` ถูกฝังตอน build ต้อง `npm run build` ใหม่ |
| เพิ่มงานแล้ว restart dev server งานหาย | ปกติ — `lib/taskStore.js` เก็บในหน่วยความจำ ไม่ใช่ database |
| `/login` ขึ้นแค่ TODO | งาน Lab B — ทำในโปรเจกต์ `lab-day-08-b-start` ไม่ใช่ที่นี่ |
| `/dashboard` เข้าได้ทั้งที่ไม่ล็อกอิน | ใช่ — เวอร์ชันไม่ปลอดภัยของเช้านี้ · แก้ใน Lab B (โปรเจกต์ `lab-day-08-b-start`) |

## ไฟล์ที่ต้องเขียน

```
app/
├── tasks/
│   ├── page.jsx            ← Lab A ขั้น 2 ปุ่ม toggle/ลบ ต่อแถว (ห้าม "use client")
│   ├── actions.js          ← Lab A ขั้น 2 + 4 (removeTask · toggleTask · addTask ให้ return error)
│   └── AddTaskForm.jsx     ← Lab A ขั้น 3 + 4 (SubmitButton · useActionState)
├── login/                  ✗ งาน Lab B — ทำใน lab-day-08-b-start ไม่ใช่ที่นี่
├── dashboard/              ✗ งาน Lab B — ทำใน lab-day-08-b-start ไม่ใช่ที่นี่
└── layout.jsx              ✓ อ่าน cookie ส่งให้ AuthContext (ไม่ต้องแก้)
components/Nav.jsx          ✗ งาน Lab B — ไม่ต้องแตะ
lib/taskStore.js            ← Lab A ขั้น 1 toggleTaskDone(id)
README.md                   ← หลักฐาน Twist ข้อ 1 (ปิด JS แล้วฟอร์มยังทำงาน) เขียนต่อท้ายไฟล์นี้
```

> ⚠️ อย่าลบ `await cookies()` ใน `app/layout.jsx` — มันทำให้ทุกหน้าเป็น dynamic (`ƒ`) ถ้าลบ `/tasks` จะกลายเป็นหน้า static ที่ render ครั้งเดียวตอน `npm run build` แล้วงานที่เพิ่มบน production จะไม่โผล่

---

# โจทย์ (สำเนาจาก `labs/day-08.md`)

## Lab A (55 น. · 13:00–13:55) — Context

**โจทย์วันนี้คือแอปเดียวกับที่อาจารย์สาธิตสด ๆ ตอนเช้า** — Task Board ที่ mutation ทุกจุด (เพิ่ม/ลบ/ติ๊กว่าทำเสร็จ) วิ่งผ่าน **Server Action** ล้วน ๆ ไม่มี `fetch`/`onSubmit` ฝั่ง client เจือปนเลยแม้แต่จุดเดียว บ่ายนี้ให้ทำเป็นของตัวเอง ให้ครบ ให้ผ่านเกณฑ์ แล้วต่อด้วย auth + ย้ายความลับไปฝั่ง server ใน Lab B

**Starter:** สืบทอดจาก `lecture-day-08-start` ที่อาจารย์ใช้ตอนเช้า — มี `lib/taskStore.js` (in-memory store) และโครง `app/tasks/` ให้แล้ว แต่:
- `actions.js` มีแค่ `addTask` เวอร์ชัน **ยังไม่ validate** (ตามที่สาธิตช่วง 1.2) — ยังไม่มี `removeTask` และไม่มี `toggleTask` (ฟีเจอร์ mark-done เป็นของใหม่ที่ต้องทำเองบ่ายนี้ ไม่ได้สาธิตตอนเช้า)
- `AddTaskForm.jsx` ยังไม่ได้แยก `SubmitButton` และยังไม่ต่อ `useActionState`
- `app/dashboard/`, `app/login/` และปุ่ม "ออกจากระบบ" ใน `components/Nav.jsx` — **ไม่ต้องแตะใน Lab A** เป็นงาน Lab B ที่ทำในอีกโปรเจกต์ (`lab-day-08-b-start`)

```
app/
├── tasks/
│   ├── page.jsx          # Server Component — list งาน (ยังไม่มี mark-done)
│   ├── actions.js         # "use server" — addTask ยังไม่ validate, ไม่มี remove/toggle
│   └── AddTaskForm.jsx    # "use client" — ยังไม่แยก SubmitButton
├── dashboard/
│   ├── page.jsx           # ⚠️ เวอร์ชันไม่ปลอดภัย (client-side check) — ไม่ต้องแตะ (Lab B รื้อในโปรเจกต์ B)
│   └── DashboardPanel.jsx
lib/
└── taskStore.js           # getTasks / addTaskToStore / removeTaskFromStore ให้แล้ว — toggleTaskDone ต้องเพิ่มเอง
```

| ขั้น | เวลา | ทำอะไร |
|:--:|:--:|---|
| 1 | 10 น. | ทวนของเดิมจากเช้า: `addTask` ทำงานผ่าน `<form action={addTask}>` ได้แล้ว → เพิ่ม `toggleTaskDone(id)` ใน `lib/taskStore.js` |
| 2 | 15 น. | เขียน `toggleTask` (Server Action ใหม่) + `removeTask` ใน `actions.js` แล้วต่อเข้าปุ่มในแต่ละแถวของ `page.jsx` — **ทุกปุ่มเป็น `<form action={...}>` ของตัวเอง** ไม่มี `onClick` ที่ยิง client fetch |
| 3 | 15 น. | แยก `SubmitButton` ออกเป็น child component ใช้ `useFormStatus` โชว์สถานะ pending ตอนกำลังเพิ่มงาน |
| 4 | 15 น. | เปลี่ยน `addTask(formData)` → `addTask(prevState, formData)` ต่อกับ `useActionState` ให้ reject ชื่องานว่าง/สั้นเกินไป แล้วโชว์ error กลับเข้าฟอร์มโดยไม่ reload หน้า |

---

### สิ่งที่ต้องได้ตอนจบ Lab A

- [ ] เพิ่มงาน / ลบงาน / ติ๊กว่าทำเสร็จ (mark-done) ทำงานผ่าน Server Action ทั้ง 3 อย่าง — **ไม่มี `fetch`, `onSubmit`, หรือ `onClick` ที่เรียก client fetch เหลืออยู่ในโค้ดเลยสักจุด**
- [ ] `SubmitButton` เป็น component แยก อยู่**ใต้** `<form>` ในต้นไม้ component จริง ๆ (ไม่ใช่ component เดียวกับที่สร้าง `<form>`) — กดปุ่มซ้ำ ๆ ต้องเห็นปุ่ม disable + ข้อความเปลี่ยนจริง
- [ ] submit ฟอร์มโดยเว้นชื่องานว่างไว้ → error message ขึ้นใต้ฟอร์ม **โดยหน้าไม่ reload** แล้วพิมพ์ชื่อถูกต้อง submit ใหม่ → error หาย
- [ ] `app/tasks/page.jsx` ยังเป็น Server Component ล้วน ๆ (ไม่มี `"use client"` บนสุดของไฟล์)
- [ ] **13:55 commit + push** repo ของ Lab A แล้ว — TA ตรวจ Lab A จาก commit นี้ (Twist ข้อ 1 ก็ทดสอบในโปรเจกต์นี้)

```
app/tasks/
├── page.jsx              # Server Component — list + ปุ่ม toggle/remove ต่อแถว
├── actions.js             # "use server" — addTask (มี validate) / removeTask / toggleTask
└── AddTaskForm.jsx         # "use client" — useActionState + <SubmitButton/> เป็นลูก
lib/
└── taskStore.js            # + toggleTaskDone(id)
```

---

## Lab B (50 น. · 14:00–14:50) — Auth Middleware + ความลับต้องอยู่ฝั่ง server

**Starter: `lab-day-08-b-start` — โปรเจกต์ใหม่ ทุกกลุ่มเริ่มจากจุดเดียวกัน** (ไม่ใช่ต่อจากโปรเจกต์ Lab A — ทำ Lab A จบหรือไม่ไม่มีผลกับ Lab B) · สร้าง GitHub repo ใหม่ให้โปรเจกต์นี้แล้ว commit + push ก่อน 14:50 (TA ตรวจจาก repo นี้ · **ไม่ต้อง deploy**) · `app/tasks/` ในโปรเจกต์นี้ยังเป็น TODO ของ Lab A ตามเดิม **ไม่ต้องทำซ้ำ** (`/dashboard` ใช้แค่ `getTasks()` ที่มีให้แล้ว) · ⚠️ **ต่างจากตอนเช้า:** `app/login/page.jsx` และ `app/login/actions.js` เป็น **TODO เปล่า** (ตอนเช้าอาจารย์มีให้ครบ) และปุ่ม "ออกจากระบบ" ใน `components/Nav.jsx` ยังเป็น TODO — ทั้ง 3 จุดเป็นงานขั้น A · ยังไม่มี `middleware.js` (ขั้น B)

**Context:** เวอร์ชันเช้านี้ของ `/dashboard` เช็ก auth ที่ Client Component (`if (!user) return null`) — พิสูจน์ไปแล้วตอนเช้าว่าโค้ดและข้อมูลลับทั้งหมดหลุดไปอยู่ใน JS bundle ตั้งแต่ก่อนเช็กเงื่อนไขด้วยซ้ำ บ่ายนี้ให้รื้อของเดิมทิ้ง แล้วสร้างระบบล็อกอินจริง + `middleware.js` ที่เช็กที่ **server ก่อน**ตอบ request ใด ๆ กลับไปเลย

| ขั้น | เวลา | ทำอะไร |
|---|:--:|---|
| **A. Mock login + cookie** | 10 น. | เขียนฟอร์ม `/login` + Server Action `login(prevState, formData)` ที่เทียบ email/password กับค่า mock แล้ว `(await cookies()).set('session', ..., { httpOnly: true, path: '/' })` ถ้าถูกต้อง (Next.js 15: `cookies()` เป็น async ต้อง `await`) |
| **B. `middleware.js`** | 15 น. | สร้างที่ราก project นอก `app/` — เช็ก cookie `session` ก่อนปล่อยเข้า `/dashboard` ไม่มี → `NextResponse.redirect(new URL('/login', request.url))` มี → `NextResponse.next()` ตั้ง `matcher: ['/dashboard/:path*']` |
| **C. พิสูจน์ว่าไม่รั่ว** | 10 น. | Log out → เปิด DevTools **Sources**/**Network** → พิมพ์ `/dashboard` ตรง ๆ ใน address bar → ต้องเห็น **redirect ก่อน**ไฟล์ของหน้า dashboard จะถูกโหลดเลย (เทียบกับตอนเช้าที่โหลดมาเต็ม ๆ ทั้งที่ log out) — แคปหน้าจอทั้ง 2 เวอร์ชันเก็บไว้ |
| **D. ความลับไม่หลุดไป client** | 15 น. | รื้อ `/dashboard` เป็น **Server Component** (ไม่มี `"use client"`) ที่อ่าน `getTasks()` ฝั่ง server → **ลบ `DashboardPanel.jsx` ทิ้งทั้งไฟล์** → ตั้ง `SESSION_SECRET` (ไม่มี prefix) และ `NEXT_PUBLIC_SITE_NAME` (มี prefix) ใน `.env.local` ไม่ hardcode → `npm run build && npm start` → DevTools **Sources** กด Ctrl+Shift+F ค้น `ยอดขายทั้งปี` ต้อง**ไม่เจอ**ในไฟล์ JS ใด ๆ (ก่อนรื้อ ลองค้นดูก่อน — จะเจอใน `page-*.js`) |

---

### Twist

1. 🔴 **(ทดสอบในโปรเจกต์ Lab A) ปิด JavaScript ในเบราว์เซอร์แล้วฟอร์มเพิ่ม/ลบ/mark-done ต้องยังทำงานได้ทั้ง 3 อย่าง** (progressive enhancement) — เปิด DevTools → Settings → Debugger → Disable JavaScript แล้วทดสอบทีละปุ่ม หน้าจะ reload เต็มหน้าแทนที่จะ smooth แต่ mutation ต้องสำเร็จทุกครั้ง
2. 🔴 **ต้องพิสูจน์ด้วยภาพว่าคนไม่ล็อกอินเข้าหน้า protected ไม่ได้ ทั้งจาก UI และจาก direct URL** — แคป (ก) กดลิงก์ไปหน้า dashboard ตอน log out แล้วโดนเด้ง (ข) พิมพ์ URL `/dashboard` ตรง ๆ ใน address bar ตอน log out แล้วโดนเด้งเหมือนกัน พร้อม Network tab ที่เห็น status `307` **ก่อน**มีไฟล์ของหน้า dashboard โหลดเข้ามา
3. 🔴 **ใส่ middleware แล้วยังไม่พอ — ข้อความลับต้องหายไปจาก JS ที่ส่งให้เบราว์เซอร์** — middleware กันแค่ request ที่ไป `/dashboard` แต่ไฟล์ JS ของ Client Component อยู่ที่ `/_next/static/...` ซึ่ง `matcher` ไม่ครอบ ใครรู้ URL ก็โหลดได้โดยไม่ต้องล็อกอิน · ทดสอบบน **production build** (`npm run build && npm start`) ไม่ใช่ `npm run dev` เพราะ dev ไม่ได้ bundle แบบเดียวกับที่ผู้ใช้จริงได้รับ
4. 🔴 **ห้าม hardcode ความลับ (เช่น session secret) ลงในโค้ดที่ commit เข้า git** — ต้องอยู่ใน `.env.local` (gitignore อัตโนมัติ) เท่านั้น — TA เปิด repo ค้นต้องไม่เจอค่าจริง (`.env.local.example` ใส่ได้แค่ค่าตัวอย่าง)
