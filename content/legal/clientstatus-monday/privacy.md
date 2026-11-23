---
description: "How ClientStatus for monday.com (a monday.com app by NoxVoid Software) collects, stores, and protects data from your monday.com boards and your clients."
updated: 2026-11-24
---

## Introduction & scope

NoxVoid Software ("NoxVoid", "we", "us", or "our") respects your privacy. This Privacy Policy explains how we handle data when you install and use **ClientStatus for monday.com** (the "App"), an app available on the monday.com apps marketplace, and when your clients open the status pages the App gives them.

The App connects your monday.com boards to ClientStatus (clientstatus.cloud), which shows each of your clients a private, read-only page with the status of their own tasks.

For the purposes of applicable data protection laws (including the EU GDPR and UK GDPR), NoxVoid acts as a **Data Processor** for the board data and client details your organization syncs through the App. Your organization remains the Data Controller of that data.

The standalone ClientStatus web app at clientstatus.cloud is also covered by its own policy at [clientstatus.cloud/privacy](https://clientstatus.cloud/privacy).

## Data the App reads from monday.com

When you install the App, you authorize it with monday.com's OAuth. The App then reads:

- **About you and your account**: your monday.com user ID, name, and email address, and your account's ID and name. These are used to create your ClientStatus workspace and to sign you in to it from monday.com. When a teammate opens the App, their name and email are read the same way.
- **From the boards you set up** (only those): the board's name and columns, and for each item its name, its status label, and the columns you choose in the App's setup: due date, note, and the client's name, email, and phone.
- **Item updates you mark for the client**: an update that contains `#client` is shown on the client's page. Other updates are not read.
- **Your subscription to the App**: the plan, billing period, renewal date, and whether it is a trial, as monday.com reports them. Payment details stay with monday.com.

The App does not read boards you have not set up in it.

## Data the App writes to monday.com

Only on the boards you set up:

- status, item name, due date, and client details changed on clientstatus.cloud are written back to the matching item and columns;
- comments your clients leave on their status page are added to the item as updates;
- webhooks are registered on each board, so changes in monday.com reach ClientStatus right away.

## Data stored by ClientStatus

ClientStatus stores, in your workspace:

- the projects (one per board), tasks (one per item), and the fields listed above;
- clients and their name, email, and phone;
- each task's status history, which builds the client's timeline;
- client comments;
- the private links you share with clients, and whether each one is enabled;
- your monday.com access and refresh tokens, encrypted at rest;
- the board settings you chose in the App.

## Your clients' status pages

Each client gets a private, unguessable link to a page that shows only their own tasks. The page is read-only, except for comments if you allow them. You can disable any link at any time. Clients do not need a monday.com account.

## How we use data

We use the data above only to provide the App:

- syncing your boards with ClientStatus in both directions;
- showing your clients their status pages;
- applying the limits of your plan;
- security, abuse prevention, and troubleshooting when you contact support.

We do not sell, rent, or monetize your data, and we do not use it for advertising or profiling.

## Subprocessors

- **monday.com Ltd.**: the platform the App runs in, and hosting of the App's views (monday code CDN)
- **Google Cloud (Google LLC)**: hosting of the ClientStatus service and its database
- **Resend, Inc.**: transactional email delivery from ClientStatus

## Third-party domains

The App's views and your clients' status pages load code only from monday.com and clientstatus.cloud, and send data only to monday.com (`api.monday.com`, `auth.monday.com`) and ClientStatus (`clientstatus.cloud`, `api.clientstatus.cloud`). They use no analytics, advertising, or tracking cookies.

The marketing pages of clientstatus.cloud and its dashboard use Google Analytics (`googletagmanager.com`, `google-analytics.com`) and Microsoft Clarity (`clarity.ms`) to understand how the site is used, and only after the visitor accepts analytics cookies. They are never loaded on client status pages or inside monday.com.

## Data retention & deletion

- **When the App is uninstalled**, monday.com notifies us and we delete your monday.com tokens immediately. The App stops reading and writing your boards. Your projects, tasks, and client links stay in your ClientStatus workspace, so installing the App again picks up where you left off.
- **To delete your data**, email us at the address below from an owner's address, and we delete the workspace and everything in it within 30 days. An owner who also belongs to another ClientStatus workspace can delete it directly in ClientStatus Settings.
- Data in your monday.com boards stays in monday.com and is governed by your agreement with monday.com.

{{> privacy/support-requests}}

## Security

Data is encrypted in transit using TLS and at rest by our cloud provider. monday.com tokens are additionally encrypted by the application. Requests from monday.com are verified with the App's signing secrets, and client links are long random tokens that you can disable at any time. See the [Security](security-clientstatus-monday.html) page for details.

## Your rights (GDPR & CCPA)

Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data. If you are a client whose details appear on a status page, please contact the organization that shared the page with you first. They control that data, and we will assist them. You can also reach us directly at the address below.

{{> privacy/policy-updates}}

## Contact

For privacy questions, data subject requests, or security disclosures:  
NoxVoid Software: [support@clientstatus.cloud](mailto:support@clientstatus.cloud)
