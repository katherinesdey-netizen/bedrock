-- ============================================================
-- Bedrock — Seed data from Daily Digest, May 4 2026
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── TASKS ────────────────────────────────────────────────────

INSERT INTO tasks (title, notes, status, priority, sort_order, source, source_account, due_date, tags) VALUES

-- ── Action Required ─────────────────────────────────────────
(
  'Send billing/shipping address — Rise8 promo products',
  'Rachel (Flashbay) needs billing + shipping address to finalize order for branded pens, notebooks, and flash drives.',
  'active', 2, 100, 'digest', 'rise8', NULL, '{action}'
),
(
  'Coordinate offsite meals & activities (ClickUp — Rob Monroe)',
  'Rob Monroe assigned this task for the June 2026 Offsite. No deadline visible but needs attention.',
  'active', 2, 200, 'digest', 'rise8', '2026-06-01', '{action,offsite}'
),
(
  'Can Tracer team be penciled in? — PVD office scheduling',
  'Dave Chapman assigned an action item on the Providence Office Scheduling doc asking Kat to weigh in on Tracer team visit timing.',
  'active', 2, 300, 'digest', 'rise8', NULL, '{action,office}'
),
(
  'IRS penalty notice — Grow Sagely 401(k) plan (monitoring)',
  'Gusto: Filing delay on Form 8955-SSA for the 2024 plan year. No action needed now — keeping an eye on it.',
  'active', 3, 400, 'digest', 'personal', NULL, '{monitoring,financial}'
),

-- ── Follow Up Needed ─────────────────────────────────────────
(
  'Reply to Nicole Wright — water quote decision',
  'She asked: "Remind me where we settled yesterday: third quote for water or lock in first guy?" Direct question.',
  'active', 1, 500, 'digest', NULL, '2026-05-08', '{follow-up}'
),
(
  'Reply to Darilyn — confirm laundry split',
  'You asked "Oh right. We doing 50 each time?" — she replied "I mean I you can do it.. if you''d rather." She''s deferring back, needs a yes/no.',
  'active', 2, 600, 'digest', NULL, NULL, '{follow-up}'
),
(
  'Confirm June 9 pizza party venue — Kelly Joseph',
  'You asked: pizza at the field or Flatbread Co? She said "Whatever!" — needs a decision and confirmation.',
  'active', 3, 700, 'digest', NULL, '2026-06-09', '{follow-up}'
),
(
  'Reply to Robert — Maine properties & general updates',
  'Robert sent info about tax situation (fed due, ME refund) and new property bought 4/30 via 1031 exchange. Gmail nudge: "Received 4 days ago. Reply?"',
  'active', 2, 800, 'digest', 'personal', NULL, '{follow-up}'
),
(
  'Reply to Paul — Uzzi estimate deadline',
  'Paul asking "meet the deadline you need the estimate for?" — thread about Uzzi misc stuff, needs a follow-up reply on timing.',
  'active', 2, 900, 'digest', 'personal', NULL, '{follow-up}'
),
(
  'Airbnb — prepare for guest Jamie''s arrival',
  'Reservation reminder for upcoming Airbnb guest stay. Ensure property is ready.',
  'active', 2, 1000, 'digest', 'personal', NULL, '{airbnb,westerly}'
),
(
  'Bill, Adam — houseboat project follow-up',
  'Bill Drage (East) responded positively: "very interesting idea, hope you''re able to see it through." Worth continuing the conversation.',
  'active', 3, 1100, 'digest', 'personal', NULL, '{follow-up}'
),

-- ── Financial / Admin ────────────────────────────────────────
(
  'Pay SNE Women''s Health — statement balance due',
  'Statement posted to Patient Portal. Log in and pay online.',
  'active', 2, 1200, 'digest', 'personal', NULL, '{financial}'
),
(
  'Pay Providence Water Supply Board — invoice #2026UB22122007619658',
  '"View Invoice or Pay Now."',
  'active', 2, 1300, 'digest', 'personal', NULL, '{financial}'
),
(
  'Pay Rhode Island Energy — new bill',
  'New bill from Rhode Island Energy available to view and pay.',
  'active', 2, 1400, 'digest', 'personal', NULL, '{financial}'
),
(
  'Process invoice #305663 — Rise8 (poandinvoices)',
  'Invoice entered for Rise8. PDF attached: Invoice_RISE8_305663.pdf. Review and process payment.',
  'active', 2, 1500, 'digest', 'earlehouse', '2026-05-04', '{financial}'
),
(
  'Pay final invoice for electrical — Donald DiScullio',
  '"You can pay them directly." PDF attached: sole source finish invoice.pdf. Earle House project.',
  'active', 2, 1600, 'digest', 'earlehouse', '2026-05-03', '{financial,earle-house}'
),
(
  'Review & pay Rise8 invoice for mugs — order 36721 (Mike Higgins)',
  'Invoice from Coast to Coast Promotional Products. Addressed to Adam.',
  'active', 2, 1700, 'digest', 'rise8', '2026-04-20', '{financial}'
),
(
  'Register Verizon Fios reward — deadline Jun 14',
  'Fios Business installed ~Apr 14. Must register reward within 60 days (~Jun 14) or it expires.',
  'active', 2, 1800, 'digest', 'rise8', '2026-06-14', '{financial,deadline}'
),

