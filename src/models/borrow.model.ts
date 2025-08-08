import mongoose, { Schema, Document } from "mongoose";
import Book, { IBook, IBookModel } from "./book.model";

export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

const BorrowSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

BorrowSchema.pre("save", async function (next) {
  const borrow = this as any;
  if (borrow.isNew || borrow.isModified("quantity")) {
    const book = await (Book as IBookModel).findById(borrow.book).exec();
    if (!book) {
      throw new Error("Book not found");
    }
    book.copies -= borrow.quantity;
    book.available = book.copies > 0;
    await book.save();
  }
  next();
});

export default mongoose.model<IBorrow>("Borrow", BorrowSchema);
