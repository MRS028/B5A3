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
  title: { type: String, required: [true, "Title is required"] },
  author: { type: String, required: [true, "Author name is required"] },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    message: "One genere should be at least.",
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
  isbn: { type: String, required: [true, "ISBN is required"], unique: true },
  description: { type: String},
  copies: {
    type: Number,
    required: true,
    min: [0, "Copies should be a positive number"],
  },
  available: { type: Boolean, default: true },
}, {
  timestamps: true,
});



BookSchema.pre("save", async function (next) {
    if(this.isModified("copies")){
        this.available = this.copies > 0;
    }
    next();
})

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
