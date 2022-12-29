//import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from "./components/common/Login";
import Logout from "./components/common/Logout";
import Signup from "./components/common/Signup";
import Error from "./components/common/Error";
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/List';
import ProductDescription from './components/products/Description';
//import { getUser, getToken } from './utils/Common';
import Cart from './components/products/Cart';
import Checkout from './components/products/Checkout';
function App() {

  // let navigate = useNavigate();
  // alert('sss');
  // const user_token = getToken();
  // console.log(user_token);
  // if(user_token === null){
  //   navigate("/login"); 

  //   console.log("*******************");
  // }

  return (
    <div className="App">
      
      <Router>
        {/* <nav>
          <Link to="">Home/Dashboard</Link>
          <Link to="">Mobiles</Link>
          <Link to="">Electronics</Link>
        </nav> */}
        <Routes>
          <Route path='/'  element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/products/*' element={<ProductList />} />
          <Route path='/product/:modelno/:categoryid/:id' element={<ProductDescription />} />
          <Route path='/viewcart/*' element={<Cart />} />
          <Route path='/checkout/*' element={<Checkout />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
