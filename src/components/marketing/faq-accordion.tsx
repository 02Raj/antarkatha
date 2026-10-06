import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this a translation of the Gita or the Upanishads?",
    a: "No. Lessons are original English adaptations. When a verse number, translator, or Sanskrit line cannot be verified, we do not invent one.",
  },
  {
    q: "Do I need to be religious to read here?",
    a: "No. AntarKatha is for people who want a clear hour with these texts. It is not a debate forum, a guru marketplace, or a substitute for a community of practice.",
  },
  {
    q: "What does the daily lesson cost?",
    a: "Today’s featured lesson is always open, including to guests. A founding membership unlocks the rest of the library.",
  },
  {
    q: "Can I listen instead of reading?",
    a: "Yes, when an audio file exists. If it does not, you will see “Audio coming soon” rather than a broken player.",
  },
  {
    q: "Is this medical or mental-health advice?",
    a: "No. Topics such as anxiety or grief name ordinary human weather. They are not treatment, diagnosis, or a replacement for care.",
  },
];

export function FAQAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      className="hairline rounded-xl border bg-surface px-5 sm:px-8"
    >
      {faqs.map((item, index) => (
        <AccordionItem key={item.q} value={`faq-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
