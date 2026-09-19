---
title: Privacy Policy / Datenschutzerklärung
description: "How niobe.dev handles personal data under the GDPR: no cookies, no tracking scripts, no third-party requests."
updated: 2026-09-20
---

## The short version

This site sets **no cookies**, runs **no tracking scripts**, and makes **no
requests to third-party servers**. Fonts, styles, scripts and images are all
served from this domain. Nothing is stored on your device and nothing is read
from it, so there is no consent banner to click away — there is nothing to
consent to.

Where the site needs something from GitHub — the newest version number, the
installer — the server fetches it and hands you the answer. Your browser never
talks to GitHub, so your address is never disclosed to it.

What remains is unavoidable: to send you this page, the server has to receive a
request from your device, and that request is logged. The rest of this document
explains that in the detail the GDPR requires.

## Controller / *Verantwortlicher*

<p class="address">Viacheslav Shynkarenko<br>
c/o<span aria-hidden="true" style="display:none">·</span> COCENTER<br>
Koppoldstr.<span aria-hidden="true" style="display:none">·</span> 1<br>
86<span aria-hidden="true" style="display:none">·</span>551 Aichach<br>
Germany</p>

Email: <a class="mail">slavik&#64;<span aria-hidden="true" style="display:none">nospam-</span>slavikdev&#46;com</a>

No data protection officer has been appointed. This is a private,
non-commercial website processing personal data on a very small scale, so the
thresholds in Art. 37 GDPR and § 38 BDSG are not met.

## Server log data

This site runs on Cloudflare Workers. When you open a page, your browser
necessarily transmits technical information which Cloudflare processes to
deliver the page and keep the service secure:

- IP address
- date and time of the request
- the page or file requested
- referring URL, if your browser sends one
- browser type and version, and operating system

**Purpose:** delivering the website, ensuring stability and security, and
defending against attacks and abuse.
**Legal basis:** Art. 6 (1) (f) GDPR. The legitimate interest is operating a
functioning, secure website.
**Retention:** this data is held by Cloudflare under its own retention policy
and is not merged by me with any other data, nor used to identify individual
visitors.

## Hosting

**Cloudflare** — Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107,
USA. Cloudflare serves the whole site: DNS, TLS termination, caching, and the
worker and static files themselves, from an edge location near you. There is no
separate origin server behind it.

Cloudflare is based in the United States, so personal data is transferred to a
third country. Cloudflare is certified under the EU-U.S. Data Privacy Framework,
for which the European Commission adopted an adequacy decision on 10 July 2023,
and additionally offers Standard Contractual Clauses under Art. 46 (2) (c) GDPR.
Transfers therefore take place on the basis of Art. 45 (1) GDPR.

## Operational logging

Cloudflare's Workers observability is switched on for this site. It records
request metadata — the path, the response status, how long the request took, and
any error — so that a page that breaks can be found and fixed. It is retained
for a short period under Cloudflare's own policy and is not used to build a
profile of anyone or merged with other data.

**Legal basis:** Art. 6 (1) (f) GDPR, the legitimate interest being to keep the
site working.

## Fonts

All typefaces are served **from this domain**. They are not loaded from Google
Fonts or any other external service, so opening a page transmits nothing to
Google and creates no connection to a third-party font provider.

## Cookies and local storage

None. This site sets no cookies of any kind — not for analytics, not for
preferences, not for sessions — and stores nothing in local storage or session
storage. Accordingly, no consent under § 25 TDDDG is required, and there is no
consent banner.

## What the pages request

A page on this site makes exactly one request of its own after loading: to
`/api/release` on this domain, to find out which version of Niobe is current, so
that a page built weeks ago does not name an old one. That request goes to this
site, not to GitHub. The server asks GitHub on its behalf, from Cloudflare's
edge, and your address is not part of that.

## Installing Niobe

`https://niobe.dev/install.sh` serves the installer that was published with the
newest release. Your machine fetches it from this domain, the same as any page.

The script itself then downloads the release archive and its checksum **directly
from GitHub** (`github.com` and `release-assets.githubusercontent.com`). At that
point your IP address and the request reach GitHub, Inc., 88 Colin P. Kelly Jr.
Street, San Francisco, CA 94107, USA, and
[GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement)
applies to it. The same is true of the longer command that fetches the installer
from GitHub directly. GitHub is certified under the EU-U.S. Data Privacy
Framework.

Niobe itself sends nothing anywhere. It has no telemetry, no update check and no
crash reporter: once installed, it makes network calls only to the provider CLI
it drives and to that provider's API. Nothing about your use of it reaches me or
this site.

## Links to GitHub

The source code, the releases and the issue tracker are on GitHub, and this site
links to them. Following one of those links takes you to GitHub and GitHub's
privacy statement applies from that point. Nothing is transmitted to GitHub
while you are merely reading a page here.

## Contacting me by email

If you email me, your address and the content of your message are processed
solely to handle your enquiry.

**Legal basis:** Art. 6 (1) (f) GDPR, and Art. 6 (1) (b) GDPR where your message
concerns a prospective or existing agreement.
**Retention:** until your enquiry is settled, unless statutory retention periods
apply. You can ask me to delete the correspondence at any time.

An issue you open on GitHub instead is public and is processed by GitHub under
its own terms, not by me under this policy.

## The releases feed

The feed at `/releases.xml` is a static file. Requesting it is logged exactly
like any other page request and involves no additional processing.

## Your rights

Under the GDPR you have the right to:

- **Access** — confirmation of whether I process data about you, and a copy of
  it (Art. 15)
- **Rectification** — correction of inaccurate data (Art. 16)
- **Erasure** — deletion of your data (Art. 17)
- **Restriction** — limitation of processing (Art. 18)
- **Data portability** — your data in a structured, machine-readable format
  (Art. 20)
- **Objection** — to processing based on legitimate interests, on grounds
  relating to your particular situation (Art. 21)

To exercise any of these, email
<a class="mail">slavik&#64;<span aria-hidden="true" style="display:none">nospam-</span>slavikdev&#46;com</a>.
Where processing is ever based on consent, you may withdraw it at any time with
effect for the future, without affecting the lawfulness of processing carried
out beforehand.

## Right to lodge a complaint

You have the right to complain to a data protection supervisory authority under
Art. 77 GDPR — in the EU member state of your residence, your place of work, or
the place of the alleged infringement.

The authority responsible for me is **Bayerisches Landesamt für
Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach**.

## Changes to this policy

This policy is updated when the site changes in a way that affects it — for
example if analytics were ever enabled, or if a page began loading something
from another server. The current version always applies.

---

Written in English because this site is published in English, with the German
statutory terms given alongside. See also the
[Legal Notice / Impressum](/legal-notice).
