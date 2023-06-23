function Flag({
  currentCountry,
  prefixHint,
  prefixLength,
  totalLengthHint,
  inputRef,
  guess,
  handleInputChange,
  nextFlag,
  resetGame,
}) {
  return (
    <>
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
          (prefixHint
            ? currentCountry.name
                .substring(
                  0,
                  Math.min(prefixLength, currentCountry.name.length - 1)
                )
                .toLowerCase()
            : "") +
          (totalLengthHint
            ? "*".repeat(
                currentCountry.name.length -
                  Math.min(prefixLength, currentCountry.name.length - 1)
              )
            : "")
        }
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
    </>
  );
}

export default Flag;
