import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import { v4 as uuid } from "uuid";
import helmet from "helmet";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = polka();

app.use((req, res, next) => {
  res.locals = {};
  res.locals.nonce = uuid();
  next();
});

app.use(
  helmet({
    // TODO
    contentSecurityPolicy: false,
    // contentSecurityPolicy: {
    //   directives: {
    //     "default-src": ["'self'"],
    //     "base-uri": ["'self'"],
    //     "block-all-mixed-content": [],
    //     "font-src": ["'self'", "https:", "data:"],
    //     "frame-ancestors": ["'self'"],
    //     "img-src": ["'self'", "data:"],
    //     "object-src": ["'none'"],
    //     "script-src": [
    //       "'self' 'unsafe-eval'",
    //       (_req, res) => `'nonce-${res.locals.nonce}'`,
    //     ],
    //     "script-src-attr": ["'none'"],
    //     "style-src": ["'self'", "https:", "'unsafe-inline'"],
    //     "upgrade-insecure-requests": [],
    //   },
    // },
  })
);

app
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
