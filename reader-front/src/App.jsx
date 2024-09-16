import React, { useEffect, useState } from 'react'
import NavBar from './assets/components/NavBar/NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DefaultHome from './assets/pages/DefaultHome/DefaultHome';
import Libraries from './assets/pages/Libraries/Libraries';
import Profile from './assets/pages/Profile/Profile';
import Read from './assets/pages/Read/Read';
import Single from './assets/pages/Single/Single';
import Store from './assets/pages/Store/Store';
import UserDash from './assets/pages/UserDash/UserDash';
import useUser from './assets/hooks/useUser';
import OtherProfile from './assets/pages/Profile/OtherProfile';
import Clubs from './assets/pages/Clubs/Clubs';

function App() {
  const [userId, setUserId] = useState(useUser());
  const user = useUser();

  useEffect(() => {
    setUserId(user);
  }, [user]);

  return (
    <Router>
      <NavBar userId={userId} updateUserId={setUserId} />
      <div className="appRoutes container">
        <Routes>
          <Route exact path="/" element={userId !== null ? <UserDash  userId={userId} /> : <DefaultHome />} />
          <Route path="/store/:sCat/:sQuery/:sStart" element={<Store userId={userId} />} />
          <Route path="/store" element={<Store userId={userId} />} />
          <Route path="/:userId/profile" element={userId !== null ? <Profile userId={userId} /> : <DefaultHome />} />
          <Route path="/profile/:userName" element={userId !== null ? <OtherProfile userId={userId} /> : <DefaultHome />} />
          <Route path="/view/:bookId" element={<Single userId={userId} />} />
          <Route path="/:userId/library" element={userId !== null ? <Libraries userId={userId} /> : <DefaultHome />} />
          <Route path="/read/:bookId" element={userId !== null ? <Read userId={userId}/> : <DefaultHome />} />
          <Route path='/clubs' element={userId !== null ? <Clubs /> : <DefaultHome />}/>
        </Routes>
      </div>

    </Router>
  )
}

export default App