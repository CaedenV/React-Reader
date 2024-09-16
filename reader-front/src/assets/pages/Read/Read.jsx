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
  const [show, setShowOwned] = useState(false);
  const nav = useNavigate();

  const token = localStorage.getItem('accessToken');

  const [location, setLocation] = useState(null);


  useEffect(() => {
    async function getBooks() {
      await apiClient.get(`${ownBack}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => { setOwnedBooks(response.data.owned); });

      const response = await apiClient.get(`${ownBack}/nowRead`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const epubFile = response.data.nowRead.nowReadFile;
      const blob = new Blob([atob(epubFile)], { type: 'application/epub+zip' });
      const url = URL.createObjectURL(blob);
      setCurrentRead({
        nowReadId: response.data.nowRead.nowReadId,
        nowReadFN: url
      });
    }

    getBooks();
    setValidAccess(currentRead.nowReadId === bookId);
    console.log(currentRead.nowReadId, bookId);
  }, [userId, bookId]);

  const setBookAdds = async () => {
    await apiClient.patch(`${ownBack}/bookAdds`, {
      headers: { Authorization: `Bearer ${token}` },
      body: {},
    });
  }

  const toggleOwned = () => {
    setShowOwned(!show);
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

          {ownedBooks && <button className={show ? "active " + 'setting showOwn' : 'setting showOwn'} onClick={toggleOwned}><i className="fa-solid fa-book" /></button>}
          <button className="setting save" onClick={setBookAdds}>Save</button>
        </div>
        <div className={show ? "owned " + 'true' : "owned " + "false"}>
          {ownedBooks.length > 0 ? ownedBooks.map((book, i) => (
            <div className="bookOptions" key={i}>
              <SmallBook bookId={book.bookId} key={book.bookId} />
              <button className="readBook"  onClick={() => startRead(book.bookId)}> Read</button>
            </div>
          )) : <></>}
        </div>
        <div className="eReader">
          <ReactReader
            url="https://react-reader.metabits.no/files/alice.epub"
            location={location}
            locationChanged={(epubcfi) => setLocation(epubcfi)}
          />
        </div>
      </div>
    )
  }

}

export default Read