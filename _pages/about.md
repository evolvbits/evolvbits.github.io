---
layout: base
title: About
description: Learn about the EvolvBits mission and values.
permalink: /about/
---

{% assign contents = site.data.contents %}

<main class="main page-main">
  <section class="container page-hero">
    <p class="page-hero__badge">About EvolvBits</p>
    <h1 class="page-hero__title">Engineering tools with practical impact.</h1>
    <p class="page-hero__subtitle">{{ contents.about.mission }}</p>
  </section>

  <section class="container page-section">
    <div class="row g-4">
      {% for value in contents.about.values %}
      <div class="col-12 col-md-6 col-lg-4">
        <article class="page-card h-100">
          <h2 class="page-card__title">{{ value.title }}</h2>
          <p class="page-card__text">{{ value.text }}</p>
        </article>
      </div>
      {% endfor %}
    </div>
  </section>
</main>
