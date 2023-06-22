import { useState, useEffect, useRef } from 'react';
import countries from './countries.json';

const useFocus = () => {
  const htmlElRef = useRef(null)
  const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

  return [ htmlElRef, setFocus ] 
}

function App() {
  const [country, setCountry] = useState({"id": "0","name": "","alpha2": "","alpha3": ""});

  const [guess, setGuess] = useState("");
  const [correct, setCorrect] = useState(false);
  const [inputRef, setInputFocus] = useFocus()
  const handleInputChange = (e) => {
    setGuess(e.target.value.toLowerCase());
  }

  useEffect(() => {
    setCorrect(country.name.toLowerCase() === guess.toLowerCase());
  }, [country.name, guess]);

  useEffect(() => {if (correct) nextFlag()}, [correct]);

  const nextFlag = () => {
    setCountry(countries[Math.floor(Math.random() * countries.length)]);
    setGuess("");
    setInputFocus();
  }
  useEffect(nextFlag, []);

  const [lengthHint, setLengthHint] = useState(false);
  const [prefixHint, setPrefixHint] = useState(false);
  const [prefixLength, setPrefixLength] = useState(1);

  const handleCheckChange = (e, f) => {
    f(e.target.checked);
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      <div className="settings">
        <h2>Hints</h2>
        <label>
          <input
            type="checkbox"
            checked={lengthHint}
            onChange={(e) => handleCheckChange(e, setLengthHint)}
          />
          Total length
        </label><br/>
        <label>
          <input
            type="checkbox"
            checked={prefixHint}
            onChange={(e) => handleCheckChange(e, setPrefixHint)}
          />
          Prefix
        </label><br/>
        <label>
          <input
          value={prefixLength}
            type="number"
            onChange={(e) => setPrefixLength(e.target.value) }
            min={0}
          />
          Prefix length
        </label><br/>
      </div>
      <div className="main ">
        { country && // Needed to wait for the country to be picked
          <img
            src={`https://flagcdn.com/w320/${country.alpha2}.png`}
            srcSet={`https://flagcdn.com/w640/${country.alpha2}.png 2x`}
            width="240"
            alt="Country Flag ot guess"></img>
        }

        <input placeholder={prefixHint ? country.name.substring(0,Math.min(prefixLength, country.name.length-1)).toLowerCase() : ""} className="mainInput" ref={inputRef} value={guess} onChange={handleInputChange} style={{backgroundColor: correct ? "#52CC7A" : "white" }}/>

        <div className='actionBar'>
          <span onKeyDown={(e) => {if(e.keyCode === 13) nextFlag()}} className="material-symbols-outlined" tabIndex={0}>chevron_right</span>
          <span className="material-symbols-outlined" tabIndex={0}>question_mark</span>
          <span className="material-symbols-outlined" tabIndex={0}>restart_alt</span>
        </div>
      </div>
    </>
  );
}

export default App;
