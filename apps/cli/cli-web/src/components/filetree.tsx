import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './common/accordion';
import { classNames } from '../utils/classnames';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { createZodFetcher } from 'zod-fetch';

const fetchWithZod = createZodFetcher();

const GHResponseSchema = z.object({
  sha: z.string(),
  url: z.string(),
  tree: z.array(
    z.union([
      z.object({
        path: z.string(),
        mode: z.string(),
        type: z.literal('tree'),
        sha: z.string(),
        url: z.string(),
      }),
      z.object({
        path: z.string(),
        mode: z.string(),
        type: z.literal('blob'),
        sha: z.string(),
        url: z.string(),
        size: z.number(),
      }),
    ])
  ),
  truncated: z.boolean(),
});

type GHResponse = z.infer<typeof GHResponseSchema>;

/**
 * get /hooks sha from gh api then https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/{sha}?recursive=1
 *
 * eg: https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/main?recursive=1 to get sha, then https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/5ca62d06afaa21f4dd705bacea021b02f64d61bd?recursive=1 to get data
 */
const MOCK_SAMPLE_HOOKS_FROM_GH_API: GHResponse = {
  sha: '5ca62d06afaa21f4dd705bacea021b02f64d61bd',
  url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/5ca62d06afaa21f4dd705bacea021b02f64d61bd',
  tree: [
    {
      path: 'discord',
      mode: '040000',
      type: 'tree',
      sha: '15d4cff6a75d887b27a6813475df418079b3d448',
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/15d4cff6a75d887b27a6813475df418079b3d448',
    },
    {
      path: 'discord/discord_webhook.json',
      mode: '100644',
      type: 'blob',
      sha: '55c966e2c2ab1643a47af5faed674601a19481d3',
      size: 960,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/55c966e2c2ab1643a47af5faed674601a19481d3',
    },
    {
      path: 'github',
      mode: '040000',
      type: 'tree',
      sha: 'adf9360cd7dd204b4e84e9b51bdc4e8051014a7e',
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/adf9360cd7dd204b4e84e9b51bdc4e8051014a7e',
    },
    {
      path: 'github/github_pr_opened.json',
      mode: '100644',
      type: 'blob',
      sha: '7a6a23c347c30474364908ccee90305bc2054a27',
      size: 28507,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/7a6a23c347c30474364908ccee90305bc2054a27',
    },
    {
      path: 'slack',
      mode: '040000',
      type: 'tree',
      sha: '614b41b234de58e2becc5e1b5f9ce6788829c2a2',
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/614b41b234de58e2becc5e1b5f9ce6788829c2a2',
    },
    {
      path: 'slack/slack_channel_message.json',
      mode: '100644',
      type: 'blob',
      sha: 'fae6b38ba189d08e7a7daf477e5da78033961ca0',
      size: 450,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/fae6b38ba189d08e7a7daf477e5da78033961ca0',
    },
    {
      path: 'stripe',
      mode: '040000',
      type: 'tree',
      sha: '5adc1936c3c3404a0461b7d81280e5c17b2d70e1',
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/5adc1936c3c3404a0461b7d81280e5c17b2d70e1',
    },
    {
      path: 'stripe/payment',
      mode: '040000',
      type: 'tree',
      sha: 'f89c34deab0cd7c5b2d5458889af497f9363c7d0',
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/f89c34deab0cd7c5b2d5458889af497f9363c7d0',
    },
    {
      path: 'stripe/payment/stripe_payment_failed_nested.json',
      mode: '100644',
      type: 'blob',
      sha: 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391',
      size: 0,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/e69de29bb2d1d6434b8b29ae775ad8c2e48c5391',
    },
    {
      path: 'stripe/payment/stripe_payment_succeeded_nested.json',
      mode: '100644',
      type: 'blob',
      sha: 'ba0fd7c948bb0482728323084c20dc232bef7349',
      size: 6445,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/ba0fd7c948bb0482728323084c20dc232bef7349',
    },
    {
      path: 'stripe/stripe_payment_failed.json',
      mode: '100644',
      type: 'blob',
      sha: 'ddfff0a8767bcc92ffa96197721afce0f9402b9d',
      size: 12892,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/ddfff0a8767bcc92ffa96197721afce0f9402b9d',
    },
    {
      path: 'stripe/stripe_payment_succeeded.json',
      mode: '100644',
      type: 'blob',
      sha: 'ba0fd7c948bb0482728323084c20dc232bef7349',
      size: 6445,
      url: 'https://api.github.com/repos/bdsqqq/sample_hooks/git/blobs/ba0fd7c948bb0482728323084c20dc232bef7349',
    },
  ],
  truncated: false,
};

