import {
  getByRole,
  getByText,
  render,
  screen,
} from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import { OrderEntry } from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total sstarts out at $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops tp 2 and check subtotal

  const chocolateScoops = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateScoops);
  await user.type(chocolateScoops, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("get default toppings subtotal", () => {
  render(<Options optionType="toppings" />);

  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");
});

test("update toppings sybtotal when user add/remove them", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });

  const hotFudgeToppings = await screen.findByRole("checkbox", {
    name: /Hot Fudge/i,
  });

  await user.click(hotFudgeToppings);

  expect(hotFudgeToppings).toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  const CherriesToppings = screen.getByRole("checkbox", {
    name: /Cherries/i,
  });

  await user.click(CherriesToppings);

  expect(hotFudgeToppings).toBeChecked();
  expect(CherriesToppings).toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent("3.00");

  await user.click(CherriesToppings);

  expect(hotFudgeToppings).toBeChecked();
  expect(CherriesToppings).not.toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  test("grand total starts at $0.00", () => {
    const { unmount } = render(<OrderEntry />);
    const totalPrice = screen.getByText("Grand total", {
      exact: false,
    });
    expect(totalPrice).toHaveTextContent("0.00");

    unmount();
  });

  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<OrderEntry />);

    const totalPrice = screen.getByText("Grand total", {
      exact: false,
    });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    expect(totalPrice).toHaveTextContent("4.00");

    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    await user.click(cherriesCheckbox);

    expect(totalPrice).toHaveTextContent("5.50");
    unmount();
  });

  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<OrderEntry />);

    const totalPrice = screen.getByText("Grand total", {
      exact: false,
    });
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });

    await user.click(cherriesCheckbox);

    expect(totalPrice).toHaveTextContent("1.50");

    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");

    expect(totalPrice).toHaveTextContent("3.50");
    unmount();
  });

  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<OrderEntry />);

    const totalPrice = screen.getByText("Grand total", {
      exact: false,
    });
    const cherriesCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    await user.click(cherriesCheckbox);

    expect(totalPrice).toHaveTextContent("3.50");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");
    await user.click(cherriesCheckbox);

    expect(totalPrice).toHaveTextContent("0.00");
    unmount();
  });
});
