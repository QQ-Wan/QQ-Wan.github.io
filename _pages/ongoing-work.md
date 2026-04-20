---
layout: page
permalink: /ongoing-work/
title: ongoing work
nav: true
nav_order: 3
description:
---

<!-- Add your poster PDFs to assets/pdf/posters/ and list them below.
     For each poster, copy the block and update the title and filename. -->

{% assign posters = "poster_example.pdf" | split: "," %}

{% comment %}
  To add posters, replace the example above with your actual filenames, e.g.:
  {% assign posters = "poster_psychonomics_2025.pdf,poster_srcd_2025.pdf" | split: "," %}
  And add a titles array to match:
  {% assign titles = "Multimodal Attention Capture in Real-World Exploration|How Working Memory Shapes Early Attention and Learning" | split: "|" %}
{% endcomment %}

<p style="color: #666; font-style: italic;">Posters will be added here soon. Check back for updates on ongoing research projects.</p>

<!--
To add a poster, uncomment and duplicate this block:

<div style="margin-bottom: 2rem;">
  <h3>Your Poster Title Here</h3>
  <div style="text-align: left; margin-bottom: 0.5rem;">
    <a href="{{ '/assets/pdf/posters/your_poster.pdf' | relative_url }}" class="btn btn-sm z-depth-0" role="button" target="_blank">
      <i class="fas fa-download"></i> Download PDF
    </a>
  </div>
  <div style="width: 100%; height: 80vh;">
    <iframe src="{{ '/assets/pdf/posters/your_poster.pdf' | relative_url }}" width="100%" height="100%" style="border: none;"></iframe>
  </div>
</div>
-->
