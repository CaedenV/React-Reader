import './bookwdesc.css';
import { Link } from "react-router-dom";
import LibWrap from "../LibraryWrapper/LibWrap";
import React from 'react';
import moment from 'moment';

const BookWDesc = ({ cover, title, pubDate, auth, avgRate, genres, desc, id, lib, user }) => {
    const single = `/view/${id}`;

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
                    <Link className="link" to={`/store/subject/${genres}`} >
                        <span className="bookGenre">{genres}</span>
                    </Link>
                </div>
                <Link className="link" to={single}>
                    <span className="bookTitle">{title} </span>
                </Link>
                <span className="Pub_Auth">
                    <Link className="link" to={`/store/inauthor/${auth}`}>{auth}</Link> | {moment(pubDate).format('YYYY-MM-DD')}</span>
                <div className="iconContainer">
                    <span className="ratingNum">{avgRate}
                        <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
                    </span>
                    {user ? (<LibWrap bookId={id} libraries={lib} />) : (<></>)}
                </div>
                <span className="bookDesc">
                    {desc}
                </span>
            </div>
        </div>
    )
}


export default BookWDesc;