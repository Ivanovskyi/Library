import React from 'react'
import { Link } from 'react-router-dom';
import BookModel from '../../../models/BookModel';
import BookLuv2CodeImg from '../../../Images/BooksImages/book-luv2code-1000.png';

export const ReturnBook: React.FC<{book: BookModel}> = (props) => {
    // Use book ID as cache-busting to ensure different images are loaded
    const bookImageUrl = `${import.meta.env.VITE_API_URL}/books/${props.book.id}/image?v=${props.book.id}`;
    
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>
                <img
                    src={bookImageUrl}
                    width='151'
                    height='233'
                    alt="book"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = BookLuv2CodeImg;
                    }}
                    key={`book-${props.book.id}-image`} // Force re-render for different books
                />
                <h6 className='mt-2'>{props.book.title}</h6>
                <p>{props.book.author}</p>
                <Link className='btn main-color text-white' to={`checkout/${props.book.id}`}>Reserve</Link>
            </div>
        </div>
    );
}