-- ── Appointments & Meetings ──────────────────────────────────
(
  'Ropes course info session — 3:00pm (Katie)',
  'Info session re: ropes course waiver. Also send information packet to Kat and Adam afterward.',
  'active', 2, 1900, 'digest', 'personal', '2026-05-08', '{appointment}'
),
(
  'Glass installation (tentative) — Donald',
  '"Wednesday of next week is the tentative day for the Glass to be installed." Earle House project.',
  'active', 2, 2000, 'digest', 'earlehouse', '2026-05-06', '{appointment,earle-house}'
),
(
  'Dental appointment — Dr. Lena D. Karkalas, DDS — 10:30am',
  'Appointment confirmed. Reminder sent May 4.',
  'active', 2, 2100, 'digest', 'personal', '2026-05-11', '{appointment}'
),
(
  'Guillermo — PVD office tour, proposed ~noon',
  'Guillermo asking to come by ~noon, see the space, have lunch. Asked: "Will the buildout be completed by then?"',
  'active', 2, 2200, 'digest', 'rise8', '2026-05-11', '{appointment,office}'
),
(
  'Moses Brown PA — all-school meeting, 8:15–10am',
  'At Sinclair & virtual. Invitation via Google Calendar. RSVP pending.',
  'active', 2, 2300, 'digest', 'personal', '2026-05-13', '{appointment}'
),
(
  'Teacher Appreciation Week — volunteer coordination',
  'Jenna Silver: May 4–8. Volunteer coordination; Dunkin Donuts treat donations being collected.',
  'active', 3, 2400, 'digest', 'personal', '2026-05-08', '{appointment}'
),

-- ── Westerly Calendar ────────────────────────────────────────
(
  'Westerly: check-in Harriette — 6 nights (May 20–26)',
  'Guest arrives May 20. Checkout May 26.',
  'active', 2, 2500, 'digest', NULL, '2026-05-20', '{westerly,check-in}'
),
(
  'Westerly: cleaning day + pay cleaners — Harriette checks out',
  'Harriette''s stay ends May 26. Confirm cleaning is scheduled. Pay Westerly cleaners.',
  'active', 2, 2600, 'digest', NULL, '2026-05-26', '{westerly,cleaning}'
);


-- ── READING LIST ─────────────────────────────────────────────

INSERT INTO reading_list (title, url, source_account) VALUES

(
  'The Bezos Backlash Hits the Met — Jessica Yellin / News Not Noise',
  'https://newsnotnoisejessicayellin.substack.com/p/the-bezos-backlash-hits-the-met',
  'personal'
),
(
  'April 29, 2026 — Heather Cox Richardson',
  'https://heathercoxrichardson.substack.com/p/april-29-2026',
  'personal'
),
(
  'Rattled Nerves — News Items by John',
  'https://substack.news-items.com/p/rattled-nerves',
  'personal'
),
(
  'War(s). — News Items by John',
  'https://substack.news-items.com/p/wars',
  'personal'
),
(
  'Will AI Make You Stupid? — The Prof G Pod',
  'https://www.profgmedia.com/p/will-ai-make-you-stupid',
  'personal'
),
(
  'The Southern Poverty Law Center Indictment — Marginal Revolution',
  NULL,
  'personal'
),
(
  'California''s "billionaire tax" is the wrong approach — Noahpinion',
  NULL,
  'personal'
),
(
  'The Reckoning — Scott Galloway',
  NULL,
  'personal'
),
(
  'Always with us in spirit — Exec Sum / Litquidity',
  NULL,
  'personal'
),
(
  'Kleptocracy Inc — Open Letters',
  'https://substack.com/redirect/ce659561-75a4-492b-9153-c155134e8428?j=eyJ1Ijoib25ha2IifQ',
  'personal'
);
