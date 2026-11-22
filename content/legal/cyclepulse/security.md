---
description: "CyclePulse runs 100% on Atlassian Forge with no external egress. How we protect your Jira data."
updated: 2026-11-16
---

This page describes how **CyclePulse: Time in Status, Lead & Cycle Time Exports** protects your Jira data. For what data is processed and why, see the [Privacy Policy](privacy-cyclepulse.html).

## Runs on Atlassian

CyclePulse is built 100% on Atlassian Forge and carries the **Runs on Atlassian** badge. This means:

- all of the App's code runs inside Atlassian's cloud infrastructure;
- the App has no external egress — it does not send your data to any server outside Atlassian;
- the App uses no external databases; reports, settings, and calendars are stored in Forge storage for your site;
- NoxVoid has no copy of your Jira data and no access to it outside your site.

Hosting, encryption at rest and in transit, and physical security of this infrastructure are provided by Atlassian. See the [Atlassian Trust Center](https://www.atlassian.com/trust).

## Access inside your site

- Admins choose which Jira groups can share and edit calendars and run exports.
- Lead and Cycle Time values are written only to the App's own Jira fields.

## Subprocessors

**Atlassian** is the only subprocessor. The App uses no other third-party services.

## Development & access security

- **Multi-factor authentication** is enforced on all accounts used to build, deploy, and operate the App, including source control, cloud consoles, and the Atlassian developer console.
- **Automated security scanning**: static code analysis (SAST) and dependency vulnerability scanning (SCA) run in our CI pipeline on every change.
- **Least privilege**: the App requests only the Forge permissions it needs. The full list of permissions is shown on the Marketplace listing under "Integration permissions".

{{> security/incident-response}}

{{> security/reporting-a-vulnerability}}
