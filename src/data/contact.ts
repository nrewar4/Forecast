// Single source of truth for how a visitor reaches APAC. Used by the CDMO page,
// the assistant's contact card, and the enquiry form.

export const CONTACT = {
  company: "APAC Sourcing Solutions",
  phone: "092128 03501",
  phoneHref: "tel:+919212803501",
  email: "info@apacss.com",
  emailHref: "mailto:info@apacss.com",
  site: "https://apacss.com/",
} as const;

// The preliminary-evaluation disclaimer shown on every route and feasibility
// output. Kept verbatim wherever technical content is presented.
export const TECH_DISCLAIMER =
  "This is a preliminary technical evaluation from public and catalog sources. It is not freedom-to-operate, patent clearance, regulatory, safety, or commercial manufacturing advice. Final route selection must be reviewed by qualified process chemists, IP counsel, regulatory experts, and EHS teams.";
