# Should we add YouTube cookie consent in `tracking-consent-frontend`?

* Status: rejected 
* Date: 2026-11-10

Technical Story: PLATUI-4509

## Context and Problem Statement

A service team in HMRC display YouTube videos in their service. Users accessing the service need to consent to YouTube
tracking cookies to be able to view the videos. The current solution created by the team is to you an interstitial page
per video to ask a user to consent to cookies. The service team approached PlatUI to see if this YouTube consent could
instead be collected via the `tracking-consent-frontend` solution.

## Decision Drivers

* It is a legal requirement that services showing YouTube videos obtain the user consent for the tracking cookies
* The use of videos on `gov.uk` websites is an established use case and there is no suggestion that services should not use YouTube videos
* PlatUI own the solution for capturing consent for **Google Analytics** and **Optimizely** via `tracking-consent-frontend`
* Currently only 1 service on MDTP have reached out to PlatUI about YouTube tracking cookies
* The service does have a solution in place currently (interstitial pages)
* Making changes to `tracking-consent-frontend` could require revoking the current user consents for tracking

## Considered Options

* Option 1: Add YouTube tracking cookies and consent into `tracking-consent-frontend` for all services
* Option 2: Investigate granular solutions for specific services to ask for YouTube cookie consent via `tracking-consent-frontend`
* Option 3: Ask service team to implement their own solution for asking for user consent for YouTube tracking cookies 

## Decision Outcome

Chosen option: "Option 3: Ask service team to implement their own solution", following on from a detailed spike conducted
in 2025 (involving Experimentation Team and CDO colleagues), and as re-assessed by PlatUI in November 2026. There are 
documents with full justification in these Jira tickets:
* PLATUI-3843 (spike in 2025)
* PLATUI-4509 (revisited in 2026)

## Pros and Cons of the Options

### Option 1: Add YouTube tracking cookies and consent into `tracking-consent-frontend`

* Good, because for service because the solution is centralised and does not need to be collected per-video, per-service
* Bad, because too heavy‑handed. Even if we launch between Experimentaion test cycles, it wipes all historic consent, 
  slashes sample sizes so no meaningful experiments can be run —hurting both short‑ and long‑term insight. 
* Bad, because PlatUI introduce a large breaking change for all services to benefit just one service
* Bad, because PlatUI engineering time is limited and the benefit for all teams should be considered when scoping new features

### Option 2: Investigate granular solutions for specific services

* Good, because for service there might be a solution that is owned by PlatUI reducing service team work
* Good, because future services **might** be able to re-use
* Bad, because PlatUI engineering time is limited and the benefit for all teams should be considered when scoping new features

### Option 3: Investigate granular solutions for specific services

* Good, because this isolates the code changes with the single service that needs this
* Good, because PlatUI are not breaking `tracking-consent-frontend` consent for other stakeholders such as Experimentation
* Good, because PlatUI are focussing engineer time on solutions that have whole-Platform benefit
* Bad, for service because they need to own their own solution
* Bad, for hypothetical services in the future that might need to re-implement the same
