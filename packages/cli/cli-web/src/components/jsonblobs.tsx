import { cliApi } from "../utils/api";

export const JsonBlobs = () => {
  const { data } = cliApi.getBlobs.useQuery();

  return <div>{data?.map((blob) => blob)}</div>;
};
