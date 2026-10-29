---
title: "ANDRE: An Attention-based Neuro-symbolic Differentiable Rule Extractor for Inductive Logic Programming"
collection: talks
type: "Conference Talk (online)"
permalink: /talks/2026-09-04-nesy-andre
venue: "International Conference on Neurosymbolic Learning and Reasoning (NeSy 2026)"
date: 2026-09-04
location: "Lisbon, Portugal"
excerpt: "How ANDRE learns first-order logic rules from noisy, probabilistic data without rule templates, using attention as a differentiable stand-in for logical AND and OR."
video: "kw_2Ngg1cgk"
video_cover: "/images/talks/andre-nesy-2026.webp"
thumb: "/images/talks/andre-nesy-2026-thumb.webp"
slidesurl: "/files/talks/andre-nesy-2026-slides.pdf"
paper: "/publication/2026-andre-nesy"
---

I presented our paper *ANDRE: An Attention-based Neuro-symbolic Differentiable Rule Extractor for Inductive Logic Programming* online at **NeSy 2026**, the International Conference on Neurosymbolic Learning and Reasoning, held in Lisbon, Portugal, on **September 4, 2026**.

The talk walks through why differentiable inductive logic programming struggles in practice (hand-written rule templates, product-based logic operators with vanishing gradients, and brittleness under label noise) and how ANDRE addresses each one:

- **A continuous, template-free rule space.** Every candidate body predicate can be included, negated, or excluded, and these choices are learned as probabilities by gradient descent.
- **Attention as logic.** Softmin and softmax attention give a close, differentiable approximation of min and max, so conjunction and disjunction stay faithful while gradients stay alive.
- **Results.** Correct rules on all ten classical ILP tasks, an average accuracy gain of 21.6% over DFORL on probabilistic datasets, and exact recovery of 9 of 14 ground-truth rules under noisy supervision.
