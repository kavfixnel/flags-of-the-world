function Flag({
  currentCountry,
  prefixHint,
  prefixLengthHint,
  totalLengthHint,
  inputRef,
  setInputFocus,
  guess,
  handleInputChange,
  nextFlag,
  skipFlag,
  resetGame,
}) {
  // Only the part of the name that is actually revealed counts against the
  // length hint, so the stars have to be measured from the prefix that is shown
  // (none at all when the prefix hint is off) rather than from prefixLengthHint.
  const revealed = prefixHint
    ? Math.min(prefixLengthHint, currentCountry.name.length - 1)
    : 0;

  const placeholder =
    currentCountry.name.substring(0, revealed).toLowerCase() +
    (totalLengthHint
      ? "*".repeat(currentCountry.name.length - revealed)
      : "");

  return (
    <>
      <div className="flag" onClick={setInputFocus}>
        <img
          src={`https://flagcdn.com/w320/${currentCountry.alpha2}.png`}
          srcSet={`https://flagcdn.com/w640/${currentCountry.alpha2}.png 2x`}
          width="240"
          alt="Flag to guess"
        />
      </div>

      <input
        placeholder={placeholder}
        className="mainInput"
        ref={inputRef}
        value={guess}
        onChange={handleInputChange}
        aria-label="Guess the country"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />

      {/* Buttons rather than spans with key handlers: Enter, Space, the right
          role for screen readers and a focus ring all come for free */}
      <div className="actionBar">
        <button
          type="button"
          className="material-symbols-outlined"
          aria-label="Show another flag"
          onClick={nextFlag}
        >
          chevron_right
        </button>
        <button
          type="button"
          className="material-symbols-outlined"
          aria-label="Give up on this flag"
          onClick={skipFlag}
        >
          question_mark
        </button>
        <button
          type="button"
          className="material-symbols-outlined"
          aria-label="Start a new game"
          onClick={resetGame}
        >
          restart_alt
        </button>
      </div>
    </>
  );
}

export default Flag;
