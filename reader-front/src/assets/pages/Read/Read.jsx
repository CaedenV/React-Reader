import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactReader } from 'react-reader';
import { ownBack, userBack } from '../../backendRoutes';
import Popup from 'reactjs-popup';
import SmallBook from '../../components/BookDisplay/SmallBook/SmallBook';
import axios from 'axios';

const Read = ({ userId }) => {
  const { bookId } = useParams();
  const [fSize, setFSize] = useState(20);
  const [theme, setTheme] = useState('light');
  const [lineHeight, setLineHeight] = useState(1.5);

  const [comments, getComments] = useState({});
  const [currentRead, setCurrentRead] = useState('');
  const [ownedBooks, setOwnedBooks] = useState({});
  const nav = useNavigate();

  const token = localStorage.getItem('token');

  const [location, setLocation] = useState(null);
  const locationChanged = (epubcifi) => {
    setLocation(epubcifi);
  }
  const handleFontSizeChange = (newFontSize) => {
    setFSize(newFontSize);
  };
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };
  const handleLineHeightChange = (newLineHeight) => {
    setLineHeight(newLineHeight);
  }

  useEffect(() => {
    async function getBooks() {
      await axios.get(`${ownBack}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => { setOwnedBooks(response.data.owned); });

      await axios.get(`${ownBack}/nowRead`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then((response) => { setCurrentRead(response.data.nowRead) });
    }

    getBooks();
  }, [userId, bookId]);

  const startRead = async (bookId) => {
    await axios.patch(`${userBack}/nowRead/${bookId}`, {
      headers: { Authorization: `Bearere ${token}` }
    });

    const redirect = `/read/${currentRead}`;
    nav(redirect);
  }

  const getRendition = (rendition) => {
    const colors = {
      light: {
        background: '#FFE4C4',
        text: '#000000',
      },
      dark: {
        background: '#212427',
        text: '#EFEFEF',
      },
    };
    const themeColors = colors[theme];
    rendition.themes.register('custom', {
      body: {
        background: themeColors.background,
        color: themeColors.text,
      },
    });
    rendition.themes.select('custom');
    rendition.hooks.content.register((content) => {
      content.default({
        style: {
          fontSize: `${fSize}px`,
          color: themeColors.text,
          lineHeight: `${lineHeight}em`,
        },
      });
    });
  };

  return (
    <div className='read'>
      <div className="settings">
        <Popup trigger={<button className='options'><i className="fa-solid fa-sliders" /></button>}>

        </Popup>
        {ownedBooks && <Popup trigger={<button className='showOwn'><i className="fa-solid fa-book" /></button>} >
          {/* <div className="owned">
            {ownedBooks.map((bookId) => {
              return (
                <button className="readBook" onClick={() => startRead(bookId)}>
                  <SmallBook bookId={bookId} />
                </button>
              )
            })}
          </div> */}
        </Popup>}

        <button className="fSize"><i className="fa-regular fa-text-size" /></button>
        <button className="color"><i className="fa-solid fa-palette" /></button>
        <button className="lineHeight"><i className="fa-solid fa-arrow-down-up-across-line" /></button>
        <button className="comment"><i className="fa-solid fa-comment-dots" /></button>
      </div>
      <div className="eReader">
        <ReactReader
          location={location}
          locationChanged={locationChanged}
          url={currentRead}
          epubOptions={{
            allowPopups: true,
            allowScriptedContent: true
          }}
          getRendition={getRendition}
          onFontSizeChange={handleFontSizeChange}
          onThemeChange={handleThemeChange}
          onLineHightChange={handleLineHeightChange}
          theme={theme}

        />
      </div>
    </div>
  )
}

export default Read