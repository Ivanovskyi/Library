import axiosInstance from '../../lib/axiosInstance';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { useAuth } from '../../Auth/authContext';

export const PaymentPage = () => {
    
    const { isAuthenticated } = useAuth();

    const [httpError, setHttpError] = useState<string | null>(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    // No need for manual email decode - backend uses auth principal

    useEffect(() => {
        const fetchFees = async () => {
            if (isAuthenticated) {
                try {
                    const response = await axiosInstance.get('/payment/secure/current');

                    setFees(response.data);
                } catch (error: any) {
                    setFees(0);
                    // console.error('Failed to fetch fees:', error);
                    setHttpError('Failed to fetch payment fees. Please try again.');
                }
            }

            setLoadingFees(false);
        };

        fetchFees();

    }, [isAuthenticated]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        const paymentInfo = new PaymentInfoRequest(
            Math.round(fees * 100),
            'USD',
            'user@example.com' // backend doesn't use, but required for Stripe
        );

        // ✅ Create payment intent
        const response = await axiosInstance.post('/payment/secure/payment-intent', paymentInfo);

        if (response.status !== 200) {
            setHttpError('Payment failed');
            setSubmitDisabled(false);
            return;
        }

        const data = response.data;

        // ✅ Confirm payment with Stripe
        const result = await stripe.confirmCardPayment(
            data.client_secret,
            {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: 'user@example.com'
                    }
                }
            },
            { handleActions: false }
        );

        if (result.error) {
            setSubmitDisabled(false);
            alert('Payment error');
            return;
        }

        // ✅ Complete payment in backend
        const completeResponse = await axiosInstance.put('/payment/secure/payment-complete');

        if (completeResponse.status !== 200) {
            setHttpError('Payment completion failed');
            setSubmitDisabled(false);
            return;
        }

        setFees(0);
        setSubmitDisabled(false);
        setHttpError(null);
    }

    if (loadingFees) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className='container'>
          
            {fees > 0 && (
                <div className='card mt-3'>
                    <h5 className='card-header'>
                        Fees pending: <span className='text-danger'>${fees}</span>
                    </h5>

                    <div className='card-body'>
                        <h5 className='card-title mb-3'>Credit Card</h5>

                        <CardElement />

                        <button
                            disabled={submitDisabled}
                            className='btn btn-md main-color text-white mt-3'
                            onClick={checkout}
                        >
                            Pay fees
                        </button>
                    </div>
                </div>
            )}

            {fees === 0 && (
                <div className='mt-3'>
                    <h5>You have no fees!</h5>
                    <Link className='btn main-color text-white' to='search'>
                        Explore top books
                    </Link>
                </div>
            )}

            {submitDisabled && <SpinnerLoading />}
        </div>
    );
};