import { NextRequest, NextResponse } from "next/server";

import { connect } from "@planetscale/database";
const conn = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

import { nanoid } from "nanoid";

const injest = async (req: NextRequest) => {
  const key = req.nextUrl.searchParams.get("key");

  console.log(req);

  const forwarded = req.headers.get("x-forwarded-for");
  const host = forwarded ? forwarded.split(/, /)[0] : req.url;

  const size = +(req.headers.get("content-length") ?? 0);

  const endpoint = req.url?.split("/").reverse()?.[0];

  const responseHeaders = JSON.stringify(
    Object.fromEntries(req.headers.entries())
  );

  const data = {
    id: nanoid(),
    host: host ?? "",
    endpoint: endpoint ?? "",
    method: req.method ?? "UNKNOWN",
    headers: responseHeaders ?? null,
    body: req.body ?? null,
    size: size ?? 0,
  };

  console.log("data?", data);

  const dbwrite = await conn.execute(
    "INSERT INTO RequestObject (projectId, id, host, endpoint, method, headers, body, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      key,
      data.id,
      data.host,
      data.endpoint,
      data.method,
      data.headers,
      data.body,
      data.size,
    ]
  );

  console.log("written?", dbwrite);

  // TODO: Write data to db

  // TODO: Forward request

  return NextResponse.json({
    name: `Hello, from ${req.url} I'm now an Edge Function!`,
  });
};

export default injest;

export const config = {
  runtime: "experimental-edge",
};
