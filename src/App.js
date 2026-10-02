import { useState, useEffect } from "react";
import { useFocus, usePersistedState } from "./helpers";

import countries from "./countries.json";
import GuessedCountries from "./components/GuessedCountries";
import Settings from "./components/Settings";
import Flag from "./components/Flag";

function App() {
  const [currentCountry, setCurrentCountry] = usePersistedState(
    null,
    "game.state.currentCountry"
  );
  const [guessedCountries, setGuessedCountries] = usePersistedState(
    [],
    "game.state.guessedCountries"
  );

  // Every country has been either guessed or skipped. Derived rather than
  // stored, so it survives a reload along with the guessed list. Matching on
  // ids rather than comparing lengths, because a list persisted by an older
  // version of the game can hold the same country twice.
  const guessedIds = new Set(guessedCountries.map((c) => c.id));
  const finished = countries.every((c) => guessedIds.has(c.id));

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
    if (currentCountry === null && !finished) pickNext(guessedCountries);
  }, [currentCountry, guess]);

  useEffect(() => {
    if (correct) {
      // User guessed the flag correctly
      advance("guessed");
    }
  }, [correct]);

  // Draws the next flag from the countries that are not in `guessed` yet. The
  // list is passed in rather than read from state, because the callers have just
  // queued an update to it and would otherwise still see the previous render's
  // value, making the country they just answered eligible to be drawn again.
  const pickNext = (guessed) => {
    const remaining = countries.filter(
      (e) => !guessed.some((f) => f.id === e.id)
    );
    setCurrentCountry(
      remaining.length === 0
        ? null
        : remaining[Math.floor(Math.random() * remaining.length)]
    );
    setGuess("");
    setInputFocus();
  };

  // Files the current flag away under `status` and moves on to the next one.
  // currentCountry is a reference into the imported countries.json array, so it
  // is copied rather than written to: mutating it would both leave a stray
  // status on the source data for the rest of the session and change state
  // without telling React about it.
  const advance = (status) => {
    const guessed = [{ ...currentCountry, status }, ...guessedCountries];
    setGuessedCountries(guessed);
    pickNext(guessed);
  };

  const skipFlag = () => advance("skipped");

  const resetGame = () => {
    setGuessedCountries([]);
    pickNext([]);
  };

  const [totalLengthHint, settotalLengthHint] = usePersistedState(false, 'game.hint.totalLength');
  const [prefixHint, setPrefixHint] = usePersistedState(false, 'game.hint.prefix');
  const [prefixLengthHint, setPrefixLengthHint] = usePersistedState(1, 'game.hint.prefixLengthHint');
  const [showSkipped, setShowSkipped] = usePersistedState(false, 'game.setting.showSkipped');

  return (
    <>
      <Settings
        totalLengthHint={totalLengthHint}
        settotalLengthHint={settotalLengthHint}
        prefixHint={prefixHint}
        setPrefixHint={setPrefixHint}
        prefixLengthHint={prefixLengthHint}
        setPrefixLengthHint={setPrefixLengthHint}
        guessedCountries={guessedCountries}
        showSkipped={showSkipped}
        setShowSkipped={setShowSkipped}
      />
      <GuessedCountries countries={guessedCountries} showSkipped={showSkipped} />

      <div className="main ">
        {finished ? (
          <div className="finished">
            <h1>All {countries.length} flags done!</h1>
            <p>
              {guessedCountries.filter((c) => c.status === "guessed").length}{" "}
              guessed,{" "}
              {guessedCountries.filter((c) => c.status !== "guessed").length}{" "}
              skipped
            </p>
            <button onClick={resetGame}>Play again</button>
          </div>
        ) : (
          currentCountry != null && (
            <Flag
              currentCountry={currentCountry}
              prefixHint={prefixHint}
              prefixLengthHint={prefixLengthHint}
              totalLengthHint={totalLengthHint}
              inputRef={inputRef}
              setInputFocus={setInputFocus}
              guess={guess}
              handleInputChange={handleInputChange}
              nextFlag={() => pickNext(guessedCountries)}
              skipFlag={skipFlag}
              resetGame={resetGame}
            />
          )
        )}
      </div>
    </>
  );
}

export default App;
