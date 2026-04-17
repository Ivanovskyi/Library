import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { LoansModal } from './LoansModal';
import BookLuv2CodeImg from '../../../Images/BooksImages/book-luv2code-1000.png';
import { useAuth } from '../../../Auth/authContext';

export const Loans = () => {
    
    const { isAuthenticated, token } = useAuth();

    const [httpError, setHttpError] = useState<string | null>(null);

    // Current Loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [forceRefresh, setForceRefresh] = useState(Date.now());

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            console.log('Fetching loans - checkout:', checkout, 'refreshKey:', refreshKey);
            setIsLoadingUserLoans(true);
            setHttpError(null);
            
            if (isAuthenticated && token) {
                try {
                    const url = `${import.meta.env.VITE_API_URL}/books/secure/currentloans`;

                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    };

                    const shelfCurrentLoansResponse = await fetch(url, requestOptions);

                    if (!shelfCurrentLoansResponse.ok) {
                        throw new Error('Something went wrong!');
                    }

                    const shelfCurrentLoansResponseJson = await shelfCurrentLoansResponse.json();
                    console.log('Loans fetched:', shelfCurrentLoansResponseJson);
                    setShelfCurrentLoans(shelfCurrentLoansResponseJson);
                } catch (error: any) {
                    console.error('Error fetching loans:', error);
                    setHttpError(error.message);
                } finally {
                    setIsLoadingUserLoans(false);
                }
            } else {
                setIsLoadingUserLoans(false);
            }

            window.scrollTo(0, 0);
        };

        fetchUserCurrentLoans();
    }, [isAuthenticated, token, checkout, refreshKey, forceRefresh]);

    if (isLoadingUserLoans) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function returnBook(bookId: number) {
        const url = `${import.meta.env.VITE_API_URL}/books/secure/return?bookId=${bookId}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            // Use multiple state updates to ensure proper UI refresh
            setCheckout(prev => !prev);
            setRefreshKey(prev => prev + 1);
            setForceRefresh(Date.now()); // Force complete refresh
        } catch (error: any) {
            // console.error('Return book failed:', error);
            alert('Failed to return book. Please try again.');
        }
    }

    async function renewLoan(bookId: number) {
        const url = `${import.meta.env.VITE_API_URL}/books/secure/renew/loan?bookId=${bookId}`;

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            // Use multiple state updates to ensure proper UI refresh
            setCheckout(prev => !prev);
            setRefreshKey(prev => prev + 1);
            setForceRefresh(Date.now()); // Force complete refresh
        } catch (error: any) {
            // console.error('Renew loan failed:', error);
            alert('Failed to renew loan. Please try again.');
        }
    }
    
    return (
        <div>
            {/* Desktop */}
            <div className='d-none d-lg-block mt-2'>
                {shelfCurrentLoans.length > 0 ? 
                <>
                    <h5>Current Loans: </h5>

                    {shelfCurrentLoans.map(shelfCurrentLoan => (
                        <div key={shelfCurrentLoan.book.id}>
                            <div className='row mt-3 mb-3'>
                                <div className='col-4 col-md-4 container'>
                                    {shelfCurrentLoan.book?.img ? 
                                        <img src={shelfCurrentLoan.book?.img} width='226' height='349' alt='Book'/>
                                        :
                                        <img src={BookLuv2CodeImg} width='226' height='349' alt='Book'/>
                                    }
                                </div>

                                <div className='card col-3 col-md-3 container d-flex'>
                                    <div className='card-body'>
                                        <div className='mt-3'>
                                            <h4>Loan Options</h4>

                                            {shelfCurrentLoan.daysLeft > 0 && 
                                                <p className='text-secondary'>
                                                    Due in {shelfCurrentLoan.daysLeft} days.
                                                </p>
                                            }

                                            {shelfCurrentLoan.daysLeft === 0 && 
                                                <p className='text-success'>
                                                    Due Today.
                                                </p>
                                            }

                                            {shelfCurrentLoan.daysLeft < 0 && 
                                                <p className='text-danger'>
                                                    Past due by {Math.abs(shelfCurrentLoan.daysLeft)} days.
                                                </p>
                                            }

                                            <div className='list-group mt-3'>
                                                <button 
                                                    className='list-group-item list-group-item-action'
                                                    data-bs-toggle='modal'
                                                    data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                                                >
                                                    Manage Loan
                                                </button>

                                                <Link to={'search'} className='list-group-item list-group-item-action'>
                                                    Search more books?
                                                </Link>
                                            </div>
                                        </div>

                                        <hr/>

                                        <p className='mt-3'>
                                            Help others by reviewing your loan.
                                        </p>

                                        <Link className='btn btn-primary' to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <LoansModal
                                shelfCurrentLoan={shelfCurrentLoan}
                                mobile={false}
                                returnBook={returnBook}
                                renewLoan={renewLoan}
                            />
                        </div>
                    ))}
                </> :
                <>
                    <h3 className='mt-3'>Currently no loans</h3>
                    <Link className='btn btn-primary' to={`search`}>
                        Search for a new book
                    </Link>
                </>
            }
            </div>

            {/* Mobile */}
            <div className='container d-lg-none mt-2'>
                {shelfCurrentLoans.length > 0 ? 
                <>
                    <h5 className='mb-3'>Current Loans: </h5>

                    {shelfCurrentLoans.map(shelfCurrentLoan => (
                        <div key={shelfCurrentLoan.book.id}>
                            <div className='d-flex justify-content-center align-items-center'>
                                {shelfCurrentLoan.book?.img ? 
                                    <img src={shelfCurrentLoan.book?.img} width='226' height='349' alt='Book'/>
                                    :
                                    <img src={BookLuv2CodeImg} width='226' height='349' alt='Book'/>
                                }
                            </div>

                            <div className='card d-flex mt-5 mb-3'>
                                <div className='card-body container'>
                                    <h4>Loan Options</h4>

                                    {shelfCurrentLoan.daysLeft > 0 && 
                                        <p className='text-secondary'>
                                            Due in {shelfCurrentLoan.daysLeft} days.
                                        </p>
                                    }

                                    {shelfCurrentLoan.daysLeft === 0 && 
                                        <p className='text-success'>
                                            Due Today.
                                        </p>
                                    }

                                    {shelfCurrentLoan.daysLeft < 0 && 
                                        <p className='text-danger'>
                                            Past due by {Math.abs(shelfCurrentLoan.daysLeft)} days.
                                        </p>
                                    }

                                    <div className='list-group mt-3'>
                                        <button 
                                            className='list-group-item list-group-item-action'
                                            data-bs-toggle='modal'
                                            data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                                        >
                                            Manage Loan
                                        </button>

                                        <Link to={'search'} className='list-group-item list-group-item-action'>
                                            Search more books?
                                        </Link>
                                    </div>

                                    <hr/>

                                    <p>Help others by reviewing your loan.</p>

                                    <Link className='btn btn-primary' to={`/checkout/${shelfCurrentLoan.book.id}`}>
                                        Leave a review
                                    </Link>
                                </div>
                            </div>

                            <hr/>

                            <LoansModal
                                shelfCurrentLoan={shelfCurrentLoan}
                                mobile={true}
                                returnBook={returnBook}
                                renewLoan={renewLoan}
                            />
                        </div>
                    ))}
                </> :
                <>
                    <h3 className='mt-3'>Currently no loans</h3>
                    <Link className='btn btn-primary' to={`search`}>
                        Search for a new book
                    </Link>
                </>
            }
            </div>
        </div>
    );
};