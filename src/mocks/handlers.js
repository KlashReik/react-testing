import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3030/scoops", (req, res, ctx) => {
    return res(
      ctx.json([
        { name: "Chocolate", imagePath: "/images/chocolate.ong" },
        { name: "Vanilla", imagePath: "/images/vanilla.ong" },
      ])
    );
  }),
];
