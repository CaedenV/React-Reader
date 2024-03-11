import Link from "next/link";
import "./TopBar.css";
//import axios from "axios";


const TopBar = ({ userId, updateUserId }) => {

    return (
        <div className='top'>
            <div className="topLeft">
                WeReader
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem"><Link href="/reccs"><a>HOME</a></Link></li>
                    <li className="topListItem"><Link href="/store"><a>STORE</a></Link></li>
                    <li className="topListItem"><Link href="/read"><a>READ</a></Link></li>
                    <li className="topListItem"><Link href="/lib"><a>LIBRARY</a></Link></li>
                </ul>
            </div>
        </div>
    )
}

export default TopBar;