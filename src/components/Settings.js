import countries from "../countries.json";

const handleCheckChange = (e, f) => {
  f(e.target.checked);
};

function GuessedCountries({
  totalLengthHint,
  settotalLengthHint,
  prefixHint,
  setPrefixHint,
  prefixLengthHint,
  setPrefixLengthHint,
  guessedCountries,
}) {
  return (
    <div className="settings">
      <h2>Hints</h2>
      <label>
        <input
          type="checkbox"
          checked={totalLengthHint}
          onChange={(e) => handleCheckChange(e, settotalLengthHint)}
        />
        Total length
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={prefixHint}
          onChange={(e) => handleCheckChange(e, setPrefixHint)}
        />
        Prefix
      </label>
      <br />
      <label>
        <input
          value={prefixLengthHint}
          type="number"
          onChange={(e) => setPrefixLengthHint(e.target.value)}
          min={0}
        />
        Prefix length
      </label>
      <br />

      <h2>Stats</h2>
      <p>
        Number of guessed flags:{" "}
        {guessedCountries.reduce(
          (prev, cur) => prev + (cur.status === "guessed" ? 1 : 0),
          0
        )}
        /{countries.length}
      </p>
    </div>
  );
}

export default GuessedCountries;
