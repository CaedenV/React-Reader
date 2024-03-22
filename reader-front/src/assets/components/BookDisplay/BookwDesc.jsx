import './bookwdesc.css';
import { Link } from "react-router-dom";
import LibWrap from "../LibraryWrapper/LibWrap";
import React from 'react';

const BookWDesc = ({ cover, title, pubDate, auth, avgRate, genres, desc, id, libraries, userId }) => {
    const single = `/view/${id}`;
    const store = `/store`;

    return (
        <div className="libBooks">
            <Link className="link" to={single}>
                <img className="bookCover"
                    src={cover}
                    alt="Book Cover"
                />
            </Link>

            <div className="bookInfo">
                <div className="bookGenre">
                    <Link className="link" to={`${store}/genre/${genres}`} >
                        <span className="bookGenre">{genres}</span>
                    </Link>
                </div>
                <Link className="link" to={single}>
                    <span className="bookTitle">{title} </span>
                </Link>
                <span className="Pub_Auth">
                    <Link className="link" to={`${store}/author/${auth}`}>{auth}</Link> | {pubDate}</span>
                <div className="iconContainer">
                    <span className="ratingNum">{avgRate}
                        <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
                    </span>
                    {len ?
                        (<span className="len">{len}<i className="singleLen fa-solid fa-scroll"></i></span>) : (<></>)
                    }
                    {userId ? (<LibWrap bookId={id} libraries={libraries} />) : (<></>)}
                </div>
                <span className="bookDesc">
                    {desc}
                </span>
            </div>
        </div>
    )
}


export default BookWDesc;