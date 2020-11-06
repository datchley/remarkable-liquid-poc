# <liquid-prop>{{ frontMatter.title }}</liquid-prop>

<liquid-prop>{{ frontMatter.author }}</liquid-prop>

> This is a blockquote!

---

  <p>Color: {{color}}</p>
  
***

# Headings

{% for i in (1..6) %}
{{ '#' | repeat: i }} h{{i}} Heading
{% endfor %}

Some other text in between

<liquid-if>
{% if color == "blue" %}
  The color blue is awesome!
{% elsif color == "red" %}
  The color red sucks!
{% else %}
  The color {{color}} is ok, ...I guess.
{% endif %}
</liquid-if>

## Horizontal Rules

Some other text in between

---
