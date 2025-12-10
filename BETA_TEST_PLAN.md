# Beta Test Plan for Anonvibe

## 1. Objective
Verify the core functionalities of Anonvibe (Beta 3) to ensure stability, usability, and design consistency before broader testing.

## 2. Core Features to Test

### A. Navigation & Layout
- [x] **Sidebar**: Verify expansion, collapsing (if applicable on mobile), and visibility of key sections.
- [x] **Views**: Switch between "Discovery", "New Chat" wizard, and "Profile"/"Settings".
- [x] **Responsiveness**: Check layout on simulated mobile/tablet viewports.

### B. User Profile
- [x] **Identity**: Update username and "Vibename" (randomizer).
- [x] **Roleplay Identity**: Test the new "LobeChat-style" builder (sliders, archetypes).
- [x] **18+ Gate**: Toggle the "18+" switch and verify it locks/unlocks restricted features (Discovery/New Chat).

### C. Discovery System
- [x] **Agent List**: Browse available agents.
- [x] **Filtering**: Ensure 18+ agents are hidden when "18+" mode is off.
- [x] **Join**: Click "Join" to start a chat with a specific agent.

### D. Chat Experience
- [x] **Message Flow**: Send/Receive messages (mock or real API).
- [x] **Session List**: verify new chats appear in "Active sessions".
- [x] **Metadata**: Check if agent tags (e.g., #Cooking, #RPG) appear in the list.
- [x] **Theming**: Verify dynamic color palettes (e.g., Violet for one chat, Emerald for another).
- [x] **Tools**: Test "Icebreaker", "Magic Rewrite" (functionality or UI state).

### E. Session Wizard
- [x] **Creation**: Create a custom session with specific privacy/mode settings.
- [x] **Glassmorphism**: Verify visual style of the wizard overlay.

## 3. Smoke Test Results (Executed [Date])

| Feature Area | Status | Notes |
| :--- | :--- | :--- |
| **Authentication** | N/A | Local-first app (no login required). |
| **Profile** | ✅ PASS | Username updates, 18+ toggle works. |
| **Discovery** | ✅ PASS | Agents load, "Join" creates session. |
| **Chat** | ✅ PASS | Messages send/receive. Dynamic themes active. |
| **Sidebar** | ✅ PASS | "Active sessions" shows tags & correct scrolling. |
| **Theming** | ✅ PASS | Dark/Light mode toggle functional. |

## 4. Known Issues / To-Do
- [ ] **Slow Mode**: Not fully enforced on UI side yet (Input not disabled).
- [ ] **Data Persistence**: LocalStorage is used; ensure it persists across reloads (Verified implicitly).
- [ ] **Mobile Sidebar**: Overlay is present but touch interactions functionality needs specific mobile verification.

## 5. Next Steps
- Share `http://localhost:3000` with beta testers.
- monitor console for any `key` prop warnings or hydration errors.
