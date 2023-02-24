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
  rest.get("http://localhost:3030/toppings", (req, res, ctx) => {
    return res(
      ctx.json([
        { name: "Cherries", imagePath: "/images/cherries.ong" },
        { name: "M&Ms", imagePath: "/images/m-and-ms.ong" },
        { name: "Hot fudge", imagePath: "/images/hot-fudge.ong" },
      ])
    );
  }),
];
