import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./common/accordion";

const MOCK_SAMPLE_HOOKS_WiTH_JUST_NAMES = [
  {
    name: "stripe",
    prettyName: "Stripe",

    children: [
      {
        name: "stripe_payment",
        prettyName: "Payment",
        children: [
          {
            name: "stripe_payment_succeeded_nested.json",
            prettyName: "Payment Succeeded nested",
          },
          {
            name: "stripe_payment_failed_nested.json",
            prettyName: "Payment Failed nested",
          },
        ],
      },

      {
        name: "stripe_payment_succeeded.json",
        prettyName: "Payment Succeeded",
      },

      {
        name: "stripe_payment_failed.json",
        prettyName: "Payment Failed",
      },
    ],
  },
  {
    name: "github",
    prettyName: "GitHub",

    children: [
      {
        name: "github_pull_request_opened.json",
        prettyName: "Pull request opened",
      },
      {
        name: "github_pull_request_closed.json",
        prettyName: "Pull request closed",
      },
    ],
  },
  {
    name: "slack",
    prettyName: "Slack",

    children: [
      {
        name: "slack_channel_message.json",
        prettyName: "Channel message",
      },
    ],
  },
];

type File = {
  name: string;
  prettyName: string;
};

type Dir = {
  name: string;
  prettyName: string;
  children: (Dir | File)[];
};

type HookTree = (Dir | File)[];

const recurseIntoAccordions = (hookTree: HookTree, nestedness = 0) => {
  return hookTree.map((entry) => {
    if ("children" in entry) {
      return (
        <AccordionItem
          style={{
            marginLeft: `${nestedness}rem`,
          }}
          key={entry.name}
          value={entry.prettyName}
        >
          <AccordionTrigger>{entry.prettyName}</AccordionTrigger>
          <AccordionContent>
            {recurseIntoAccordions(entry.children, nestedness + 1)}
          </AccordionContent>
        </AccordionItem>
      );
    } else {
      return (
        <div style={{ marginLeft: `${nestedness}rem` }} key={entry.name}>
          {entry.prettyName}
        </div>
      );
    }
  });
};

export const FileTree = () => {
  return (
    <Accordion type="multiple">
      {recurseIntoAccordions(MOCK_SAMPLE_HOOKS_WiTH_JUST_NAMES)}
    </Accordion>
  );
};
