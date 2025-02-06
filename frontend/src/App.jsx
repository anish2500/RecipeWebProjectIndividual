import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Body from './components/Body';
import ViewRecipe from './components/ViewRecipe';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AddRecipe from './components/AddRecipe';
import Contacts from './components/Contacts';
import AboutUs from './components/AboutUs';



const App = () => {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/Body" element={<Body />} />
        <Route path="/view-recipe" element={<ViewRecipe />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/AboutUs" element={<AboutUs />} />


        


      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;












// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import NavBar from './components/NavBar';
// import Body from './components/Body';
// import Footer from './components/Footer';

// import Contact from './components/Contact'; // Create this component
// import AddRecipe from './components/AddRecipe'; // Create this component

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <NavBar />
//         <Routes>
//           <Route path="/" element={<Body />} />

//           <Route path="/contact" element={<Contact />} />

//         </Routes>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';

// // import ViewRecipe from './components/ViewRecipe';
// // import './App.css';

// // import Footer from './components/Footer';
// // import NavBar from './components/NavBar';

// import AddRecipe from './components/addRecipe';


// function App() {
//   return (
//     <div className="App">
//     <AddRecipe/>
//     </div>
//   );
// }
// export default App;
