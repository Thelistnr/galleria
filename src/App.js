import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import { createContext, useState } from 'react';

export const logInContext = createContext();

function App() {
  const[loggedIn, setLoggedIn] = useState(localStorage.getItem('accessToken') === null ? false : true);

  return (
    <logInContext.Provider value={[loggedIn, setLoggedIn]}>
      <div className="App">
        <Router>
          {/* <Navbar/> */}
          <div className="content">
            <Routes>
              <Route path='/' element={<Home/>}></Route>
            </Routes>
          </div>
        </Router>
      </div>
    </logInContext.Provider>
  );
}

export default App;
