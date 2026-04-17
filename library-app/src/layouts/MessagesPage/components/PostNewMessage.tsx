import { useState } from 'react';
import { useAuth } from '../../../Auth/authContext';
import MessageModel from '../../../models/MessageModel';

export const PostNewMessage = () => {
    
    const { isAuthenticated, token } = useAuth(); // use your custom auth context
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        const url = `${import.meta.env.VITE_API_URL}/messages/secure/add/message`;

        // Check that user is authenticated and fields are not empty
        if (isAuthenticated && title.trim() !== '' && question.trim() !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);

            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // use token from custom auth
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };

            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) throw new Error('Something went wrong!');

                setTitle('');
                setQuestion('');
                setDisplayWarning(false);
                setDisplaySuccess(true);
            } catch (error) {
                // console.error(error);
                setDisplaySuccess(false);
                setDisplayWarning(true);
            }

        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }
    
    return (
        <div className='card mt-3'>
            <div className='card-header'>
                Ask question to Luv 2 Read Admin
            </div>
            <div className='card-body'>
                <form>
                    {displayWarning && 
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out
                        </div>
                    }
                    {displaySuccess && 
                        <div className='alert alert-success' role='alert'>
                            Question added successfully
                        </div>
                    }
                    <div className='mb-3'>
                        <label className='form-label'>Title</label>
                        <input 
                            type='text' 
                            className='form-control'
                            placeholder='Title'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>Question</label>
                        <textarea 
                            className='form-control'
                            rows={3}
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                    </div>

                    <button 
                        type='button' 
                        className='btn btn-primary mt-3' 
                        onClick={submitNewQuestion}
                    >
                        Submit Question
                    </button>
                </form>
            </div>
        </div>
    );
};