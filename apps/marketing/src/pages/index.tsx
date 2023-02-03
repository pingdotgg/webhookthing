import { EnvelopeIcon, GlobeAltIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { useState } from "react";
import { z } from "zod";

import type { NextPage } from "next";

import { api } from "../utils/api";

const bannedEndpoints = [
  "webhookthing.com",
  "hookthing.com",
  "example.com",
  "foo.bar",
  "localhost",
  "example/",
  "examplecom/",
  "asdf.com",
  "ping.gg",
  "test.com",
  "google.com",
];

const Home: NextPage = () => {
  const [showEmail, setShowEmail] = useState(false);

  const [endpoint, setEndpoint] = useState<string>();
  const [email, setEmail] = useState<string>();

  const [invalidEndpoint, setInvalidEndpoint] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [bottomText, setBottomText] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const { mutate: submit } = api.example.submitWaitlist.useMutation();
  const handleSubmit = () => {
    if (!email) {
      setShowEmail(true);
      setBottomText("ok... so we actually do want your email");
      if (endpoint && !z.string().url().safeParse(endpoint).success) {
        setInvalidEndpoint(true);
      }
      return;
    }

    if (!z.string().email().safeParse(email).success) {
      setInvalidEmail(true);
      return;
    }

    if (endpoint && !z.string().url().safeParse(endpoint).success) {
      setInvalidEndpoint(true);
      return;
    }

    submit({ endpoint: endpoint === "" ? undefined : endpoint, email });
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>webhookthing</title>
        <meta
          name="description"
          content="an easier way to develop with webhooks locally"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-800/40">
        <div className="container flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-[3.5rem] font-medium tracking-tighter text-white sm:text-[5rem]">
            webhook
            <span className="font-extrabold text-indigo-600 ">thing</span>
          </h1>
          <div className="flex w-96 max-w-sm flex-col gap-4 rounded-xl bg-white/10 p-6 text-white">
            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold">join the waitlist</h3>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="endpoint"
                    className="sr-only block text-sm font-medium"
                  >
                    Endpoint
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <GlobeAltIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="url"
                      name="endpoint"
                      id="endpoint"
                      className="block w-full rounded-md border-gray-300 bg-white/10 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="https://example.com/hooks"
                      onChange={(e) => {
                        setEndpoint(e.target.value);
                        const banned = bannedEndpoints.some((banned) =>
                          e.target.value.includes(banned)
                        );
                        setInvalidEndpoint(banned);
                      }}
                      value={endpoint}
                    />
                  </div>
                  {invalidEndpoint && (
                    <p className="text-sm text-red-500">
                      invalid endpoint url.
                    </p>
                  )}
                  {showEmail && (
                    <>
                      <label
                        htmlFor="email"
                        className="sr-only block text-sm font-medium"
                      >
                        Email
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <EnvelopeIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="block w-full rounded-md border-gray-300 bg-white/10 p-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="jdoe@example.com"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setInvalidEmail(
                              !z.string().email().safeParse(e.target.value)
                                .success
                            );
                          }}
                          value={email}
                        />
                      </div>
                      {invalidEmail && (
                        <p className="text-sm text-red-500">invalid email</p>
                      )}
                    </>
                  )}
                  <button
                    className="mt-4 w-full rounded-lg bg-indigo-600/80 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-600/80"
                    disabled={
                      (!endpoint && !email) ||
                      (showEmail && !email) ||
                      invalidEndpoint ||
                      invalidEmail
                    }
                    onClick={handleSubmit}
                  >
                    submit
                  </button>
                </div>
                <p className="text-center text-sm text-white/70 ">
                  {showEmail ? (
                    <>
                      {!endpoint && !bottomText && <>no endpoint? lame.</>}
                      {bottomText}
                    </>
                  ) : (
                    <>
                      <span
                        className="cursor-pointer hover:text-indigo-500 hover:underline"
                        onClick={() => setShowEmail(true)}
                      >
                        where do i put my email?
                      </span>
                    </>
                  )}
                </p>
              </>
            ) : (
              <h3 className="text-center text-2xl font-bold">
                thanks for joining the waitlist!
              </h3>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
