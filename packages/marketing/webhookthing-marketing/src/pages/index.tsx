import Head from "next/head";
import { useState } from "react";

import type { NextPage } from "next";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const [showEmail, setShowEmail] = useState(false);

  const [endpoint, setEndpoint] = useState(undefined);
  const [email, setEmail] = useState(undefined);

  const [bottomText, setBottomText] = useState("");

  const { mutate: submit } = api.example.submitWaitlist.useMutation();
  const handleSubmit = () => {
    if (!email) {
      setShowEmail(true);
      setBottomText("ok... so we actually do want your email");
      return;
    }

    submit({ endpoint: endpoint === "" ? undefined : endpoint, email });
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-[3.5rem] font-extrabold tracking-tight text-white sm:text-[5rem]">
            webhook<span className="text-indigo-500">thing</span>
          </h1>
          <div className="flex w-96 max-w-sm flex-col gap-4 rounded-xl bg-white/10 p-6 text-white">
            <h3 className="text-2xl font-bold">join the waitlist</h3>
            <div className="flex flex-col gap-2">
              <input
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
                type="text"
                placeholder="endpoint"
                onChange={(e) => setEndpoint(e.target.value)}
                value={endpoint}
              />
              {showEmail && (
                <input
                  className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
                  type="email"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              )}
              <button
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
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
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
