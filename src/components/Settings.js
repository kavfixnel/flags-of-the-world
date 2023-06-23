import countries from '../countries.json';

const handleCheckChange = (e, f) => {
  f(e.target.checked);
};

function GuessedCountries({totalLengthHint, settotalLengthHint, prefixHint, setPrefixHint, prefixLength, setPrefixLength, guessedCountries}) {
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

      <h2>Stats</h2>
      <p>Number of guessed flags: {guessedCountries.length}/{countries.length}</p>
    </div>  
  );
}

export default GuessedCountries;