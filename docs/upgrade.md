You are working on:

https://github.com/joshualparris/ResearchAtlas

Task:
Add a second wave of excellent Google Drive deep research documents to Research Atlas.

Important:
- Do not remove existing entries.
- Append these new entries to src/data/researchManifest.ts.
- These are real Google Drive / Google Docs links.
- Do not replace them with placeholders.
- These documents are not already covered in the current manifest.
- Keep the existing ResearchDocument type.
- Use the existing categories only:
  "Health", "Mind", "Family", "Faith", "Tech", "Life", "Archive"
- Add or support new region names as strings.
- If the map currently clips at the bottom/right, expand the world bounds so entries with larger x/y coordinates are reachable.
- Run npm run build and fix any TypeScript errors.

Add these new modules/regions:

1. Body Systems Lab
Region for practical body, pain, movement, water, environment and health risk research.

2. ADHD Focus Grove
Region for attention, screens, neurodiversity, disability, and self-understanding.

3. Parenting Haven
Region for Sylvie, Elias, home support, meltdowns, education and family rhythms.

4. Marriage & Connection Garden
Region for emotional intimacy, Christian marriage, relationship dynamics and restoration.

5. Tech & AI Citadel Expansion
Region for AI security, game building, future work, DARPA, electronics and systems thinking.

6. Life Analytics Observatory
Region for personal data, ChatGPT/YouTube analysis, whole-life synthesis and future planning.

7. Places & Calling Map
Region for Dubbo, Bendigo, Burrabadine, Cornerstone, DCS, moving, community and place-based research.

8. Work & Vocation Guildhall
Region for career, operational fit, school/work reports and future work pathways.

Append these entries:

