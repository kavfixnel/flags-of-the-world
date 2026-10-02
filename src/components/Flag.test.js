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

const placeholder = () => screen.getByRole("textbox").placeholder;

describe("the hint placeholder", () => {
  it("is empty when both hints are off", () => {
    renderFlag();

    expect(placeholder()).toBe("");
  });

  it("stars the whole name when only the length hint is on", () => {
    renderFlag({ totalLengthHint: true, prefixLengthHint: 1 });

    expect(placeholder()).toBe("****");
  });

  it("ignores the prefix length while the prefix hint is off", () => {
    renderFlag({ totalLengthHint: true, prefixLengthHint: 3 });

    expect(placeholder()).toBe("****");
  });

  it("reveals the prefix and stars the rest", () => {
    renderFlag({ totalLengthHint: true, prefixHint: true, prefixLengthHint: 2 });

    expect(placeholder()).toBe("ch**");
    expect(placeholder()).toHaveLength(chad.name.length);
  });

  it("never reveals the whole name through the prefix", () => {
    renderFlag({ prefixHint: true, prefixLengthHint: 99 });

    expect(placeholder()).toBe("cha");
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
