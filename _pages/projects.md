---
layout: base
title: Projects
description: Public EvolvBits projects and roadmap.
permalink: /projects/
---

{% assign contents = site.data.contents %}

<main class="main page-main">
  <section class="container page-hero">
    <p class="page-hero__badge">Projects</p>
    <h1 class="page-hero__title">Public tools and active roadmap.</h1>
    <p class="page-hero__subtitle">
      Evolving projects focused on developer productivity, automation, and maintainable delivery workflows.
    </p>
  </section>

  <section class="container page-section">
    <div class="row g-4">
      {% for project in contents.projects.featured %}
      <div class="col-12 col-lg-6">
        <article class="page-card h-100">
          <h2 class="page-card__title">{{ project.name }}</h2>
          <p class="page-card__text">{{ project.description }}</p>
          <p class="page-card__meta">
            {% for tag in project.tags %}
            <span>{{ tag }}</span>
            {% endfor %}
          </p>
          <a href="{{ project.url }}" class="page-card__link" target="_blank">Open project</a>
        </article>
      </div>
      {% endfor %}
    </div>
  </section>

  <section class="container page-section">
    <div class="page-roadmap">
      <h2>Roadmap</h2>
      <ul>
        {% for item in contents.projects.roadmap %}
        <li>{{ item }}</li>
        {% endfor %}
      </ul>
    </div>
  </section>
</main>
