---
title: "Competent Autonomous Driving Through Fine Tuning Vision Language Action Models with Symbolic Traffic Rules"
collection: publications
category: preprints
venue_short: "arXiv"
permalink: /publication/2026-rule-guided-vla
excerpt: "A rule-guided vision-language-action (VLA) framework that fine-tunes a Qwen3-VL driving policy with reinforcement learning, using UK Highway Code provisions encoded as first-order logic rules in PyReason as reward feedback, evaluated on CARLA data."
date: 2026-11-16
venue: "arXiv preprint"
paperurl: "https://arxiv.org/abs/2611.20648"
citation: "B. Dagda, V. Asodia, I. Sharifi, P. Wei, and S. Fallah. (2026). \"Competent Autonomous Driving Through Fine Tuning Vision Language Action Models with Symbolic Traffic Rules.\" <i>arXiv preprint</i> arXiv:2611.20648."
authors: "Barkin Dagda, Vinal Asodia, Iman Sharifi, Peng Wei, Saber Fallah"
arxiv: "https://arxiv.org/abs/2611.20648"
topics: ["Neuro-Symbolic AI", "LLMs", "Reinforcement Learning", "Autonomous Driving"]
teaser: "teasers/2026-rule-guided-vla.webp"
teaser_alt: "Rule-guided VLA framework: a Qwen3-VL policy is first fine-tuned on expert driving data, then refined with GRPO, GDPO, and Dr. GRPO using rewards from a PyReason engine that checks UK Highway Code rules."
abstract: >-
  Vision-language-action (VLA) models offer a unified approach to perception, reasoning, and control
  for autonomous driving, but accurate action prediction alone does not establish compliance with
  traffic regulations. This paper presents a rule-guided VLA framework that incorporates symbolic
  traffic-rule feedback into policy optimisation. The framework combines supervised fine-tuning on
  expert demonstrations with reinforcement learning (RL) refinement using a reward that encourages
  encoded-rule compliance while penalising deviations from expert actions. Selected provisions of the
  United Kingdom Highway Code are formalised as executable first-order logic rules using PyReason,
  covering speed adaptation, following distance, and road-user priority. A frozen vision-language
  model extracts scene predicates, which are combined with vehicle-state information to assess the
  projected consequences of candidate control actions. Offline evaluation on held-out data collected
  in the CARLA simulator compares three group-based RL methods. The results show improvements in both
  action prediction accuracy and encoded-rule compliance over the supervised baseline. The
  best-performing variant increases the overall rule pass rate from 92.9% to 97.6%, with zero observed
  violations of the encoded road-user-priority check in the evaluated samples. These findings support
  symbolic rule feedback as a means of improving VLA policy alignment with explicit traffic-rule
  criteria.
bibtex: |
  @article{dagda2026competent,
    title     = {Competent Autonomous Driving Through Fine Tuning Vision Language Action Models with Symbolic Traffic Rules},
    author    = {Dagda, Barkin and Asodia, Vinal and Sharifi, Iman and Wei, Peng and Fallah, Saber},
    journal   = {arXiv preprint arXiv:2611.20648},
    year      = {2026},
    eprint    = {2611.20648},
    archivePrefix = {arXiv}
  }
---
