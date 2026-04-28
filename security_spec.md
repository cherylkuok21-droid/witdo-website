# Security Specification for Baby Hand & Foot Casting Studio

## Data Invariants
1.  **Work Orders** must have a valid `ownerUid` matching the authenticated user.
2.  **Work Orders** must have a `customerName` and `wechatId`.
3.  **Products**, **Presets**, and **Discounts** are only writable by the admin (`mo.witdo@gmail.com`).
4.  **Work Orders** can only be created by an authenticated user.
5.  **Status** transitions for Work Orders are restricted to whitelisted values.
6.  **Owner Uid** is immutable after creation.
7.  **Server Timestamps** (`createdAt`, `updatedAt`, `orderDate`) must be validated against `request.time`.

## Field Constraints
-   Strings must have maximum sizes (e.g., 200 chars for names, 1MB for Signatures).
-   Numbers must be non-negative.
-   IDs must follow the WD-YYYYMMDD-XXXX format.

## The "Dirty Dozen" Payloads (Targets for Rejection)
1.  **Identity Spoofing**: Attempt to create a workOrder with someone else's `ownerUid`.
2.  **Admin Escalation**: Attempt to create a `product` as a non-admin.
3.  **Size Attack**: Send a 2MB string as `customerName`.
4.  **ID Poisoning**: Use a 10KB junk string as `workOrderId`.
5.  **Negative Pricing**: Set `totalPrice` to -100.
6.  **Invalid Status**: Set `status` to "shipped" (not in allowed list).
7.  **Timestamp Fraud**: Send a future date string instead of `serverTimestamp()`.
8.  **Signature Hijack**: Update the `signatureData` of someone else's order.
9.  **Orphaned Order**: Create a work order without a `customerName`.
10. **Shadow Field**: Include `isVerified: true` in a user payload.
11. **Malicious ID**: Use document ID `../../../../etc/passwd`.
12. **Anonymous Write**: Attempt to create an order without being logged in.
