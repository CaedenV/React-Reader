import React from 'react'
import {Link} from 'react-router-dom';
import './defaultHome.css';
import back from '../../../assets/default_back.jpg';

const DefaultHome = () => {
  return (
    <div className='intro'>
      <img src={back} alt="" className='back'/>
      <h1 className='introHead'>Welcome to WeReader!</h1>
      <p className='introBody'> Find yourself new books to enjoy, old books you loved, and send recommendations to your friends!</p>
      <button className="start"> <Link to="store" >Browse Now</Link></button>

    </div>
  )
}

export default DefaultHome