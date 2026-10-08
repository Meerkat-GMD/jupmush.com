// Text comes from PaperVillage/docs/itch/store-page.md (English description).

export const studio = {
  name: 'Jupiter Mushroom Association',
  email: 'gmd1356@jupmush.com',
  tagline: 'We make small, warm and slightly strange games.',
  about:
    'Jupiter Mushroom Association is a small independent game studio. We like fairy tales, paper craft and rules you can hold in your head, and we build games where a careful plan feels cozy rather than cold.',
}

export type Screenshot = { file: string; alt: string }

export const game = {
  title: 'The Night-Eating Wolf and the Paper Village',
  capsule: '/images/capsule.jpg',
  shortDescription:
    'Unfold paper houses on your board and cross the night against the wolf that eats it.',
  status: 'In development',
  developer: studio.name,
  tags: ['Deckbuilding', 'Roguelite', 'Card Game', 'Turn-Based', 'Strategy', 'Cozy', 'Fairy Tale'],
  screenshots: [
    { file: '01-title', alt: 'Title screen: a paper village glowing at night under a starry wolf that swallows the sky.' },
    { file: '02-character', alt: 'Character select: Red Riding Hood folds a glowing paper house beside her starting bag.' },
    { file: '03-placement', alt: 'Battle: houses on a grid board with a preview of what placing a card here will do.' },
    { file: '04-wolf', alt: 'Battle against the wolf: tiles glow red where the next attack lands.' },
    { file: '05-reward', alt: 'Reward screen: choose one of three new cards for your bag.' },
    { file: '06-route', alt: 'Road map: a dirt path through a papercraft forest with an engraver, treasure and a spell library.' },
    { file: '07-insight', alt: 'Insight on the Road: choose one of three new powers such as expanding the village.' },
  ] satisfies Screenshot[],
  lead: 'Find the pieces of the sun, and cross the night with the help of your neighbours.',
  story: [
    'A wolf is coming that swallows the night sky and the villages beneath it. When it bites into the night, the forest and the road under the stars vanish too. The alley that smelled of fresh bread yesterday is nowhere today.',
    'From the eaten night, strange monsters crawl out and block the road. Heroes from the tales where someone faces a wolf set out to find the pieces of the sun, the power to stand against it. Each village they save hands them a small piece of its life, an ember from the oven or a ladle of water from the well, and that piece becomes a paper house card.',
  ],
  pillars: [
    {
      title: 'Choose who walks the night.',
      body: 'Play as Red Riding Hood, who folds those gifts into paper houses with the magic her grandmother taught her. The third of the Three Little Pigs and Víðarr of the Norse myths will join later, each with their own board and their own magic.',
    },
    {
      title: 'When the road is blocked, unfold your village.',
      body: 'Set your bag down and lay out a card. A roof rises, windows open, and the chimney lights up. In the middle of a lonely road, a village appears to fight beside you.',
    },
  ],
  features: [
    {
      title: 'Where you place a house matters.',
      body: 'Oven Houses build up Heat, Pinwheels hit harder for every other pinwheel in the village, and a Forge strengthens the houses around it. Your village starts on a 4×4 board and can grow to 5×5.',
    },
    {
      title: 'Monsters you can read.',
      body: 'Each monster born from the eaten night strikes by one rule. The ground glows red where the next blow lands.',
    },
    {
      title: 'See the outcome before you commit.',
      body: 'Hold a card over a tile to preview the damage, Block and actions it will bring this turn.',
    },
    {
      title: 'A road between battles.',
      body: 'Pick your path past engravers, spell libraries, shops, treasure and campfires. Fold new houses, carve inscriptions into your cards and gain Insight on the Road.',
    },
    {
      title: 'Nine battles, one wolf.',
      body: 'Eight monsters stand on the road before the night-eating wolf, whose attacks change as it weakens.',
    },
  ],
  languages: ['English', 'Korean'],
  controls: [
    'Drag cards from your hand onto the board',
    'Drag houses to move them; click a house to inspect it',
    'E: end turn · Space: speed up · Esc: cancel',
  ],
}
