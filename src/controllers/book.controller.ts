import { Request, Response } from "express";
import Book from "../models/book.model";

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

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const {filter, sortBy, sort, limit, skip} = req.query;
    const query: any = {};
    const sortOptions : any = {};

    if (filter) {
      query.genre = filter;
    }
    if(sortBy){
        sortOptions[sortBy as string] = sort === 'dec' ? -1 : 1;
    }else{
        sortOptions.createdAt = -1;
    }

    const books = await Book.find(query)
    .sort(sortOptions).limit(Number(limit) || 10);

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
