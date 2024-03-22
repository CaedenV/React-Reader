import './store.css';
import BookWDesc from '../../components/BookDisplay/BookwDesc';
import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookBack } from '../../backendRoutes';

const Store = ({ userId }) => {
  const { sCat, sQuery } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (sQuery != "") {
      const apiKey = "check env";
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=+${sCat}:${sQuery}&download=epub&filter=ebooks&langRestring=en&printType=books&key=${apiKey}&maxResults=40`;

      axios.get(searchUrl).then((response) => {
        const formattedResults = response.data.items.map((item) => {
          const volumeInfo = item.volumeInfo;
          return {
            cover: volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail,
            title: volumeInfo.title,
            publishDate: volumeInfo.publishedDate,
            author: volumeInfo.authors && volumeInfo.authors[0],
            avgRating: volumeInfo.averageRating || 0,
            genre: volumeInfo.categories && volumeInfo.categories[0],
            desc: volumeInfo.description || "",
            id: item.id,
          };
        });
        setResults(formattedResults);
      });
    }
  }, [sCat, sQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirect = `/store/${sCat}/${sQuery}`;
  }


  return (
    <div className="store">
      <label className="pageLabel">Store</label>
      <div className='SearchArea'>
        <form className="searchBar" onSubmit={handleSubmit}>
          <select className='type' id='type' value={sCat} >
            <option value="intitle">Book Title</option>
            <option value="inauthor">Author</option>
            <option value="subject">Genre</option>
          </select>
          <input type="text" placeholder={sQuery} className="text" />
            <button className="searchIcon" type='submit'><i className="sIcon fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>
      <div className="results">
        {sQuery ? <label>Here's what we found for {sQuery} in {sCat}</label> : <label>Fill out the search parameters!</label>}
        {results ? (
          <ul className="found">
            <li>{results.map((book, i) => (
              <BookWDesc
                key={i}
                cover={book.BookCoverLink}
                title={book.BookTitle}
                pubDate={book.BookPubDate}
                auth={book.BookAuthor}
                avgRate={book.BookAvgRating}
                genres={book.BookGenre}
                desc={book.BookDesc}
                id={book.GoogleBookId}
                user={userId}
                lib={library}
              />))}</li>
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Store;