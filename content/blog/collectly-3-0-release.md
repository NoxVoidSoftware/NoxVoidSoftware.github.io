---
title: "Collectly 3.0 for Jira: Client Forms, Document Requests & BYO Cloud Storage"
seoTitle: "Collectly 3.0 for Jira: Forms & BYO Storage"
description: "Announcing Collectly 3.0 on Atlassian Marketplace: 7 form field types, item-by-item approvals, automated reminders, and BYO S3/Azure/GCS storage."
date: "2026-11-16"
category: "Product Release"
readTime: "4 min read"
slug: "collectly-3-0-release"
---

Today we are releasing **Collectly 3.0.0** on the [Atlassian Marketplace](https://marketplace.atlassian.com/apps/2837900681/collectly-external-file-collector-client-uploads?hosting=cloud&tab=overview). What started as a lightweight upload link generator has evolved into a complete client form and document collection engine built natively on Atlassian Forge for Jira Cloud.

## The Core Friction: Email Attachment Ping-Pong

For accounting, lending, legal, and client onboarding teams, collecting documents and intake details is often the slowest stage of any workflow. Teams send back-and-forth emails, receive incomplete PDF scans, chase missing W-2s or bank statements, and manually upload attachments into Jira tickets.

Clients don't have (and shouldn't need) Jira licenses, and generic shared folders like Google Drive or Dropbox lack structure, verification, and auditability.

**Collectly 3.0 solves this cleanly**: you build a secure form linked to any Jira ticket, the client fills it out without an Atlassian account or login, and your team reviews every single answer and document right in Jira.

---

## What's New in Version 3.0.0

### 1. Seven Rich Form Field Types & Templates
You can now collect far more than just files:
- **File Upload** (up to 1 GB per file)
- **Short Text & Long Text**
- **Numbers & Currency**
- **Date Picker**
- **Yes / No Toggles**
- **Dropdown Selectors**

Set fields as required or optional, add helpful descriptions or formatting hints, and use pre-configured templates for accounting, mortgage lending, legal onboarding, and HR intake.

### 2. Item-by-Item Review & Targeted Client Fixes
Instead of approving or rejecting an entire client packet as an all-or-nothing ordeal, your team reviews each submitted item individually:
- Mark answers as **Approved** or **Rejected**
- Add specific reviewer notes (e.g., *"Please provide the 2025 W-2 showing box 12, not the 2024 copy"*)
- When the client opens their link again, they only see and re-submit the specific items that need fixing.

### 3. Automated Reminder Schedules
Set a due date on your document request, and Collectly automatically sends polite email reminders to clients **3 days** and **1 day** before the deadline. Stop wasting hours manually pinging clients on Slack or email.

### 4. BYO Storage (AWS S3, Azure Blob, Google Cloud Storage)
Keep complete sovereignty over your organization's sensitive files. In Collectly 3.0, you choose where incoming uploads are stored:
- Directly as native **Jira issue attachments**
- In secure **Collectly cloud storage**
- In your company's own **AWS S3**, **Azure Blob**, or **Google Cloud Storage** bucket

### 5. Custom Email Delivery & Jira Automation
Send notification emails using Collectly's default service, or plug in your own transactional provider account (**Resend**, **SendGrid**, or **Mailgun**) for full branding and custom domain control. Custom JQL statuses and Jira Automation triggers ensure document requests seamlessly drive your sprint boards.

---

## Availability & Pricing

Collectly 3.0 is available now on the Atlassian Marketplace. Start on the **free plan** with usage limits, and upgrade to a paid plan billed through Atlassian when your team needs more. See current prices on the [Marketplace pricing page](https://marketplace.atlassian.com/apps/2837900681/collectly-client-forms-document-requests-for-jira?hosting=cloud&tab=pricing).

- **Marketplace Listing**: [Install Collectly on Atlassian Marketplace](https://marketplace.atlassian.com/apps/2837900681/collectly-external-file-collector-client-uploads?hosting=cloud&tab=overview)
- **Knowledge Base & Documentation**: [Collectly for Jira User Guide](https://decorous-humerus-392.notion.site/Collectly-for-Jira-User-Knowledge-Base-3d6c1158ccb88138b7c6f7e4e52b59c8)
- **Support**: Reach out to our engineering team anytime at [support@collectly.cloud](mailto:support@collectly.cloud).
