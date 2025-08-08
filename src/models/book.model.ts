import { Mode } from "fs";
import mongoose, { Schema, Document, Model } from "mongoose";
import { title } from "process";

export interface IBook extends Document {
  title: string;
  author: string;
  genre:
    | "Friction"
    | "Science"
    | "Non-Fiction"
    | "Self-Help"
    | "Biography"
    | "Poetry"
    | "History"
    | "Drama"
    | "Philosophy"
    | "Religion";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface IBookModel extends Model<IBook> {
  updateAvailability(
    bookId: mongoose.Types.ObjectId,
    quantity: number
  ): Promise<IBook>;
}

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: {
    type: String,
    required: true,
    enum: [
      "FRICTION",
      "SCIENCE",
      "NON_FRICTION",
      "BIOGRAPHY",
      "FANTASY",
      "HISTORY",
      "DRAMA",
      "PHILOSOPHY",
      "RELIGION",
    ],
  },
  isbn: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  copies: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true },
});

BookSchema.statics.updateAvailability = async function (
  bookId: mongoose.Types.ObjectId,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }
  book.copies += quantity;
  book.available = book.copies > 0;
  await book.save();
  return book;
};  

export default mongoose.model<IBook, IBookModel>("Book", BookSchema);