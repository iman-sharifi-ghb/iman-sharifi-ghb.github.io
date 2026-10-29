---
title: "Separation Assurance between Heterogeneous Fleets of Small Unmanned Aerial Systems via Multi-Agent Reinforcement Learning"
collection: talks
type: "Conference Talk (online)"
permalink: /talks/2026-09-16-itsc-separation
venue: "IEEE International Conference on Intelligent Transportation Systems (ITSC 2026)"
date: 2026-09-16
location: "Naples, Italy"
excerpt: "Can drone fleets with different policies and aircraft configurations share dense urban airspace safely, and is the outcome fair to both operators?"
video: "ppSpl-BF61Q"
video_cover: "/images/talks/itsc-2026.webp"
thumb: "/images/talks/itsc-2026-thumb.webp"
slidesurl: "/files/talks/itsc-2026-slides.pdf"
paper: "/publication/2026-heterogeneous-deconfliction-itsc"
---

I presented our paper *Separation Assurance between Heterogeneous Fleets of Small Unmanned Aerial Systems via Multi-Agent Reinforcement Learning* online at **IEEE ITSC 2026**, held in Naples, Italy, on **September 16, 2026**. This is joint work with collaborators at Purdue University.

The talk asks three questions about two drone fleets that share dense urban airspace while running their own private policies and aircraft configurations: can they reach an equilibrium, is the result fair to both, and what drives any bias?

- **Approach.** Each fleet trains its own attention-based PPO advantage actor-critic (PPOA2C) policy, shared within the fleet and private across fleets, in a dense delivery scenario over Frisco, Texas, with 20 aircraft and three bottlenecks, simulated in BlueSky.
- **Safety.** Both fleets converge to an equilibrium with about 98% mission success, and near mid-air collisions drop by about 71% compared with a strong rule-based policy.
- **Fairness.** A time-based fairness metric reaches about 99% when the fleets share configurations but about 82% when they differ, which points to the need for fairness-aware conflict management.
