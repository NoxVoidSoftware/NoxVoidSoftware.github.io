---
description: "How Wishly protects your Jira data and your portal visitors: Forge, signed requests, signed cookies, single-use sign-in links, and abuse protection."
updated: 2026-11-23
---

This page describes how **Wishly: Public Feedback Portal for Jira Product Discovery** protects your Jira data and the people who use your feedback portal. For what data is collected and why, see the [Privacy Policy](privacy-wishly.html).

## Architecture

- **Jira side — Atlassian Forge.** Settings, moderation, and vote-count updates run on Atlassian Forge. Actions taken by your team in Jira use that person's own Jira permissions.
- **Portal — Cloudflare.** The public portal runs on Cloudflare Workers with a Cloudflare D1 database. It receives only the ideas you mark public and the portal settings, never other Jira content.

## Data protection

- **Encryption in transit**: all traffic between Jira, the portal, and visitors' browsers uses TLS.
- **Encryption at rest**: the portal database is encrypted at rest by Cloudflare.
- **Signed requests**: calls between Jira and the portal are authenticated through Atlassian Forge Remote, and vote notifications from the portal to Jira are signed and time-limited.
- **Signed cookies & single-use links**: the voter cookie is signed so it cannot be forged, and email confirmation links work once and expire within a day.
- **Secure sign-in**: Google and GitHub sign-in use signed, single-use state and PKCE, and accept only verified email addresses.
- **No raw IP addresses**: rate limiting uses a hash of the visitor's IP address that changes every day.
- **Private boards**: private portals are never cached at the edge, are hidden from search engines, and never reveal their allowed email domains.

## Abuse protection

Cloudflare Turnstile checks that a first vote comes from a person, per-network rate limits slow down vote and suggestion floods, and suspicious votes are flagged.

## Subprocessors

- **Atlassian** — Forge hosting and storage
- **Cloudflare** — portal hosting, database, and Turnstile
- **Resend** — confirmation and status-update emails
- **Google** and **GitHub** — optional visitor sign-in

## Development & access security

- **Multi-factor authentication** is enforced on all accounts used to build, deploy, and operate the App, including source control, cloud consoles, and the Atlassian developer console.
- **Automated tests** cover authentication, rate limiting, and data visibility rules and run before every release.
- **Least privilege**: the App requests only the Forge permissions it needs. The full list of permissions is shown on the Marketplace listing under "Integration permissions".

{{> security/incident-response}}

{{> security/reporting-a-vulnerability}}
