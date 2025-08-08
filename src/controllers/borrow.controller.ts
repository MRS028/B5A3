import { Request, Response } from "express";
import Borrow from "../models/borrow.model";
import Book from "../models/book.model";
import { title } from "process";

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { book, quantity, dueDate } = req.body;
    const existingBook = await Book.findById(book);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
        error: "Book not found By this BookId",
      });
    }
    const newBorrow = await Borrow.create({ book, quantity, dueDate });
    const savedBorrow = await newBorrow.save();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully.",
      data: savedBorrow,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "validation failed.",
      error: error.errors || error.message,
    });
  }
};

export const getBorrowBooksSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
      {
        $unwind: "$book",
      },
    ]);
    if (summary.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No borrowed books found.",
        error: "Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Borrowed books retrieved successfully.",
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed book's summary.",
      error: error.message,
    });
  }
};