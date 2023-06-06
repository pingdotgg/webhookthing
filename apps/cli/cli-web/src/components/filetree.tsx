import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./common/accordion";

export const FileTree = () => {
  return (
    <Accordion type="multiple">
      <AccordionItem value="a">
        <AccordionTrigger>Item A</AccordionTrigger>
        <AccordionContent>Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Item B</AccordionTrigger>
        <AccordionContent>Content B</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
