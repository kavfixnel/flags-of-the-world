import countries from "./countries.json";
import { normalizeGuess, matchesCountry } from "./guessing";

const country = (name) => {
  const found = countries.find((c) => c.name === name);

  if (!found) throw new Error(`No country named ${name} in countries.json`);

  return found;
};

describe("normalizeGuess", () => {
  it("strips diacritics, case, punctuation and spacing", () => {
    expect(normalizeGuess("Curaçao")).toBe("curacao");
    expect(normalizeGuess("  Côte d'Ivoire ")).toBe("cotedivoire");
    expect(normalizeGuess("Guinea-Bissau")).toBe("guineabissau");
    expect(normalizeGuess("ST. KITTS & NEVIS")).toBe("stkittsnevis");
  });
});

describe("matchesCountry", () => {
  it.each([
    ["Curacao", "Curaçao"],
    ["curaçao", "Curaçao"],
    ["reunion", "Réunion"],
    ["cote divoire", "Cote d'Ivoire"],
    ["Cote d'Ivoire", "Cote d'Ivoire"],
    ["guinea bissau", "Guinea-Bissau"],
    ["  peru  ", "Peru"],
    ["PERU", "Peru"],
  ])("accepts %p for %p without the exact spelling", (guess, name) => {
    expect(matchesCountry(guess, country(name))).toBe(true);
  });

  it.each([
    ["uk", "United Kingdom of Great Britain and Northern Ireland"],
    ["Great Britain", "United Kingdom of Great Britain and Northern Ireland"],
    ["usa", "United States of America"],
    ["america", "United States of America"],
    ["ivory coast", "Cote d'Ivoire"],
    ["czech republic", "Czechia"],
    ["burma", "Myanmar"],
    ["holland", "Netherlands"],
    ["swaziland", "Eswatini"],
    ["east timor", "Timor-Leste"],
    ["cape verde", "Cabo Verde"],
    ["vatican", "Holy See"],
    ["drc", "Democratic Republic of the Congo"],
    ["congo", "Democratic Republic of the Congo"],
    ["congo", "Congo"],
    ["virgin islands", "British Virgin Islands"],
    ["virgin islands", "United States Virgin Islands"],
  ])("accepts the common name %p for %p", (guess, name) => {
    expect(matchesCountry(guess, country(name))).toBe(true);
  });

  it.each([
    ["st lucia", "Saint Lucia"],
    ["St. Lucia", "Saint Lucia"],
    ["st kitts and nevis", "Saint Kitts and Nevis"],
    ["st. kitts & nevis", "Saint Kitts and Nevis"],
    ["Antigua & Barbuda", "Antigua and Barbuda"],
  ])("derives %p for %p from the name itself", (guess, name) => {
    expect(matchesCountry(guess, country(name))).toBe(true);
  });

  it.each([
    ["", "Peru"],
    ["   ", "Peru"],
    ["chile", "Peru"],
    ["per", "Peru"],
    ["perux", "Peru"],
  ])("rejects %p for %p", (guess, name) => {
    expect(matchesCountry(guess, country(name))).toBe(false);
  });
});

describe("countries.json", () => {
  it("lets every country be answered with its own name", () => {
    const unreachable = countries.filter((c) => !matchesCountry(c.name, c));

    expect(unreachable).toEqual([]);
  });

  it("has no two countries sharing a normalised name", () => {
    const byNormalized = {};
    countries.forEach((c) => {
      const key = normalizeGuess(c.name);
      byNormalized[key] = [...(byNormalized[key] || []), c.name];
    });

    const collisions = Object.values(byNormalized).filter((n) => n.length > 1);

    expect(collisions).toEqual([]);
  });

  it("has unique ids", () => {
    const ids = countries.map((c) => c.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
