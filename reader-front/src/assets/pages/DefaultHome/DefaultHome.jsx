import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './defaultHome.css';
import back from '../../../assets/default_back.jpg';
import axios from 'axios';
import { recBack } from '../../backendRoutes';
import BookNoDesc from '../../components/BookDisplay/NoDesc/BookNoDesc';

const DefaultHome = () => {
  const [recs, setRecs] = useState({});

  useEffect(() => {
    async function getBasics() {
      try {
        const results = await axios.get(`${recBack}/basicRecs`);
        setRecs(results.data.recs);
      } catch (error) {
        console.log('Errors:', error);
      }
    }

    getBasics();
  }, []);


  return (
    <div className='intro'>
      <div className="introText">
        <img src={back} alt="" className='back' />
        <h1 className='introHead'>Welcome to WeReader!</h1>
        <p className='introBody'> Find yourself new books to enjoy, old books you loved, and send recommendations to your friends!</p>
        <button className="start"> <Link to="store" >Browse Now</Link></button>
      </div>


      <div className="basicRecs">
        {recs.popular &&
          <div className="popular group">
            <h2>Popular Books:</h2>
            <div className="books">
              {recs.popular && recs.popular.length > 0 &&
                recs.popular.map((book, i) => (
                  <BookNoDesc
                    key={i}
                    cover={book.cover}
                    title={book.title}
                    pubDate={book.pubDate}
                    auth={book.author}
                    avgRate={book.avgRating}
                    genres={book.genre}
                    id={book.id}
                    rateCount={book.rateCount}
                  />
                ))}
            </div>
          </div>
        }

        {recs.recents &&
          <div className="recent group">
            <h2>Some new releases:</h2>
            <div className="books">
              {recs.recents && recs.recents.length > 0 &&
                recs.recents.map((book, i) => (
                  <BookNoDesc
                    key={i}
                    cover={book.cover}
                    title={book.title}
                    pubDate={book.pubDate}
                    auth={book.author}
                    avgRate={book.avgRating}
                    genres={book.genre}
                    id={book.id}
                    rateCount={book.rateCount}
                  />
                ))}
            </div>
          </div>
        }
      </div>

    </div>
  )
}

export default DefaultHome