function GuessedCountries({ countries }) {
  return (
    <div className="guessedFlags">
      {countries.map((c, i) => (
        <div key={i}>
          <img
            src={`https://flagcdn.com/w320/${c.alpha2}.png`}
            srcSet={`https://flagcdn.com/w640/${c.alpha2}.png 2x`}
            width="240"
            alt="Country Flag ot guess"
            style={{ width: "100px" }}
          />
          <p>{c.name}</p>
        </div>
      ))}
    </div>
  );
}

export default GuessedCountries;
