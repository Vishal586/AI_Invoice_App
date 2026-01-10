const { GoogleGenerativeAI } = require("@google/generative-ai");
const Invoice = require("../models/Invoice");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Parse invoice data from raw text using Gemini AI
 */
const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    try {
        const prompt = `
You are an expert invoice data extraction AI.
Extract invoice information and return ONLY a valid JSON object.

Required JSON format:
{
  "clientName": "string",
  "email": "string | null",
  "address": "string | null",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "unitPrice": number
    }
  ]
}

Invoice Text:
${text}
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedJson = responseText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleanedJson);

        res.status(200).json(parsedData);
    } catch (error) {
        console.error("Invoice parsing error:", error);
        res.status(500).json({
            message: "Failed to parse invoice data",
            error: error.message
        });
    }
};

/**
 * Generate invoice payment reminder email
 */
const generateReminderEmail = async (req, res) => {
    const { invoiceId } = req.body;

    if (!invoiceId) {
        return res.status(400).json({ message: "Invoice ID is required" });
    }

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const prompt = `
Write a professional, friendly reminder email.

Details:
Client Name: ${invoice.billTo.clientName}
Invoice Number: ${invoice.invoiceNumber}
Amount Due: ₹${invoice.total.toFixed(2)}
Due Date: ${new Date(invoice.dueDate).toDateString()}

Start with "Subject:" and keep it concise.
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const result = await model.generateContent(prompt);
        const reminderText = result.response.text();

        res.status(200).json({ reminderText });
    } catch (error) {
        console.error("Reminder email error:", error);
        res.status(500).json({
            message: "Failed to generate reminder email",
            error: error.message
        });
    }
};

/**
 * Generate dashboard insights
 */
const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id });

        if (!invoices.length) {
            return res.status(200).json({
                insights: ["No invoices available yet."]
            });
        }

        const totalInvoices = invoices.length;
        const paid = invoices.filter(i => i.status === "Paid");
        const unpaid = invoices.filter(i => i.status !== "Paid");

        const totalRevenue = paid.reduce((sum, i) => sum + i.total, 0);
        const outstanding = unpaid.reduce((sum, i) => sum + i.total, 0);

        const prompt = `
You are a financial assistant.

Summary:
Total invoices: ${totalInvoices}
Paid invoices: ${paid.length}
Unpaid invoices: ${unpaid.length}
Revenue: ₹${totalRevenue.toFixed(2)}
Outstanding: ₹${outstanding.toFixed(2)}

Return 2–3 actionable insights as JSON:
{ "insights": ["...", "..."] }
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedJson = responseText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleanedJson);

        res.status(200).json(parsedData);
    } catch (error) {
        console.error("Dashboard summary error:", error);
        res.status(500).json({
            message: "Failed to generate dashboard insights",
            error: error.message
        });
    }
};

module.exports = {
    parseInvoiceFromText,
    generateReminderEmail,
    getDashboardSummary
};