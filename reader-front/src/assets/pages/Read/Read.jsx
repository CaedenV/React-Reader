import './read.css';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import { ownBack, userBack } from '../../backendRoutes';
import SmallBook from '../../components/BookDisplay/SmallBook/SmallBook';
import axios from 'axios';

const Read = ({ userId }) => {
  const { bookId } = useParams();

  const [currentRead, setCurrentRead] = useState([]);
  const [ownedBooks, setOwnedBooks] = useState({});
  const [validAccess, setValidAccess] = useState(false);
  const [show, setShowOwned] = useState(false);
  const nav = useNavigate();

  const token = localStorage.getItem('token');

  const [location, setLocation] = useState(null);


  useEffect(() => {
    async function getBooks() {
      await axios.get(`${ownBack}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => { setOwnedBooks(response.data.owned); console.log(ownedBooks); });

      await axios.get(`${ownBack}/nowRead`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
        const epubFile = response.data.nowRead.nowReadFile;
        const blob = new Blob([atob(epubFile)], { type: 'application/epub+zip' });
        const url = URL.createObjectURL(blob);
        setCurrentRead({
          nowReadId: response.data.nowRead.nowReadId,
          nowReadFN: url
        });
      });

    }

    getBooks();
    if (bookId in ownedBooks) {
      setValidAccess(true);
    }
  }, [userId, bookId]);

  const setBookAdds = async () => {
    await axios.patch(`${ownBack}/bookAdds`, {
      headers: { Authorization: `Bearer ${token}` },
      body: {},
    });
  }

  const toggleOwned = () => {
    setShowOwned(!show);
  }

  const startRead = async (bookId) => {
    await axios.patch(`${userBack}/nowRead/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const redirect = `/read/${currentRead.nowReadId}`;
    nav(redirect);
  }
  if (true) {
    return (
      <div className='read'>
        <div className="readerSettings">
          <button className="setting fSize"><i className="fa-solid fa-text-height" /></button>
          <button className="setting color"><i className="fa-solid fa-palette" /></button>
          <button className="setting comment"><i className="fa-solid fa-comment-dots" /></button>

          {ownedBooks && <button className={show ? "active " + 'setting showOwn': 'setting showOwn'} onClick={toggleOwned}><i className="fa-solid fa-book" /></button>}
          <button className="setting save" onClick={setBookAdds}>Save</button>
        </div>
        <div className={show ? "owned " + 'true' : "owned " + "false"}>
          {ownedBooks.length > 0 ? ownedBooks.map((book, i) => (
            <div className="bookOptions">
              <SmallBook bookId={book.bookId} key={book.bookId} />
              <button className="readBook" key={i} onClick={() => startRead(book.bookId)}> Read</button>
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