const convertToTree = (response: GHResponse) => {
  const tree = response.tree.reduce<HookTree>((acc, entry) => {
    const { path, type } = entry;
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];

    let currentLevel = acc;
    for (const part of parts) {
      const existingDir = currentLevel.find((item) => item.name === part);
      if (existingDir && 'children' in existingDir) {
        currentLevel = existingDir.children;
      } else {
        if (type === 'blob') {
          const hook: Hook = {
            name: fileName,
          };
          currentLevel.push(hook);
        }

        if (type === 'tree') {
          const newDir: Dir = {
            name: part,
            children: [],
          };
          currentLevel.push(newDir);
          currentLevel = newDir.children;
        }
      }
    }

    return acc;
  }, []);

  return tree;
};

const MOCK_SAMPLE_HOOKS_WiTH_JUST_NAMES = [
  {
    name: 'stripe',
    prettyName: 'Stripe',

    children: [
      {
        name: 'stripe_payment',
        prettyName: 'Payment',
        children: [
          {
            name: 'stripe_payment_succeeded_nested.json',
            prettyName: 'Payment Succeeded nested',
          },
          {
            name: 'stripe_payment_failed_nested.json',
            prettyName: 'Payment Failed nested',
          },
        ],
      },

      {
        name: 'stripe_payment_succeeded.json',
        prettyName: 'Payment Succeeded',
      },

      {
        name: 'stripe_payment_failed.json',
        prettyName: 'Payment Failed',
      },
    ],
  },
  {
    name: 'github',
    prettyName: 'GitHub',

    children: [
      {
        name: 'github_pull_request_opened.json',
        prettyName: 'Pull request opened',
      },
      {
        name: 'github_pull_request_closed.json',
        prettyName: 'Pull request closed',
      },
    ],
  },
  {
    name: 'slack',
    prettyName: 'Slack',

    children: [
      {
        name: 'slack_channel_message.json',
        prettyName: 'Channel message',
      },
    ],
  },
];

type Hook = {
  name: string;
};

type Dir = {
  name: string;
  children: (Dir | Hook)[];
};

type HookTree = (Dir | Hook)[];

const recurseIntoAccordions = (
  hookTree: HookTree,
  nestedness = 0,
  {
    selectedHooks,
    selectHook,
    unselectHook,
  }: {
    selectedHooks: SampleHookStore['selectedHooks'];
    selectHook: SampleHookStore['selectHook'];
    unselectHook: SampleHookStore['unselectHook'];
  }
) => {
  const checkIfAllRecursiveChildrenSelected = (
    entry: Dir,
    safetyCounter = 0
  ): boolean => {
    if (safetyCounter > 100) {
      throw new Error('got way too deep in a recursion');
    }

    return entry.children.every((child) => {
      if ('children' in child) {
        return checkIfAllRecursiveChildrenSelected(child, safetyCounter + 1);
      }

      return selectedHooks.includes(child.name);
    });
  };

  const checkIfSomeRecursiveChildrenSelected = (
    entry: Dir,
    safetyCounter = 0
  ): boolean => {
    return entry.children.some((child) => {
      if (safetyCounter > 100) {
        throw new Error('got way too deep in a recursion');
      }

      if ('children' in child) {
        return checkIfSomeRecursiveChildrenSelected(child, safetyCounter + 1);
      }

      return selectedHooks.includes(child.name);
    });
  };

  const howManyRecursiveChildrenSelected = (
    entry: Dir,
    safetyCounter = 0
  ): number => {
    if (safetyCounter > 100) {
      throw new Error('got way too deep in a recursion');
    }

    return entry.children.reduce((acc, child) => {
      if ('children' in child) {
        return acc + howManyRecursiveChildrenSelected(child, safetyCounter + 1);
      }

      return acc + (selectedHooks.includes(child.name) ? 1 : 0);
    }, 0);
  };

  const recursivelySelectAllChildren = (entry: Dir) => {
    entry.children.forEach((child) => {
      if ('children' in child) {
        recursivelySelectAllChildren(child);
      } else {
        selectHook(child.name);
      }
    });
  };

  const recursivelyUnselectAllChildren = (entry: Dir) => {
    entry.children.forEach((child) => {
      if ('children' in child) {
        recursivelyUnselectAllChildren(child);
      } else {
        unselectHook(child.name);
      }
    });
  };

  return hookTree.map((entry) => {
    if ('children' in entry) {
      const howManyChildrenSelected = howManyRecursiveChildrenSelected(entry);
      const areSomeChildrenSelected = howManyChildrenSelected > 0;
      const areAllChildrenSelected = areSomeChildrenSelected
        ? checkIfAllRecursiveChildrenSelected(entry)
        : false; // no need to check if all are selected if we know none is.

      return (
        <AccordionItem
          className="relative border-b-0"
          style={{
            marginLeft: nestedness && '1rem',
          }}
          key={entry.name}
          value={entry.name}
        >
          <div className="flex items-center gap-1">
            <Checkbox
              checked={
                areAllChildrenSelected
                  ? true
                  : areSomeChildrenSelected
                  ? 'indeterminate'
                  : false
              }
              onCheckedChange={() => {
                if (areAllChildrenSelected) {
                  recursivelyUnselectAllChildren(entry);
                } else {
                  recursivelySelectAllChildren(entry);
                }
              }}
            />
            <AccordionTrigger className="m-0 p-0 text-sm">
              <div className="flex gap-1">
                {entry.name}
                <Tooltip
                  content={`${howManyChildrenSelected} children selected`}
                >
                  <div
                    className={classNames(
                      'items-center rounded bg-gray-200 px-2 text-xs text-gray-600',
                      howManyChildrenSelected < 1 ? 'hidden' : 'flex'
                    )}
                  >
                    {howManyChildrenSelected}
                  </div>
                </Tooltip>
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent>
            {recurseIntoAccordions(entry.children, nestedness + 1, {
              selectedHooks,
              selectHook,
              unselectHook,
            })}
          </AccordionContent>
        </AccordionItem>
      );
    } else {
      const isSelected = selectedHooks.includes(entry.name);
      return (
        <div
          className="flex items-center gap-1 py-1 text-sm"
          style={{
            marginLeft: nestedness && '1rem',
          }}
          key={entry.name}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => {
              if (isSelected) {
                unselectHook(entry.name);
              } else {
                selectHook(entry.name);
              }
            }}
          />
          {entry.name}
        </div>
      );
    }
  });
};

