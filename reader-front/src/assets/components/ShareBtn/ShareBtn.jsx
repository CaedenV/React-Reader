import './share.css';
import Popup from 'reactjs-popup';
import axios from 'axios';
import { notifBack, backend } from '../../backendRoutes';
import { useState } from 'react';


const ShareBtn = ({ friends, book }) => {
  const [axResponse, setAxResponse] = useState("");
  const token = localStorage.getItem('token');
  const shareBook = async (f) => {
    const data = {
      friend: f,
      book: book
    };
    console.log(data);
    const results = await axios.post(`${notifBack}/sendBook`, { data: data }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // if (results.data.success) {
    //   setAxResponse(results.data.message);
    // }
  }
  return (
    <Popup trigger={<button className='share'><i className="fa-regular fa-share-from-square" /></button>} position='bottom center'>
      <div className="list">
      {friends ? friends.map((friend, i) => (
        <div className='sendTo' key={i}>
            <button className='friend' onClick={() => shareBook(friend)}><img src={`${backend}${friend.pic}`} className='miniF' />{friend.userName}</button><label>{axResponse}</label>
        </div>
      )) : <label className='friend'>Add more friends to share books with!</label>}
      </div>
      
    </Popup>
  )
}

export default ShareBtn