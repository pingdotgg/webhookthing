import { cliApi } from "../utils/api";

export const JsonBlobs = () => {
  const { data } = cliApi.getBlobs.useQuery();

  return (
    <div>
      <h2 className="text-2xl font-bold">JSON Blobs</h2>
      <div className="font-light">{"(put json files in .captain/hooks)"}</div>

      <div className="py-2" />
      {data?.map((blob) => (
        <div className="text-xl">{blob}</div>
      ))}
    </div>
  );
};
