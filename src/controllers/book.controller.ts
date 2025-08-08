import { Request, Response } from "express";
import Book from "../models/book.model";



//create Book
export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: savedBook,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "validation failed.",
      error: error.message,
    });
  }
};


//get all books
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { filter, sortBy, sort, limit } = req.query;
    const query: any = {};
    const sortOptions: any = {};

    if (filter) {
      query.genre = filter;
    }
    if (sortBy) {
      sortOptions[sortBy as string] = sort === 'desc' ? -1 : 1; // 'desc' ঠিক করে দিলাম
    } else {
      sortOptions.createdAt = -1;
    }

    const books = await Book.find(query)
      .sort(sortOptions)
      .limit(Number(limit) || 10);
    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found",
        error: "Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books.",
      error: error.message,
    });
  }
};


//get book by id
export const getBookById = async (req: Request, res: Response) => {
  try {
    const {bookId} = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
        error: "Book not found By this BookId",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve book.",
      error: error.message,
    });
}
};

//update book
export const  updateBook = async (req: Request, res: Response) => {
  try {
    const {bookId} = req.params;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,runValidators: true
    });
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
        error: "Book not found By this BookId",
      });
    }   
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update book.",
      error: error.errors || error.message,
    });
  }
};  

//delete book

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const {bookId} = req.params;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
        error: "Book not found By this BookId",
      });
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete book.",
      error: error.message,
    });
  }
};