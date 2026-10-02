import { buildSlots } from "./slots";

// One character per slot: "_" when empty, punctuation as is, "|" between words
const render = ({ words }) =>
  words
    .map((word) => word.map((cell) => cell.char || "_").join(""))
    .join("|");

const states = ({ words }) =>
  words.flat().filter((c) => c.kind === "slot").map((c) => c.state);

describe("with the length hint", () => {
  const opts = { revealed: 0, showLength: true };

  it("splits the name into words", () => {
    expect(render(buildSlots("Saint Lucia", "", opts))).toBe("_____|_____");
  });

  it("shows the name's punctuation instead of a slot for it", () => {
    expect(render(buildSlots("Guinea-Bissau", "", opts))).toBe("______-______");
    expect(render(buildSlots("Cote d'Ivoire", "", opts))).toBe("____|_'______");
  });

  it("fills slots across words without the player typing the gaps", () => {
    expect(render(buildSlots("Cote d'Ivoire", "cotedi", opts))).toBe("cote|d'i_____");
  });

  it("counts only letters towards the length", () => {
    expect(buildSlots("Guinea-Bissau", "", opts).letters).toBe(12);
  });

  it("puts the cursor on the next slot to fill", () => {
    expect(buildSlots("Saint Lucia", "saint", opts).cursor).toBe(5);
  });

  it("keeps letters typed past the end of the name", () => {
    const slots = buildSlots("Chad", "chadd", opts);

    expect(render(slots)).toBe("chad|d");
    expect(states(slots)).toEqual(["typed", "typed", "typed", "typed", "extra"]);
  });

  it("shows the revealed prefix until it is typed over", () => {
    const slots = buildSlots("Chad", "x", { ...opts, revealed: 2 });

    expect(render(slots)).toBe("xh__");
    expect(states(slots)).toEqual(["typed", "hint", "empty", "empty"]);
  });
});

describe("without the length hint", () => {
  const opts = { revealed: 0, showLength: false };

  it("shows the guess as typed followed by one open slot", () => {
    expect(render(buildSlots("Saint Lucia", "saint l", opts))).toBe("saint|l_");
  });

  it("does not give the length away", () => {
    expect(buildSlots("Chad", "", opts).letters).toBeNull();
  });

  it("shows the revealed prefix after what has been typed", () => {
    const slots = buildSlots("Saint Lucia", "s", { ...opts, revealed: 7 });

    expect(render(slots)).toBe("saint|L_");
    expect(slots.cursor).toBe(1);
  });
});
