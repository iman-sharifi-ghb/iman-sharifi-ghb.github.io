---
title: "ANDRE: An Attention-based Neuro-symbolic Differentiable Rule Extractor for Inductive Logic Programming"
collection: publications
category: conferences
venue_short: "NeSy"
selected: true
permalink: /publication/2026-andre-nesy
excerpt: "A neuro-symbolic differentiable Inductive Logic Programming framework that learns first-order logic rules over a continuous rule space using attention-based conjunction/disjunction operators, enabling accurate, stable, and interpretable rule extraction from noisy, probabilistic data."
date: 2026-06-24
venue: "International Conference on Neurosymbolic Learning and Reasoning (NeSy)"
paperurl: "https://openreview.net/forum?id=Kqd1zKe3Go"
citation: "I. Sharifi, P. Wei, and S. Fallah. (2026). \"ANDRE: An Attention-based Neuro-symbolic Differentiable Rule Extractor for Inductive Logic Programming.\" <i>International Conference on Neurosymbolic Learning and Reasoning (NeSy)</i>, 2026."
authors: "Iman Sharifi, Peng Wei, Saber Fallah"
arxiv: "https://arxiv.org/abs/2605.04193"
slidesurl: "/files/talks/andre-nesy-2026-slides.pdf"
videourl: "/talks/2026-09-04-nesy-andre"
topics: ["Neuro-Symbolic AI"]
teaser: "teasers/2026-andre-nesy.webp"
teaser_alt: "ANDRE architecture: extracted predicates feed a rule space of prob-sum activations, attention-based conjunction layers, and an attention-based disjunction layer that outputs the learned rule."
abstract: >-
  Inductive Logic Programming (ILP) aims to learn interpretable first-order rules from data, but
  existing symbolic and neuro-symbolic approaches struggle to scale to noisy and probabilistic
  settings. Classical ILP relies on discrete combinatorial rule search and is brittle under
  uncertainty, while differentiable ILP methods typically depend on predefined rule templates or
  inaccurate fuzzy operators that suffer from vanishing gradients or poor approximation of logical
  structure when reasoning over probabilistic predicate valuations. This paper proposes an
  Attention-based Neuro-symbolic Differentiable Rule Extractor (ANDRE), a novel ILP framework that
  learns first-order logic programs by optimizing over a continuous rule space with attention-based
  logical operators. ANDRE replaces both rule templates and logical operators with fully
  differentiable, attention-driven conjunction and disjunction operators that approximate logical
  min-max semantics, enabling accurate, stable, and interpretable reasoning over probabilistic data.
  By softly selecting, negating, or excluding predicates within each rule, ANDRE supports flexible
  rule induction while preserving symbolic structure. Extensive experiments on classical ILP
  benchmarks, large-scale knowledge bases, and synthetic datasets with probabilistic predicates and
  noisy supervision demonstrate that ANDRE achieves competitive or superior predictive performance
  while reliably recovering correct symbolic rules under uncertainty. In particular, ANDRE remains
  robust to moderate label noise, substantially outperforming existing differentiable ILP methods in
  both rule extraction quality and stability.
bibtex: |
  @inproceedings{sharifi2026andre,
    title     = {ANDRE: An Attention-based Neuro-symbolic Differentiable Rule Extractor for Inductive Logic Programming},
    author    = {Sharifi, Iman and Wei, Peng and Fallah, Saber},
    booktitle = {International Conference on Neurosymbolic Learning and Reasoning (NeSy)},
    year      = {2026},
    eprint    = {2605.04193},
    archivePrefix = {arXiv},
    url       = {https://openreview.net/forum?id=Kqd1zKe3Go}
  }
---
