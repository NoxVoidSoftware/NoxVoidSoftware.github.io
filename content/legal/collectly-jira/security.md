---
description: "How Collectly for Jira protects your Jira data and client submissions: Forge, signed expiring links, encryption, and secure development."
updated: 2026-11-16
---

This page describes how **Collectly: Client Forms & Document Requests for Jira** protects your Jira data and the information your clients submit. For what data is collected and why, see the [Privacy Policy](privacy-collectly-jira.html).

## Architecture

- **Jira side — Atlassian Forge.** The Jira part of the App is a Forge app. Requests, form answers, review decisions, and settings are stored in Atlassian's Forge storage for your site. The App reads and writes only the Jira work items where your team uses it.
- **Client portal — collectly.cloud.** Your clients answer and upload through the Collectly portal, hosted on Google Cloud. It receives only what is needed to show a request: title, description, form fields, client name and email, due date, and the client's answers.
- **File storage.** Your Jira administrator chooses where files are kept: Jira attachments, Collectly storage (Cloudflare R2, Western Europe), or your own Amazon S3, Azure Blob Storage, or Google Cloud Storage bucket.

## Data protection

- **Encryption in transit**: all traffic between Jira, collectly.cloud, storage, and your clients' browsers uses TLS.
- **Encryption at rest**: files in Collectly storage and data in our database are encrypted at rest by our cloud providers.
- **Signed requests**: every call between Jira and collectly.cloud is signed and verified.
- **Signed, expiring client links**: each client gets a personal signed link that expires on the request's due date. Clients do not need an Atlassian account and never get access to your Jira site.
- **Encrypted credentials**: credentials for your own storage or email provider are stored encrypted on collectly.cloud and are never shown again in Jira after you save them.
- **Short-lived transfer storage**: files on their way to Jira are kept only until they are attached; leftovers are deleted automatically within two days.

## Subprocessors

- **Atlassian** — Forge hosting and storage
- **Google Cloud** — client portal hosting and database
- **Cloudflare** — Collectly file storage (R2, Western Europe)
- **Resend** — client email delivery (unless you connect your own provider)

## Development & access security

- **Multi-factor authentication** is enforced on all accounts used to build, deploy, and operate the App, including source control, cloud consoles, and the Atlassian developer console.
- **Automated security scanning**: static code analysis (SAST) and dependency vulnerability scanning (SCA) run in our CI pipeline on every change.
- **Least privilege**: the App requests only the Forge permissions it needs. The full list of permissions is shown on the Marketplace listing under "Integration permissions".

{{> security/incident-response}}

{{> security/reporting-a-vulnerability}}
