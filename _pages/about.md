---
layout: home
permalink: /
title: "Iman Sharifi"
author_profile: false
hero_eyebrow: "Ph.D. Candidate · Aerospace Autonomy & AI"
hero_tagline: "I build **safe, interpretable, and verifiable AI** for autonomous flight — from multi-agent reinforcement learning to neuro-symbolic reasoning and large language models."
focus: "Multi-Agent RL · Neuro-Symbolic AI · LLMs"
status: "Seeking 2026–27 research internships"
hero_photo: "profile-stanford-square.webp"

affiliations:
  - name: "George Washington University"
    url: "https://www.gwu.edu/"
  - name: "Stanford SISL"
    url: "https://sisl.stanford.edu/"
  - name: "NASA ULI"
    url: "https://www.nasa.gov/"

# Research themes shown as cards. "topic" links to the filtered publication list.
# To show a looping clip instead of the image, add  video: "research/clip.mp4"  (muted MP4/WebM in /images/).
research:
  - title: "Multi-Agent RL for Shared Airspace"
    text: "Decentralized policies that keep heterogeneous drone fleets safely separated in dense urban airspace, while staying fair to every operator."
    image: "teasers/2026-heterogeneous-deconfliction-itsc.webp"
    image_alt: "BlueSky simulation of two drone fleets crossing at a shared conflict point"
    fit: "cover"
    anim: "airspace"
    anim_alt: "Animation: two drone fleets stream along waypoint routes and merge at a shared conflict point; aircraft that would conflict slow down to keep separation."
    topic: "Drones & Air Mobility"
  - title: "Language Models for Air Traffic Decisions"
    text: "Fine-tuning LLMs with supervised learning and GRPO to act as cooperative tactical deconfliction advisors for small unmanned aircraft."
    image: "teasers/2026-cvpr-llm-atc.webp"
    image_alt: "A fine-tuned LLM issuing deconfliction actions to drones over a vertiport network"
    anim: "llm"
    anim_alt: "Animation: a predicted drone conflict is turned into a text prompt, a fine-tuned LLM answers decelerate, and the ownship slows to keep separation."
    topic: "LLMs"
  - title: "Neuro-Symbolic Rule Learning"
    text: "Differentiable logic that learns human-readable first-order rules from noisy, probabilistic data, so the model explains itself."
    image: "teasers/2026-andre-nesy.webp"
    image_alt: "ANDRE architecture with attention-based conjunction and disjunction layers"
    anim: "andre"
    anim_alt: "Animation: attention weights from predicates to conjunction and disjunction nodes sharpen during training until a readable logic rule is extracted."
    topic: "Neuro-Symbolic AI"
  - title: "Safe & Explainable Autonomous Driving"
    text: "Symbolic reasoning that constrains deep reinforcement learning, so highway driving policies stay safe during exploration and remain explainable."
    image: "teasers/2025-safe-driving-trr.webp"
    image_alt: "A symbolic logic core restricting a DQN to safe actions for an autonomous vehicle"
    anim: "highway"
    anim_alt: "Animation: on a highway, a DQN proposes lane changes; a symbolic safety check rejects the unsafe one and allows the safe one."
    topic: "Autonomous Driving"

news:
  - date: "2026 · 09"
    text: "Presented our multi-agent RL work on separating heterogeneous drone fleets at **IEEE ITSC 2026** (Naples, Italy), online on Sep 16. [Watch the talk &amp; get the slides](/talks/2026-09-16-itsc-separation)."
  - date: "2026 · 09"
    text: "Attended the second **NASA ULI monthly meeting** at **Purdue University**, Sep 15–17."
    img: "gallery/nasa-uli-purdue-2026"
    img_alt: "NASA ULI students in front of the Purdue University gateway, September 2026"
  - date: "2026 · 09"
    text: "Presented **ANDRE**, our attention-based differentiable rule extractor, at **NeSy 2026** (Lisbon, Portugal), online on Sep 4. [Watch the talk &amp; get the slides](/talks/2026-09-04-nesy-andre)."
  - date: "2026 · 06"
    text: "Our paper **ANDRE: An Attention-based Neuro-symbolic Differentiable Rule Extractor** was accepted at **NeSy 2026** (Int'l Conference on Neurosymbolic Learning and Reasoning)."
  - date: "2026 · 06"
    text: "Joined the **Stanford Intelligent Systems Laboratory (SISL)**, Dept. of Aeronautics &amp; Astronautics, as a visiting researcher."
    img: "gallery/sisl-kochenderfer"
    img_alt: "Iman with Prof. Mykel Kochenderfer at Stanford"
  - date: "2026 · 06"
    text: "Presented our poster at **CVPR 2026** in Denver, Colorado."
    img: "gallery/cvpr-2026-poster"
    img_alt: "Iman presenting the poster at CVPR 2026"
  - date: "2026 · 04"
    text: "Paper accepted at **IEEE ITSC 2026**, Naples — *Separation Assurance between Heterogeneous Fleets of sUAS via Multi-Agent Reinforcement Learning*."
  - date: "2026 · 04"
    text: "Defended my Doctoral Qualifying Exam (DQE) — now a **Ph.D. Candidate** at George Washington University."
  - date: "2026 · 03"
    text: "Paper accepted at **CVPR Workshops 2026** — *Fine-Tuning Large Language Models for Cooperative Tactical Deconfliction of sUAS*."
  - date: "2025 · 10"
    text: "Published **Agricultural Spraying Drones: A Comprehensive Review** in *Smart Agricultural Technology*."
  - date: "2025 · 09"
    text: "Two papers accepted at **AIAA SciTech Forum 2026** on UTM and AAM cybersecurity."
  - date: "2025 · 08"
    text: "Published **Integrating Neurosymbolic AI in Advanced Air Mobility: A Comprehensive Survey** at **IJCAI 2025**."

