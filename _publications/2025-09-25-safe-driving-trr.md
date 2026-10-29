---
title: "Toward Safe Autonomous Highway Driving Policies using a Neuro-Symbolic Deep Reinforcement Learning Approach"
collection: publications
category: manuscripts
venue_short: "TRR"
selected: true
permalink: /publication/2025-safe-driving-trr
excerpt: "A neuro-symbolic deep reinforcement learning framework integrating symbolic reasoning and neural control to ensure safety and interpretability in autonomous driving systems."
date: 2025-09-25
venue: "Transportation Research Record (TRR)"
paperurl: "https://doi.org/10.1177/03611981251357006"
citation: "I. Sharifi, M. Yildirim, and S. Fallah. (2025). \"Toward Safe Autonomous Highway Driving Policies using a Neuro-Symbolic Deep Reinforcement Learning Approach.\" <i>Transportation Research Record</i>, 2680(1), 416–431."
authors: "Iman Sharifi, Mustafa Yildirim, Saber Fallah"
arxiv: "https://arxiv.org/abs/2307.01316"
doi: "10.1177/03611981251357006"
codeurl: "https://github.com/iman-sharifi-ghb/Safe-Reinforcement-Learning-via-Symbolic-Logical-Programming-for-Autonomous-Highway-Driving"
topics: ["Neuro-Symbolic AI", "Reinforcement Learning", "Autonomous Driving"]
teaser: "teasers/2025-safe-driving-trr.webp"
teaser_alt: "Framework: a symbolic logic programming (SLP) core restricts the DQN to safe actions, which a low-level controller executes on the autonomous vehicle."
abstract: >-
  The dynamic nature of driving environments and the presence of diverse road users pose significant
  challenges for decision-making in autonomous driving. Deep reinforcement learning (DRL) has emerged
  as a popular approach to tackle this problem. However, the application of existing DRL solutions is
  mainly confined to simulated environments because of safety concerns, impeding their deployment in
  real-world environments. To overcome this limitation, this paper introduces a novel neuro-symbolic
  model-free DRL approach, called DRL with symbolic logic (DRLSL) that combines the strengths of DRL
  (learning from experience) and symbolic first-order logic (knowledge-driven reasoning) to enable
  safe learning in real-time interactions of autonomous driving within real environments. This
  innovative approach provides a means to learn autonomous driving policies by actively engaging with
  the physical environment while ensuring safety. We have implemented the DRLSL framework in a highway
  driving scenario using the HighD dataset and demonstrated that our method successfully avoids unsafe
  actions during both the training and testing phases. Furthermore, our results indicate that DRLSL
  achieves faster convergence during training and exhibits better generalizability to new highway
  driving scenarios compared to traditional DRL methods.
bibtex: |
  @article{sharifi2025toward,
    title     = {Toward Safe Autonomous Highway Driving Policies using a Neuro-Symbolic Deep Reinforcement Learning Approach},
    author    = {Sharifi, Iman and Yildirim, Mustafa and Fallah, Saber},
    journal   = {Transportation Research Record},
    volume    = {2680},
    number    = {1},
    pages     = {416--431},
    year      = {2025},
    doi       = {10.1177/03611981251357006}
  }
---
