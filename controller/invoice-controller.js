const PDFDocument = require("pdfkit");
const orderModel = require("../model/order-model");

exports.getInvoice = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename=invoice-${orderId}.pdf`
        );

        doc.pipe(res);

        const items = order.cartItems || [];
        const subtotal = order.subtotal || 0;
        const tax = order.tax || 0;
        const shipping = order.shipping || 0;
        const total = order.total || 0;
        const shippingAddress = order.shippingAddress || {};

        // --- Header ---
        doc.fontSize(16).fillColor("#e7000b").text("ATAL Opticals", 50, 50);
        doc.fontSize(10).fillColor("#333333")
            .text("10906 Hurontario St", 50, 70)
            .text("Unit D7 Brampton,", 50, 82)
            .text("ON L7A 3R9 905-970-9444", 50, 94)
            .text("CANADA", 50, 106);

        doc.fontSize(20).fillColor("#e7000b").text("INVOICE", 400, 50);

        // --- Invoice Info Box ---
        doc.fontSize(10).fillColor("#000000");
        doc.text(`Invoice #: ${order._id.toString().slice(-6)}`, 400, 80);
        doc.text(`Invoice Date: ${order.createdAt ? order.createdAt.toDateString() : "N/A"}`, 400, 95);
        doc.text(`Terms: Due on Receipt`, 400, 110);
        doc.text(`Due Date: ${order.createdAt ? order.createdAt.toDateString() : "N/A"}`, 400, 125);

        // --- Bill To / Ship To ---
        doc.fontSize(12).fillColor("#e7000b").text("Bill To:", 50, 150);
        doc.fontSize(10).fillColor("#000000");
        doc.text(`${shippingAddress.fullName || "N/A"}`, 50, 165);
        doc.text(`${shippingAddress.address || ""}`, 50, 180);
        doc.text(`${shippingAddress.city || ""}, ${shippingAddress.province || ""}, ${shippingAddress.postalCode || ""}`, 50, 195);
        doc.text(`${shippingAddress.country || ""}`, 50, 210);

        doc.fontSize(12).fillColor("#e7000b").text("Ship To:", 300, 150);
        doc.fontSize(10).fillColor("#000000");
        doc.text(`${shippingAddress.fullName || "N/A"}`, 300, 165);
        doc.text(`${shippingAddress.address || ""}`, 300, 180);
        doc.text(`${shippingAddress.city || ""}, ${shippingAddress.province || ""}, ${shippingAddress.postalCode || ""}`, 300, 195);
        doc.text(`${shippingAddress.country || ""}`, 300, 210);

        // --- Table Header ---
        const tableTop = 240;
        doc.rect(50, tableTop, 520, 20).fill("#e7000b");  // Medium Blue background
        doc.fillColor("#fff")
            .text("#", 55, tableTop + 5)
            .text("Item & Description", 75, tableTop + 5)
            .text("Qty", 350, tableTop + 5, { width: 50, align: "right" })
            .text("Rate", 400, tableTop + 5, { width: 70, align: "right" })
            .text("Amount", 480, tableTop + 5, { width: 70, align: "right" });

        // --- Table Items ---
        let y = tableTop + 25;
        items.forEach((item, index) => {
            doc.fillColor("#000000")
                .text(index + 1, 55, y)
                .text(item.name, 75, y, { width: 270 })
                .text(item.quantity, 350, y, { width: 50, align: "right" })
                .text(item.price.toFixed(2), 400, y, { width: 70, align: "right" })
                .text((item.price * item.quantity).toFixed(2), 480, y, { width: 70, align: "right" });
            y += 20;
        });

        // --- Summary Box (Sub Total, Tax, Total) ---
        y += 10;
        const summaryX = 400;

        // Draw a light blue background rectangle behind the summary text
        doc.rect(summaryX - 10, y - 10, 150, 70).fill;
        doc.fillColor("#000000")
            .text(`Sub Total: $${subtotal.toFixed(2)}`, summaryX, y, { align: "right" });
        y += 15;
        doc.text(`Tax (${order.taxRate || 5}%): $${tax.toFixed(2)}`, summaryX, y, { align: "right" });
        y += 15;
        doc.text(`Shipping: ${shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}`, summaryX, y, { align: "right" });
        y += 15;
        doc.fontSize(12).fillColor("#e7000b").text(`Total: $${total.toFixed(2)}`, summaryX, y, { align: "right" });

        // --- Footer Terms ---
        y += 40;
        doc.fontSize(9).fillColor("#555555").text(
            "Thanks for your business!\nFull payment is due upon receipt of this invoice. Late payments may incur additional charges or interest as per the applicable laws.",
            50, y, { width: 500, align: "center" }
        );

        doc.end();
    } catch (err) {
        console.error("Invoice generation error:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to generate invoice", error: err.message });
        } else {
            res.end();
        }
    }
};
