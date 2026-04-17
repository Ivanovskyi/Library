import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";

import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";

import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";

import { useAuth } from "../../Auth/authContext";

import BookLuv2CodeImg from "../../Images/BooksImages/book-luv2code-1000.png";

export const BookCheckoutPage = () => {
    const { isAuthenticated } = useAuth();

    // Debug: Check token immediately when component loads
    // console.log('BookCheckoutPage - Token in localStorage:', localStorage.getItem('jwt_token') ? 'present' : 'missing');
    // console.log('BookCheckoutPage - isAuthenticated:', isAuthenticated);

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Book state
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    // Payment
    const [displayError, setDisplayError] = useState(false);

    const bookId = window.location.pathname.split('/')[2];

    // 📚 Fetch Book
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axiosInstance.get(`/books/${bookId}`);

                const data = response.data;

                const loadedBook: BookModel = {
                    id: data.id,
                    title: data.title,
                    author: data.author,
                    description: data.description,
                    copies: data.copies,
                    copiesAvailable: data.copiesAvailable,
                    category: data.category,
                    img: data.img,
                };

                setBook(loadedBook);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBook();
    }, [bookId, isCheckedOut]);

    // ⭐ Fetch Reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(
                    `/reviews/search/findByBookId?bookId=${bookId}`
                );

                const responseData = response.data._embedded.reviews;

                const loadedReviews: ReviewModel[] = [];
                let weighted = 0;

                for (const key in responseData) {
                    loadedReviews.push({
                        id: responseData[key].id,
                        userEmail: responseData[key].userEmail,
                        date: responseData[key].date,
                        rating: responseData[key].rating,
                        book_id: responseData[key].bookId,
                        reviewDescription: responseData[key].reviewDescription,
                    });

                    weighted += responseData[key].rating;
                }

                if (loadedReviews.length > 0) {
                    const avg = Math.round((weighted / loadedReviews.length) * 2) / 2;
                    setTotalStars(avg);
                }

                setReviews(loadedReviews);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingReview(false);
            }
        };

        fetchReviews();
    }, [bookId, isReviewLeft]);

    // 👤 User Review
    useEffect(() => {
        const fetchUserReview = async () => {
            if (!isAuthenticated) {
                setIsLoadingUserReview(false);
                return;
            }

try {
                const response = await axiosInstance.get(
                    `/reviews/secure/user/book/?bookId=${bookId}`
                );
                setIsReviewLeft(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setIsReviewLeft(false);
                } else {
                    setHttpError(error.message);
                }
            } finally {
                setIsLoadingUserReview(false);
            }
        };

        fetchUserReview();
    }, [bookId, isAuthenticated]);

    // 📦 Loans Count
    useEffect(() => {
        const fetchLoans = async () => {
            if (!isAuthenticated) {
                setIsLoadingCurrentLoansCount(false);
                return;
            }

try {
                const response = await axiosInstance.get(
                    `/books/secure/currentloans/count`
                );
                setCurrentLoansCount(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setCurrentLoansCount(0);
                } else {
                    setHttpError(error.message);
                }
            } finally {
                setIsLoadingCurrentLoansCount(false);
            }
        };

        fetchLoans();
    }, [isAuthenticated, isCheckedOut]);

    // 📕 Checked Out
    useEffect(() => {
        const fetchCheckedOut = async () => {
            if (!isAuthenticated) {
                setIsLoadingBookCheckedOut(false);
                return;
            }

try {
                const response = await axiosInstance.get(
                    `/books/secure/ischeckedout/byuser/?bookId=${bookId}`
                );
                setIsCheckedOut(response.data);
            } catch (error: any) {
                if (error.response && error.response.status === 403) {
                    setIsCheckedOut(false);
                } else {
                    setHttpError(error.message);
                }
            } finally {
                setIsLoadingBookCheckedOut(false);
            }
        };

        fetchCheckedOut();
    }, [bookId, isAuthenticated]);

    // 📥 Checkout
    async function checkoutBook() {
        try {
            await axiosInstance.put(`/books/secure/checkout/?bookId=${book?.id}`);
            setDisplayError(false);
            setIsCheckedOut(true);
        } catch (error: any) {
            setDisplayError(true);
            // If error is due to outstanding fees, redirect to shelf
            if (error.response?.status === 403 && 
                (error.message?.includes('Outstanding fees') || 
                 error.response?.data?.includes?.('Outstanding fees') ||
                 JSON.stringify(error.response?.data)?.includes('Outstanding fees'))) {
                setTimeout(() => {
                    window.location.href = '/shelf';
                }, 2000);
            }
        }
    }

    // ✍️ Submit Review
    async function submitReview(starInput: number, reviewDescription: string) {
        const reviewRequest = new ReviewRequestModel(
            starInput,
            book?.id ?? 0,
            reviewDescription
        );

        try {
            await axiosInstance.post(`/reviews/secure`, reviewRequest);
            setIsReviewLeft(true);
        } catch {
            throw new Error('Something went wrong!');
        }
    }

    // ⏳ Loading
    if (
        isLoading ||
        isLoadingReview ||
        isLoadingCurrentLoansCount ||
        isLoadingBookCheckedOut ||
        isLoadingUserReview
    ) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    // 🎨 UI
    return (
        <div>
            <div className='container d-none d-lg-block'>
                {displayError && (
                    <div className='alert alert-danger mt-3'>
                        Please pay outstanding fees and/or return late book(s).
                    </div>
                )}

                <div className='row mt-5'>
                    <div className='col-sm-2'>
                        <img
                            src={book?.img ?? BookLuv2CodeImg}
                            width='226'
                            height='349'
                            alt='Book'
                        />
                    </div>

                    <div className='col-4 container'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>

                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>

                <hr />

                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={false}
                />
            </div>
        </div>
    );
};