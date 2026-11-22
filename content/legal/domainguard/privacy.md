---
description: "How DomainGuard (Runs on Atlassian Forge app by NoxVoid Software) handles your Jira Service Management data. Your data stays in Atlassian Cloud."
updated: 2026-11-22
---

## Introduction & scope

NoxVoid Software ("NoxVoid", "we", "us", or "our") respects your privacy. This Privacy Policy explains how **DomainGuard: Customer Domain Router for JSM** (the "App"), an Atlassian Forge app available on the Atlassian Marketplace, handles data from your Jira Service Management (JSM) Cloud site.

## Runs on Atlassian — your data stays in Atlassian Cloud

DomainGuard is built entirely on the Atlassian Forge platform and is eligible for the **Runs on Atlassian** program. The App runs inside Atlassian's infrastructure, has no external server egress, and uses no external databases. NoxVoid does not receive, copy, or store your Jira data on any systems of its own.

## Data the App processes

To route customers to the right JSM organization, the App reads from your Jira site:

- the reporter of each new JSM request, including the reporter's email address, which is used only to work out the email domain;
- request (issue) keys, the project, the Organizations field, labels, and priority;
- service desks and JSM organizations, so admins can map domains to organizations;
- when an admin starts a "Sync Existing Users" run, the users on your site and their email addresses, used only to find users whose domain matches the selected rule.

Based on the admin's rules, the App adds customers to JSM organizations, sets the Organizations field on requests, adds labels (for example `quarantine-freemail` or `unmapped-domain`), and can change the request priority.

## Data the App stores

The App stores the following in Atlassian's Forge storage for your Jira site:

- **Domain rules** — email domains, the JSM organization and service desks they map to, and rule options;
- **Settings** — Freemail Shield options, your custom freemail and exception domain lists, and how unmapped domains are handled;
- **Audit log** — one entry per routing decision: request key, a masked reporter email (for example `j***@example.com`), the matched domain and organization, and the result. Full email addresses are not stored. Audit entries expire automatically after 30 days;
- **Sync status** — progress counters (users scanned and matched) for each sync run;
- **Cache** — a list of service desk IDs, kept for up to one hour.

## How we use data

Data is processed only to provide the App's features within your Jira site. We do not sell, rent, or monetize your data, and we do not use it for advertising or profiling.

## Subprocessors

- **Atlassian** — Forge platform hosting, compute, and storage. Data is handled under [Atlassian's Privacy Policy](https://www.atlassian.com/legal/privacy-policy) and data residency settings for your site.

The App uses no other subprocessors.

## Data retention & deletion

Audit log entries are deleted automatically 30 days after they are written. Rules and settings stay until an admin deletes them. When the App is uninstalled, all App data in Forge storage is removed by Atlassian under its Forge retention rules. Organization memberships, field values, and labels the App set in Jira stay in Jira and can be changed there like any other Jira data.

{{> privacy/support-requests}}

## Your rights (GDPR & CCPA)

Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data. Because Jira data processed by the App stays in your Atlassian site, most requests are handled by your Jira administrator or Atlassian. For anything related to the App or your support correspondence with us, contact us at the address below.

{{> privacy/policy-updates}}

## Contact

NoxVoid Software — Email: [support@collectly.cloud](mailto:support@collectly.cloud)
