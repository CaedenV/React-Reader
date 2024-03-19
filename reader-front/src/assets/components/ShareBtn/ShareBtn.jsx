import './share.css';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { notifBack } from '../../backendRoutes';
import { useState } from 'react';
import useUser from '../../hooks/useUser';

const ShareBtn = ({friends, bookId}) => {
  const [axResponse, setAxResponse] = useState("");
    const shareBook = async () => {
        const data = {
            sender: useUser(),
            receiver: friends,
            book: bookId
        }
        const response = await axios.get(`${notifBack}/`, data);
        if(response.data.success) {
            setAxResponse(response.data.message);
        }
  }
    return (
    <Popup trigger={<button className='share'><i class="fa-regular fa-share-from-square"></i></button>} position='bottom center'>
        {friends ? <ul>
            <li><button className='friend' onClick={shareBook}>Friend</button><label>{axResponse}</label></li>
        </ul>: <label className='friend'>Add more friends to share books with!</label>}
    </Popup>
  )
}

export default ShareBtn