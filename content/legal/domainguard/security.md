---
description: "How DomainGuard (Runs on Atlassian Forge app by NoxVoid Software) protects your Jira Service Management data."
updated: 2026-11-22
---

This page describes how **DomainGuard: Customer Domain Router for JSM** protects your Jira Service Management data. For what data is processed and why, see the [Privacy Policy](privacy-domainguard.html).

## Runs on Atlassian

DomainGuard is built 100% on Atlassian Forge and is eligible for the **Runs on Atlassian** program. This means:

- all of the App's code runs inside Atlassian's cloud infrastructure;
- the App has no external egress — it does not send your data to any server outside Atlassian;
- the App uses no external databases; rules, settings, and the audit log are stored in Forge storage for your site;
- NoxVoid has no copy of your Jira data and no access to it outside your site.

Hosting, encryption at rest and in transit, and physical security of this infrastructure are provided by Atlassian. See the [Atlassian Trust Center](https://www.atlassian.com/trust).

## Access inside your site

- The DomainGuard settings page is available only to Jira administrators. Every settings action is checked against the signed-in user's Jira permissions on the server side.
- Retrying a request from the audit log also requires permission to browse and edit that request.
- Safe defaults: subdomain matching, automatic linking of organizations to service desks, and automatic request sharing are off until an admin turns them on for a rule. Public email domains (Gmail, Outlook, and about 30,000 others) cannot be mapped to an organization, so unrelated customers are never grouped together.
- Data minimization: the audit log stores masked email addresses only and expires after 30 days.

## Subprocessors

**Atlassian** is the only subprocessor. The App uses no other third-party services.

## Development & access security

- **Multi-factor authentication** is enforced on all accounts used to build, deploy, and operate the App, including source control, cloud consoles, and the Atlassian developer console.
- **Automated security scanning**: static code analysis (SAST) and dependency vulnerability scanning (SCA) run on every change before release.
- **Least privilege**: the App requests only the Forge permissions it needs. The full list of permissions is shown on the Marketplace listing under "Integration permissions".

{{> security/incident-response}}

{{> security/reporting-a-vulnerability}}
