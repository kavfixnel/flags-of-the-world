// fireEvent rather than user-event: it comes from the same copy of
// @testing-library/dom that render() configures, so React state updates stay
// wrapped in act() and are flushed before the assertions run
import { render, screen, fireEvent } from "@testing-library/react";

import Flag from "./Flag";

const chad = { id: "148", name: "Chad", alpha2: "td", alpha3: "tcd" };

const renderFlag = (props = {}) =>
  render(
    <Flag
      currentCountry={chad}
      prefixHint={false}
      prefixLengthHint={1}
      totalLengthHint={false}
      inputRef={{ current: null }}
      setInputFocus={() => {}}
      guess=""
      handleInputChange={() => {}}
      nextFlag={() => {}}
      skipFlag={() => {}}
      resetGame={() => {}}
      {...props}
    />
  );

// The slots as text, one character per slot: "_" for an empty one, "." for
// the punctuation the name carries and "|" between words
const slots = () =>
  [...screen.getByTestId("slots").children]
    .map((word) =>
      [...word.children]
        .map((cell) => cell.textContent || "_")
        .join("")
    )
    .join("|");

describe("the hint slots", () => {
  it("shows a single open slot when both hints are off", () => {
    renderFlag();

    expect(slots()).toBe("_");
  });

  it("shows one slot per letter when the length hint is on", () => {
    renderFlag({ totalLengthHint: true });

    expect(slots()).toBe("____");
  });

  it("ignores the prefix length while the prefix hint is off", () => {
    renderFlag({ totalLengthHint: true, prefixLengthHint: 3 });

    expect(slots()).toBe("____");
  });

  it("reveals the prefix and leaves the rest open", () => {
    renderFlag({ totalLengthHint: true, prefixHint: true, prefixLengthHint: 2 });

    expect(slots()).toBe("Ch__");
  });

  it("keeps the hint on screen once the player starts typing", () => {
    renderFlag({ totalLengthHint: true, prefixHint: true, prefixLengthHint: 2, guess: "c" });

    expect(slots()).toBe("ch__");
  });

  it("never reveals the whole name through the prefix", () => {
    renderFlag({ prefixHint: true, prefixLengthHint: 99 });

    expect(slots()).toBe("Cha_");
  });

  it("spells the hint out for screen readers", () => {
    renderFlag({ totalLengthHint: true, prefixHint: true, prefixLengthHint: 2 });

    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "4 letters, starts with Ch"
    );
  });
});

describe("the controls", () => {
  it("exposes each action as a named button", () => {
    renderFlag();

    expect(screen.getByRole("button", { name: "Show another flag" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Give up on this flag" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start a new game" })).toBeInTheDocument();
  });

  it("runs the action behind each button", () => {
    const nextFlag = jest.fn();
    const skipFlag = jest.fn();
    const resetGame = jest.fn();
    renderFlag({ nextFlag, skipFlag, resetGame });

    fireEvent.click(screen.getByRole("button", { name: "Show another flag" }));
    fireEvent.click(screen.getByRole("button", { name: "Give up on this flag" }));
    fireEvent.click(screen.getByRole("button", { name: "Start a new game" }));

    expect(nextFlag).toHaveBeenCalledTimes(1);
    expect(skipFlag).toHaveBeenCalledTimes(1);
    expect(resetGame).toHaveBeenCalledTimes(1);
  });

  it("labels the guess input and the flag", () => {
    renderFlag();

    expect(screen.getByRole("textbox", { name: "Guess the country" })).toBeInTheDocument();
    expect(screen.getByAltText("Flag to guess")).toBeInTheDocument();
  });
});
