<img src="/client/public/logo-with-bg.png" />

# Project Description

**Code, Chat, Create, — All in One Place.**  
CodeNest is a real-time collaborative coding platform where you can **write, execute, and debug code together** while chatting over **live video/audio** and even **sketching on a shared drawing canvas**.  

Whether you’re preparing for interviews, practicing Data Structures & Algorithms with friends, or pair-programming remotely, CodeNest brings **all the tools you need** into a single, seamless workspace.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [User Interface](#user-interface)
- [Highlights](#highlights)

---

## Features

### Room-based Collaboration
- Create or join dedicated rooms for a private coding session.
- Fully synchronized environment — every keystroke, shape, and interaction is updated in real-time for all participants.

### Real-time Video & Audio Chat
- Peer-to-peer **WebRTC** connections ensure smooth, low-latency video and audio sharing.
- Ideal for **mock interviews**, **pair programming**, or just discussing ideas face-to-face.

### Collaborative Monaco Code Editor
- Write code together with **live cursor pointers** for all users.
- Supports multiple popular languages:
  - JavaScript
  - TypeScript
  - Java
  - C / C++
  - Python
- Fully synced editing with real-time updates.
- Adjustable font size for personalized comfort.
- Syntax highlighting & IntelliSense powered by **Monaco Editor**.

### Code Execution with Input/Output
- Custom **input and output text areas** for running your code.
- Execute directly from the editor using the **Piston API**.
- Real-time sharing of outputs with other users in the room.

### Collaborative Drawing Canvas
- Toggle between the editor and a **Fabric.js** powered drawing canvas.
- Live updates for every shape drawn.
- Tools include:
  - Basic shapes
  - Freehand pencil tool
  - Change brush color and size
  - Delete individual shapes
  - Clear entire canvas
- Perfect for **whiteboarding**, **dry-running algorithms**, or explaining problem approaches.

---

## Tech Stack

### **Real-time Communication**
- **WebRTC** — High-performance peer-to-peer audio/video streaming.
- **WebSockets** — Instant event broadcasting for code, output, and canvas updates.

### **Frontend**
- **React.js** — Component-based UI for building a responsive, interactive interface.
- **TypeScript** — Type-safe development for fewer runtime errors.
- **TailwindCSS** — Utility-first CSS for rapid, consistent styling.
- **Shadcn-UI** — Pre-styled UI components for a polished, modern design.
- **socket.io-client** — Real-time bidirectional communication with the server.
- **peer.js** — Simplifies WebRTC peer-to-peer video/audio connections.
- **monaco-editor** — Rich code editor with syntax highlighting, IntelliSense, and language support.
- **fabric.js** — Canvas manipulation library for collaborative drawing tools.
- **zustand** — Lightweight state management for handling global UI and media states.
- **Piston API** — Remote code execution for multiple programming languages.

### **Backend**
- **Node.js** — JavaScript runtime for building fast, scalable server applications.
- **Express.js** — Lightweight web framework for handling API routes and socket server setup.
- **socket.io** — WebSockets abstraction for real-time communication between server and clients.
- **TypeScript** — Strongly typed backend development for better maintainability.

---

## How It Works

1. **Create or Join a Room**  
   Get started instantly — no sign-up required.
   
2. **Collaborate in Real-time**  
   Write code together in the Monaco editor, see each other’s changes instantly.

3. **Communicate Face-to-Face**  
   Use the built-in video/audio chat for smooth conversation and coordination.

4. **Whiteboard Ideas**  
   Switch to the collaborative canvas to sketch diagrams, dry-run solutions, or explain concepts visually.

---

## User Interface

### Landing Page
<img src="/client/public/landing-page.png" />
<img src="/client/public/features.png" />

### Join Room Page
<img src="/client/public/join-room-page.png" />

### Collaborative Room Page
#### Editor
<img src="/client/public/editor-demo.png" />

#### Canvas
<img src="/client/public/canvas-demo.png" />

---

## Highlights
- **No Sign-up Required** — Jump straight into coding without account creation.
- **Instant Real-time Sync** — Every edit, shape, or output update is instantly visible to all.
- **Multi-Modal Collaboration** — Code + Video + Canvas all in one platform.
- **Responsive UI** — Works across devices and screen sizes.
