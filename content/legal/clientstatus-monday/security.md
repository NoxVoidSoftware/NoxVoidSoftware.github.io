---
description: "How ClientStatus for monday.com protects your board data and your clients' status pages: OAuth, signed requests, encryption, and private links."
updated: 2026-11-24
---

This page describes how **ClientStatus for monday.com** protects your monday.com data and the pages your clients see. For what data is collected and why, see the [Privacy Policy](privacy-clientstatus-monday.html).

## Architecture

- **Views in monday.com.** The App's board view and item view are hosted on monday.com's CDN. They hold no monday.com token: they send monday.com's short-lived session token to ClientStatus, which verifies it and returns a ClientStatus session kept in memory only.
- **ClientStatus service.** The sync, your workspace, and your clients' status pages run on ClientStatus, hosted on Google Cloud.
- **Only the boards you choose.** The App reads and writes only the boards you set up in it, and only the columns you pick.

## Authentication & authorization

- **OAuth 2.1 with PKCE**: the App is authorized through monday.com's OAuth. Access tokens expire and are refreshed with rotating refresh tokens.
- **Verified requests from monday.com**: session tokens, board webhooks, and app lifecycle events are JWTs that ClientStatus verifies with the App's secrets before acting on them.
- **Matching accounts**: an authorization is accepted only from the same monday.com user and account that opened the App.
- **Roles**: monday.com viewers get read-only access in ClientStatus.

## Data protection

- **Encryption in transit**: all traffic between monday.com, ClientStatus, and your clients' browsers uses TLS.
- **Encryption at rest**: our database and backups are encrypted at rest by Google Cloud. monday.com tokens are also encrypted by the application before they are stored.
- **Private client links**: each client link is a long random token that shows only that client's tasks, read-only. You can disable a link at any time.
- **Uninstall**: when the App is uninstalled, its monday.com tokens are deleted right away and it stops reading and writing your boards. The data from your boards is deleted 10 days later, unless the App is installed again.

## Subprocessors

- **monday.com**: platform and hosting of the App's views
- **Google Cloud**: ClientStatus hosting and database
- **Resend**: transactional email delivery

## Development & access security

- **Multi-factor authentication** is enforced on all accounts used to build, deploy, and operate the App, including source control, cloud consoles, and the monday.com Developer Center.
- **Secrets** (OAuth client secret, signing secret) are kept only in the production configuration, never in source code.
- **Least privilege**: the App requests only the monday.com scopes it needs: `me:read`, `account:read`, `boards:read`, `boards:write`, `updates:write`, and `webhooks:write`.

## Incident response

If we confirm a security incident that affects your data, we will notify affected customers and monday.com without undue delay, and share what happened, what data was affected, and what we are doing about it.

## Reporting a vulnerability

If you believe you have found a security vulnerability, please email [security@clientstatus.cloud](mailto:security@clientstatus.cloud) with the subject "Security", and include a description, steps to reproduce, and a proof of concept if possible. Please do not publicly disclose the issue until we have had a chance to fix it. We will acknowledge your report and keep you updated until it is resolved.
