const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../db/database");
const router = express.Router();
const verifyToken = require("./mware");

router.post("/orderitems", verifyToken, async (req, res) => {
  try {
    const { order_id, product_id, quantity, paymentMode, status, total_price } =
      req.body;
    if (req.user) {
      const [checkStock] = await db("products")
        .select("*")
        .where({ id: product_id });
      //Prevent orders if stock is insufficient.
      if (checkStock.quantity > quantity) {
        const orders = await db("order_items").insert(req.body);
        const [products] = await db("products").select("*");
        const [customer] = await db("customers").select("*");
        const [details] = await db("order_items")
          .join("products", "order_items.product_id", "products.id")
          .join("orders", "order_items.order_id", "orders.id")
          .select(
            "order_items.id",
            "products.name",
            "products.price",
            "order_items.quantity",
            "order_items.paymentMode",
            "order_items.status",
            "order_items.price"
          )
          .where("order_items.product_id", product_id);
        const difference = products.quantity - quantity;
        const product = await db("products")
          .update({ quantity: difference })
          .where({ id: product_id });
        if (product) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "huzaifa009428@gmail.com",
              pass: "ldhr untp qvrq vqsi",
            },
          });
          const mailOptions = {
            from: "huzaifa009428@gmail.com",
            to: customer.email,
            subject: "your order received",
            text: JSON.stringify(details),
            // html: "<h1>Hello!</h1><p>This is a <b>test email</b> from gmail.</p>",
          };
          try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
            return res.status(200).json({ message: "Email sent successfully" });
          } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Error sending email" });
          }
        }
      } else {
        return res.status(403).json({ message: "not enough stock" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// router.get("/total", async (req, res) => {
//   try {
//     const sum = await db("orders").sum("total_price as total");
//     return res.send(sum);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });
module.exports = router;
