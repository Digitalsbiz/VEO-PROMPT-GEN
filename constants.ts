
export interface Template {
    id: string;
    name: string;
    template: string;
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
}

export const ADMIN_EMAIL = 'admin@example.com';


export const TEMPLATES: Template[] = [
    {
        id: 'crate-opening',
        name: '1. Crate-Opening Product Launch',
        template: `{
  "description": "Photorealistic cinematic sequence set in a pristine futuristic showroom. A sealed {{BRAND_NAME}}-branded crate rests center stage, softly illuminated. The crate vibrates gently—then unlocks with a soft *click*. As it opens, a wave of elegant visual energy bursts outward. Inside, {{PRODUCT_NAME}} components begin assembling mid-air with precision and elegance: {{PRODUCT_ELEMENTS}}. The entire scene feels like a ritual of innovation and refinement, showcasing the product's essence without using any text.",
  "style": "photorealistic cinematic, premium minimalism",
  "camera": "starts with a slow push-in on the crate, then orbits as panels open; transitions into top-down reveal as products assemble mid-air",
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
        template: `{
  "description": "A sweeping aerial shot glides over misty mountains and vast emerald valleys. Ancient stone ruins rise from the earth, bathed in golden sunrise. At the center of a grand courtyard, a colossal stone altar rests — its carvings pulsing faintly. As a deep choir hums, the stone cracks apart to reveal {{PRODUCT_NAME}}, floating in a sphere of golden light. Runes swirl around it, casting beams into the sky. Far away, kingdoms awaken — banners unfurl, waterfalls surge, dragons soar past towering citadels. Magic storms spiral over oceans as the world reacts to the relic’s return. Knights, wizards, and entire armies gather at the altar in awe. The camera sweeps in as the product descends gently onto a pedestal made of crystal, its glow illuminating the faces of those gathered. The world has changed forever.",
  "style": "cinematic, high-fantasy, ultra-realistic magical realism",
  "camera": "starts with a sweeping aerial dolly over the landscape; dives down to circle the altar; orbiting crane shot around the relic as magic erupts; fast aerial pullbacks to reveal entire world transformations; ends with a slow dramatic zoom on product",
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
        template: `{
  "description": "Nighttime in a neon-lit city — rain slick streets reflect holographic ads. A black briefcase handcuffed to an agent’s wrist cuts through a crowded market. Surveillance drones track him. Suddenly, a high-speed chase erupts — parkour over rooftops, weaving through traffic, sprinting down subway tunnels. The briefcase hums louder and louder until the agent bursts into a rooftop helipad surrounded by skyscrapers. A stealth chopper hovers overhead, spotlight blinding. He slams the briefcase onto a table — biometric locks scan and release with a hiss. Inside, bathed in cold blue light, is {{PRODUCT_NAME}}. The city’s power grid surges, all holographic billboards flipping to its image. The agent disappears into the night as the product hovers in the air, rain cascading off its edges.",
  "style": "high-contrast, gritty neon realism, cinematic spy thriller",
  "camera": "handheld chase shots, low-angle tracking through crowds, FPV rooftop jumps, whip-pans into slow motion for critical moments, final crane-up reveal from product to full city skyline",
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
  "camera": "starts with an intimate macro shot of the bottle surface and droplets, slowly dollies back while orbiting, then cranes upward to reveal the full ethereal transformation in sweeping, graceful motion",
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
  "camera": "starts ultra close on embossed brand logo, gentle dolly out with floating camera motion, subtle parallax for depth, macro shots on key features",
  "lighting": "soft, diffused illumination with delicate reflections and shadows, evoking a calm premium feel",
  "environment": "infinite seamless white environment—no walls, no floor—just soft gradients and floating products",
  "elements": [
    "{{BRAND_NAME}}-branded box (subtle emboss, matte finish)",
    "{{PRODUCT_NAME}} with subtle edge glow animation",
    "{{KEY_FEATURES}} animating into place",
    "no extra decor—pure focus on the product"
  ],
  "motion": "Box levitates gently, opens in a slow, elegant lift. Product floats up, rotates gracefully, and assembles itself with seamless, natural motion—no sharp cuts.",
  "ending": "Perfectly assembled {{PRODUCT_NAME}} displayed in a soft white space. Brand logo fades in with delicate typography.",
  "text": "{{BRAND_NAME}} - {{PRODUCT_NAME}}",
  "keywords": [
    "{{BRAND_NAME}}",
    "{{PRODUCT_NAME}}",
    "minimalistic",
    "premium aesthetic",
    "silver, white, space gray",
    "fluid assembly",
    "elegant motion",
    "soft lighting",
    "tech reveal"
  ]
}`
    },
    {
        id: 'food-ad',
        name: '6. Dynamic Food Ad',
        template: `{
  "description": "A cinematic, vibrant shot in a sun-drenched kitchen. A {{BRAND_NAME}} {{FOOD_ITEM}} is the star. In gravity-defying slow motion, fresh ingredients twirl mid-air: {{INGREDIENTS}}. They assemble into a picture-perfect dish on a rustic wooden table, showcasing its delicious, {{TASTE_PROFILE}} nature.",
  "style": "photorealistic cinematic, sensory-rich, warm and inviting",
  "camera": "slow orbital shot from low angle upward, transitioning into an overhead top-down reveal, with extreme close-ups on textures",
  "lighting": "morning sunlight streaming through soft white curtains, gentle glow on food highlights",
  "environment": "cozy kitchen or rustic dining setting with natural textures",
  "elements": [
    "{{FOOD_ITEM}} as the centerpiece",
    "{{INGREDIENTS}} flying and swirling through the air",
    "liquid splashes (e.g., olive oil, syrup) captured in slow motion",
    "steam rising from the finished dish",
    "garnishes gently falling into place"
  ],
  "motion": "Ingredients erupt upward in a beautiful vortex, assembling the final dish mid-air before it gently lands on the plate. Camera moves through the floating elements.",
  "ending": "A beautifully arranged {{FOOD_ITEM}} sits steaming on the table, glistening in the sunlight. A final ingredient (e.g., herb, nut) rolls slowly to a stop.",
  "text": "none",
  "keywords": [
    "{{BRAND_NAME}}",
    "{{FOOD_ITEM}}",
    "food ad",
    "slow motion",
    "delicious",
    "fresh ingredients",
    "cinematic food",
    "high detail",
    "no text"
  ]
}`
    },
    {
        id: 'nature-documentary',
        name: '7. Epic Nature Documentary Scene',
        template: `{
  "description": "A sweeping, cinematic aerial shot reveals the vast, untouched landscape of {{LOCATION}}. The camera descends, finding our subject: a majestic {{ANIMAL_SUBJECT}}. We witness a breathtaking moment as the animal {{ACTION}}. The scene captures the raw beauty and drama of the natural world, highlighting {{ENVIRONMENT_DETAILS}}.",
  "style": "cinematic, ultra-realistic, epic nature documentary",
  "camera": "starts with a sweeping aerial dolly over the landscape; transitions to a long-lens ground shot to create intimacy; uses slow-motion to emphasize key actions",
  "lighting": "natural golden hour or dramatic storm lighting to enhance the mood",
  "environment": "{{LOCATION}} with rich details like {{ENVIRONMENT_DETAILS}}",
  "elements": [
    "{{ANIMAL_SUBJECT}} in its natural habitat",
    "The landscape of {{LOCATION}}",
    "Other native flora and fauna to build the ecosystem",
    "Weather elements (e.g., mist, rain, intense sun)"
  ],
  "motion": "Slow, patient camera movements. A mix of real-time and slow-motion footage to capture the intensity and grace of the animal's {{ACTION}}.",
  "ending": "The {{ANIMAL_SUBJECT}} continues its journey, disappearing into the vast landscape as the camera pulls back, leaving the viewer in awe of nature's scale.",
  "text": "none",
  "keywords": [
    "nature documentary",
    "wildlife",
    "{{ANIMAL_SUBJECT}}",
    "{{LOCATION}}",
    "cinematic",
    "epic",
    "natural world",
    "slow motion"
  ]
}`
    }
];

export const PREDEFINED_EXAMPLES: Example[] = [
    {
        id: 'tesla-cybertruck',
        name: 'Tesla Cybertruck Launch',
        templateId: 'crate-opening',
        values: {
            BRAND_NAME: 'Tesla',
            PRODUCT_NAME: 'Cybertruck',
            PRODUCT_ELEMENTS: 'Exoskeleton frame\nArmor glass panels\nCyber-style wheels',
            SUPPORTING_VISUAL_PROPS: 'Laser grid lines\nArc flashes\nMetallic dust particles',
        },
    },
    {
        id: 'dior-j-adore',
        name: `Dior J'adore Perfume`,
        templateId: 'dior-perfume',
        values: {
            BRAND_NAME: 'Dior',
            PRODUCT_NAME: `J'adore Eau de Parfum`,
        },
    },
    {
        id: 'apple-vision-pro',
        name: 'Apple Vision Pro Unboxing',
        templateId: 'tech-unboxing',
        values: {
            BRAND_NAME: 'Apple',
            PRODUCT_NAME: 'Vision Pro',
            KEY_FEATURES: 'Laminated glass front\nAluminum alloy frame\nLight Seal and Head Band clicking into place',
        },
    },
    {
        id: 'nutella-swirl',
        name: 'Nutella Breakfast Ad',
        templateId: 'food-ad',
        values: {
            BRAND_NAME: 'Nutella',
            FOOD_ITEM: 'Pancakes with Nutella',
            INGREDIENTS: 'Swirling chocolate-hazelnut spread\nRoasted hazelnuts\nFresh strawberries\nSlices of banana',
            TASTE_PROFILE: 'rich and decadent',
        }
    },
     {
        id: 'patagonia-wolf',
        name: 'Patagonia Wolf Documentary',
        templateId: 'nature-documentary',
        values: {
            LOCATION: 'Patagonia',
            ANIMAL_SUBJECT: 'Gray Wolf',
            ACTION: 'howls at the rising moon',
            ENVIRONMENT_DETAILS: 'snow-capped peaks, ancient forests, and icy blue rivers',
        }
    }
];

export const SHOWCASE_VIDEOS: ShowcaseVideo[] = [
    {
        id: 'showcase-1',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'Futuristic Product Reveal',
        description: 'A sleek, minimalist reveal perfect for high-tech products, inspired by our Crate-Opening template.',
        exampleId: 'tesla-cybertruck',
    },
    {
        id: 'showcase-2',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        title: 'Luxury Perfume Commercial',
        description: 'Capture elegance and magic with ethereal visuals, based on the Elegant Perfume Ad Style.',
        exampleId: 'dior-j-adore',
    },
    {
        id: 'showcase-3',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Epic Wildlife Scene',
        description: 'Create breathtaking nature shots that tell a powerful story, using the Nature Documentary template.',
        exampleId: 'patagonia-wolf',
    },
    {
        id: 'showcase-4',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'Dynamic Food Advertisement',
        description: 'Make mouths water with vibrant, slow-motion ingredients, built from our Dynamic Food Ad template.',
        exampleId: 'nutella-swirl',
    },
];
