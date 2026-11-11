// Selected Works data (motion.md v2 section 5). One entry per project; js/works.js
// builds the cards from it. `domains` says which domain views a project is in.
// caseStudyUrl: the project's case study page. Empty until it exists: the card image is
// then not a link, and its cursor label reads "Case study coming soon" (js/works.js).
// Set it (e.g. 'case-studies/aangan.html') and the card image becomes the link.
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
  { src: 'assets/logos/iit-delhi.webp', alt: 'Indian Institute of Technology Delhi', width: 55, height: 55, className: 'card__logo' },
  { src: 'assets/logos/department-of-design.webp', alt: 'Department of Design, IIT Delhi', width: 66, height: 55, className: 'card__logo card__logo--wide' },
];

export const PROJECTS = [
  {
    id: 'aangan',
    name: 'Aangan', // for announcements
    title: 'Aangan - A Service Design for Indian Mothers', // Figma 32:404
    description: 'Service Design for Indian Mothers facing Empty Nest Syndrome (ENS), a full service system including service blueprint, dual mobile app prototypes and a self-sustaining CSR-funded business model.', // Figma 32:403
    caseStudyUrl: '',
    image: { src: 'assets/images/card-aangan.webp', alt: 'Aangan project cover: an aerial view of a courtyard house with a tiled roof, framed by a patterned border, with the title "aangan, A Service Design Project for Urban Indian Mothers"', width: 533, height: 300 },
    // The third mark (Figma 32:414, "image 118") is only on the Aangan card. Its alt text
    // is empty until Carol names the organisation it stands for.
    logos: [...SCHOOL_LOGOS, { src: 'assets/logos/aangan-mark.webp', alt: '', width: 38, height: 69, className: 'card__logo card__logo--mark' }],
    tags: ['Service Design', 'Visual Design', 'UI/UX Design'], // Figma 32:411-413
    domains: ['service', 'ux'],
  },
  {
    id: 'nest',
    name: 'Nest',
    title: 'Nest',
    description: 'AC-as-a-Service for Urban India',
    caseStudyUrl: '',
    image: { src: 'assets/images/card-nest.webp', alt: 'Nest project cover: a pile of discarded electronics, an old television, boxes and bicycles, with the title "nest, Consumer Research, Service Design"', width: 533, height: 300 },
    logos: SCHOOL_LOGOS,
    tags: ['Service Design', 'Behaviour Design'],
    domains: ['service', 'product'],
  },
  {
    id: 'petting-zoo',
    name: 'Petting Zoo',
    title: 'Petting Zoo',
    description: 'Cultural Probe Design',
    caseStudyUrl: '',
    image: { src: 'assets/images/card-petting-zoo.webp', alt: 'The Petting Zoo project cover: scattered activity and reflection cards with animal illustrations, with the title "the Petting Zoo, Design Probe, Research Experiment"', width: 533, height: 300 },
    logos: SCHOOL_LOGOS,
    tags: ['Design Experiment', 'Graphic Design'],
    domains: ['product', 'ux'],
  },
];
