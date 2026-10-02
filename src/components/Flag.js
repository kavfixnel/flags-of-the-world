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
          alt="Country Flag ot guess"
        />
      </div>

      <input
        placeholder={placeholder}
        className="mainInput"
        ref={inputRef}
        value={guess}
        onChange={handleInputChange}
      />

      <div className="actionBar">
        <span
          onKeyDown={(e) => {
            if (e.keyCode === 13) nextFlag();
          }}
          className="material-symbols-outlined"
          tabIndex={0}
          onClick={nextFlag}
        >
          chevron_right
        </span>
        <span
          className="material-symbols-outlined"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.keyCode === 13) skipFlag();
          }}
          onClick={skipFlag}
        >
          question_mark
        </span>
        <span
          className="material-symbols-outlined"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.keyCode === 13) resetGame();
          }}
          onClick={resetGame}
        >
          restart_alt
        </span>
      </div>
    </>
  );
}

export default Flag;
