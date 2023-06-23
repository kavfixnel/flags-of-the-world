import { useState, useEffect, useRef } from "react";

import countries from "./countries.json";
import GuessedCountries from "./components/GuessedCountries";
import Settings from "./components/Settings";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

function App() {
  const [currentCountry, setCurrentCountry] = useState({
    id: "-1",
    name: "",
    alpha2: "",
    alpha3: "",
  });
  const [guessedCountries, setGuessedCountries] = useState([]);

  const [guess, setGuess] = useState("");
  const [correct, setCorrect] = useState(false);
  const [inputRef, setInputFocus] = useFocus();
  const handleInputChange = (e) => {
    setGuess(e.target.value.toLowerCase());
  };

  useEffect(() => {
    setCorrect(currentCountry.name.toLowerCase() === guess.toLowerCase());
  }, [currentCountry.name, guess]);

  useEffect(() => {
    if (correct && currentCountry.id >= 0) {
      // User guessed the flag correctly
      setGuessedCountries((guessedCountries) => [
        currentCountry,
        ...guessedCountries,
      ]);
      nextFlag();
    }
  }, [correct]);

  const nextFlag = () => {
    // Set the next flag
    if (countries.length === guessedCountries.length) return;

    let newPickCountries = countries.filter(
      (e) => !guessedCountries.some((f) => f.id === e.id)
    );

    setCurrentCountry(
      newPickCountries[Math.floor(Math.random() * newPickCountries.length)]
    );
    setGuess("");
    setInputFocus();
  };

  const resetGame = () => {
    setGuessedCountries([]);
    nextFlag();
  };
  useEffect(resetGame, []);

  const [totalLengthHint, settotalLengthHint] = useState(false);
  const [prefixHint, setPrefixHint] = useState(false);
  const [prefixLength, setPrefixLength] = useState(1);

  return (
    <>
      <Settings
        totalLengthHint={totalLengthHint}
        settotalLengthHint={settotalLengthHint}
        prefixHint={prefixHint}
        setPrefixHint={setPrefixHint}
        prefixLength={prefixLength}
        setPrefixLength={setPrefixLength}
        guessedCountries={guessedCountries}
      />
      <GuessedCountries countries={guessedCountries} />

      <div className="main ">
        <div className="flag">
          {currentCountry && ( // Needed to wait for the currentCountry to be picked
            <img
              src={`https://flagcdn.com/w320/${currentCountry.alpha2}.png`}
              srcSet={`https://flagcdn.com/w640/${currentCountry.alpha2}.png 2x`}
              width="240"
              alt="Country Flag ot guess"
              style={{ border: "3px solid black", padding: "1px" }}
            />
          )}
        </div>

        <input
          placeholder={
            prefixHint
              ? currentCountry.name
                  .substring(
                    0,
                    Math.min(prefixLength, currentCountry.name.length - 1)
                  )
                  .toLowerCase()
              : ""
          }
          className="mainInput"
          ref={inputRef}
          value={guess}
          onChange={handleInputChange}
          style={{ backgroundColor: correct ? "#52CC7A" : "white" }}
        />

        <div className="actionBar">
          <span
            onKeyDown={(e) => {
              if (e.keyCode === 13) nextFlag();
            }}
            className="material-symbols-outlined"
            tabIndex={0}
          >
            chevron_right
          </span>
          <span className="material-symbols-outlined" tabIndex={0}>
            question_mark
          </span>
          <span
            onKeyDown={(e) => {
              if (e.keyCode === 13) resetGame();
            }}
            className="material-symbols-outlined"
            tabIndex={0}
          >
            restart_alt
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
