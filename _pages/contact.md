---
layout: base
title: Contact
description: Contact channels for EvolvBits.
permalink: /contact/
---

{% assign contents = site.data.contents %}

<main class="main page-main">
  <section class="container page-hero">
    <p class="page-hero__badge">Contact</p>
    <h1 class="page-hero__title">{{ contents.contact.title }}</h1>
    <p class="page-hero__subtitle">{{ contents.contact.text }}</p>
    <a class="btn home-btn home-btn--primary" href="mailto:{{ contents.email }}">
      {{ contents.contact.cta_label }}
    </a>
  </section>

  <section class="container page-section">
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <article class="page-card h-100">
          <h2 class="page-card__title">Email</h2>
          <p class="page-card__text">For all inquiries, use the official channel below.</p>
          <a href="mailto:{{ contents.email }}" class="page-card__link">{{ contents.email }}</a>
        </article>
      </div>
      <div class="col-12 col-lg-6">
        <article class="page-card h-100">
          <h2 class="page-card__title">Social Media</h2>
          <p class="page-card__text">Follow updates and announcements on official profiles.</p>
          <ul class="page-socials list-unstyled mb-0">
            {% for item in contents.socials.links %}
            <li>
              <a href="{{ item.url }}" target="_blank">
                <i class="{{ item.icon }}"></i> {{ item.title }}
              </a>
            </li>
            {% endfor %}
          </ul>
        </article>
      </div>
    </div>
  </section>
</main>
