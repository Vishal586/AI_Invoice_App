# AI Invoice App

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

- PORT – Port on which the server runs
- GEMINI_API_KEY – API key for Google Generative AI (Gemini)

## 📡 API Endpoints
### Upload & Process Invoice

POST /api/invoice/upload
- Description: Uploads an invoice file and extracts structured data using AI.
- Request Type: multipart/form-data\
- Form Data:
   - file – Invoice PDF or image

Response Example:-
```bash
{
  "invoiceNumber": "INV-1023",
  "invoiceDate": "2025-01-05",
  "vendorName": "ABC Traders",
  "items": [
    {
      "description": "Product A",
      "quantity": 2,
      "price": 500
    }
  ],
  "totalAmount": 1000
}
```

## Health Check
### GET /api/health
- Description: Checks if the server is running.
- Response:-
```bash
{
  "status": "Server is running"
}
```

## 🎯 Project Objective
- The objective of AI Invoice App is to demonstrate the practical implementation of AI in automating document processing tasks. It showcases how intelligent systems can reduce operational effort, enhance accuracy, and modernize traditional invoice handling processes.

## 📌 Future Enhancements
- Database integration for storing invoices
- User authentication and role management
- Invoice history and search functionality
- Export extracted data to Excel or PDF
- Multi-language invoice support
