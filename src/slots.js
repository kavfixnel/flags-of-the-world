import { normalizeGuess } from "./guessing";

// Lays the guess out as the row of letter slots shown under the flag, grouped
// into words so a long name wraps between words rather than mid-word.
//
// Each cell is one of:
//   { kind: "slot", char, state } where state is
//     "typed"  - a letter the player typed
//     "hint"   - a letter revealed by the prefix hint, not typed over yet
//     "empty"  - nothing there yet
//     "extra"  - typed past the end of the name
//   { kind: "punct", char } - punctuation that is part of the name itself
//
// `cursor` is the index, across all slots, of the one the next letter lands in.
const buildSlots = (name, guess, { revealed, showLength }) =>
  showLength
    ? lengthSlots(name, guess, revealed)
    : freeSlots(name, guess, revealed);

// With the length hint on, the slots are the name's letters. Typed letters fill
// them in order, skipping the spaces and punctuation the layout already shows,
// so "cote divoire" lines up with "Cote d'Ivoire" without typing the apostrophe.
const lengthSlots = (name, guess, revealed) => {
  const typed = normalizeGuess(guess);
  const words = [[]];
  let slot = 0;

  [...name].forEach((ch, i) => {
    if (ch === " ") {
      words.push([]);
    } else if (normalizeGuess(ch) === "") {
      words[words.length - 1].push({ kind: "punct", char: ch });
    } else {
      words[words.length - 1].push(
        slot < typed.length
          ? { kind: "slot", char: typed[slot], state: "typed" }
          : i < revealed
          ? { kind: "slot", char: ch, state: "hint" }
          : { kind: "slot", char: "", state: "empty" }
      );
      slot++;
    }
  });

  // Aliases can be longer than the name ("Congo Brazzaville" for "Congo"), so
  // anything past the last slot is kept on show rather than silently dropped
  if (typed.length > slot) {
    words.push(
      [...typed.slice(slot)].map((char) => ({ kind: "slot", char, state: "extra" }))
    );
  }

  return { words, cursor: typed.length, letters: slot };
};

// Without the length hint there is nothing to line up against, so the guess is
// shown as typed, followed by whatever of the prefix hint it has not covered
// yet, and one open slot for the next letter.
const freeSlots = (name, guess, revealed) => {
  const words = [[]];
  const push = (cell) => words[words.length - 1].push(cell);
  // Not substring(guess.length, revealed): substring swaps its arguments when
  // the guess is the longer of the two, which would reveal the name
  const hint = name.slice(0, revealed).slice(guess.length);

  [...guess].forEach((char) =>
    char === " " ? words.push([]) : push({ kind: "slot", char, state: "typed" })
  );
  [...hint].forEach((char) =>
    char === " " ? words.push([]) : push({ kind: "slot", char, state: "hint" })
  );
  push({ kind: "slot", char: "", state: "empty" });

  // The next letter lands right after the typed ones, on top of the hint
  const cursor = [...guess].filter((c) => c !== " ").length;

  return { words: words.filter((w) => w.length > 0), cursor, letters: null };
};

export { buildSlots };
