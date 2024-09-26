import './store.css';
import BookWDesc from '../../components/BookDisplay/Desc/BookwDesc';
import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookBack, userBack } from '../../backendRoutes';
import axios from 'axios';
import apiClient from '../../axiosTokenIntercept';
import moment from 'moment';

const Store = ({ userId }) => {
  const { sCat, sQuery, sStart } = useParams();
  const [selectedCat, setSCat] = useState(sCat || 'intitle');
  const [results, setResults] = useState([]);
  const [totalRes, setTotalRes] = useState();
  const [isRes, setIsRes] = useState(false);
  const nav = useNavigate();
  const currentPage = sStart || 1;
  const [resultsPerPage] = useState(15);

  const [userLib, setUserLib] = useState({});
  const [query, setQuery] = useState(sQuery);

  const addToDB = async (books) => {
    for (const book of books) {
      await axios.post(`${bookBack}/add`, book);
    }
  }

  useEffect(() => {
    async function getLib() {
      await apiClient.get(`${userBack}/libraries`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
        .then((response) => { setUserLib(response.data.library); });
    }
    if (userId) {
      getLib();
    }

    window.scrollTo({
      top: 0,
    });
  }, [userId]);

  useEffect(() => {
    if (sQuery) {
      const modQ = sQuery.replace(' ', '+');
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=+${selectedCat}:${modQ}&langRestrict=en&printType=books&maxResults=${resultsPerPage}&startIndex=${(currentPage - 1) * resultsPerPage}&orderBy=relevance`;
      // TODO: adjust size based on filtered results to have 10 on every page
      async function getRes() {
        await axios.get(searchUrl).then((response) => {
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
              id: volumeInfo.industryIdentifiers && volumeInfo.industryIdentifiers[0].identifier.replace(/[^0-9]/g, ''),
            };
          });
          //console.log(formattedResults);
          const filteredResults = formattedResults.filter((item) => {
            return item.cover && item.title && item.pubDate && item.author && item.genre && item.desc && item.id;
          });

          if (filteredResults.length > 0) {
            setIsRes(true);
            addToDB(filteredResults);
          }
          setResults(filteredResults);
        });
      }

      getRes();
      axios.get(searchUrl).then((response) => {
        if (response.data.totalItems < 300) {
          setTotalRes(response.data.totalItems);
        }
        else {
          setTotalRes(300);
        }
      });
      //console.log(searchUrl);
    }
  }, [selectedCat, sQuery, sStart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('query');
    const redirect = `/store/${selectedCat}/${query}/1` ||
      `/store/${selectedCat}/${sQuery}/1` ||
      `/store/${sCat}/${query}/1` ||
      `/store/${sCat}/${sQuery}/1`;
    nav(redirect);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalRes / resultsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (event, pageNumber) => {
    event.preventDefault();
    const redirect = `/store/${selectedCat}/${sQuery}/${pageNumber}`;
    nav(redirect);
    window.scrollTo({
      top: 0,
    });
  };

  const handleClearInput = () => {
    setQuery('');
  }


  return (
    <div className="store">
      <h1 className="pageLabel">Store</h1>
      <form className="searchBar" onSubmit={handleSubmit}>
        <div className="searchWrapper">
          <select className='type' id='type' value={selectedCat} onChange={(e) => setSCat(e.target.value)} >
            <option value="intitle">Book Title</option>
            <option value="inauthor">Author</option>
            <option value="subject">Genre</option>
          </select>
          <div className="searchBox">
            <input type="text" placeholder={sQuery || 'Search WeReader'} className="text" name='query'value={query} onChange={(e) => setQuery(e.value)}/>
            <button type='button' className="clearInput" onClick={() => handleClearInput()}><i className="fa-solid fa-delete-left" /></button>
          </div>
          <button className="searchIcon" type='submit'><i className="sIcon fa-solid fa-magnifying-glass" /></button>
        </div>
      </form>
      {sQuery && isRes && (
        <div className="results">
          <label> Here's what we found for '{sQuery}' in
            {selectedCat === 'intitle' && " Titles"}
            {selectedCat === 'inauthor' && " Authors"}
            {selectedCat === 'subject' && " Genres"}:
          </label>
          <ul className="found">
            {results.map((book, i) => {
              return (
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
              );
            })}
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

      <div className="pagination">
        {pageNumbers.map((number) => {
          return (
            <button className={`page-link ${currentPage == number ? 'curPage' : ''}`} key={number} onClick={(e) => handlePageClick(e, number)}>{number}</button>
          );
        })}
      </div>

    </div>
  )
}

export default Store;