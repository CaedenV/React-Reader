import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { bookBack } from '../../../backendRoutes';

const SmallBook = ({ bookId }) => {
    const [book, setBook] = useState({});
    const single = `/view/${bookId}`;

    useEffect(async () => {
        await axios.get(`${bookBack}/getById/${bookId}`).then((response) => {
            setBook(response.data.book);
        })
    }, [bookId])

    return (
        <Link className="link" to={single}>
            <img className="bookCover"
                src={book.cover}
                alt={book.title}
            />
        </Link>
    )
}

export default SmallBook