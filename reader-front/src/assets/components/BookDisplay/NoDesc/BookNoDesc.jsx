import './booknodesc.css';
import { Link } from "react-router-dom";
import React from "react";
import LibWrap from "../../LibraryWrapper/LibWrap";

const BookNoDesc = ({ cover, title, auth, avgRate, rateCount, genres, id, lib, user }) => {
    const single = `/view/${id}`;
    const genreStore = `/store/subject/${genres}/1`;
    const authStore = `/store/inauthor/${auth}/1`;

    return (
        <article className="libNbooks">
            <Link className="link" to={single}>
                <img className="bCover"
                    src={cover}
                    alt="Book Cover"
                />
            </Link>
            <p className="bGenre"><Link className="link" to={genreStore}>{genres}</Link></p>
            <p className="bTitle"><Link className="link" to={single}>{title}</Link></p>
            <p className="bAuth"><Link className="link" to={authStore}>{auth}</Link></p>
            {avgRate > 0 && <div className="bInfo">
                <p>
                    {avgRate} / 5 <i className="reviewIcon fa-solid fa-star-half-stroke" /> {rateCount} review(s)
                </p>
            </div>}
            {user ? (<LibWrap bookId={id} libraries={lib} />) : (<></>)}
        </article>
    )
}


export default BookNoDesc;