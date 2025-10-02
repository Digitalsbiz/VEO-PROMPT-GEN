

export interface Template {
    id: string;
    name: string;
    template: string;
    premium?: boolean;
}

export interface Example {
    id: string;
    name: string;
    templateId: string;
    values: { [key: string]: string };
}

export interface ShowcaseVideo {
    id: string;
    videoUrl: string; // Placeholder URL
    title: string;
    description: string;
    exampleId: string;
    isPremium?: boolean;
}

export interface VisualStyle {
    id: string;
    name: string;
}

export const ADMIN_EMAIL = 'digitalsbiz@gmail.com';
export const FREE_USER_GENERATION_LIMIT = 5;

export const VISUAL_STYLES: VisualStyle[] = [
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'art-deco', name: 'Art Deco' },
    { id: 'film-noir', name: 'Film Noir' },
    { id: 'impressionism', name: 'Impressionism' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'steampunk', name: 'Steampunk' },
    { id: 'dreamy', name: 'Dreamy' },
    { id: 'gritty', name: 'Gritty' },
    { id: 'retro-futuristic', name: 'Retro Futuristic' },
];


export const TEMPLATES: Template[] = [
    {
        id: 'crate-opening',
        name: '1. Crate-Opening Product Launch',
        template: `{
  "description": "Photorealistic cinematic sequence set in a pristine futuristic showroom. A sealed {{BRAND_NAME}}-branded crate rests center stage, softly illuminated. The crate vibrates gently—then unlocks with a soft *click*. As it opens, a wave of elegant visual energy bursts outward. Inside, {{PRODUCT_NAME}} components begin assembling mid-air with precision and elegance: {{PRODUCT_ELEMENTS}}. The entire scene feels like a ritual of innovation and refinement, showcasing the product's essence without using any text.",
  "style": "photorealistic cinematic, premium minimalism",
  "camera": "starts with a dramatic extreme close-up on the crate's lock, transitions into a slow dolly push-in, then orbits as panels open; culminates in a majestic top-down crane shot to reveal products assembling mid-air",
  "lighting": "controlled, high-end ambient lighting with soft spot highlights; background glows in neutral tones (white/silver/graphite) to emphasize the product shine",
  "environment": "minimalist futuristic showroom with seamless white or metallic surfaces, ambient reflections, and subtle fog or mist to add dimensionality",
  "elements": [
    "{{BRAND_NAME}}-branded crate (matte finish, glowing seams)",
    "{{PRODUCT_NAME}}",
    "{{PRODUCT_ELEMENTS}}",
    "{{SUPPORTING_VISUAL_PROPS}}",
    "floating platform or display stand for the final product",
    "soft ambient particles and shimmer trails around moving components"
  ],
  "motion": "crate unlocks with satisfying click, panels fold away smoothly; internal elements lift into the air and assemble mid-air with slow, elegant movement; floating particles add a magical but clean touch",
  "ending": "{{PRODUCT_NAME}} is fully assembled and centered on a glowing display base, softly rotating under a spotlight. Camera pulls back as ambient light dims, leaving only the product in focus.",
  "text": "none",
  "keywords": [
    "{{BRAND_NAME}}",
    "{{PRODUCT_NAME}}",
    "crate-opening reveal",
    "floating product parts",
    "premium design",
    "elegant motion",
    "futuristic showroom",
    "photorealistic",
    "cinematic",
    "no text"
  ]
}`
    },
    {
        id: 'fantasy-epic',
        name: '2. Fantasy Epic Relic Reveal',
        premium: true,
        template: `{
  "description": "A sweeping aerial shot glides over misty mountains and vast emerald valleys. Ancient stone ruins rise from the earth, bathed in golden sunrise. At the center of a grand courtyard, a colossal stone altar rests — its carvings pulsing faintly. As a deep choir hums, the stone cracks apart to reveal {{PRODUCT_NAME}}, floating in a sphere of golden light. Runes swirl around it, casting beams into the sky. Far away, kingdoms awaken — banners unfurl, waterfalls surge, dragons soar past towering citadels. Magic storms spiral over oceans as the world reacts to the relic’s return. Knights, wizards, and entire armies gather at the altar in awe. The camera sweeps in as the product descends gently onto a pedestal made of crystal, its glow illuminating the faces of those gathered. The world has changed forever.",
  "style": "cinematic, high-fantasy, ultra-realistic magical realism",
  "camera": "opens with a grand establishing shot of the landscape using a sweeping aerial dolly; dives to circle the altar; uses an orbiting crane shot for the relic reveal as magic erupts; fast aerial pullbacks show world transformations; ends with a dramatic dolly zoom on the product, making the background expand with magical energy",
  "lighting": "warm golden dawn over landscapes; magical beams and soft volumetric god rays at altar; deep saturated colors for kingdoms; stormy blues and purples for magic surges; soft white-gold halo for final product display",
  "environment": "mountain valleys, ancient ruins, royal kingdoms, stormy oceans, magical skies",
  "elements": [
    "ancient stone altar with glowing runes",
    "{{PRODUCT_NAME}} floating in golden sphere",
    "swirling runic symbols casting light",
    "dragons flying across the sky",
    "royal citadels with banners unfurling",
    "magic lightning storms over oceans",
    "armies and citizens gathering at altar",
    "crystal pedestal for final product display"
  ],
  "motion": "landscape flyovers, altar reveal with stone breaking apart, runes spinning rapidly, magical surges across distant lands, sweeping arcs through crowds, slow-push-in for final hero shot",
  "ending": "product resting on crystal pedestal with golden halo, crowd kneeling in reverence as camera slowly pulls upward into the sky",
  "text": "none",
  "keywords": [
    "fantasy epic",
    "ancient relic",
    "mythical reveal",
    "dragons",
    "magic energy",
    "cinematic",
    "Hollywood scale",
    "{{PRODUCT_NAME}}",
    "no text"
  ]
}`
    },
    {
        id: 'action-thriller',
        name: '3. Modern-Day Action Thriller',
        premium: true,
        template: `{
  "description": "Nighttime in a neon-lit city — rain slick streets reflect holographic ads. A black briefcase handcuffed to an agent’s wrist cuts through a crowded market. Surveillance drones track him. Suddenly, a high-speed chase erupts — parkour over rooftops, weaving through traffic, sprinting down subway tunnels. The briefcase hums louder and louder until the agent bursts into a rooftop helipad surrounded by skyscrapers. A stealth chopper hovers overhead, spotlight blinding. He slams the briefcase onto a table — biometric locks scan and release with a hiss. Inside, bathed in cold blue light, is {{PRODUCT_NAME}}. The city’s power grid surges, all holographic billboards flipping to its image. The agent disappears into the night as the product hovers in the air, rain cascading off its edges.",
  "style": "high-contrast, gritty neon realism, cinematic spy thriller",
  "camera": "frantic handheld tracking shots and disorienting Dutch angles for chase sequences; low-angle tracking through crowds, FPV rooftop jumps, whip-pans into slow motion; final crane shot reveals the product, then lifts to show the full city skyline",
  "lighting": "neon pinks, blues, and greens reflecting in wet streets; harsh white spotlights from drones; cold blue glow for product reveal",
  "environment": "dense futuristic city, neon marketplaces, rooftops, helipad surrounded by skyscrapers",
  "elements": [
    "handcuffed briefcase with biometric lock",
    "parkour and chase sequences",
    "rain-soaked neon streets",
    "hovering surveillance drones",
    "stealth helicopter with spotlight",
    "holographic billboards",
    "{{PRODUCT_NAME}} hovering in cold blue light"
  ],
  "motion": "fast, chaotic chase sequences broken by slow-motion reveal beats; briefcase slamming onto table; biometric locks opening in precision animation; holographic citywide takeover",
  "ending": "product hovering mid-air over rooftop table as rain falls, surrounded by citywide holographic projection of {{PRODUCT_NAME}}",
  "text": "none",
  "keywords": [
    "spy thriller",
    "action chase",
    "neon city",
    "cinematic",
    "Hollywood-level",
    "dramatic reveal",
    "{{PRODUCT_NAME}}",
    "classified tech",
    "no text"
  ]
}`
    },
    {
        id: 'dior-perfume',
        name: '4. Elegant Perfume Ad Style',
        template: `{
  "description": "Cinematic ultra-close-up of a {{BRAND_NAME}} {{PRODUCT_NAME}} bottle resting delicately on a polished marble pedestal in an empty, misty hall. Dew-like droplets glisten on the glass. The bottle subtly shimmers-then the perfume spritzes in slow motion. From the mist, silk fabrics flow outward, forming ethereal dresses that float mid-air. Petals blossom and spiral upward, creating an enchanted garden suspended in time. Walls dissolve into open sky. A chandelier of stars assembles above. A luminous figure, representing elegance, dances through the floating petals as fragrance waves ripple through the scene. The entire space transforms into an otherworldly {{BRAND_NAME}} dreamscape. No text.",
  "style": "cinematic, elegant magical realism",
  "camera": "begins with an intimate extreme close-up on droplets, then slowly dollies back while orbiting the bottle; transitions to a sweeping crane shot that rises to reveal the full ethereal transformation in one graceful, continuous motion",
  "lighting": "soft morning light transitioning into golden glow, ending with a moonlit sparkle across the scene",
  "environment": "quiet marble hall transforms into an infinite floating garden above the clouds",
  "elements": [
    "{{BRAND_NAME}} {{PRODUCT_NAME}} bottle (logo subtly visible, glass texture detailed)",
    "slow-motion perfume spritz with shimmering particles",
    "silk fabrics flowing from mist, creating mid-air couture dresses",
    "petals blooming and swirling upward",
    "walls dissolving into sky",
    "chandelier of stars forming piece by piece",
    "luminous figure dancing through floating elements",
    "light waves symbolizing fragrance spreading gracefully",
    "reflections and refractions of light on marble and glass",
    "a seamless blend of nature and luxury aesthetics"
  ],
  "motion": "fluid, graceful chain reaction from the perfume spray-silks and petals animate in elegant slow-motion mixed with time-lapse as the world transforms around the bottle",
  "ending": "{{BRAND_NAME}} {{PRODUCT_NAME}} bottle in foreground, the surreal {{BRAND_NAME}} dreamscape floating behind it, softly glowing",
  "text": "none",
  "keywords": [
    "{{BRAND_NAME}}",
    "{{PRODUCT_NAME}}",
    "perfume transformation",
    "ethereal elegance",
    "magical realism",
    "luxury fashion",
    "floating garden",
    "silk and petals",
    "dreamscape",
    "cinematic",
    "no text"
  ]
}`
    },
    {
        id: 'tech-unboxing',
        name: '5. Minimalist Tech Unboxing',
        template: `{
  "description": "An elegant, high-end animated sequence on a seamless soft white background. A minimalist {{BRAND_NAME}}-branded box levitates gently, opening with a slow, graceful motion. The {{PRODUCT_NAME}} floats out, its key features assembling with precision. {{KEY_FEATURES}}. Silver, space gray, and ceramic white tones dominate, creating a refined, sophisticated mood. No hard cuts—only smooth, continuous movement.",
  "style": "cinematic, premium minimalism, Apple aesthetic",
  "camera": "starts with an elegant extreme close-up on the embossed brand logo; a gentle dolly out combined with a floating orbital motion for depth; transitions into intimate macro shots on key features as they assemble",
  "lighting": "soft, diffused illumination with delicate reflections and shadows, evoking a calm premium feel",
  "environment": "seamless, infinite soft white or light gray background with subtle gradients",
  "elements": [
    "{{BRAND_NAME}} box (matte texture, embossed logo)",
    "{{PRODUCT_NAME}}",
    "{{KEY_FEATURES}}",
    "gentle light refractions and lens flares",
    "subtle particle effects to enhance motion",
    "minimalist iconography for feature callouts (optional, animated)"
  ],
  "motion": "slow, deliberate, and continuous movement; box panels unfold elegantly; components assemble with magnetic precision; product gently rotates in a hero shot",
  "ending": "fully assembled {{PRODUCT_NAME}} floats in the center, perfectly lit, with a subtle shadow underneath to give it weight and presence",
  "text": "none",
  "keywords": [
    "{{BRAND_NAME}}",
    "{{PRODUCT_NAME}}",
    "tech unboxing",
    "minimalist animation",
    "premium design",
    "clean aesthetic",
    "Apple-style",
    "3D animation",
    "no text"
  ]
}`
    },
     {
        id: 'food-ad',
        name: '6. Delicious Food Ad',
        premium: true,
        template: `{
  "description": "Extreme macro shot of {{MAIN_INGREDIENT}} being prepared in slow-motion: chopped, grilled, or drizzled with sauce. Water droplets or steam rise gracefully. The camera pulls back to reveal a beautifully plated dish of {{DISH_NAME}}, with fresh ingredients like {{FRESH_GARNISHES}} scattered around. The entire scene is set on a rustic wooden table, with soft, natural light coming from a nearby window.",
  "style": "cinematic food videography, high-speed camera, macro details",
  "camera": "starts with extreme macro shots, using a probe lens to get intimate details; transitions to a slow, orbiting motion around the final plated dish; uses a top-down flat lay for the final shot",
  "lighting": "soft, natural window light; a single key light to create appetizing highlights and shadows",
  "environment": "warm, rustic kitchen or dining setting with natural textures like wood and slate",
  "elements": [
    "{{MAIN_INGREDIENT}} (close-up details)",
    "{{DISH_NAME}} (fully plated)",
    "{{FRESH_GARNISHES}}",
    "slow-motion cooking actions (sizzling, drizzling, steaming)",
    "water droplets or steam",
    "rustic wooden table and background elements"
  ],
  "motion": "ultra slow-motion for food preparation; gentle, smooth camera movements around the final dish; ingredients falling onto the plate in a controlled, artistic way",
  "ending": "a top-down shot of the perfectly arranged {{DISH_NAME}}, with a hand reaching in with a fork to take the first bite, just before contact",
  "text": "none",
  "keywords": [
    "food videography",
    "cinematic food",
    "macro shots",
    "slow-motion",
    "delicious",
    "{{DISH_NAME}}",
    "fresh ingredients",
    "no text"
  ]
}`
    }
];

