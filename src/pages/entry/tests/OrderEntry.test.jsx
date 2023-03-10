import {
  screen,
  render,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import { OrderEntry } from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";

test("handles error for scoops and toppings router", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops"),
    (req, res, ctx) => {
      res(ctx.status(500));
    },
    rest.get("http://localhost:3030/topings"),
    (req, res, ctx) => {
      res(ctx.status(500));
    }
  );

  render(<OrderEntry />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});
