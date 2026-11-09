// Selected Works data (motion.md v2 section 5). One entry per project; js/works.js
// builds the cards from it. `domains` says which domain views a project is in.
// Placeholder content until the project pages exist: the links go nowhere yet.
//
// Domain assignment (PROPOSED in motion.md, Carol to correct):
//   Aangan -> service, ux;  Nest -> service, product;  Petting Zoo -> product, ux.
// That already gives every domain two projects, so no duplicate cards are needed.

export const DOMAINS = [
  { id: 'product', title: 'Product Design' },
  { id: 'service', title: 'Service Design' },
  { id: 'ux', title: 'UX Design' },
];

const SCHOOL_LOGOS = [
  { src: 'assets/logos/iit-delhi.webp', width: 55, height: 55, className: 'card__logo' },
  { src: 'assets/logos/department-of-design.webp', width: 66, height: 55, className: 'card__logo card__logo--wide' },
];

export const PROJECTS = [
  {
    id: 'aangan',
    name: 'Aangan', // for announcements
    title: 'Aangan - A Service Design for Indian Mothers', // Figma 32:404
    description: 'Service Design for Indian Mothers facing Empty Nest Syndrome (ENS), a full service system including service blueprint, dual mobile app prototypes and a self-sustaining CSR-funded business model.', // Figma 32:403
    image: { src: 'assets/images/card-aangan.webp', alt: 'Aangan project cover', width: 533, height: 300 },
    // The third mark (Figma 32:414, "image 118") is only on the Aangan card.
    logos: [...SCHOOL_LOGOS, { src: 'assets/logos/aangan-mark.webp', width: 38, height: 69, className: 'card__logo card__logo--mark' }],
    tags: ['Service Design', 'Visual Design', 'UI/UX Design'], // Figma 32:411-413
    domains: ['service', 'ux'],
  },
  {
    id: 'nest',
    name: 'Nest',
    title: 'Nest',
    description: 'AC-as-a-Service for Urban India',
    image: { src: 'assets/images/card-nest.webp', alt: 'Nest project cover', width: 533, height: 300 },
    logos: SCHOOL_LOGOS,
    tags: ['Service Design', 'Behaviour Design'],
    domains: ['service', 'product'],
  },
  {
    id: 'petting-zoo',
    name: 'Petting Zoo',
    title: 'Petting Zoo',
    description: 'Cultural Probe Design',
    image: { src: 'assets/images/card-petting-zoo.webp', alt: 'Petting Zoo project cover', width: 533, height: 300 },
    logos: SCHOOL_LOGOS,
    tags: ['Design Experiment', 'Graphic Design'],
    domains: ['product', 'ux'],
  },
];
