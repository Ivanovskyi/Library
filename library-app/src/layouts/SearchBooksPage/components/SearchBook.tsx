import { Link } from "react-router-dom";
import BookLuv2CodeImg from "../../../Images/BooksImages/book-luv2code-1000.png";
import BookModel from "../../../models/BookModel"

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {
    // Use book ID as cache-busting to ensure different images are loaded
    const bookImageUrl = `${import.meta.env.VITE_API_URL}/books/${props.book.id}/image?v=${props.book.id}`;
    
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        <img src={bookImageUrl}
                            width='123'
                            height='196'
                            alt='Book'
                            key={`search-book-${props.book.id}-image`} // Force re-render for different books
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = BookLuv2CodeImg;
                            }}
                        />
                    </div>
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        <img src={bookImageUrl}
                            width='123'
                            height='196'
                            alt='Book'
                            key={`search-book-mobile-${props.book.id}-image`} // Force re-render for different books
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = BookLuv2CodeImg;
                            }}
                        />
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {props.book.author}
                        </h5>
                        <h4>
                            {props.book.title}
                        </h4>
                        <p className='card-text'>
                            {props.book.description}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/checkout/${props.book.id}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}