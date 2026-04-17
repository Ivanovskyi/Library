import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useAuth } from "../../../Auth/authContext";
import BookLuv2CodeImg from '../../../Images/BooksImages/book-luv2code-1000.png';
import axiosInstance from '../../../lib/axiosInstance';

interface ChangeQuantityProps {
    book: BookModel;
    deleteBook: () => void;
}

export const ChangeQuantityOfBook: React.FC<ChangeQuantityProps> = ({ book, deleteBook }) => {
    
    const { isAuthenticated } = useAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        setQuantity(book.copies ?? 0);
        setRemaining(book.copiesAvailable ?? 0);
    }, [book]);

    async function increaseQuantity() {
        if (!isAuthenticated) return;

        try {
            await axiosInstance.put(`/admin/secure/increase/book/quantity/?bookId=${book.id}`);
            setQuantity(prev => prev + 1);
            setRemaining(prev => prev + 1);
        } catch (error) {
            // console.error('Increase quantity failed:', error);
            alert('Failed to increase book quantity. Please try again.');
        }
    }

    async function decreaseQuantity() {
        if (!isAuthenticated) return;

        try {
            await axiosInstance.put(`/admin/secure/decrease/book/quantity/?bookId=${book.id}`);
            setQuantity(prev => prev - 1);
            setRemaining(prev => prev - 1);
        } catch (error) {
            // console.error('Decrease quantity failed:', error);
            alert('Failed to decrease book quantity. Please try again.');
        }
    }

    async function handleDeleteBook() {
        if (!isAuthenticated) return;

        try {
            await axiosInstance.delete(`/admin/secure/delete/book/?bookId=${book.id}`);
            deleteBook();
        } catch (error) {
            // console.error('Delete book failed:', error);
            alert('Failed to delete book. Please try again.');
        }
    }

        
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                {/* Book Image */}
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        <img src={book.img ?? BookLuv2CodeImg} width='123' height='196' alt='Book' />
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        <img src={book.img ?? BookLuv2CodeImg} width='123' height='196' alt='Book' />
                    </div>
                </div>

                {/* Book Details */}
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{book.author}</h5>
                        <h4>{book.title}</h4>
                        <p className='card-text'>{book.description}</p>
                    </div>
                </div>

                {/* Quantity Info */}
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                </div>

                {/* Delete Button */}
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={handleDeleteBook}>
                            Delete
                        </button>
                    </div>
                </div>

                {/* Quantity Control Buttons */}
                <div className='mt-3 col-md-12 d-flex justify-content-start'>
                    <button className='m-1 btn btn-md main-color text-white' onClick={increaseQuantity}>
                        Add Quantity
                    </button>
                    <button className='m-1 btn btn-md btn-warning' onClick={decreaseQuantity}>
                        Decrease Quantity
                    </button>
                </div>
            </div>
        </div>
    );
};
