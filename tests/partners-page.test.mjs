import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

// Run after npm run build:netlify: validate the actual deployable HTML.
const output = new URL("../out/", import.meta.url);
const home = await readFile(new URL("index.html", output), "utf8");
const page = await readFile(new URL("partners/index.html", output), "utf8");

test("homepage opens the local Partner page with shared navigation and footer", () => {
  assert.match(home, /<a[^>]*href="\/partners\/"[^>]*>Scopri i partner<\/a>/);
  for (const tag of ["header", "footer"]) {
    const markup = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`);
    assert.equal(
      home.match(markup)?.[0].replaceAll('href="#', 'href="/#'),
      page.match(markup)?.[0],
    );
  }
});

test("four updated principal partners and nine network partners are server-rendered", () => {
  const cards = page.match(/<article class="partner-principal-card"[\s\S]*?<\/article>/g) ?? [];
  assert.equal(cards.length, 4);
  assert.deepEqual(cards.map((card) => card.match(/<h3[^>]*>(.*?)<\/h3>/)?.[1].replace(/<[^>]+>/g, "")), [
    "Forbes Next Leaders", "Deloitte", "Fair Play Consulting", "5JES",
  ]);
  assert.equal((page.match(/<article class="partner-network-card" data-copy="original"/g) ?? []).length, 9);
  const headline = page.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1].replace(/<br\/?\s*>/g, " ").replace(/<[^>]+>/g, "");
  assert.equal(headline, "Il mezzo per la crescita condivisa.");
  assert.doesNotMatch(cards.join(""), /Partner principale<|partner-principal-topline/);
  assert.match(page, /<title>Partner - JEVE<\/title>/);
});

test("all partner-page anchor targets and local image assets exist", async () => {
  const ids = new Set([...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const match of page.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(ids.has(match[1]), `Missing anchor ${match[1]}`);
  }
  const images = new Set([...page.matchAll(/<img\b[^>]*\bsrc="(\/[^"?]+)"/g)].map((match) => match[1]));
  for (const src of images) await access(new URL(src.slice(1), output));
  assert.ok(images.has("/partners/scientifica-vc-transparent.png"));
  assert.ok(images.has("/partners/gruppo-italia-retail-transparent.png"));
});

test("the simplified Hero has only the four principals and one final partnership CTA", () => {
  const hero = page.match(/<section class="partner-hero"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  assert.equal((hero.match(/class="partner-orbit-node"/g) ?? []).length, 4);
  assert.match(hero, /src="\/partners\/principal-5jes-square\.png"/);
  assert.doesNotMatch(hero, /principal-5jes-square-v2\.png/);
  const heroImages = [...hero.matchAll(/<img\b[^>]*\balt="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(heroImages)].sort(), [
    "5JES", "BFC Media S.p.A. — Forbes Next Leaders", "Deloitte", "Fair Play Consulting",
  ].sort());
  assert.doesNotMatch(hero, /Diventa partner|partner-orbit-stats/);
  assert.equal((hero.match(/class="partner-engagement-node"/g) ?? []).length, 4);
  assert.match(hero, /--engagement-duration:/);
  assert.equal((hero.match(/class="[^"]*partner-engagement-appear/g) ?? []).length, 7);
  const main = page.match(/<main>[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.doesNotMatch(main, /[↗↓→]|Parliamone|>0[1-4]</);
  assert.doesNotMatch(main, /Metti in pausa|Riprendi scorrimento|class="partner-network-pause"/);
  assert.match(main, /id="partner-network-instructions"/);
  assert.match(main, /aria-describedby="partner-network-instructions"/);
  const animatedTexts = [...main.matchAll(/<(\w+)\b[^>]*class="[^"]*partner-text-reveal/g)];
  assert.deepEqual(animatedTexts.map((match) => match[1]), ["h1", "h2", "h2", "h2", "h2"]);
  assert.doesNotMatch(main, /partner-reveal-word|--word-delay/);
  assert.equal((main.match(/href="mailto:info@jeve\.it\?subject=Partnership%20con%20JEVE"/g) ?? []).length, 1);
  for (const id of ["recruiting", "eventi", "social-media"]) {
    const article = page.match(new RegExp(`<article[^>]*id="${id}"[\\s\\S]*?<\\/article>`))?.[0];
    assert.ok(article, `Missing opportunity ${id}`);
    assert.doesNotMatch(article, /<a\b/);
  }
});
