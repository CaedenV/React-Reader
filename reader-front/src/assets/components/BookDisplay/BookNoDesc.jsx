import "./bookNoDesc.css"
import { Link } from "react-router-dom";


const BookNoDesc = ({ cover, title, pubDate, auth, avgRate, genres, id, libraries, userId }) => {
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
                    <Link className="link" to={store} >
                        <span className="bookGenre">{genres}</span>
                    </Link>
                </div>
                <Link className="link" to={single}>
                    <span className="bookTitle">{title} </span>
                </Link>
                <div className="auth">
                    <span className="Pub_Auth"> {auth} | {pubDate}</span>
                </div>
                <div className="iconContainer">
                    <span className="ratingNum">{avgRate}
                        <i className="reviewIcon fa-solid fa-star-half-stroke"></i>
                    </span>
                    {len ? 
                    (<span className="len">{len}<i className="singleLen fa-solid fa-scroll"></i></span>) : (<></>)
                    }
                    {userId ? (<LibWrap bookId={id} libraries={libraries} />) : (<></>)}
                </div>
            </div>
        </div>
    )
}


export default BookNoDesc;