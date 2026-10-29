---
title: "Reinforcement Learning Enhancement Using Vector Semantic Representation and Symbolic Reasoning for Human-Centered Autonomous Emergency Braking"
collection: publications
category: preprints
venue_short: "arXiv"
permalink: /publication/2026-neurosymbolic-aeb
excerpt: "A neuro-symbolic pipeline that fuses semantic, spatial, and shape features with a Soft First-Order Logic reward — extracting symbolic predicates from segmentation maps — to improve the robustness and safety of camera-based deep reinforcement learning for autonomous emergency braking, evaluated in CARLA."
date: 2026-02-04
venue: "arXiv preprint"
paperurl: "https://arxiv.org/abs/2602.05079"
citation: "V. Asodia, I. Sharifi, and S. Fallah. (2026). \"Reinforcement Learning Enhancement Using Vector Semantic Representation and Symbolic Reasoning for Human-Centered Autonomous Emergency Braking.\" <i>arXiv preprint</i> arXiv:2602.05079."
authors: "Vinal Asodia, Iman Sharifi, Saber Fallah"
arxiv: "https://arxiv.org/abs/2602.05079"
topics: ["Neuro-Symbolic AI", "Reinforcement Learning", "Autonomous Driving"]
abstract: >-
  The problem with existing camera-based Deep Reinforcement Learning approaches is twofold: they
  rarely integrate high-level scene context into the feature representation, and they rely on rigid,
  fixed reward functions. To address these challenges, this paper proposes a novel pipeline that
  produces a neuro-symbolic feature representation that encompasses semantic, spatial, and shape
  information, as well as spatially boosted features of dynamic entities in the scene, with an
  emphasis on safety-critical road users. It also proposes a Soft First-Order Logic (SFOL) reward
  function that balances human values via a symbolic reasoning module. Here, semantic and spatial
  predicates are extracted from segmentation maps and applied to linguistic rules to obtain reward
  weights. Quantitative experiments in the CARLA simulation environment show that the proposed
  neuro-symbolic representation and SFOL reward function improved policy robustness and safety-related
  performance metrics compared to baseline representations and reward formulations across varying
  traffic densities and occlusion levels. The findings demonstrate that integrating holistic
  representations and soft reasoning into Reinforcement Learning can support more context-aware and
  value-aligned decision-making for autonomous driving.
bibtex: |
  @article{asodia2026reinforcement,
    title     = {Reinforcement Learning Enhancement Using Vector Semantic Representation and Symbolic Reasoning for Human-Centered Autonomous Emergency Braking},
    author    = {Asodia, Vinal and Sharifi, Iman and Fallah, Saber},
    journal   = {arXiv preprint arXiv:2602.05079},
    year      = {2026},
    eprint    = {2602.05079},
    archivePrefix = {arXiv}
  }
---
