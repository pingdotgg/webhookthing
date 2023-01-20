import { useState } from "react";
import { classNames } from "../utils/classnames";
import { useCurrentUrl } from "../utils/useCurrentUrl";

export const EndpointSetting = () => {
  const [storedEndpoint, setStoredEndpoint] = useCurrentUrl();
  const [endpoint, setEndpoint] = useState<string>(storedEndpoint);

  const changed = storedEndpoint !== endpoint;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Settings
        </h3>
      </div>
      <div className="relative flex flex-col items-start gap-x-2">
        <label
          htmlFor="endpoint"
          className="block text-sm font-medium text-gray-700"
        >
          Endpoint
        </label>
        <input
          type="text"
          name="endpoint"
          id="endpoint"
          className="mt-1 block w-full rounded-md border-gray-300 pr-12 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={endpoint}
          onChange={(e) => {
            setEndpoint(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <button
          type="button"
          className={classNames(
            "flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            changed ? "" : "invisible"
          )}
          onClick={() => setStoredEndpoint(endpoint)}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
