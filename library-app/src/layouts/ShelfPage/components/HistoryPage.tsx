import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axiosInstance from '../../../lib/axiosInstance';
import { useAuth } from '../../../Auth/authContext';

import HistoryModel from '../../../models/HistoryModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

import BookLuv2CodeImg from '../../../Images/BooksImages/book-luv2code-1000.png';

export const HistoryPage = () => {

    const { isAuthenticated, token } = useAuth();

    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    const [histories, setHistories] = useState<HistoryModel[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const getUserEmail = (): string | null => {
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub; // обычно email лежит в sub
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (!isAuthenticated) {
                setIsLoadingHistory(false);
                return;
            }

            const userEmail = getUserEmail();

            if (!userEmail) {
                setIsLoadingHistory(false);
                return;
            }

            try {
                const response = await axiosInstance.get(
                    `/histories/search/findBooksByUserEmail`,
                    {
                        params: {
                            userEmail: userEmail,
                            page: currentPage - 1,
                            size: 5
                        }
                    }
                );

                setHistories(response.data._embedded.histories);
                setTotalPages(response.data.page.totalPages);

            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        fetchUserHistory();

    }, [isAuthenticated, currentPage]);

    if (isLoadingHistory) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-2'>
            {histories.length > 0 ? (
                <Fragment key="history-list">
                    <h5>Recent History:</h5>

                    {histories.map(history => (
                        <div key={history.id}>
                            <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                                <div className='row g-0'>
                                    
                                    <div className='col-md-2'>
                                        <div className='d-none d-lg-block'>
                                            <img
                                                src={history.img && history.img.startsWith('data:') ? history.img : BookLuv2CodeImg}
                                                width='123'
                                                height='196'
                                                alt='Book'
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = BookLuv2CodeImg;
                                                }}
                                            />
                                        </div>

                                        <div className='d-lg-none d-flex justify-content-center align-items-center'>
                                            <img
                                                src={history.img && history.img.startsWith('data:') ? history.img : BookLuv2CodeImg}
                                                width='123'
                                                height='196'
                                                alt='Book'
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = BookLuv2CodeImg;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='card-body'>
                                            <h5 className='card-title'>{history.author}</h5>
                                            <h4>{history.title}</h4>
                                            <p className='card-text'>{history.description}</p>
                                            <hr />
                                            <p>Checked out on: {history.checkoutDate}</p>
                                            <p>Returned on: {history.returnedDate}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </Fragment>
            ) : (
                <>
                    <h3 className='mt-3'>Currently no history:</h3>
                    <Link className='btn btn-primary' to={'/search'}>
                        Search for new book
                    </Link>
                </>
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>
    );
};