import './read.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import { ownBack, userBack } from '../../backendRoutes';
import SmallBook from '../../components/BookDisplay/SmallBook/SmallBook';
import apiClient from '../../axiosTokenIntercept';

const Read = ({ userId }) => {
  const { bookId } = useParams();

  const [currentRead, setCurrentRead] = useState([]);
  const [ownedBooks, setOwnedBooks] = useState([]);
  const [validAccess, setValidAccess] = useState(false);
  const [showOwned, setShowOwned] = useState(false);
  const [bookAdds, setBookAdds] = useState({});
  const nav = useNavigate();

  const token = localStorage.getItem('accessToken');

  const [location, setLocation] = useState(null);


  useEffect(() => {
    async function getBooks() {
      const fetchOwn = await apiClient.get(`${ownBack}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOwnedBooks(fetchOwn.data.owned);

      const response = await apiClient.get(`${ownBack}/nowRead`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if(response.data.success) {
        setValidAccess(response.data.nowReadId === bookId);
      }
      setCurrentRead({
        nowReadId: response.data.nowReadId,
        url: response.data.nowReadUrl
      });
    }

    getBooks();
    console.log(currentRead);
  }, [userId, bookId]);

  const handleSave = async () => {
    await apiClient.patch(`${ownBack}/bookAdds`, {bookAdds: bookAdds}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const toggleOwned = () => {
    setShowOwned(!showOwned);
  }

  const startRead = async (bookId) => {
    await apiClient.patch(`${userBack}/nowRead/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const redirect = `/read/${currentRead.nowReadId}`;
    nav(redirect);
  }
  if (validAccess) {
    return (
      <div className='read'>
        <div className="readerSettings">
          <button className="setting fSize"><i className="fa-solid fa-text-height" /></button>
          <button className="setting color"><i className="fa-solid fa-palette" /></button>
          <button className="setting comment"><i className="fa-solid fa-comment-dots" /></button>
          {ownedBooks && <button className={showOwned ? "active " + 'setting showOwn' : 'setting showOwn'} onClick={toggleOwned}><i className="fa-solid fa-book" /></button>}
          <div className={showOwned ? "owned " + 'true' : "owned " + "false"}>
            {ownedBooks.length > 0 ? ownedBooks.map((book, i) => (
              <div className="bookOptions" key={i}>
                <SmallBook bookId={book.bookId} key={book.bookId} />
                <button className="readBook" onClick={() => startRead(book.bookId)}> Read</button>
              </div>
            )) : <></>}
          </div>
          <button className="setting save" onClick={handleSave}>Save</button>
        </div>
        <div className="eReader" style={{ height: '87vh', border: '1px solid mediumpurple', }}>
          <ReactReader
            url={currentRead.url}
            location={location}
            locationChanged={(epubcfi) => setLocation(epubcfi)}
            
          />
        </div>
      </div>
    )
  }

}

export default Read