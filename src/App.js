import { useState, useEffect } from "react";
import { useFocus, usePersistedState } from "./helpers";

import countries from "./countries.json";
import GuessedCountries from "./components/GuessedCountries";
import Settings from "./components/Settings";
import Flag from "./components/Flag";

function App() {
  const [currentCountry, setCurrentCountry] = usePersistedState(
    null,
    "gameSate.currentCountry"
  );
  const [guessedCountries, setGuessedCountries] = usePersistedState(
    [],
    "gameSate.guessedCountries"
  );

  const [guess, setGuess] = useState("");
  const [correct, setCorrect] = useState(false);
  const [inputRef, setInputFocus] = useFocus();
  const handleInputChange = (e) => {
    setGuess(e.target.value.toLowerCase());
  };

  useEffect(() => {
    setCorrect(
      currentCountry != null &&
        currentCountry.name.toLowerCase() === guess.toLowerCase()
    );

    // This is needed to kickstart the game. If there is no state in localstorage
    // gameSate.currentCountry, we need to set a new flag
    if (currentCountry === null) nextFlag();
  }, [currentCountry, guess]);

  useEffect(() => {
    if (correct) {
      // User guessed the flag correctly
      currentCountry.status = "guessed";
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

  const skipFlag = () => {
    currentCountry.status = "skipped";
    setGuessedCountries((guessedCountries) => [
      currentCountry,
      ...guessedCountries,
    ]);
    nextFlag();
  };

  const resetGame = () => {
    setGuessedCountries([]);
    nextFlag();
  };

  const [totalLengthHint, settotalLengthHint] = useState(false);
  const [prefixHint, setPrefixHint] = useState(false);
  const [prefixLength, setPrefixLength] = useState(1);

  return currentCountry == null ? (
    <></>
  ) : (
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
          skipFlag={skipFlag}
          resetGame={resetGame}
        />
      </div>
    </>
  );
}

export default App;
