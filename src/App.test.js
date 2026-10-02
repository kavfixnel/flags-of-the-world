// fireEvent rather than user-event: it comes from the same copy of
// @testing-library/dom that render() configures, so React state updates stay
// wrapped in act() and are flushed before the assertions run
import { render, screen, fireEvent } from "@testing-library/react";

import App from "./App";
import countries from "./countries.json";

const chad = countries.find((c) => c.name === "Chad");
const peru = countries.find((c) => c.name === "Peru");

const startWith = ({ current, guessed = [] }) => {
  window.localStorage.setItem("game.state.currentCountry", JSON.stringify(current));
  window.localStorage.setItem("game.state.guessedCountries", JSON.stringify(guessed));
};

// Every country except the given ones, already filed away
const allBut = (unanswered) =>
  countries
    .filter((c) => !unanswered.some((u) => u.id === c.id))
    .map((c) => ({ ...c, status: "skipped" }));

const allButCurrent = (current) => allBut([current]);

beforeEach(() => window.localStorage.clear());

it("files a correct guess away and moves on to another flag", () => {
  startWith({ current: peru });
  render(<App />);

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "peru" } });

  expect(screen.getByAltText("Flag of Peru")).toBeInTheDocument();
  expect(screen.getByAltText("Flag to guess")).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toHaveValue("");
});

it("accepts an alias rather than only the exact name", () => {
  const uk = countries.find((c) => c.alpha2 === "gb");
  startWith({ current: uk });
  render(<App />);

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "uk" } });

  expect(screen.getByAltText(`Flag of ${uk.name}`)).toBeInTheDocument();
});

it("does not draw the country that was just skipped", () => {
  // Two countries are left and Math.random is pinned to the first of them.
  // Chad sorts before Peru, so a guessed list read from a stale render - which
  // would still consider Chad unanswered - hands Chad straight back.
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  startWith({ current: chad, guessed: allBut([chad, peru]) });
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Give up on this flag" }));

  expect(screen.getByAltText("Flag to guess").src).toContain(`/${peru.alpha2}.png`);
  random.mockRestore();
});

it("does not draw the country that was just guessed", () => {
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  startWith({ current: chad, guessed: allBut([chad, peru]) });
  render(<App />);

  fireEvent.change(screen.getByRole("textbox"), { target: { value: "chad" } });

  expect(screen.getByAltText("Flag to guess").src).toContain(`/${peru.alpha2}.png`);
  random.mockRestore();
});

it("ends the game with a tally once every flag has been answered", () => {
  startWith({ current: chad, guessed: allButCurrent(chad) });
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: "Give up on this flag" }));

  expect(
    screen.getByRole("heading", { name: `All ${countries.length} flags done!` })
  ).toBeInTheDocument();
  expect(screen.getByText("0 guessed, 249 skipped")).toBeInTheDocument();
});

it("starts over from the completion screen", () => {
  startWith({ current: chad, guessed: allButCurrent(chad) });
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Give up on this flag" }));

  fireEvent.click(screen.getByRole("button", { name: "Play again" }));

  expect(screen.getByAltText("Flag to guess")).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: /flags done/ })
  ).not.toBeInTheDocument();
});

it("leaves the countries data unmodified", () => {
  // The country has to be drawn by the game rather than seeded from
  // localStorage, which would hand the app a parsed copy: only a country taken
  // straight from the imported array can expose a write to the module's data
  const random = jest.spyOn(Math, "random").mockReturnValue(0);
  render(<App />);
  const drawn = countries[0];

  fireEvent.change(screen.getByRole("textbox"), { target: { value: drawn.name } });

  expect(screen.getByAltText(`Flag of ${drawn.name}`)).toBeInTheDocument();
  expect(countries.filter((c) => "status" in c)).toEqual([]);
  random.mockRestore();
});

it("starts a fresh game when localStorage holds something unreadable", () => {
  window.localStorage.setItem("game.state.guessedCountries", "[{broken json");
  window.localStorage.setItem("game.state.currentCountry", "not json either");

  render(<App />);

  expect(screen.getByAltText("Flag to guess")).toBeInTheDocument();
});
