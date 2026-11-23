---
description: "How Wishly (Jira Product Discovery app by NoxVoid Software) handles data from your Jira site and from the people who vote on your public feedback portal."
updated: 2026-11-23
---

## Introduction & scope

NoxVoid Software ("NoxVoid", "we", "us", or "our") respects your privacy. This Privacy Policy explains how **Wishly: Public Feedback Portal for Jira Product Discovery** (the "App") handles data when your organization installs it on a Jira Cloud site, and when people visit, vote on, or sign in to a Wishly feedback portal (a "Portal").

The App has two parts: a Jira part built on Atlassian Forge, and the Portal, hosted on Cloudflare at wishly.noxvoid.workers.dev (or a successor domain we announce on this page).

For the purposes of applicable data protection laws (including the EU GDPR and UK GDPR), NoxVoid acts as a **Data Processor** for the voter and suggestion data collected through your Portal. The organization that runs the Portal remains the **Data Controller** of that data.

## Data stored in your Jira site (Atlassian Forge)

App settings (which project is published, field and status mappings, Portal branding) are stored in Atlassian's Forge storage for your Jira site. The App writes vote counts into the Jira Product Discovery fields your administrator selects, and, when a moderator approves or merges a suggestion, it creates an idea or adds a comment as that moderator. Comments name the suggester's company email domain (for example "someone at example.com"), never their email address.

## Data the Portal receives from Jira

The Portal receives only what your team publishes:

- for each idea marked public: its title, summary, public status, and the optional "Update from the team" text;
- the Portal's name, logo, colours, and settings, including any allowed email domains (never shown publicly).

The Portal does not receive other Jira fields, comments, attachments, or user data.

## Data collected from Portal visitors

- **Votes and follows**: which ideas a visitor voted for or chose to follow.
- **Email address** (optional): when a visitor confirms their vote, subscribes to updates, signs in to a private board, or suggests an idea. Email addresses are confirmed with a one-time link.
- **Google or GitHub sign-in** (optional): if a visitor chooses it, we receive only their verified email address from Google or GitHub. We do not receive passwords, contacts, or repository data.
- **Suggestions**: the title and description a visitor submits.
- **Network information**: the visitor's IP address is used only to compute a hash that changes every day, for rate limiting and abuse detection. We do not store raw IP addresses.
- **Cookies**: a signed cookie that remembers the visitor's votes on that Portal (valid for one year), and a short-lived cookie (about 10 minutes) that protects Google/GitHub sign-in. We use no advertising or analytics cookies.

## How we use data

We use the data above only to provide the App:

- counting votes and writing the totals to your Jira Product Discovery fields;
- showing visitors which ideas they voted for or follow;
- sending one-time confirmation links and the status-update emails a visitor subscribed to;
- passing suggestions to your team for moderation;
- security, abuse prevention, and troubleshooting when you contact support.

Voter email addresses are never shown on the Portal or written to Jira. We do not sell, rent, or monetize data, and we do not use it for advertising or profiling.

## Subprocessors

- **Atlassian** — Forge platform hosting and storage for the Jira part of the App
- **Cloudflare, Inc.** — Portal hosting, database, and bot protection (Cloudflare Turnstile)
- **Resend** — delivery of confirmation and status-update emails
- **Google LLC** and **GitHub, Inc.** — only when a visitor chooses to sign in with them

## Data retention & deletion

- Every status-update email contains an unsubscribe link that takes effect immediately.
- One-time email links expire after use or within a day.
- Unsent emails are dropped after 7 days.
- Votes, follows, and confirmed email addresses are kept while the Portal exists, so that vote counts stay accurate.
- When your organization uninstalls the App or asks us to remove a Portal, we delete that Portal's data, including votes, emails, and suggestions, within 30 days of a request to the address below. Data in Forge storage is removed by Atlassian under its retention rules.

## Security

All traffic uses TLS. Messages between Jira and the Portal are signed, voter cookies are signed, sign-in links are single-use, and data is encrypted at rest by our hosting providers. See the [Wishly Security](security-wishly.html) page for details.

{{> privacy/support-requests}}

## Your rights (GDPR & CCPA)

Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data. If you voted or suggested an idea on a Portal, you can contact the organization that runs it, or write to us directly at the address below and we will help. You can stop status emails at any time with the unsubscribe link in each email.

{{> privacy/policy-updates}}

## Contact

For privacy questions, data subject requests, or security disclosures:  
NoxVoid Software — Email: [support@collectly.cloud](mailto:support@collectly.cloud)
