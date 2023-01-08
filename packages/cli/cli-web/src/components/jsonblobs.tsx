import { cliApi } from "../utils/api";

export const JsonBlobs = () => {
  const { data } = cliApi.getBlobs.useQuery();

  const { mutate } = cliApi.runFile.useMutation();

  return (
    <div>
      <h2 className="text-2xl font-bold">JSON Blobs</h2>
      <div className="font-light">{"(put json files in .captain/hooks)"}</div>

      <div className="py-2" />
      <div className="max-w-2xl">
        {data?.map((blob) => (
          <div key={blob} className="flex justify-between gap-4">
            <div className="text-xl">{blob}</div>
            <button
              onClick={() => {
                mutate({ file: blob, url: "localhost:3000" });
              }}
              className="rounded bg-slate-600/80 p-2 px-3 hover:bg-slate-500"
            >
              Run Locally
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
