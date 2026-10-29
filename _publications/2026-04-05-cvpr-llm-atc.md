---
title: "Fine-Tuning Large Language Models for Cooperative Tactical Deconfliction of Small Unmanned Aerial Systems"
collection: publications
category: conferences
venue_short: "CVPR-W"
selected: true
permalink: /publication/2026-cvpr-llm-atc
excerpt: "Explores supervised fine-tuning and Group Relative Policy Optimization (GRPO) to adapt large language models for centralized conflict resolution and safe separation assurance in cooperative multi-agent sUAS operations."
date: 2026-04-05
venue: "Proceedings of the Computer Vision and Pattern Recognition (CVPR) Workshops"
paperurl: "https://arxiv.org/abs/2603.28561"
citation: "I. Sharifi, A. Zongo, and P. Wei. (2026). \"Fine-Tuning Large Language Models for Cooperative Tactical Deconfliction of Small Unmanned Aerial Systems.\" <i>CVPR Workshops</i>, 2026."
authors: "Iman Sharifi, Alex Zongo, Peng Wei"
arxiv: "https://arxiv.org/abs/2603.28561"
talk: "/talks/2026-06-04-cvpr-poster"
topics: ["LLMs", "Drones & Air Mobility"]
teaser: "teasers/2026-cvpr-llm-atc.webp"
teaser_alt: "Overview: a simulation-to-language dataset generator feeds a fine-tuned LLM that issues deconfliction actions to drones flying over a vertiport network."
abstract: >-
  The growing deployment of small Unmanned Aerial Systems (sUASs) in low-altitude airspaces has
  increased the need for reliable tactical deconfliction under safety-critical constraints. Tactical
  deconfliction involves short-horizon decision-making in dense, partially observable, and
  heterogeneous multi-agent environments, where both cooperative separation assurance and operational
  efficiency must be maintained. While Large Language Models (LLMs) exhibit strong reasoning
  capabilities, their direct application to air traffic control remains limited by insufficient domain
  grounding and unpredictable output inconsistency. This paper investigates LLMs as decision-makers in
  cooperative multi-agent tactical deconfliction using fine-tuning strategies that align model outputs
  to human operator heuristics. We propose a simulation-to-language data generation pipeline based on
  the BlueSky air traffic simulator that produces rule-consistent deconfliction datasets reflecting
  established safety practices. A pretrained Qwen-Math-7B model is fine-tuned using two
  parameter-efficient strategies: supervised fine-tuning with Low-Rank Adaptation (LoRA) and
  preference-based fine-tuning combining LoRA with Group-Relative Policy Optimization (GRPO).
  Experimental results on validation datasets and closed-loop simulations demonstrate that supervised
  LoRA fine-tuning substantially improves decision accuracy, consistency, and separation performance
  compared to the pretrained LLM, with significant reductions in near mid-air collisions. GRPO
  provides additional coordination benefits but exhibits reduced robustness when interacting with
  heterogeneous agent policies.
bibtex: |
  @inproceedings{sharifi2026finetuning,
    title     = {Fine-Tuning Large Language Models for Cooperative Tactical Deconfliction of Small Unmanned Aerial Systems},
    author    = {Sharifi, Iman and Zongo, Alex and Wei, Peng},
    booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) Workshops},
    year      = {2026},
    eprint    = {2603.28561},
    archivePrefix = {arXiv}
  }
---
