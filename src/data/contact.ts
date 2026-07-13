// Single source of truth for how customers reach APAC. Update here and every
// contact CTA, enquiry form, and chatbot handoff picks it up.
export const CONTACT = {
  phoneDisplay: "092128 03501",
  // E.164 for tel: links (India, drop the leading 0, prefix +91).
  phoneHref: "tel:+919212803501",
  email: "info@apacss.com",
  emailHref: "mailto:info@apacss.com",
  company: "APAC Sourcing Solutions",
  responseSla: "within one business day",
} as const;
