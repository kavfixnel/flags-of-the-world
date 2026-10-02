import { buildSlots } from "../slots";

// Screen readers cannot see the slots, so the same hint is spelled out for them
const describeHint = (name, revealed, letters) =>
  [
    letters != null && `${letters} letters`,
    revealed > 0 && `starts with ${name.substring(0, revealed)}`,
  ]
    .filter(Boolean)
    .join(", ");

// The caret is not drawn (the slots show where the next letter goes), so it is
// pinned to the end: editing mid-word would change letters the player cannot
// see the caret next to
const keepCaretAtEnd = (e) => {
  const end = e.target.value.length;
  if (e.target.selectionStart !== end || e.target.selectionEnd !== end) {
    e.target.setSelectionRange(end, end);
  }
};

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
  // Never the whole name, or the hint would answer the flag by itself
  const revealed = prefixHint
    ? Math.min(prefixLengthHint, currentCountry.name.length - 1)
    : 0;

  const { words, cursor, letters } = buildSlots(currentCountry.name, guess, {
    revealed,
    showLength: totalLengthHint,
  });
  const hint = describeHint(currentCountry.name, revealed, letters);

  // Slots are numbered across words so the cursor can be matched against them
  let slotIndex = 0;

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

      {/* A real input sits transparently on top of the slots, so typing,
          the mobile keyboard, paste and screen readers all behave as usual
          while the slots do the drawing */}
      <div className="guessBox">
        <div className="slots" aria-hidden="true" data-testid="slots">
          {words.map((word, w) => (
            <span className="word" key={w}>
              {word.map((cell, c) => {
                if (cell.kind === "punct") {
                  return (
                    <span className="punct" key={c}>
                      {cell.char}
                    </span>
                  );
                }
                const isCursor = slotIndex++ === cursor;
                return (
                  <span
                    key={c}
                    className={`slot ${cell.state}${isCursor ? " cursor" : ""}`}
                    data-state={cell.state}
                  >
                    {cell.char}
                  </span>
                );
              })}
            </span>
          ))}
        </div>
        {hint && (
          <span id="guessHint" className="visuallyHidden">
            {hint}
          </span>
        )}
        <input
          className="mainInput"
          ref={inputRef}
          value={guess}
          onChange={handleInputChange}
          onSelect={keepCaretAtEnd}
          aria-label="Guess the country"
          aria-describedby={hint ? "guessHint" : undefined}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

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
