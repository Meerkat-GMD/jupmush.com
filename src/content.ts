// Night of Vargold text comes from its Steam store page (English and Korean, read from Steamworks
// on 2026-10-22). The free demo section stays off the site until the demo is out.

export type Lang = 'en' | 'ko'

export const studio = {
  email: 'gmd1356@jupmush.com',
  en: {
    name: 'Jupiter Mushroom Association',
    tagline: 'We make small, warm and slightly strange games.',
    about:
      'Jupiter Mushroom Association is a small independent game studio. We like fairy tales, paper craft and rules you can hold in your head, and we build games where a careful plan feels cozy rather than cold.',
  },
  ko: {
    name: '목성버섯연합',
    tagline: '작고 따뜻하고, 조금 이상한 게임을 만듭니다.',
    about:
      '목성버섯연합은 작은 독립 게임 스튜디오입니다. 동화와 종이 공예, 머릿속에 담아 둘 수 있는 규칙을 좋아합니다. 꼼꼼하게 세운 계획이 차갑기보다 아늑하게 느껴지는 게임을 만듭니다.',
  },
}

// Labels shared by the studio pages.
export const siteText = {
  en: { games: 'Games', about: 'About', contact: 'Contact', switchLabel: '한국어', privacy: 'Privacy Policy', contactBody: 'For questions, press or collaboration, write to us.', rights: 'All rights reserved.' },
  ko: { games: '게임', about: '소개', contact: '연락처', switchLabel: 'English', privacy: '개인정보 처리방침', contactBody: '문의, 취재, 협업 제안은 메일로 보내 주세요.', rights: 'All rights reserved.' },
}

export type Screenshot = { file: string; alt: string }

// A button appears only once its link is set.
export const vargoldLinks = {
  discord: 'https://discord.com/invite/zYHme9GxKZ',
  trailer: null as string | null,
  steam: null as string | null,
}

const shots = ['01-battle-board', '02-attack-zones', '03-stone-deck', '04-reward-pick', '05-market-day']

export const vargold = {
  path: '/games/night-of-vargold/',
  en: {
    title: 'Night of Vargold',
    genre: 'Turn-based roguelike deckbuilder',
    status: 'In development',
    shortDescription:
      'Hunt wolves that devour the night in a turn-based roguelike deckbuilder where cards become buildings. Enemies attack both you and the board. Read their attack zones, place your buildings, and turn even their destruction into part of your strategy.',
    aboutTitle: 'About the game',
    intro:
      'Night of Vargold is a single-player, turn-based roguelike deckbuilder where your cards become buildings. Place buildings and combine their effects to take on the monsters in your path.',
    features: [
      {
        title: 'Your buildings are targets, too',
        body: "Enemies attack both your character and the board. Watch the marked attack zones and move your buildings before the next strike. Losing a building isn't always a setback: effects that trigger when buildings are hit or demolished can help turn a fight in your favor.",
      },
      {
        title: 'Make every card and placement count',
        body: "Rotate buildings of different shapes to make the most of the space on your board. Combine effects that trigger when you build, or return buildings to your hand and rebuild them where they're needed. With limited actions each turn, the cards you play, their order, and where you place them all matter.",
      },
      {
        title: 'New choices in every village',
        body: "Check your travel journal for each village's enemies and rewards, then choose your next stop. Collect new cards and relics to refine your deck along the way. Expand your board to fit more buildings, recover your health, or save your gold for market day. Let what you need most guide your next destination.",
      },
    ],
    story: {
      title: 'A warm, wistful fairy tale',
      body: 'Wolves devour the night, swallowing homes and people along with it. Follow their trail to find the family they took from you. Beyond the warm glow of village lights lie lonely forests and monsters carrying fragments of the night sky.',
    },
    screenshotsTitle: 'Screenshots',
    screenshots: [
      'Battle: buildings on the board, the hand of cards and two enemies showing their next moves.',
      'Attack zones an enemy has marked on the board, with houses standing inside them.',
      'A battle against an armored knight with a hand of stone cards.',
      'The travel journal after a battle: pick one new building card.',
      'Market day: buildings, relics and helpers with their prices.',
    ].map((alt, i) => ({ file: shots[i], alt })) satisfies Screenshot[],
    joinDiscord: 'Join the Discord',
    watchTrailer: 'Watch the trailer',
    wishlist: 'Wishlist on Steam',
    communityTitle: 'Follow the journey',
    communityBody: 'Devlogs, playtests and announcements come to our Discord first.',
    titleArtAlt: 'Night of Vargold',
    heroAlt: 'Red Riding Hood stands by a lit paper village as a huge wolf made of night creeps toward it.',
  },
  ko: {
    title: 'Night of Vargold',
    genre: '턴제 로그라이크 덱빌딩',
    status: '개발 중',
    shortDescription:
      '밤을 먹는 늑대를 쫓아, 건물 카드로 싸우는 턴제 로그라이크 덱빌딩. 적은 당신뿐 아니라 건물이 놓인 보드까지 공격합니다. 공격 범위를 읽고 건물을 배치하며, 건물이 무너지는 순간까지 전략으로 활용하세요.',
    aboutTitle: '게임 소개',
    intro:
      '『Night of Vargold』은 건물 카드를 배치하며 싸우는 싱글플레이 턴제 로그라이크 덱빌딩 게임입니다. 카드로 건물을 짓고, 건물마다 가진 효과를 조합해 괴물과 맞서세요.',
    features: [
      {
        title: '건물도 공격받는 전투',
        body: '적은 캐릭터뿐 아니라 건물이 놓인 보드도 공격합니다. 미리 표시되는 공격 범위를 살피고, 건물을 옮겨 다음 공격에 대비하세요. 건물이 무너진다고 꼭 손해만 보는 것은 아닙니다. 공격받거나 철거될 때 발동하는 효과를 잘 활용하면 전투를 유리하게 풀어 갈 수 있습니다.',
      },
      {
        title: '카드 조합과 배치의 재미',
        body: '모양이 서로 다른 건물을 돌려 가며 한정된 보드에 배치하세요. 건물을 지을 때 발동하는 효과를 조합하거나, 건물을 손패로 되돌려 필요한 곳에 다시 지을 수도 있습니다. 한 턴에 쓸 수 있는 행동은 정해져 있습니다. 어떤 카드를 먼저 쓰고 건물을 어디에 놓을지, 매 턴 새로운 조합을 고민해 보세요.',
      },
      {
        title: '마을마다 기다리는 새로운 선택',
        body: '여행 일지에서 마을마다 등장하는 적과 보상을 확인하고, 다음에 갈 곳을 고르세요. 새로운 카드와 유물을 얻으며 덱을 다듬고, 보드를 넓혀 더 많은 건물을 놓을 수도 있습니다. 체력을 회복하며 한숨 돌릴지, 금화를 모아 장날을 기다릴지, 지금 필요한 것에 맞춰 길을 선택하세요.',
      },
    ],
    story: {
      title: '따뜻하지만 쓸쓸한 동화 속으로',
      body: '밤을 먹는 늑대들이 집과 사람까지 삼켜 버렸습니다. 삼켜진 가족을 찾아 늑대들의 흔적을 따라가세요. 마을의 따뜻한 불빛을 뒤로하면 쓸쓸한 숲과 밤하늘의 부스러기를 품은 괴물들이 기다립니다.',
    },
    screenshotsTitle: '스크린샷',
    screenshots: [
      '전투 화면: 건물이 놓인 보드, 손패, 다음 행동을 보여 주는 두 적.',
      '적이 보드에 표시한 공격 범위와 그 안에 선 집들.',
      '돌 카드를 손에 들고 갑옷 기사와 싸우는 전투.',
      '전투가 끝난 뒤의 여행 일지: 새 건물 카드 한 장 고르기.',
      '장날: 건물, 유물, 도우미와 그 가격.',
    ].map((alt, i) => ({ file: shots[i], alt })) satisfies Screenshot[],
    joinDiscord: 'Discord 참여하기',
    watchTrailer: '트레일러 보기',
    wishlist: 'Steam에서 찜하기',
    communityTitle: '여정을 함께해 주세요',
    communityBody: '개발 소식과 플레이테스트, 공지는 Discord에 가장 먼저 올라옵니다.',
    titleArtAlt: 'Night of Vargold',
    heroAlt: '불 켜진 종이 마을 옆에 선 빨간 모자에게 밤으로 된 거대한 늑대가 다가오는 그림.',
  },
}

