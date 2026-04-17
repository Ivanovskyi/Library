import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

interface AdminMessageProps {
    message: MessageModel;
    submitResponseToQuestion: (id: number, response: string) => void;
}

export const AdminMessage: React.FC<AdminMessageProps> = ({ message, submitResponseToQuestion }) => {

    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');

    function submitBtn() {
    if (response.trim() === '') {
        setDisplayWarning(true);
        return;
    }

    if (message.id === undefined) {
        // console.error('Message ID is undefined!');
        return;
    }

    submitResponseToQuestion(message.id, response);
    setDisplayWarning(false);
    setResponse('');
   }

    return (
        <div>
            <div className='card mt-2 shadow p-3 bg-body rounded'>
                <h5>Case #{message.id}: {message.title}</h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr/>
                <div>
                    <h5>Response: </h5>
                    <form>
                        {displayWarning && 
                            <div className='alert alert-danger' role='alert'>
                                All fields must be filled out.
                            </div>
                        }
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Response</label>
                            <textarea className='form-control' rows={3} 
                                value={response} 
                                onChange={e => setResponse(e.target.value)}>
                            </textarea>
                        </div>
                        <button type='button' className='btn btn-primary mt-3' onClick={submitBtn}>
                            Submit Response
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};