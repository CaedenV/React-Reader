import './booknodesc.css';
import { Link } from "react-router-dom";
import React from "react";
import LibWrap from "../../LibraryWrapper/LibWrap";
import moment from "moment";

const BookNoDesc = ({ cover, title, pubDate, auth, avgRate, rateCount, genres, id, lib, user }) => {
    const single = `/view/${id}`;
    const genreStore = `/store/subject/${genres}/1`;
    const authStore = `/store/inauthor/${auth}/1`;

    return (
        <div className="libNbooks">
            <Link className="link" to={single}>
                <img className="bnCover"
                    src={cover}
                    alt="Book Cover"
                />
            </Link>

            <div className="bnInfo">
                <Link className="link" to={genreStore} >
                    <span className="bnGenre">{genres}</span>
                </Link>

                <Link className="link" to={single}>
                    <span className="bnTitle">{title} </span>
                </Link>
                <span className="bnAuth"><Link className="link" to={authStore}>{auth}</Link></span>
                <span className='bnPub'>{moment(pubDate).format('YYYY-MM-DD')}</span>

                {avgRate > 0 && <span className="ratingNum">{avgRate}/5 : {rateCount} review(s)
                    <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
                </span>}
                {user ? (<LibWrap bookId={id} libraries={lib} />) : (<></>)}
            </div>
        </div>
    )
}


export default BookNoDesc;