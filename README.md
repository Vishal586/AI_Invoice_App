# AI_Invoice_App

AI_Invoice_App is a web-based application that automates invoice processing using Artificial Intelligence. It allows users to upload invoice documents and automatically extracts essential information such as invoice number, invoice date, vendor details, item descriptions, quantities, prices, and total amounts. This application reduces manual data entry, improves accuracy, and streamlines invoice management workflows.

The system leverages AI-powered document understanding to handle invoices in different formats and presents the extracted data in a structured and user-friendly interface, making it suitable for real-world business and accounting use cases.

---

## ✨ Features

- Upload invoice files (PDF or image formats)
- AI-based invoice data extraction
- Automatic identification of key invoice fields
- Real-time invoice processing
- Clean and responsive user interface
- Error handling for unsupported or invalid files

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Vite, Tailwind CSS
- **Backend:** Node.js, Express.js  
- **AI Integration:** Google Generative AI (Gemini)  
- **Other Tools:** REST APIs, File upload & processing libraries

---

## ✅ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI_Invoice_App.git
cd AI_Invoice_App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a .env file in the root directory and add the required values (see below).

### 4. Start the Server
```bash
npm start
```

The application will run on:-
```bash
http://localhost:3000
```

## 🔐 Environment Variables
Create a .env file in the root directory and configure the following variables:-
```bash
PORT=3000
GEMINI_API_KEY=your_google_generative_ai_api_key
```