export const PREDEFINED_EXAMPLES: Example[] = [
    {
        id: 'ex-smartwatch',
        name: 'Smartwatch Crate Opening',
        templateId: 'crate-opening',
        values: {
            BRAND_NAME: 'Aura',
            PRODUCT_NAME: 'Aura-Band Pro',
            PRODUCT_ELEMENTS: 'glossy black watch face, titanium alloy casing, woven nylon strap',
            SUPPORTING_VISUAL_PROPS: 'geometric light patterns, soft energy waves'
        }
    },
    {
        id: 'ex-dior-perfume',
        name: 'Dior-Style Perfume Ad',
        templateId: 'dior-perfume',
        values: {
            BRAND_NAME: 'Dior',
            PRODUCT_NAME: 'J\'adore'
        }
    },
    {
        id: 'ex-iphone-unboxing',
        name: 'Apple-Style iPhone Unboxing',
        templateId: 'tech-unboxing',
        values: {
            BRAND_NAME: 'Apple',
            PRODUCT_NAME: 'iPhone 15 Pro',
            KEY_FEATURES: 'A17 Pro Chip, Dynamic Island, Titanium Frame'
        }
    },
    {
        id: 'ex-burger-ad',
        name: 'Gourmet Burger Ad',
        templateId: 'food-ad',
        values: {
            MAIN_INGREDIENT: 'a thick, juicy beef patty',
            DISH_NAME: 'The Ultimate Bacon Cheeseburger',
            FRESH_GARNISHES: 'crispy lettuce, ripe tomatoes, melted cheddar cheese'
        }
    },
    {
        id: 'ex-relic-reveal',
        name: 'Fantasy Relic Reveal',
        templateId: 'fantasy-epic',
        values: {
            PRODUCT_NAME: 'The Chronos Sphere'
        }
    },
    {
        id: 'ex-cyber-headset',
        name: 'Cyberpunk Headset Thriller',
        templateId: 'action-thriller',
        values: {
            PRODUCT_NAME: 'Neuralink X-1 Headset'
        }
    }
];


export const SHOWCASE_VIDEOS: ShowcaseVideo[] = [
    {
        id: 'vid1',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'Aura Smartwatch',
        description: 'A futuristic crate-opening sequence revealing a sleek new smartwatch.',
        exampleId: 'ex-smartwatch'
    },
    {
        id: 'vid2',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'Fantasy Relic: The Chronos Sphere',
        description: 'An epic, world-changing reveal of a mythical artifact in a fantasy setting.',
        exampleId: 'ex-relic-reveal'
    },
    {
        id: 'vid3',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Neuralink Headset',
        description: 'A high-octane chase through a neon-drenched city to deliver a classified piece of tech.',
        exampleId: 'ex-cyber-headset'
    },
    {
        id: 'vid4',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Ultimate Cheeseburger',
        description: 'A delicious, slow-motion look at the creation of a gourmet burger.',
        exampleId: 'ex-burger-ad'
    }
];