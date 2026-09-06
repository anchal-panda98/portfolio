export type Plate = {
  id: string;
  name: string;
  movement: string;
  position: string;
  points: string;
  fill: string;
};

export type ProfessionalProject = {
  index: string;
  title: string;
  company: string;
  label: string;
  note: string;
};

export type Experiment = { number: string; title: string; tag: string };
export type Note = { date: string; category: string; title: string; copy: string };
export type Principle = { key: string; number: string; title: string; statement: string; detail: string };

export const portfolio = {
  identity: {
    name: 'CURIOUS ENGINEER',
    eyebrow: 'SOFTWARE ENGINEERING · SYSTEMS · PRODUCT · CURIOSITY',
    headline: { lead: 'I like understanding', emphasis: 'how things work.' },
    support: 'Software engineer interested in systems, products, and the space between the two.',
    about: [
      "I'm a software engineer who enjoys understanding systems — especially the messy space where technology meets people.",
      'Most of my professional life is spent building software. Outside of work, I tend to disappear down rabbit holes: products, technology, culture, maps, coffee, books, and occasionally ideas that have absolutely no reason to become software.',
      'Some of them do anyway.',
    ],
  },
  plates: [
    { id: 'pacific', name: 'Pacific', movement: 'north-west', position: '39° N / 144° W', points: '18,88 45,64 82,70 108,94 95,124 62,136 28,122', fill: '#a8b5a1' },
    { id: 'north-america', name: 'North American', movement: 'west', position: '44° N / 101° W', points: '108,24 164,21 190,45 182,77 153,87 128,71 105,72 94,47', fill: '#d1b08c' },
    { id: 'south-america', name: 'South American', movement: 'west', position: '18° S / 62° W', points: '188,91 216,99 224,130 204,160 190,143 178,118', fill: '#c99c78' },
    { id: 'eurasia', name: 'Eurasian', movement: 'east', position: '51° N / 72° E', points: '190,45 242,25 292,41 316,61 301,82 256,79 227,93 203,74', fill: '#b8a78b' },
    { id: 'africa', name: 'African', movement: 'north-east', position: '1° N / 18° E', points: '224,91 252,83 275,101 265,145 241,158 217,130', fill: '#a9aa8f' },
    { id: 'antarctic', name: 'Antarctic', movement: 'east', position: '77° S / 0° E', points: '120,165 176,157 225,169 263,162 302,176 279,197 210,202 152,193', fill: '#c9c4ad' },
  ] satisfies Plate[],
  professionalWork: [
    { index: '02', title: '[Professional Project]', company: '[Company]', label: 'CASE STUDY TO COME', note: '[Context, problem, responsibility, constraints, approach, architecture, trade-offs, outcome]' },
    { index: '03', title: '[Another Professional Project]', company: '[Company]', label: 'CASE STUDY TO COME', note: '[The engineering judgment behind this work belongs here.]' },
    { index: '04', title: '[A Third Project]', company: '[Company]', label: 'PLACEHOLDER', note: '[Replace this with a concise story about the system and the people it served.]' },
  ] satisfies ProfessionalProject[],
  experiments: [
    { number: '01', title: '[Interactive visualization]', tag: 'DATA / FORM' },
    { number: '02', title: '[Small Python tool]', tag: 'UTILITY / PLAY' },
    { number: '03', title: '[Simulation]', tag: 'MODEL / QUESTION' },
    { number: '04', title: '[Tiny product idea]', tag: 'PRODUCT / MAYBE' },
    { number: '05', title: '[API experiment]', tag: 'SYSTEM / EDGE' },
    { number: '06', title: '[Visual experiment]', tag: 'IMAGE / MOTION' },
  ] satisfies Experiment[],
  notes: [
    { date: '12.06.24', category: 'CULTURE', title: 'Why did Nescafé have to teach Japan to drink coffee?', copy: 'A product can be an invitation, a ritual, and a piece of infrastructure at the same time.' },
    { date: '04.05.24', category: 'INTERFACES', title: 'Why do some interfaces feel physical?', copy: 'The useful metaphor is not always the obvious one. Sometimes a little resistance is information.' },
    { date: '21.03.24', category: 'BEHAVIOUR', title: 'What happens when a technical system meets human behaviour?', copy: 'The gap between the model and the person is usually where the interesting work begins.' },
    { date: '08.02.24', category: 'MATERIALS', title: 'How did salt become more than food?', copy: 'A tiny object can carry a surprisingly large history of trade, power, and taste.' },
  ] satisfies Note[],
  principles: [
    { key: 'systems', number: '01', title: 'Systems', statement: 'Understanding how components interact.', detail: 'I look for the relationships first: what depends on what, where information bends, and which small change will travel furthest.' },
    { key: 'product', number: '02', title: 'Product', statement: 'Understanding why something should exist.', detail: 'A clear interface cannot rescue an unclear reason. I start with the question a product is helping someone answer.' },
    { key: 'engineering', number: '03', title: 'Engineering', statement: 'Turning constraints into reliable systems.', detail: 'Constraints are not an interruption to the work. They are the shape the work has to become.' },
    { key: 'curiosity', number: '04', title: 'Curiosity', statement: 'Following questions even when they are not immediately useful.', detail: 'The side path is often where a better mental model is waiting. I keep a notebook for the questions that do not fit yet.' },
  ] satisfies Principle[],
  currently: [
    { label: 'BUILDING', value: '[Current project]' },
    { label: 'LEARNING', value: '[Current topic]' },
    { label: 'READING', value: '[Current book]' },
    { label: 'THINKING ABOUT', value: '[Current question]' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'Résumé', href: '#about' },
  ],
} as const;