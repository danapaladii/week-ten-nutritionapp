import { useState } from "react";
import { useEffect } from "react";
import { Nutrition } from "./Nutrition";
import { LoaderPage } from "./Loader/LoaderPage";
import video from './food5.mp4';
import './App.css';

function App() {

  const [mySearch, setMySearch] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [myNutrition, setMyNutrition] = useState();
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = 'dc43f5c9';
  const APP_KEY = '41004f36187693a52846881269bea7f0';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      setMyNutrition(data);
    } else {
      setStateLoader(false);
      alert('ingredients entered incorrectly');
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setWordSubmitted(mySearch);
  }

  useEffect(() => {
    if (wordSubmitted !== '') {
      let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [wordSubmitted])

  return (
    <div className="App">
      <div className="container">

      {stateLoader && <LoaderPage />}

        <video autoPlay muted loop>
          <source src={video} type="video/mp4" />
        </video>


        <h1>Your Ingredients:</h1>
        </div>

        <div className="container">
          <form onSubmit={finalSearch}>
            <input className="search" onChange={myRecipeSearch}/>
            <button type="submit">Submit for Nutrition Info</button>
          </form>
        </div>

        <div className="container list"> 
        {
          myNutrition && <p>{myNutrition.calories} kcal</p>
        }
        {
          myNutrition && Object.values(myNutrition.totalNutrients)
            .map(({ label, quantity, unit }, index) =>
              <Nutrition key={index}
                label={label}
                quantity={quantity}
                unit={unit}
              />
            )
        }
      </div>

    </div>
  );
}

export default App;
