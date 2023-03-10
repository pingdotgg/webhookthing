import { CheckIcon, ClipboardIcon, PlayIcon } from "@heroicons/react/20/solid";
import { ClipboardIcon as ClipboardIconOutline } from "@heroicons/react/24/outline";

import Head from "next/head";
import { useEffect, useState } from "react";

import type { NextPage } from "next";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const useTemp = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [copied, timeout]);
  return [copied, () => setCopied(true)] as [boolean, () => void];
};

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useTemp();

  useEffect(() => {
    // check local storage for open
    const openFromStorage = window.localStorage.getItem("hasClickedRun");
    if (openFromStorage) {
      setOpen(true);
    }
  }, []);

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
          "relative z-10 flex min-h-screen flex-col items-center justify-center transition-all duration-1000 ease-in-out",
          open ? "bg-gradient-to-br from-indigo-800/40 " : "bg-white"
        )}
      >
        <div className="container flex h-full w-full flex-col items-center justify-center gap-12 px-4 py-16">
          {!open ? (
            <button
              className="flex items-center justify-center gap-1 rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-600 shadow-sm hover:text-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 disabled:hover:text-gray-400 disabled:hover:shadow-sm"
              onClick={() => {
                setOpen(true);
                window.localStorage.setItem("hasClickedRun", "true");
              }}
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
                  <div
                    className={classNames(
                      "flex animate-fade-in items-center gap-2"
                    )}
                  >
                    <div className="w-full animate-delayed-fade-in rounded-md bg-gray-900 p-2 text-white">
                      <div className="flex items-center justify-between px-2 py-1">
                        <pre>{`npx webhookthing`}</pre>
                        <div className="flex gap-1">
                          <button
                            className="group"
                            onClick={() => {
                              void navigator.clipboard.writeText(
                                "npx webhookthing"
                              );
                              setCopied();
                            }}
                          >
                            {copied ? (
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <>
                                <ClipboardIconOutline className="block h-4 w-4 group-hover:hidden" />
                                <ClipboardIcon className="hidden h-4 w-4 group-hover:block" />
                              </>
                            )}
                          </button>
                        </div>
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
