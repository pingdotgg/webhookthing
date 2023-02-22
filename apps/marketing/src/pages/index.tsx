import {
  ClipboardIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import Head from "next/head";
import { useState } from "react";
import { z } from "zod";

import type { NextPage } from "next";
import { classNames } from "../utils/classnames";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`webhookthing`}</title>
        <meta
          name="description"
          content="an easier way to develop with webhooks locally"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <main
        className={classNames(
          "relative z-10 flex min-h-screen flex-col items-center justify-center transition-all duration-[1500ms] ease-in-out",
          open ? "bg-gradient-to-br from-indigo-800/40 " : "bg-white"
        )}
      >
        <div className="container flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-16">
          {!open ? (
            <button
              className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 transition-colors hover:bg-indigo-600/80 hover:text-white"
              onClick={() => setOpen(true)}
            >
              {`Run`}
              <PlayIcon className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex animate-fade-in flex-col items-center justify-center">
              <h1 className="text-[3.5rem] font-medium tracking-tighter text-white sm:text-[5rem]">
                {`webhook`}
                <span className="font-extrabold text-indigo-600 ">{`thing`}</span>
              </h1>
              <div className="flex w-96 max-w-sm flex-col items-center text-center text-white">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-xl">
                    {`Run webhooks locally with 1 click.`}
                  </div>
                  {/* code block with click to copy for npx */}
                  <div className="flex items-center gap-2">
                    <div className="w-full divide-y divide-gray-600 rounded-md bg-gray-900 p-2 text-white">
                      <div className="flex items-center justify-between px-2 py-1">
                        <pre>{`npx webhookthing`}</pre>
                        <button
                          onClick={() =>
                            void navigator.clipboard.writeText(
                              "npx webhookthing"
                            )
                          }
                        >
                          <ClipboardIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {open && (
          <div className="absolute bottom-0 w-full animate-fade-in p-4 text-center text-xl text-white">
            <a className="hover:underline" href="https://docs.webhookthing.com">
              {"Docs"}
            </a>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
