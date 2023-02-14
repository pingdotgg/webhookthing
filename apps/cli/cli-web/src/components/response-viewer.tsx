import { ChevronUpIcon } from "@heroicons/react/20/solid";
import Highlight, { defaultProps } from "prism-react-renderer";
import vsDark from "prism-react-renderer/themes/vsDark";
import { useState } from "react";

import { classNames } from "../utils/classnames";

export const ResponseViewer = () => {
  const response = {
    headers: {
      "content-type": "application/json",
      "x-ratelimit-limit": "1000",
      "x-ratelimit-remaining": "999",
      "x-ratelimit-reset": "1629200000",
      "x-ratelimit-reset-after": "1629200000",
    },
    body: {
      id: "1234567890",
      name: "John Doe",
      email: "jdoe@example.com",
      phone: "123-456-7890",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
      },
    },
    extra: {
      "x-thing": "thing",
      "x-thing2": "thing2",
      "x-thing3": "thing3",
    },
  };

  const logContents =
    '[INFO] Sending hook "TestHook" to https://httpbin.org/post\n[INFO] Recieved Response:\n\n' +
    JSON.stringify(response, null, 2);

  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex max-h-96 flex-col gap-2 pt-4">
      <div className="flex flex-row items-center justify-between gap-2">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{`Log`}</h3>
        {
          // button to fold/unfold response section
          <button
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronUpIcon
              className={classNames(
                "h-6 transition duration-500 ease-in-out hover:text-indigo-600",
                expanded ? "" : "rotate-180"
              )}
            />
          </button>
        }
      </div>
      {expanded && (
        <Highlight
          {...defaultProps}
          code={logContents}
          language="json"
          theme={vsDark}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={classNames(
                className,
                "w-full overflow-auto rounded-md !bg-gray-900 p-4"
              )}
              style={style}
            >
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  );
};
