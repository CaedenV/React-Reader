import './store.css';
import BookWDesc from '../../components/BookDisplay/BookwDesc';
import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookBack, userBack } from '../../backendRoutes';
import axios from 'axios';
import moment from 'moment';

const Store = ({ userId }) => {
  const p = useParams();
  const { sCat, sQuery } = useParams();
  const [selectedCat, setSCat] = useState(sCat || 'intitle');
  const [results, setResults] = useState([]);
  const [isRes, setIsRes] = useState(false);
  const nav = useNavigate();

  const token = localStorage.getItem('token');
  const [userLib, setUserLib] = useState({});

  const addToDB = async (books) => {
    for (const book of books) {
      await axios.post(`${bookBack}/add`, book);
    }
  }

  useEffect(() => {
    async function getLib() {
      await axios.get(`${userBack}/libraries`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => { setUserLib(response.data.library); });
    }

    if (userId) {
      getLib();
    }
    //console.log(p);
  }, [userId]);

  useEffect(() => {
    if (sQuery) {
      const apiKey = "check env";
      const modQ = sQuery.replace(' ', '+');
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=+${selectedCat}:${modQ}&langRestring=en&printType=books&key=${apiKey}&maxResults=40`;

      axios.get(searchUrl).then((response) => {
        const formattedResults = response.data.items.map((item) => {
          const volumeInfo = item.volumeInfo;
          return {
            cover: volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail,
            title: volumeInfo.title,
            pubDate: moment(volumeInfo.publishedDate).format('YYYY-MM-DD'),
            author: volumeInfo.authors && volumeInfo.authors[0],
            avgRating: volumeInfo.averageRating || 0,
            rateCount: volumeInfo.ratingsCount || 0,
            genre: volumeInfo.categories && volumeInfo.categories[0],
            desc: volumeInfo.description,
            id: volumeInfo.industryIdentifiers && volumeInfo.industryIdentifiers[0].identifier,
          };
        });
        const filteredResults = formattedResults.filter((item) => {
          return item.cover && item.title && item.pubDate && item.author && item.avgRating && item.genre && item.desc;
        });

        if (filteredResults.length > 0) {
          setIsRes(true);
          addToDB(filteredResults);
        }
        setResults(filteredResults);
      });
    }


  }, [selectedCat, sQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('query');
    const redirect = `/store/${selectedCat}/${query}` || `/store/${selectedCat}/${sQuery}` || `/store/${sCat}/${query}` || `/store/${sCat}/${sQuery}`;
    nav(redirect);
  }


  return (
    <div className="store">
      <label className="pageLabel">Store</label>
      <div className='SearchArea'>
        <form className="searchBar" onSubmit={handleSubmit}>
          <select className='type' id='type' value={selectedCat} onChange={(e) => setSCat(e.target.value)} >
            <option value="intitle">Book Title</option>
            <option value="inauthor">Author</option>
            <option value="subject">Genre</option>
          </select>
          <input type="text" placeholder={sQuery} className="text" name='query' />
          <button className="searchIcon" type='submit'><i className="sIcon fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>
      {sQuery && isRes && (
        <div className="results">
          <label> Here's what we found for {sQuery} in
            {selectedCat === 'intitle' && " 'Titles'"}
            {selectedCat === 'inauthor' && " 'Authors'"}
            {selectedCat === 'subject' && " 'Genres'"}:
          </label>
          <ul className="found">
            {results.map((book, i) => (
              <BookWDesc
                key={i}
                cover={book.cover}
                title={book.title}
                pubDate={book.pubDate}
                auth={book.author}
                avgRate={book.avgRating}
                rateCount={book.rateCount}
                genres={book.genre}
                desc={book.desc}
                id={book.id}
                user={userId}
                lib={userLib}
              />
            ))}
          </ul>
        </div>
      )}

      {sQuery && !isRes && (
        <div className="results">
          <label>No results found for {sQuery} in
            {selectedCat === 'intitle' && " 'Titles'"}
            {selectedCat === 'inauthor' && " 'Authors'"}
            {selectedCat === 'subject' && " 'Genres'"}.</label>
        </div>
      )}

      {!sQuery && (
        <div className="results">
          <label>Please enter a search query.</label>
        </div>
      )}

    </div>
  )
}

export default Store;