// src/pages/api/examples.ts
import type { REQUEST_TYPE } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../deps/db";

// TODO: Get this from DB
const FORWARDING_URL = "https://example.com";

const webhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  const forwarded = req.headers["x-forwarded-for"] as string;
  const host = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;

  const size = +(req.headers["content-length"] ?? 0);

  const endpoint = req.url?.split("/").reverse()?.[0];

  const data = {
    host: host ?? "",
    endpoint: endpoint ?? "",
    method: (req.method ?? "GET") as REQUEST_TYPE,
    headers: req.headers ?? null,
    body: req.body ?? null,
    size: size ?? req.socket.bytesRead,

    // TODO: Include project ID in input,
    projectId: "1",
  };

  await prisma.requestObject.create({ data });

  const fwdHost = FORWARDING_URL.match(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
  )?.[1] as string;

  const fwdRes = await fetch(FORWARDING_URL, {
    method: req.method,
    headers: {
      ...(req.headers as HeadersInit),
      host: fwdHost,
    },
    body: req.method !== "GET" ? req.body : undefined,
  });

  res.status(fwdRes.status).end();
};

export default webhooks;
