import aliases from "./countryAliases.json";

// Strips everything a player cannot reasonably be expected to reproduce:
// diacritics (Curacao, Reunion), case, and all punctuation and spacing, so that
// "cote d'ivoire", "Cote dIvoire" and "cotedivoire" are one and the same answer.
const normalizeGuess = (value) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Spellings that fall out of the name itself and are not worth listing by hand.
// The transformations are applied cumulatively, so "Saint Kitts and Nevis" also
// covers "St Kitts & Nevis".
const impliedVariants = (name) => {
  // Saint Lucia -> St Lucia, St. Lucia
  const variants = name.startsWith("Saint ")
    ? [name, name.replace("Saint ", "St ")]
    : [name];

  // Antigua and Barbuda -> Antigua & Barbuda, since normalisation drops the
  // ampersand and leaves the "and" behind
  return variants.flatMap((variant) =>
    variant.includes(" and ")
      ? [variant, variant.split(" and ").join(" ")]
      : [variant]
  );
};

const acceptedAnswers = (country) =>
  [...impliedVariants(country.name), ...(aliases[country.id] || [])].map(
    normalizeGuess
  );

const matchesCountry = (guess, country) => {
  const normalized = normalizeGuess(guess);

  return normalized !== "" && acceptedAnswers(country).includes(normalized);
};

export { normalizeGuess, acceptedAnswers, matchesCountry };