export type PolicySection = { title: string; paragraphs?: string[]; list?: string[]; after?: string[]; contact?: boolean }

// Decisions behind this text: PaperVillage/docs/play-data.md (2026-10-22).
export const privacy = {
  title: 'Privacy Policy',
  game: 'Night of Vargold',
  updated: 'October 22, 2026',
  intro: [
    'This page explains the play data that Night of Vargold, made by Jupiter Mushroom Association, sends while you play, and how to turn it off. This website itself sets no cookies and runs no analytics.',
  ],
  sections: [
    {
      title: 'What the game sends',
      paragraphs: [
        'When a run ends, whether you win, lose or start a new run over it, the game sends one summary of that run:',
      ],
      list: [
        'The result of the run',
        'Your deck, relics, health and gold',
        'One step for each battle: the encounter, your deck and health going in, the number of turns, and the rewards you were offered with the one you picked',
        'The game version',
        'A random install ID, made the first time the game sends a run, and a random ID for the run',
      ],
      after: [
        'It sends no name, email address, account, device ID or Steam ID.',
      ],
    },
    {
      title: 'Why',
      paragraphs: [
        'We use these summaries only to see which cards, relics and battles are too strong or too weak, so we can balance the game and design new cards.',
      ],
    },
    {
      title: 'Which versions send it',
      paragraphs: [
        'Only the release builds we publish send play data. Development and test builds never send anything.',
      ],
    },
    {
      title: 'Where it is stored',
      paragraphs: [
        'Summaries are stored with Supabase, on servers in Seoul, South Korea. The database does not keep your IP address. Like most web services, the hosting provider may briefly hold it in its request logs.',
        'If a send fails, for example when you are offline, the run waits on your computer (up to 50 runs) and the game tries again the next time it starts.',
      ],
    },
    {
      title: 'How to turn it off',
      paragraphs: [
        'Play data is on by default. To turn it off, open Settings and set "Send play data" to Off. While it is off, the game sends nothing, not even runs that were waiting to be sent.',
      ],
    },
    {
      title: 'Finding or deleting your records',
      paragraphs: [
        'The install ID is random and names nobody, so we cannot tell which records are yours. For that reason we cannot find or delete individual records on request. Turning play data off stops every further send.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'For questions about this policy, write to us at the address below.',
      ],
      contact: true,
    },
    {
      title: 'Changes',
      paragraphs: [
        'If this policy changes, we will update this page and the date at the top.',
      ],
    },
  ] satisfies PolicySection[],
}
