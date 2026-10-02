function GuessedCountries({ countries, showSkipped }) {
  return (
    <div className="guessedFlags">
      {countries.filter((e) => showSkipped ? true : e.status === 'guessed').map((c) => (
        <div key={c.id} className={c.status}>
          <img
            src={`https://flagcdn.com/w320/${c.alpha2}.png`}
            srcSet={`https://flagcdn.com/w640/${c.alpha2}.png 2x`}
            width="240"
            alt={`Flag of ${c.name}`}
            style={{ width: "100px" }}
          />
          <p>{c.name}</p>
        </div>
      ))}
    </div>
  );
}

export default GuessedCountries;
