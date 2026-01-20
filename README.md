# AI Manga Creator

AI Manga Creator is a powerful web application that allows users to create professional-looking manga pages using Artificial Intelligence. It combines a Stable Diffusion-powered image generator with a drag-and-drop manga editor.

## Features

- **AI Image Generation**: Generate anime/manga style images based on text prompts using Stable Diffusion.
- **Customizable Layouts**: Choose from various panel layouts (1-5 panels) for your pages.
- **Manga Editor**: Drag and drop speech bubbles, thought clouds, and sound effects onto your generated panels.
- **Character Consistency**: (Experimental) Input character prompts to help maintain consistency.
- **Export**: Download your creations as high-quality images.
- **Modern UI**: Sleek, dark-mode interface built with Tailwind CSS.

## Prerequisites

Before running the application, ensure you have the following installed:

1.  **Node.js**: [Download Node.js](https://nodejs.org/) (Required for the backend server).
2.  **Stable Diffusion WebUI (Automatic1111)**: You need a local instance of Stable Diffusion WebUI running with the API enabled.
    - [Installation Guide for Automatic1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

## Installation & Setup

### 1. Setup Stable Diffusion WebUI

The backend communicates with a local Stable Diffusion instance. You must start the WebUI with the `--api` flag.

**Windows:**
Edit your `webui-user.bat` file and add `--api` to the `COMMANDLINE_ARGS`:
```bat
set COMMANDLINE_ARGS=--api
```
Run `webui-user.bat`.

**Linux/Mac:**
Run with:
```bash
./webui.sh --api
```

*Note: The backend expects the WebUI to be running at `http://127.0.0.1:7860`.*

### 2. Setup Backend

The backend acts as a proxy between the frontend and the Stable Diffusion API.

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node server.js
    ```
    You should see: `✅ Backend running on http://localhost:3000`

### 3. Run Frontend

The frontend is a static web application.

1.  Navigate to the `frontend` directory.
2.  Open `index.html` in your preferred web browser.
    - Alternatively, you can use a simple HTTP server (like Live Server in VS Code) to serve the `frontend` directory for a better experience.

## Usage

1.  **Home**: Overview of the application.
2.  **Generator**:
    - Enter a "Story Prompt" for your scene.
    - (Optional) Describe your character in "Character Prompt".
    - Select a Layout.
    - Click **GENERATE PANELS**.
3.  **Editor** (Coming Soon/In Progress):
    - Use generated text bubbles and effects to complete your story.

## Project Structure

- `backend/`: Node.js Express server.
- `frontend/`: HTML, JS, and Tailwind CSS frontend files.
