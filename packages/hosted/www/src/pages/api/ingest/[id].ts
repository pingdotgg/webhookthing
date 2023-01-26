import { Destination } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { connect } from "@planetscale/database";
const conn = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

import { nanoid } from "nanoid";

const injest = async (req: NextRequest) => {
  const projectId = req.nextUrl.searchParams.get("key");

  if (!projectId) {
    return NextResponse.json(
      { error: "No project ID provided" },
      { status: 400 }
    );
  }
  console.log("projectId", projectId);

  // confirm project exists
  const project = await conn.execute("SELECT * FROM Project WHERE id = ?", [
    projectId,
  ]);

  console.log("project", project);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const host = forwarded ? forwarded.split(/, /)[0] : req.url;

  const size = +(req.headers.get("content-length") ?? 0);

  const endpoint = req.url?.split("/").reverse()?.[0];

  const responseHeaders = JSON.stringify(
    Object.fromEntries(req.headers.entries())
  );

  // TODO: this should probably do different things based on the content-type
  const parsedBody = await req.text();

  console.log("parsedBody", parsedBody);
  const data = {
    id: nanoid(),
    host: host ?? "",
    endpoint: endpoint ?? "",
    method: req.method ?? "UNKNOWN",
    headers: responseHeaders ?? null,
    body: parsedBody ?? null,
    size: size ?? 0,
  };

  const dbWrite = await conn.execute(
    "INSERT INTO RequestObject (projectId, id, host, endpoint, method, headers, body, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      projectId,
      data.id,
      data.host,
      data.endpoint,
      data.method,
      data.headers,
      data.body,
      data.size,
    ]
  );

  console.log("dbWrite", dbWrite);

  // TODO: Forward request to all destinations for this project
  const destinations = (await conn
    .execute("SELECT * FROM Destination WHERE projectId = ?", [projectId])
    .then((res) => res.rows)) as unknown as Destination[];

  console.log(destinations);

  await Promise.all(
    destinations.map(async (dest) => {
      const url = dest.url;

      const fwdHost = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im
      )?.[1] as string;

      const options = ["GET", "HEAD"].includes(data.method)
        ? {
            method: data.method,
            headers: {
              ...JSON.parse(data.headers),
              host: fwdHost,
            },
          }
        : {
            method: data.method,
            headers: {
              ...JSON.parse(data.headers),
              host: fwdHost,
            },
            body: data.body,
          };

      await fetch(url, options);
    })
  );

  return NextResponse.next({ status: 200 });
};

export default injest;

export const config = {
  runtime: "experimental-edge",
};
