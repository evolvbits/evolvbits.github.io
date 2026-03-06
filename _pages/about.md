---
layout: base
title: About
description: Learn about the EvolvBits mission and values.
permalink: /about/
---

{% assign contents = site.data.contents %}

<main class="main page-main">
  <section class="container page-hero" data-reveal>
    <p class="page-hero__badge">About EvolvBits</p>
    <h1 class="page-hero__title">A unified ecosystem of practical tools.</h1>
    <p class="page-hero__subtitle">{{ contents.about.intro }}</p>
  </section>

  <section class="container page-section" data-reveal>
    <article class="page-card">
      <h2 class="page-card__title">Mission</h2>
      <p class="page-card__text">{{ contents.about.mission }}</p>
    </article>
  </section>

  <section class="container page-section" data-reveal>
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <article class="page-card h-100" data-reveal>
          <h2 class="page-card__title">Philosophy</h2>
          <ul class="page-list mb-0">
            {% for line in contents.about.philosophy %}
            <li>{{ line }}</li>
            {% endfor %}
          </ul>
        </article>
      </div>
      <div class="col-12 col-lg-6">
        <article class="page-card h-100" data-reveal>
          <h2 class="page-card__title">Contributing</h2>
          <p class="page-card__text">{{ contents.about.collaboration.text }}</p>
          <ol class="page-steps mb-0">
            {% for step in contents.about.collaboration.steps %}
            <li>{{ step }}</li>
            {% endfor %}
          </ol>
        </article>
      </div>
    </div>
  </section>
</main>
