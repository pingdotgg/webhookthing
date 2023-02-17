import { ConfigValidatorType } from "@captain/cli-core/src/update-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertObjectToKVArray = (obj: { [k: string]: any }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
};

export const convertArrayStateToObject = (
  arr: { key: string; value: string }[]
) => {
  return arr.reduce((acc: { [k: string]: string }, curr) => {
    if (curr.key) {
      acc[curr.key] = curr.value;
    }
    return acc;
  }, {});
};

export const generateConfigFromState = (state: {
  url?: string;
  headers?: { key: string; value: string }[];
  query?: { key: string; value: string }[];
}) => {
  const config: ConfigValidatorType = {};
  if (state.url) config.url = state.url;
  if (state.query?.length)
    config.query = convertArrayStateToObject(state.query ?? []);
  if (state.headers?.length)
    config.headers = convertArrayStateToObject(state.headers ?? []);
  return config;
};

export const generatePrefillFromConfig = (config: ConfigValidatorType) => {
  return {
    url: config.url,
    query: convertObjectToKVArray(config.query ?? {}),
    headers: convertObjectToKVArray(config.headers ?? {}),
  };
};
