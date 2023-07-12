import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './common/accordion';
import { classNames } from '../utils/classnames';

type GHResponse = {
  sha: string;
  url: string;
  tree: (
    | {
        path: string;
        mode: string;
        type: 'tree';
        sha: string;
        url: string;
      }
    | {
        path: string;
        mode: string;
        type: 'blob';
        sha: string;
        url: string;
        size: number;
      }
  )[];
  truncated: boolean;
};

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
        const newDir: Dir = {
          name: part,
          children: [],
        };
        currentLevel.push(newDir);
        currentLevel = newDir.children;
      }
    }

    if (type === 'blob') {
      const hook: Hook = {
        name: fileName,
      };
      currentLevel.push(hook);
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

const recurseIntoAccordions = (hookTree: HookTree, nestedness = 0) => {
  const { selectedHooks, selectHook, unselectHook } = useSampleHooksStore();

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
      const areAllChildrenSelected = checkIfAllRecursiveChildrenSelected(entry);
      const areSomeChildrenSelected =
        checkIfSomeRecursiveChildrenSelected(entry);

      return (
        <AccordionItem
          style={{
            marginLeft: `${nestedness}rem`,
          }}
          key={entry.name}
          value={entry.name}
        >
          <div className="flex items-center">
            <button
              onClick={() => {
                if (areAllChildrenSelected) {
                  recursivelyUnselectAllChildren(entry);
                } else {
                  recursivelySelectAllChildren(entry);
                }
              }}
              className={classNames(
                'mr-2 inline-block h-4 w-4',
                areAllChildrenSelected
                  ? 'bg-green-500'
                  : areSomeChildrenSelected
                  ? 'bg-orange-500'
                  : 'bg-gray-500'
              )}
            />
            <AccordionTrigger>{entry.name}</AccordionTrigger>
          </div>
          <AccordionContent>
            {recurseIntoAccordions(entry.children, nestedness + 1)}
          </AccordionContent>
        </AccordionItem>
      );
    } else {
      const isSelected = selectedHooks.includes(entry.name);
      return (
        <div
          className="flex items-center"
          style={{ marginLeft: `${nestedness}rem` }}
          key={entry.name}
        >
          <button
            onClick={() => {
              if (isSelected) {
                unselectHook(entry.name);
              } else {
                selectHook(entry.name);
              }
            }}
            className={classNames(
              'mr-2 inline-block h-4 w-4',
              isSelected ? 'bg-green-500' : 'bg-gray-500'
            )}
          />
          {entry.name}
        </div>
      );
    }
  });
};

export const FileTree = ({ hookTree }: { hookTree: HookTree }) => {
  return (
    <Accordion type="multiple">{recurseIntoAccordions(hookTree)}</Accordion>
  );
};

import { create } from 'zustand';

export const useSampleHooksStore = create<{
  initialSampleHooks: Hook[] | undefined;
  setInitialSampleHooks: (hooks: Hook[]) => void;
  selectedHooks: string[];
  selectHook: (hookName: string) => void;
  unselectHook: (hookName: string) => void;
  clearSelectedHooks: () => void;
}>((set) => ({
  initialSampleHooks: undefined,
  setInitialSampleHooks: (hooks) => set({ initialSampleHooks: hooks }),
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

export const TestingFileTree = () => {
  const { initialSampleHooks, setInitialSampleHooks, selectedHooks } =
    useSampleHooksStore();

  // pretend this is a TRPC query that fetches from gh;
  useEffect(() => {
    setInitialSampleHooks(convertToTree(MOCK_SAMPLE_HOOKS_FROM_GH_API));
  }, [setInitialSampleHooks]);

  if (!initialSampleHooks) return <div>{`loading...`}</div>;
  return (
    <>
      <FileTree hookTree={initialSampleHooks} />

      <pre>{JSON.stringify(selectedHooks, null, 2)}</pre>
    </>
  );
};
