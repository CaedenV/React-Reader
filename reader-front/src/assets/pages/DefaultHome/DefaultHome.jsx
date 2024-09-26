import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './defaultHome.css';
//import back from '../../../assets/default_back.jpg';
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
    <div className='default'>
      <section className='intro'>
      <h1 className='introHead'> We provide a space to explore stories together.
          Join a vibrant community of readers, share recommendations, and turn pages with friends—all in one place.
        </h1>
      </section>


      <div className="basicRecs">
        {recs.popular &&
          <div className="popular group">
            <h2>Trending with members</h2>
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
            <h2>Newly published</h2>
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
      <div className="introBottom">
        <h1 className='introBody'>Read, Share, Connect</h1>
        <button className="start"> <Link to="store" >Start Now</Link></button>
      </div>
    </div>
  )
}

export default DefaultHome