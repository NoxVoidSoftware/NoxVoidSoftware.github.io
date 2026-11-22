---
description: "How Collectly for Jira (Atlassian Forge app by NoxVoid Software) collects, stores, and protects data from your Jira site and your clients."
updated: 2026-11-16
---

## Introduction & scope

NoxVoid Software ("NoxVoid", "we", "us", or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard data when you install and use **Collectly for Jira** (the "App"), an Atlassian Forge app available on the Atlassian Marketplace, and when your clients answer requests or upload files through the Collectly client portal.

For the purposes of applicable data protection laws (including the EU GDPR and UK GDPR), NoxVoid acts as a **Data Processor** for the request content, client details, answers, and files that your organization collects through the App. Your organization remains the Data Controller of that data.

The standalone Collectly web app at collectly.cloud is covered by its own policy at [collectly.cloud/privacy](https://collectly.cloud/privacy).

## Data stored in your Jira site (Atlassian Forge)

Requests, form answers, review decisions, and app settings are stored in Atlassian's Forge storage for your Jira site. The App reads and writes only the Jira work items where your team uses it. This data is hosted by Atlassian and is subject to [Atlassian's Privacy Policy](https://www.atlassian.com/legal/privacy-policy).

## Data sent to the Collectly client portal

To serve the client portal, collectly.cloud receives the details needed to show a request to your client:

- the request title and description, and its form fields;
- the client's name and email address;
- the due date;
- the client's answers and uploaded files.

Requests between Jira and collectly.cloud are signed. Client links are signed and expire on the request's due date. Clients do not need an Atlassian account to respond.

## Where uploaded files are stored

Files uploaded by clients are stored where your Jira administrator chooses:

- **As Jira attachments** on the related work item;
- **In Collectly storage** (Cloudflare R2, Western Europe);
- **In your own bucket** — Amazon S3, Azure Blob Storage, or Google Cloud Storage.

Files on their way to Jira are kept in temporary storage only until they are attached, and any leftovers are deleted automatically within two days.

## Emails to your clients

Request and reminder emails to your clients are sent by Collectly through Resend, or through your own email provider (such as Resend, SendGrid, or Mailgun) if your administrator connects one.

Credentials for your own storage or email provider are kept encrypted on collectly.cloud and are never shown again in Jira.

## How we use data

We use the data above only to provide the App:

- showing requests to your clients and collecting their answers and files;
- delivering files to the storage your administrator selected;
- sending request, reminder, and status emails;
- security, abuse prevention, and troubleshooting when you contact support.

We do not sell, rent, or monetize your data or your clients' files, and we do not use them for advertising.

## Subprocessors

- **Atlassian** — Forge platform hosting and storage for app data in your Jira site
- **Google Cloud (Google LLC)** — hosting of the collectly.cloud portal and database
- **Cloudflare, Inc.** — file storage (Cloudflare R2, Western Europe)
- **Resend** — transactional and reminder email delivery

If your administrator connects your own storage bucket or email provider, that provider processes data under your own agreement with them.

## Data retention & deletion

- Files in temporary transfer storage are deleted within two days of being attached to Jira.
- Files in Collectly storage are deleted 30 days after your plan stops including that storage, or when you delete them.
- When the App is uninstalled, the data held in Forge storage is removed by Atlassian under its retention rules.
- Files in your own bucket or in Jira attachments remain under your control.

## Security

Data is encrypted in transit using TLS, and files in Collectly storage are encrypted at rest. Communication between Jira and collectly.cloud is signed, client links are signed and time-limited, and third-party credentials are stored encrypted.

## Your rights (GDPR & CCPA)

Depending on your jurisdiction, you may have the right to access, correct, delete, or export your personal data. If you are a client who submitted information through a request, please contact the organization that sent you the request first — they control that data — and we will assist them. You can also reach us directly at the address below.

{{> privacy/policy-updates}}

## Contact

For privacy questions, data subject requests, or security disclosures:  
NoxVoid Software — Email: [support@collectly.cloud](mailto:support@collectly.cloud)
