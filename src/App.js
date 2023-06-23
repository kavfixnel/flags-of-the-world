import { useState, useEffect, useRef } from "react";

import countries from "./countries.json";
import GuessedCountries from "./components/GuessedCountries";
import Settings from "./components/Settings";
import Flag from "./components/Flag";

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
        <Flag
          currentCountry={currentCountry}
          prefixHint={prefixHint}
          prefixLength={prefixLength}
          totalLengthHint={totalLengthHint}
          inputRef={inputRef}
          guess={guess}
          handleInputChange={handleInputChange}
          nextFlag={nextFlag}
          resetGame={resetGame}
        />
      </div>
    </>
  );
}

export default App;
