// Single source of truth for how customers reach APAC. Update here and every
// contact CTA, enquiry form, and chatbot handoff picks it up.
export const CONTACT = {
  // All customer-facing phone numbers. Rendered as clickable tel: links.
  phones: [
    { display: "+91 98100 07333", href: "tel:+919810007333" },
    { display: "+91 92053 00407", href: "tel:+919205300407" },
  ],
  // Primary phone, kept for any single-number call site.
  phoneDisplay: "+91 98100 07333",
  phoneHref: "tel:+919810007333",
  email: "cdmo@apacss.com",
  emailHref: "mailto:cdmo@apacss.com",
  company: "APAC Sourcing Solutions",
  responseSla: "within one business day",
} as const;
