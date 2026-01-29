// models/Order.ts
import mongoose from 'mongoose';

// ลบ model เก่าถ้ามี (สำคัญมาก!)
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const CartItemSchema = new mongoose.Schema({
  key: { type: Number, required: true },
  menuName: { type: String, required: true },
  type: { type: String, required: true },
  milk: { type: String, required: true },
  toppings: { type: [String], default: [] },
  quantity: { type: Number, required: true, min: 1 },
  specialNote: { type: String, default: '' },
  basePrice: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerText: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['promptpay', 'counter'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed'],
      default: 'pending',
    },
    price: {
      type: Number,
      default: 0,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// สร้าง model ใหม่
const Order = mongoose.model('Order', OrderSchema);

export default Order;