import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { SettingsPageLayout } from "./layout";

export const GeneralSettingsPage = () => {
  const utils = trpc.useContext();
  const [newUrl, setNewUrl] = useState("");

  const { mutate: updateUrl } = trpc.useMutation(
    "settings.update-main-forwarding-url",
    {
      onSuccess() {
        utils.invalidateQueries(["settings.get-main-forwarding-url"]);
      },
    }
  );

  const { data: mainFwdUrl, isLoading } = trpc.useQuery(
    ["settings.get-main-forwarding-url"],
    {
      onSuccess(data) {
        setNewUrl(data ?? "");
      },
    }
  );

  if (!mainFwdUrl || isLoading) return null;

  return (
    <SettingsPageLayout>
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <label
            htmlFor="fwd-url"
            className="block text-sm font-medium text-gray-700"
          >
            Main Forwarding URL
          </label>
          <input
            type="text"
            name="fwd-url"
            id="fwd-url"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            value={newUrl}
            onChange={(e) => {
              setNewUrl(e.target.value);
            }}
          />
          <button onClick={() => updateUrl({ newUrl })}>Save Changes</button>
        </div>
      </div>
    </SettingsPageLayout>
  );
};

export default GeneralSettingsPage;
