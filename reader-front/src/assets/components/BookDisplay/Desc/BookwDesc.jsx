import './bookwdesc.css';
import { Link } from "react-router-dom";
import LibWrap from "../../LibraryWrapper/LibWrap";
import React from 'react';
import moment from 'moment';

const BookWDesc = ({ cover, title, pubDate, auth, avgRate, rateCount, genres, desc, id, lib, user }) => {
    const single = `/view/${id}`;
    const genreStore = `/store/subject/${genres}/1`;
    const authStore = `/store/inauthor/${auth}/1`;

    return (
        <div className="libBooks">
            <aside className='coverColumn'>
                <Link className="link" to={single}>
                    <img className="bCover"
                        src={cover}
                        alt="Book Cover"
                    />
                </Link>
            </aside>

            <div className="infoColumn">
                <div className="bHeader">
                    <div className="bDescInfo">
                        <p className="bGenre"><Link className="link" to={genreStore}>{genres}</Link></p>
                        <p className="bTitle"><Link className="link" to={single}>{title}</Link></p>
                        <p className="bAuth">
                            {auth} |{" "}
                            <span className='pubDate' >{moment(pubDate).format('YYYY-MM-DD')}</span>
                        </p>
                        {rateCount > 0 && <p className="bRate">
                            {avgRate} / 5 <i className="reviewIcon fa-solid fa-star-half-stroke" /> {rateCount} review(s)
                        </p>}
                    </div>
                    <div className="libraryPart">
                    {user ? (<LibWrap bookId={id} libraries={lib} />) : (<></>)}
                    </div>
                </div>
                <span className="bookDesc">
                    {desc}
                </span>
            </div>
        </div>
    )
}


export default BookWDesc;