[
  {
    id: "heat-day-protocol",
    title: "Heat Day Protocol",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["heat", "health", "routine", "safety"],
    summary: "A practical protocol for managing hot days, energy, hydration and family resilience.",
    url: "https://docs.google.com/document/d/1tlX5YGOCciWIKihjYEvGhu6Xgk3NdMpZxiciTv9hDdc/edit?usp=sharing",
    type: "google-doc",
    x: 170,
    y: 1260
  },
  {
    id: "vitel-water",
    title: "Vitel Water",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["water", "health", "hydration", "environment"],
    summary: "Research notes on Vitel Water and its relevance to health, hydration and household decisions.",
    url: "https://docs.google.com/document/d/1oc_7t47g7MSkOjTtDOPUJJxA7ZhONAVUI0BMJ_z-QnE/edit?usp=sharing",
    type: "google-doc",
    x: 350,
    y: 1260
  },
  {
    id: "bendigo-tap-water-characterisation",
    title: "Bendigo Tap Water – Full Characterisation",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["water", "Bendigo", "health", "environment"],
    summary: "A detailed characterisation of Bendigo tap water and possible health or household implications.",
    url: "https://docs.google.com/document/d/1jmGd_BxiLLgSEWHpZ3_tY-Pd1AH4Clzx0546zpq-AYM/edit?usp=sharing",
    type: "google-doc",
    x: 530,
    y: 1260
  },
  {
    id: "gas-vs-electric-stoves-health",
    title: "Long-Term Health Impacts of Ventilated Gas Stoves vs Electric Stoves",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["home", "air-quality", "gas", "health"],
    summary: "Research comparing household gas and electric cooking from a long-term health perspective.",
    url: "https://docs.google.com/document/d/1uqMSTxmGhm5jPQ7TOfu6E0vshm-q4a3u41xRhcQgGxU/edit?usp=sharing",
    type: "google-doc",
    x: 710,
    y: 1260
  },
  {
    id: "chronic-headache-plan",
    title: "Comprehensive Plan to End Chronic Tension & Stress-Triggered Headaches",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["headaches", "stress", "pain", "recovery"],
    summary: "A practical plan for understanding and reducing chronic tension and stress-triggered headaches.",
    url: "https://docs.google.com/document/d/17jbMKwek-tw3gyULJSMe6jsdW7zJEHYyfG8GOZ_rRAU/edit?usp=sharing",
    type: "google-doc",
    x: 170,
    y: 1380
  },
  {
    id: "lower-back-pain-healing-strategy",
    title: "Integrative Healing Strategy for Chronic Lower Back Pain",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["back-pain", "movement", "healing", "body"],
    summary: "An integrative strategy for chronic lower back pain, combining physical, lifestyle and recovery approaches.",
    url: "https://docs.google.com/document/d/11-8Rrc9z5GrnH3Zr6pIzHZT57lmH5n3ixZW40f9I9wY/edit?usp=sharing",
    type: "google-doc",
    x: 350,
    y: 1380
  },
  {
    id: "recurrent-migraine-like-headaches",
    title: "Recurrent Migraine-Like Headaches in Josh Parris",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["headaches", "migraine", "health", "patterns"],
    summary: "A comprehensive review of recurrent migraine-like headaches and possible contributing factors.",
    url: "https://docs.google.com/document/d/1bJj-64uu-l92jdsQSOcr6wf4nLcS-_0p0J_RhH4YgZ8/edit?usp=sharing",
    type: "google-doc",
    x: 530,
    y: 1380
  },
  {
    id: "personalized-supplement-protocol",
    title: "Joshua Parris – Personalized Supplement Protocol",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["supplements", "health", "protocol", "longevity"],
    summary: "A personalised supplement protocol designed around health, resilience and daily rhythm.",
    url: "https://docs.google.com/document/d/1bFPVVxXg745fye2kmJ1JNPwZqmX4hNQ9JGux-AKDADE/edit?usp=sharing",
    type: "google-doc",
    x: 710,
    y: 1380
  },
  {
    id: "tinea-pedis-treatment",
    title: "Treatment Strategies for Persistent Tinea Pedis",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["skin", "feet", "treatment", "health"],
    summary: "Treatment strategies and practical considerations for persistent athlete’s foot.",
    url: "https://docs.google.com/document/d/1F29KL26h8hI_8P88o9-nJPsp4Qcdho19DeMCOv8vylM/edit?usp=sharing",
    type: "google-doc",
    x: 890,
    y: 1380
  },
  {
    id: "nike-pegasus-41-analysis",
    title: "Nike Pegasus 41 — Technical, Biomechanical & Practical Analysis",
    category: "Health",
    region: "Body Systems Lab",
    tags: ["running", "shoes", "biomechanics", "movement"],
    summary: "A technical and practical analysis of Nike Pegasus 41 running shoes.",
    url: "https://docs.google.com/document/d/1zKUuB8jqfUpA_nRgvt40DAjCucDRGpmcSM9ZrxntLaE/edit?usp=sharing",
    type: "google-doc",
    x: 1070,
    y: 1380
  },

  {
    id: "adhd-screen-addiction-sleep",
    title: "Healthier Habits for ADHD: Breaking Late-Night Screen Addiction and Improving Sleep",
    category: "Mind",
    region: "ADHD Focus Grove",
    tags: ["ADHD", "screens", "sleep", "habits"],
    summary: "A practical guide to breaking late-night screen loops and improving sleep with ADHD.",
    url: "https://docs.google.com/document/d/1W7VwyCkq7wVBZwM6oCHy75s4a78En_rMs6fnhtsF7aY/edit?usp=sharing",
    type: "google-doc",
    x: 170,
    y: 1580
  },
  {
    id: "neurodiversity-adhd-fluoride",
    title: "Neurodiversity, ADHD, and Fluoride Exposure",
    category: "Mind",
    region: "ADHD Focus Grove",
    tags: ["ADHD", "neurodiversity", "fluoride", "evidence"],
    summary: "A scientific review of ADHD, neurodiversity and fluoride exposure, including controversy and conclusions.",
    url: "https://docs.google.com/document/d/1DD-Xrfo66ClbvSuGl9Ev4G-9O6ckmS1ZAMyCp8j6ckQ/edit?usp=sharing",
    type: "google-doc",
    x: 350,
    y: 1580
  },
  {
    id: "hidden-disabilities-neurodiversity-inclusive-practice",
    title: "Hidden & Dynamic Disabilities, Neurodiversity, and Inclusive Practice",
    category: "Mind",
    region: "ADHD Focus Grove",
    tags: ["neurodiversity", "disability", "inclusion", "workplace"],
    summary: "Research on hidden disabilities, dynamic disability and inclusive practice.",
    url: "https://docs.google.com/document/d/16iXFKpz3kMVAaW47gO4mV5Kx2EnhzyJlBaKLDw4iBgs/edit?usp=sharing",
    type: "google-doc",
    x: 530,
    y: 1580
  },
  {
    id: "comprehensive-analysis-josh-documents",
    title: "Comprehensive Analysis of Josh Parris Based on Uploaded Documents",
    category: "Mind",
    region: "ADHD Focus Grove",
    tags: ["self-analysis", "psychology", "documents", "patterns"],
    summary: "A whole-person analysis based on uploaded documents and recurring themes.",
    url: "https://docs.google.com/document/d/1MOtqabFl_JrpdssCGC_FY_co__Fa8OVcB0unIeIul0E/edit?usp=sharing",
    type: "google-doc",
    x: 710,
    y: 1580
  },
  {
    id: "chatgpt-conversation-logs-analysis",
    title: "In-Depth Analysis of ChatGPT Conversation Logs",
    category: "Mind",
    region: "ADHD Focus Grove",
    tags: ["ChatGPT", "self-analysis", "logs", "patterns"],
    summary: "An analysis of ChatGPT conversation logs to surface patterns, themes and repeated concerns.",
    url: "https://docs.google.com/document/d/1ih4sFuxzrCexEMx2vUp_5Yjt29WNlqWB/edit?usp=sharing&rtpof=true&sd=true",
    type: "docx",
    x: 890,
    y: 1580
  },

  {
    id: "everyday-best-practice-parenting",
    title: "Everyday Best-Practice Parenting for Joshua & Kristy Parris",
    category: "Family",
    region: "Parenting Haven",
    tags: ["parenting", "children", "family", "practice"],
    summary: "A practical parenting guide for everyday rhythms, connection and wise family leadership.",
    url: "https://docs.google.com/document/d/1YZ-mxeSWJZCiT_QufiTLn3g_JOSMfJyAR7Z_he7yB1Y/edit?usp=sharing",
    type: "google-doc",
    x: 170,
    y: 1780
  },
  {
    id: "sylvie-meltdown-crisis-response",
    title: "Crisis Response Plan for Sylvie’s Intense Meltdowns",
    category: "Family",
    region: "Parenting Haven",
    tags: ["Sylvie", "meltdowns", "parenting", "regulation"],
    summary: "A crisis response plan for intense meltdowns, regulation and family safety.",
    url: "https://docs.google.com/document/d/1nS35YsxlOMeTGRPjbU8gYSlPX4qNIRjcXUY5iw4zie0/edit?usp=sharing",
    type: "google-doc",
    x: 350,
    y: 1780
  },
  {
    id: "education-pathways-neurodiverse-kids",
    title: "Education Pathways for Neurodiverse Kids – Sylvie & Elias Parris",
    category: "Family",
    region: "Parenting Haven",
    tags: ["education", "neurodiversity", "Sylvie", "Elias"],
    summary: "A family-focused education pathway analysis for neurodiverse children.",
    url: "https://docs.google.com/document/d/1jrGwLBimRyf9k7vGuLTzGCnG7aVekE35o-irnEBZBEw/edit?usp=sharing",
    type: "google-doc",
    x: 530,
    y: 1780
  },
  {
    id: "potty-training-sylvie",
    title: "Potty Training Sylvie: A Grace-Filled Guide",
    category: "Family",
    region: "Parenting Haven",
    tags: ["Sylvie", "toilet-training", "parenting", "grace"],
    summary: "A grace-filled, practical guide to toilet training Sylvie.",
    url: "https://docs.google.com/document/d/1MIg2LwvYfboHbi823yutxI-9LFAfG8lTFHXWLzI1xQc/edit?usp=sharing",
    type: "google-doc",
    x: 710,
    y: 1780
  },
  {
    id: "kristy-elias-obstetric-summary",
    title: "Kristy & Elias Obstetric Summary",
    category: "Family",
    region: "Parenting Haven",
    tags: ["Elias", "Kristy", "birth", "family"],
    summary: "A family health and obstetric summary relating to Kristy and Elias.",
    url: "https://docs.google.com/document/d/1rck8kdJZoG_BS83pJpDrt1iMOUzxRE5AiHGaNYH0o8Q/edit?usp=sharing",
    type: "google-doc",
    x: 890,
    y: 1780
  },

  {
    id: "loving-as-christ-loves",
    title: "Loving as Christ Loves: A Theology & Practice for Christian Husbands",
    category: "Faith",
    region: "Marriage & Connection Garden",
    tags: ["faith", "marriage", "love", "husband"],
    summary: "A theological and practical guide to loving as Christ loves within marriage.",
    url: "https://docs.google.com/document/d/1W7Z_Hrfd32FeBd8G2VZ9bUBQy2xDPtf7x7EsW3xN3J4/edit?usp=sharing",
    type: "google-doc",
    x: 170,
    y: 1980
  },
  {
    id: "relationship-dynamics-marriage",
    title: "Deep Research Report: Relationship Dynamics in a Marriage",
    category: "Family",
    region: "Marriage & Connection Garden",
    tags: ["marriage", "relationship", "dynamics", "repair"],
    summary: "A deep research report on relationship dynamics, patterns and repair in marriage.",
    url: "https://docs.google.com/document/d/1wbhUy_04IGyR-JeAivjfWBqJ-i8ZWQ_YlbhnCZ59Lu8/edit?usp=sharing",
    type: "google-doc",
    x: 350,
    y: 1980
  },
  {
    id: "emotional-intimacy-right-distance",
    title: "Emotional Intimacy, Bonding & the Right Distance Framework",
    category: "Family",
    region: "Marriage & Connection Garden",
    tags: ["marriage", "intimacy", "bonding", "distance"],
    summary: "A framework for emotional intimacy, bonding and maintaining the right relational distance.",
    url: "https://docs.google.com/document/d/1X7Ryg16C15F3JiRUbuPvWCPhAi9PlZBv2_DNRYJxtNo/edit?usp=sharing",
    type: "google-doc",
    x: 530,
    y: 1980
  },
  {
    id: "thriving-sexual-intimacy-christian-marriage",
    title: "Thriving Sexual Intimacy in Christian Marriage",
    category: "Family",
    region: "Marriage & Connection Garden",
    tags: ["marriage", "intimacy", "Christian", "connection"],
    summary: "A Christian marriage document focused on healthy, connected and thriving intimacy.",
    url: "https://docs.google.com/document/d/1GV-HxN3gmQg1bvknnUJtdGj-WSEzJJizCZVSAkYHj0Q/edit?usp=sharing",
    type: "google-doc",
    x: 710,
    y: 1980
  },
  {
    id: "surviving-coercive-control-christian-husband",
    title: "Surviving Coercive Control: A Practical Guide for a Christian Husband",
    category: "Faith",
    region: "Marriage & Connection Garden",
    tags: ["faith", "marriage", "boundaries", "control"],
    summary: "A faith-framed guide for surviving coercive control and navigating boundaries wisely.",
    url: "https://docs.google.com/document/d/1ELUhWvDGM8NYF4k_IjiFGTT8LsNiWn2WU4ZuTaWI8fM/edit?usp=sharing",
    type: "google-doc",
    x: 890,
    y: 1980
  },

  {
    id: "ai-security-practitioner",
    title: "Becoming an AI Security Practitioner: Prompt Injection, Jailbreaks & Guardrails",
    category: "Tech",
    region: "Tech & AI Citadel Expansion",
    tags: ["AI", "security", "prompt-injection", "career"],
    summary: "A practical learning path into AI security, jailbreaks, guardrails and defensive AI systems.",
    url: "https://docs.google.com/document/d/1a7HmGSL5K-ACPnpp7UqMDh-lRF1Ymq6OaWbX_VwQu9U/edit?usp=sharing",
    type: "google-doc",
    x: 1230,
    y: 1260
  },
  {
    id: "upskilling-ai-industrial-revolution",
    title: "Upskilling for the AI Industrial Revolution",
    category: "Tech",
    region: "Tech & AI Citadel Expansion",
    tags: ["AI", "career", "upskilling", "future-work"],
    summary: "A future-proof playbook for work, skills and adaptation in the age of AI.",
    url: "https://docs.google.com/document/d/1HzU8I9oPgMBzmGoUiT-Uldr_K9GR2_i3/edit?usp=sharing&rtpof=true&sd=true",
    type: "docx",
    x: 1410,
    y: 1260
  },
  {
    id: "disco-elysium-style-rpg-blueprint",
    title: "Technical Blueprint for a Disco Elysium-Style Narrative RPG",
    category: "Tech",
    region: "Tech & AI Citadel Expansion",
    tags: ["game-design", "RPG", "AI", "narrative"],
    summary: "A technical design blueprint for a narrative RPG inspired by Disco Elysium-style systems.",
    url: "https://docs.google.com/document/d/10HwMDtS7k5o-52oSgmZc1KRCIKo41LiJyonR0DusO-c/edit?usp=sharing",
    type: "google-doc",
    x: 1590,
    y: 1260
  },
  {
    id: "darpa-inventions-programs-impact",
    title: "DARPA: Inventions, Discoveries, Programs & Impact",
    category: "Tech",
    region: "Tech & AI Citadel Expansion",
    tags: ["DARPA", "technology", "history", "innovation"],
    summary: "A research report on DARPA’s inventions, programs and technological impact.",
    url: "https://docs.google.com/document/d/1ls0eeJg3m6PuHpRJijGongyIURh5f-YxAMGjgBCnWFA/edit?usp=sharing",
    type: "google-doc",
    x: 1230,
    y: 1380
  },
  {
    id: "electronics-supply-chain-trace",
    title: "Full Supply-Chain Trace for Selected Electronics Products",
    category: "Tech",
    region: "Tech & AI Citadel Expansion",
    tags: ["electronics", "supply-chain", "technology", "ethics"],
    summary: "A supply-chain trace for selected electronics products and Josh’s tech items.",
    url: "https://docs.google.com/document/d/1ukdho5Ne2hIXe4hCF4F25j8kCwCtks4H/edit?usp=sharing&rtpof=true&sd=true",
    type: "docx",
    x: 1410,
    y: 1380
  },
  {
    id: "whispering-wilds-fun-friction",
    title: "Whispering Wilds — Fun & Friction Deep-Dive",
    category: "Tech",
    region: "Tech & AI Citadel Expansion",
    tags: ["game-design", "UX", "PyScript", "prototype"],
    summary: "A fun-and-friction analysis of the Whispering Wilds static PyScript build.",
    url: "https://docs.google.com/document/d/1Mzc_lh--KNIR10FhExnp5yyrVbEGdvhb2yoHT9YJydY/edit?usp=sharing",
    type: "google-doc",
    x: 1590,
    y: 1380
  },

  {
    id: "integrative-life-analysis",
    title: "Integrative Life Analysis: Josh Parris’s Journey Through Time, Habits, Creativity, and Faith",
    category: "Life",
    region: "Life Analytics Observatory",
    tags: ["life-analysis", "faith", "habits", "creativity"],
    summary: "A deep integrative life analysis across habits, creativity, faith and long-term patterns.",
    url: "https://docs.google.com/document/d/1w2tqX2R9Y6mFEDa81K4hZnzrUV2hqOdO2ksQMS2j6OE/edit?usp=sharing",
    type: "google-doc",
    x: 1230,
    y: 1580
  },
  {
    id: "chatgpt-youtube-comparison",
    title: "ChatGPT Use Analysis & Comparison with YouTube Watch History",
    category: "Life",
    region: "Life Analytics Observatory",
    tags: ["ChatGPT", "YouTube", "attention", "self-analysis"],
    summary: "A comparison of ChatGPT use and YouTube watch history to reveal attention and behaviour patterns.",
    url: "https://docs.google.com/document/d/1RYsIEjGpvhgNGSmhlYjjyVVU1ioTadU0BPRT9qyetKk/edit?usp=sharing",
    type: "google-doc",
    x: 1410,
    y: 1580
  },
  {
    id: "youtube-watch-history-2025",
    title: "2025 YouTube Watch History Analysis",
    category: "Life",
    region: "Life Analytics Observatory",
    tags: ["YouTube", "attention", "habits", "media"],
    summary: "An analysis of 2025 YouTube watch history for themes, attention patterns and behaviour loops.",
    url: "https://docs.google.com/document/d/1rwlOzIzMW8o90Czuhu4G5VI494RJBRjneCRyKszli-E/edit?usp=sharing",
    type: "google-doc",
    x: 1590,
    y: 1580
  },
  {
    id: "integrated-topic-map-v2",
    title: "Josh’s Integrated Topic Map v2",
    category: "Life",
    region: "Life Analytics Observatory",
    tags: ["topic-map", "research", "synthesis", "knowledge"],
    summary: "A deep topic map of Josh’s major research themes and recurring areas of attention.",
    url: "https://docs.google.com/document/d/1TBc63meSCSH5pSyBHc6PssA2AYz3Wcw5rv7MKU9NNSk/edit?usp=sharing",
    type: "google-doc",
    x: 1230,
    y: 1700
  },
  {
    id: "whole-life-meta-analysis-parris-family",
    title: "Whole-of-Life Meta-Analysis for the Parris Family",
    category: "Life",
    region: "Life Analytics Observatory",
    tags: ["family", "life", "synthesis", "meta-analysis"],
    summary: "A large-scale synthesis across documents about the Parris family, values, health and direction.",
    url: "https://docs.google.com/document/d/1vgiXDoYkR8EdFzBzdSSXQeFOPmF8zRL6/edit?usp=sharing&rtpof=true&sd=true",
    type: "docx",
    x: 1410,
    y: 1700
  },
  {
    id: "six-month-whole-life-reset-plan",
    title: "6-Month Whole-Life Reset Plan",
    category: "Life",
    region: "Life Analytics Observatory",
    tags: ["reset", "planning", "habits", "life"],
    summary: "A six-month whole-life reset plan for health, family, faith, work and rhythms.",
    url: "https://docs.google.com/document/d/1upTtklBUWW7XaqfEAQxhgZsFO6Cv0bvkwsN0xJ0xN40/edit?usp=sharing",
    type: "google-doc",
    x: 1590,
    y: 1700
  },

  {
    id: "move-in-commissioning-boundary-rd",
    title: "Move-In Commissioning Plan for 101 Boundary Rd, Dubbo",
    category: "Life",
    region: "Places & Calling Map",
    tags: ["Dubbo", "home", "move", "planning"],
    summary: "A commissioning plan for moving into and settling at 101 Boundary Road, Dubbo.",
    url: "https://docs.google.com/document/d/1Jkwh6u7Oai8p95Ah-UhcYjQiNT3ozJVBacPAWAGkf3I/edit?usp=sharing",
    type: "google-doc",
    x: 170,
    y: 2200
  },
  {
    id: "orientation-baseline-boundary-rd",
    title: "Orientation and Baseline Confirmation — 101 Boundary Road Dubbo",
    category: "Life",
    region: "Places & Calling Map",
    tags: ["Dubbo", "home", "orientation", "baseline"],
    summary: "A baseline and orientation document for life at 101 Boundary Road, Dubbo.",
    url: "https://docs.google.com/document/d/1DC8AaXOdQhmQSV9u9c-k4iN06mTKr3a9Br84Qi9_xAM/edit?usp=sharing",
    type: "google-doc",
    x: 350,
    y: 2200
  },
  {
    id: "moving-options-bendigo-dubbo",
    title: "Comparison of Moving Options from Bendigo to Dubbo",
    category: "Life",
    region: "Places & Calling Map",
    tags: ["moving", "Dubbo", "Bendigo", "planning"],
    summary: "A comparison of moving options from Bendigo to Dubbo across practical scenarios.",
    url: "https://docs.google.com/document/d/1mOd-hcxitv6TtKdMQoDYQFfTfoY-43qdIrs6H8MvXqk/edit?usp=sharing",
    type: "google-doc",
    x: 530,
    y: 2200
  },
  {
    id: "bendigo-dubbo-ballarat-orange-comparison",
    title: "Bendigo, Dubbo, Ballarat & Orange: Comparative Analysis",
    category: "Life",
    region: "Places & Calling Map",
    tags: ["cities", "Dubbo", "Bendigo", "family"],
    summary: "A place-based comparison of Bendigo, Dubbo, Ballarat and Orange for the Parris family.",
    url: "https://docs.google.com/document/d/1zPcVzf9GBNvVBVo_DCq3swoWAav5TGb0gNGt-6btW7w/edit?usp=sharing",
    type: "google-doc",
    x: 710,
    y: 2200
  },
  {
    id: "burrabadine-village-research",
    title: "Burrabadine Village: Comprehensive Research Report",
    category: "Life",
    region: "Places & Calling Map",
    tags: ["Burrabadine", "place", "history", "community"],
    summary: "A comprehensive research report on Burrabadine Village and its context.",
    url: "https://docs.google.com/document/d/1mgjJ6igylKD0hXjcw2VTi6QF0fKsxbpVk4UTjIm2toM/edit?usp=sharing",
    type: "google-doc",
    x: 890,
    y: 2200
  },
  {
    id: "cornerstone-community-australia",
    title: "Cornerstone Community Australia",
    category: "Faith",
    region: "Places & Calling Map",
    tags: ["Cornerstone", "faith", "community", "history"],
    summary: "A research profile of Cornerstone Community Australia.",
    url: "https://docs.google.com/document/d/1_gN_qXolNW1azKLlI5YxhT4oPSfD1ftKbkoSKomgOp0/edit?usp=sharing",
    type: "google-doc",
    x: 1070,
    y: 2200
  },
  {
    id: "dubbo-protestant-network",
    title: "Dubbo Protestant Network: Hubs and Bridges",
    category: "Faith",
    region: "Places & Calling Map",
    tags: ["Dubbo", "church", "faith", "network"],
    summary: "A map of Protestant church networks, hubs and bridges in Dubbo.",
    url: "https://docs.google.com/document/d/104YkK8RBpuVSY3Lp34NLq0tYafl6G7Fl1y_FkTrG0oQ/edit?usp=sharing",
    type: "google-doc",
    x: 1250,
    y: 2200
  },

  {
    id: "career-pathway-roadmap",
    title: "Career Pathway Roadmap for Josh Parris",
    category: "Life",
    region: "Work & Vocation Guildhall",
    tags: ["career", "roadmap", "future", "work"],
    summary: "A career roadmap exploring future work, skills and vocational direction.",
    url: "https://docs.google.com/document/d/1OnI21JnmmWnlGrtyQHzLo058m0bKu2HVsW5y38OUAtw/edit?usp=sharing",
    type: "google-doc",
    x: 1230,
    y: 1980
  },
  {
    id: "operational-fit-psychosocial-risk-ask-la-trobe",
    title: "Operational Fit and Psychosocial-Risk Assessment – Ask La Trobe Customer Care",
    category: "Life",
    region: "Work & Vocation Guildhall",
    tags: ["work", "psychosocial-risk", "operations", "career"],
    summary: "A work-focused assessment of operational fit and psychosocial risk in the Ask La Trobe context.",
    url: "https://docs.google.com/document/d/1FVsF1kcmU-oNfZdaezX8hGp2BsQ_fji5kTcyOE5BPHo/edit?usp=sharing",
    type: "google-doc",
    x: 1410,
    y: 1980
  },
  {
    id: "dcs-library-executive-summary",
    title: "Dubbo Christian School Library - Executive Summary of Findings",
    category: "Life",
    region: "Work & Vocation Guildhall",
    tags: ["DCS", "library", "work", "report"],
    summary: "An executive summary of findings related to the Dubbo Christian School library context.",
    url: "https://docs.google.com/document/d/1eq8rtGALNqpLOabTpe33ZzRi7gtJIuSR/edit?usp=sharing&rtpof=true&sd=true",
    type: "docx",
    x: 1590,
    y: 1980
  },
  {
    id: "dcs-victory-comparative-analysis",
    title: "Comparative Analysis: Dubbo Christian School & Victory Christian College",
    category: "Life",
    region: "Work & Vocation Guildhall",
    tags: ["DCS", "Victory", "school", "comparison"],
    summary: "A comparative analysis of Dubbo Christian School and Victory Christian College.",
    url: "https://docs.google.com/document/d/1DD1A_HfunmRYGcHXD3s5yShvsvIKV-hJwKzUYxTxm_4/edit?usp=sharing",
    type: "google-doc",
    x: 1770,
    y: 1980
  },
  {
    id: "dcs-expansion-report",
    title: "Dubbo Christian School — Deep Research Expansion Report",
    category: "Life",
    region: "Work & Vocation Guildhall",
    tags: ["DCS", "school", "Dubbo", "research"],
    summary: "A deep research expansion report on Dubbo Christian School.",
    url: "https://docs.google.com/document/d/1MjN56vNxjTQlBFY8a9k5E7tJ59rJIuxqw90f33hVBQg/edit?usp=sharing",
    type: "google-doc",
    x: 1950,
    y: 1980
  }
]

Also update the region legend / map labels so these new regions appear:
- Body Systems Lab
- ADHD Focus Grove
- Parenting Haven
- Marriage & Connection Garden
- Tech & AI Citadel Expansion
- Life Analytics Observatory
- Places & Calling Map
- Work & Vocation Guildhall

Acceptance criteria:
- The app builds successfully.
- All new documents appear in Map View.
- All new documents appear in List View.
- All links open correctly in a new tab.
- Search can find these by title and tags.
- Category filters still work.
- The world/map bounds are expanded so all new coordinates are reachable.
- No existing documents are deleted.