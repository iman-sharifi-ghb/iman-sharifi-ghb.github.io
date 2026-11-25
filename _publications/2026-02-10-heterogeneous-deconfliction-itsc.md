---
title: "Separation Assurance between Heterogeneous Fleets of Small Unmanned Aerial Systems via Multi-Agent Reinforcement Learning"
collection: publications
category: conferences
venue_short: "IEEE ITSC"
selected: true
permalink: /publication/2026-heterogeneous-deconfliction-itsc
excerpt: "A decentralized-centralized multi-agent reinforcement learning framework for ensuring separation assurance and fairness among heterogeneous sUAS fleets in shared airspace."
date: 2026-02-10
venue: "IEEE International Conference on Intelligent Transportation Systems (ITSC)"
paperurl: "https://arxiv.org/abs/2605.01041"
citation: "I. Sharifi, H. T. Kim, M. H. Ahmed, M. Ghasemi, and P. Wei. (2026). \"Separation Assurance between Heterogeneous Fleets of Small Unmanned Aerial Systems via Multi-Agent Reinforcement Learning.\" <i>IEEE ITSC</i>, 2026."
authors: "Iman Sharifi, Hyeong Tae Kim, Maheed Hatem Ahmed, Mahsa Ghasemi, Peng Wei"
arxiv: "https://arxiv.org/abs/2605.01041"
slidesurl: "/files/talks/itsc-2026-slides.pdf"
videourl: "/talks/2026-09-16-itsc-separation"
talk: "/talks/2025-10-16-nasa-uli-vanderbilt"
topics: ["Reinforcement Learning", "Drones & Air Mobility"]
teaser: "teasers/2026-heterogeneous-deconfliction-itsc.webp"
teaser_alt: "BlueSky scenario over Frisco, Texas: two drone fleets (blue and orange) fly between waypoints and meet at a shared conflict point."
# 3D replays shown under "3D demonstrations" (files in /images/demos/). The first one is shown large.
demos_intro: >-
  Photorealistic 3D replays of one evaluation episode (episode 35) over Frisco, Texas: 20 sUAS from two
  companies, a multirotor fleet (CoA, blue) and a fixed-wing VTOL fleet (CoB, orange), each flying its own
  learned attention-based PPOA2C policy. All 20 deliveries complete with zero collisions. Policy decisions,
  positions, and speeds at 500 ft are replayed from the BlueSky simulation and rendered with Cesium 3D tiles;
  takeoff and landing segments are illustrative.
demos:
  - title: "Airspace overview"
    video: "demos/sep-overview.mp4"
    poster: "demos/sep-overview.webp"
    duration: "1:14"
    text: "Both fleets fly across the city for the whole 11-minute episode, shown at 6× real time."
  - title: "Following one drone (AC05)"
    video: "demos/sep-follow-ac05.mp4"
    poster: "demos/sep-follow-ac05.webp"
    duration: "1:16"
    text: "A chase camera rides along with one multirotor. The panel shows its policy action (decelerate, hold, accelerate) and how its attention is split across nearby intruders."
  - title: "Shared intersection (WP9)"
    video: "demos/sep-intersection-wp9.mp4"
    poster: "demos/sep-intersection-wp9.webp"
    duration: "0:48"
    text: "Drones from both fleets meet at a shared waypoint, where intra- and inter-fleet conflicts have to be resolved."
abstract: >-
  In the envisioned future dense urban airspace, multiple companies will operate heterogeneous fleets
  of small unmanned aerial systems (sUASs), where each fleet includes several homogeneous aircraft
  with identical policies and configurations, e.g., equipage, sensing, and communication ranges,
  making tactical deconfliction highly complex for the aircraft. This paper aims to address two core
  questions: (1) Can tactical deconfliction policies converge or reach an equilibrium to ensure a
  conflict-free airspace when companies operate heterogeneous fleets of homogeneous aircraft? (2) If
  so, will the converged policies discriminate against companies operating sUASs with weaker
  configurations? We investigate a multi-agent reinforcement learning paradigm in which homogeneous
  aircraft within heterogeneous fleets operate concurrently to perform package delivery missions over
  Dallas, Texas, USA. An attention-enhanced Proximal Policy Optimization-based Advantage Actor-Critic
  (PPOA2C) framework is employed to resolve intra- and inter-fleet conflicts, with each fleet
  independently training its own policy while preserving privacy. Experimental results show that two
  fleets with distinct, shared PPOA2C policies can reach an equilibrium to maintain safe separation.
  While two PPOA2C policies outperform two strong rule-based baselines in terms of conflict
  resolution, a PPOA2C policy exhibits safer interaction with a rule-based policy, indicating adaptive
  capabilities of PPOA2C policies. Furthermore, we conducted extensive policy-configuration
  evaluations, which reveal that equilibria between similar policy types tend to favor fleets with
  stronger configurations. Even under similar configurations but different policy types, the
  equilibrium favors one of the heterogeneous policies, underscoring the need for fairness-aware
  conflict management in heterogeneous sUAS operations.
bibtex: |
  @inproceedings{sharifi2026separation,
    title     = {Separation Assurance between Heterogeneous Fleets of Small Unmanned Aerial Systems via Multi-Agent Reinforcement Learning},
    author    = {Sharifi, Iman and Kim, Hyeong Tae and Ahmed, Maheed Hatem and Ghasemi, Mahsa and Wei, Peng},
    booktitle = {IEEE International Conference on Intelligent Transportation Systems (ITSC)},
    year      = {2026},
    eprint    = {2605.01041},
    archivePrefix = {arXiv}
  }
---
