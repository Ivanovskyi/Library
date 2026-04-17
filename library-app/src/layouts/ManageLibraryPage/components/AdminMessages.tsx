import { useEffect, useState } from 'react';
import { useAuth } from '../../../Auth/authContext';
import AdminMessageRequest from '../../../models/AdminMessageRequest';
import MessageModel from '../../../models/MessageModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { AdminMessage } from './AdminMessage';
import axiosInstance from '../../../lib/axiosInstance';

export const AdminMessages = () => {
    
    const { isAuthenticated, token } = useAuth();

    // Normal Loading Pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    
    // Messages endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Trigger reload after submit
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (isAuthenticated && token) {
                try {
                    const url = `/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                    const response = await axiosInstance.get(url);
                    setMessages(response.data.content);
                    setTotalPages(response.data.totalPages);
                } catch (error: any) {
                    setHttpError(error.message);
                }
            }
            setIsLoadingMessages(false);
        };
        fetchUserMessages();
        window.scrollTo(0, 0);
    }, [isAuthenticated, token, currentPage, btnSubmit, messagesPerPage]);

    if (isLoadingMessages) return <SpinnerLoading />;

    if (httpError) return (
        <div className='container m-5'>
            <p>{httpError}</p>
        </div>
    );

    async function submitResponseToQuestion(id: number, response: string) {
        if (!isAuthenticated || !token || id === null || response === '') return;

        const url = `/messages/secure/admin/message`;
        const requestModel: AdminMessageRequest = new AdminMessageRequest(id, response);

        try {
            await axiosInstance.put(url, requestModel);
            setBtnSubmit(prev => !prev); // trigger refresh
        } catch (error: any) {
            // console.error('Error submitting response:', error);
            alert('Failed to submit response. Please try again.');
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ? (
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage
                            key={message.id}
                            message={message}
                            submitResponseToQuestion={submitResponseToQuestion}
                        />
                    ))}
                </>
            ) : (
                <h5>No pending Q/A</h5>
            )}
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
};
