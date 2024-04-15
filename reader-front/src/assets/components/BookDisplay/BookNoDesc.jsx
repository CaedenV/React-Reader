import "./booknodesc.css"
import { Link } from "react-router-dom";
import React from "react";
import LibWrap from "../LibraryWrapper/LibWrap";
import moment from "moment";

const BookNoDesc = ({ cover, title, pubDate, auth, avgRate, rateCount, genres, id, lib, user }) => {
    const single = `/view/${id}`;
    const genreStore = `/store/subject/${genres}/1`;
    const authStore = `/store/inauthor/${auth}/1`;

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
                    <Link className="link" to={genreStore} >
                        <span className="bookGenre">{genres}</span>
                    </Link>
                </div>
                <Link className="link" to={single}>
                    <span className="bookTitle">{title} </span>
                </Link>
                <div className="auth">
                    <span className="Pub_Auth"> <Link className="link" to={authStore}>{auth}</Link> | {moment(pubDate).format('YYYY-MM-DD')}</span>
                </div>
                <div className="iconContainer">
                    <span className="ratingNum">{avgRate > 0 && `${avgRate}/5 :`} {rateCount} review(s)
                        <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
                    </span>
                    {user ? (<LibWrap bookId={id} libraries={lib} />) : (<></>)}
                </div>
            </div>
        </div>
    )
}


export default BookNoDesc;