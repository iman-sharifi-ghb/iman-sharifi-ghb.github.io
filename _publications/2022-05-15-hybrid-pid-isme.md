---
title: "Self-Tuning PID Control via a Hybrid Actor-Critic-Based Neural Structure for Quadcopter Control"
collection: publications
category: conferences
venue_short: "ISME"
permalink: /publication/2022-hybrid-pid-isme
excerpt: "Introduces a hybrid actor-critic neural structure for self-tuning PID control of quadcopters, improving dynamic response and robustness."
date: 2022-05-15
venue: "30th Annual International Conference of Iranian Society of Mechanical Engineers (ISME)"
paperurl: "https://arxiv.org/pdf/2307.01312"
citation: "I. Sharifi and A. Alasty. (2022). \"Self-Tuning PID Control via a Hybrid Actor-Critic-Based Neural Structure for Quadcopter Control.\" <i>ISME Conference</i>, 2022."
authors: "Iman Sharifi, Aria Alasty"
arxiv: "https://arxiv.org/abs/2307.01312"
codeurl: "https://github.com/iman-sharifi-ghb/Self-Tuning-PID-Control-using-Reinforcement-Learning-Based-Neural-Network"
topics: ["Reinforcement Learning", "Drones & Air Mobility"]
abstract: >-
  Proportional-Integrator-Derivative (PID) controller is used in a wide range of industrial and
  experimental processes. There are a couple of offline methods for tuning PID gains. However, due to
  the uncertainty of model parameters and external disturbances, real systems such as Quadrotors need
  more robust and reliable PID controllers. In this research, a self-tuning PID controller using a
  Reinforcement-Learning-based Neural Network for attitude and altitude control of a Quadrotor has
  been investigated. An Incremental PID, which contains static and dynamic gains, has been considered
  and only the variable gains have been tuned. To tune dynamic gains, a model-free actor-critic-based
  hybrid neural structure was used that was able to properly tune PID gains, and also has done the
  best as an identifier. In both tunning and identification tasks, a Neural Network with two hidden
  layers and sigmoid activation functions has been learned using Adaptive Momentum (ADAM) optimizer
  and Back-Propagation (BP) algorithm. This method is online, able to tackle disturbance, and fast in
  training. In addition to robustness to mass uncertainty and wind gust disturbance, results showed
  that the proposed method had a better performance when compared to a PID controller with constant
  gains.
bibtex: |
  @inproceedings{sharifi2022selftuning,
    title     = {Self-Tuning PID Control via a Hybrid Actor-Critic-Based Neural Structure for Quadcopter Control},
    author    = {Sharifi, Iman and Alasty, Aria},
    booktitle = {30th Annual International Conference of the Iranian Society of Mechanical Engineers (ISME)},
    year      = {2022},
    eprint    = {2307.01312},
    archivePrefix = {arXiv}
  }
---