# Photo strip on the home page. Each "img" has a full-size .webp and a -thumb.webp in /images/.
# Copies in images/gallery are resized and stripped of location metadata; originals stay in images/personal (not published).
gallery:
  - img: "gallery/stanford-oval"
    caption: "Stanford Oval and Hoover Tower"
    alt: "Iman on a Stanford walkway with Hoover Tower in the background"
  - img: "gallery/sisl-kochenderfer"
    caption: "With Prof. Mykel Kochenderfer, Stanford SISL"
    alt: "Iman with Prof. Mykel Kochenderfer outside a Stanford building"
  - img: "gallery/cvpr-2026-group"
    caption: "With fellow researchers at CVPR 2026"
    alt: "A group of six attendees with conference badges in front of the CVPR sign"
  - img: "gallery/sisl-affiliates"
    caption: "With Stanford SISL affiliates and postdocs"
    alt: "Group photo of researchers on a sunny Stanford terrace"
  - img: "gallery/nasa-uli-purdue-2026"
    caption: "NASA ULI monthly meeting at Purdue University, Sept 2026"
    alt: "Group of students in front of the Purdue University gateway"
  - img: "gallery/nasa-uli-2025"
    caption: "NASA ULI team, 2025"
    alt: "Large group photo of the NASA ULI team taken from above"
  - img: "gallery/iasl-hike"
    caption: "IASL lab hike, GWU"
    alt: "Members of the IASL lab on a rocky overlook above a river valley"
  - img: "gallery/golden-gate"
    caption: "Golden Gate Bridge, San Francisco"
    alt: "Iman by the bay with the Golden Gate Bridge behind him"
  - img: "gallery/cvpr-2026-poster"
    caption: "Presenting our poster at CVPR 2026, Denver"
    alt: "Iman standing next to his research poster at CVPR 2026"

logos:
  - name: "George Washington University"
    url: "https://www.gwu.edu/"
    img: "gwu-logo.webp"
  - name: "Stanford University"
    url: "https://www.stanford.edu/"
    img: "stanford-logo.webp"
  - name: "NASA"
    url: "https://www.nasa.gov/"
    img: "nasa-logo.webp"

education:
  - degree: "Ph.D., Mechanical & Aerospace Engineering"
    school: "The George Washington University"
    years: "2024 – present"
  - degree: "M.Sc., Mechanical Engineering"
    school: "Sharif University of Technology"
    years: "2019 – 2022"
  - degree: "B.Sc., Aerospace Engineering"
    school: "K. N. Toosi University of Technology"
    years: "2015 – 2019"

contact_text: "I'm always glad to discuss research in reinforcement learning, neuro-symbolic AI, and large language models — and I'm actively seeking 2026–2027 research internships in academia, research labs, or industry."

redirect_from:
  - /about/
  - /about.html
---

I am a Ph.D. Candidate in Mechanical and Aerospace Engineering at [George Washington University](https://www.gwu.edu/), Washington DC, USA, where my research lies at the intersection of control, optimization, and decision-making. In particular, I work on **multi-agent reinforcement learning**, **neuro-symbolic artificial intelligence**, and **large language models (LLMs)**. I am broadly interested in developing interpretable and verifiable AI systems for safety-critical applications such as unmanned aerial systems (UAS) traffic management (UTM), advanced air mobility (AAM), and autonomous driving. My current Ph.D. program is funded by the [National Aeronautics and Space Administration (NASA)](https://www.nasa.gov/) University Leadership Initiative (ULI).

Currently, I am a visiting student researcher in the [Stanford Intelligent Systems Laboratory (SISL)](https://sisl.stanford.edu/) at **Stanford University**, Department of Aeronautics and Astronautics, where I conduct research on safeguarding LLMs/VLMs using retrieval-augmented generation (RAG) in aviation applications. I have also conducted research as a visiting student researcher at the [Connected and Automated Vehicles Lab (CAV-Lab)](https://www.cav-lab.io/), University of Surrey, focusing on symbolic imitation learning and safe decision-making for autonomous vehicles using neuro-symbolic reinforcement learning in 2023.

To date, my work has been published in venues such as *IEEE ITSC*, *CVPR Workshops*, *IJCAI*, *Smart Agricultural Technology*, *Transportation Research Record (TRR)*, *Applied Sciences*, and the *AIAA SciTech Forum*.