export const FileTree = ({ hookTree }: { hookTree: HookTree }) => {
  const { selectedHooks, selectHook, unselectHook } = useSampleHooksStore();

  return (
    <Accordion type="multiple">
      {recurseIntoAccordions(hookTree, undefined, {
        selectedHooks,
        selectHook,
        unselectHook,
      })}
    </Accordion>
  );
};

import { create } from 'zustand';
import { Checkbox } from './common/checkbox';
import { Tooltip } from './common/tooltip';

type SampleHookStore = {
  selectedHooks: string[];
  selectHook: (hookName: string) => void;
  unselectHook: (hookName: string) => void;
  clearSelectedHooks: () => void;
};

export const useSampleHooksStore = create<SampleHookStore>((set) => ({
  selectedHooks: [],
  selectHook: (hook) =>
    set((state) => {
      if (state.selectedHooks.includes(hook))
        return { selectedHooks: state.selectedHooks };

      return {
        selectedHooks: [...state.selectedHooks, hook],
      };
    }),
  unselectHook: (hook) =>
    set((state) => {
      if (!state.selectedHooks.includes(hook))
        return { selectedHooks: state.selectedHooks };
      return {
        selectedHooks: state.selectedHooks.filter((h) => h !== hook),
      };
    }),
  clearSelectedHooks: () => set({ selectedHooks: [] }),
}));

const getHooksFromGH = async () => {
  const repo = await fetchWithZod(
    GHResponseSchema,
    'https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/main'
  );

  const hooksFolderSha = repo.tree.find((entry) => entry.path === 'hooks')?.sha;

  if (!hooksFolderSha) {
    throw new Error('no hooks folder found');
  }

  const hooksFolder = await fetchWithZod(
    GHResponseSchema,
    `https://api.github.com/repos/bdsqqq/sample_hooks/git/trees/${hooksFolderSha}?recursive=1`
  );

  return convertToTree(hooksFolder);
};

export const TestingFileTree = () => {
  const { selectedHooks } = useSampleHooksStore();

  const { data, isLoading } = useQuery({
    queryKey: ['hooks'],
    queryFn: () => getHooksFromGH(),
  });

  if (isLoading) return <div>{`loading...`}</div>;
  if (!data) return <div>{`no hooks found?? something went very wrong`}</div>;

  return (
    <>
      <FileTree hookTree={data} />

      <pre>{JSON.stringify(selectedHooks, null, 2)}</pre>
    </>
  );
};
