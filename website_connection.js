/* ============================================================
   DOVELINGUA — PROJECT DECISIONS LOG (BACKUP SUMMARY)
   File suggestion: project-log.js  (or save as .md/.txt — your choice)
   Purpose: Full record of everything agreed, from planning to now.
   Last updated: July 2026
   ============================================================ */


/* ============================================================
   1. PROJECT OVERVIEW
   ============================================================ */
// Academy: DoveLingua English Learning Academy
// Founder: Gildo Angélica Dove — "Teacher Dove"
// Website: www.dovelingua.com (GitHub + Vercel)
// Founded: April 2026, Mozambique
// Languages: European Portuguese (Mozambique) — DEFAULT, and British English (toggle)
// Existing separate system: Moodle (classroom.dovelingua.com) — actual lessons happen there
// This website = management/portal layer around Moodle, not the lessons themselves
// Existing English app already live: "English Dove" (free app)


/* ============================================================
   2. ROLES DEFINED
   ============================================================ */
// Guest        — public visitor, no account
// Applicant    — signed up, mid-enrollment, not yet full student
// Student      — enrolled, active, has unique student code
// Teacher      — sees/grades ONLY their assigned students (not all students)
// Staff        — confirms payments, manages applicant documents. NO academic access.
// Admin        — full access. Teacher Dove + designated admin accounts.


/* ============================================================
   3. KEY FEATURE DECISIONS
   ============================================================ */

// STUDENT PANEL includes:
// - Progress / grades (Pauta)
// - Receipts (payment history)
// - Certificate view/download
// - Messages from teachers/admin
// - Unique student code (auto-generated, e.g. DL-2026-0001)
// - Documents shared with students
// - Term tests / final exams (taken on the website, feeds into Pauta automatically)

// PAUTA (grade sheet) — auto-calculated:
// - Multiple test scores (Test 1, 2, 3...)
// - Admission/placement exam score
// - Média (average) — calculated automatically, not by hand
// - Pass/fail logic + Resit exam if failed
// - Teacher Dove will share real university pauta later for exact field layout

// LEVEL PLACEMENT TEST:
// - New page needed: level-test.html (SEPARATE from evaluate.html)
// - evaluate.html = feedback/review page about DoveLingua (NOT the test — corrected earlier mistake)
// - Test covers all 4 skills: Reading, Listening (auto-graded), Writing, Speaking (manual review by teacher/staff)
// - Sign-up required BEFORE taking test (creates Applicant record) — NOT anonymous
// - Applicant fields needed: full name, email, phone/WhatsApp, DOB, occupation,
//   programme interest, how heard about us, native language (final list TBD, discuss when needed)
// - Questions are DATABASE-DRIVEN (Firestore), not hardcoded in HTML
//   Reason: so Admin can edit/add questions without a developer, ever
// - New page needed: admin-level-test-editor.html (admin manages questions, skills, levels, quantity per level)
// - Test structure follows QCFR/CEFR — Teacher Dove already has real QCFR-based questions to provide
// - Anti-cheating approach (realistic, not fake):
//   - NOT relying on F12/key-locking as the real anti-cheat solution (explained as unreliable — easily bypassed)
//   - Real layers: tab-switch/blur detection, disabled copy-paste on questions, timers, randomized
//     question pool per skill/level, one attempt only
//   - key-lock.js WILL still be included as an extra layer (Teacher Dove already has it from her app)
//     Placement: right before </body>, loaded last on every page:
//     <script src="/key-lock.js"></script>

// CERTIFICATES:
// - Public verification page planned: verify-certificate.html
// - Anyone enters a verification code, NO login required
// - Shows ONLY: student name, course completed, date issued, status (confirms legitimacy for job applications)
// - Does NOT show grades, contact info, or private data
// - Full detailed record only visible to Admin (logged in) — for future development

// MESSAGING SYSTEM:
// - ONE shared messaging system across all roles, filtered by role/permissions (not separate systems per role)
// - Permission rule: e.g. students should not message other students directly (school context)

// TEACHER VISIBILITY:
// - Teachers see ONLY their own assigned students/courses (not all students)
// - Admin sees everything
// - Requires teacherId field on courses/classes to link teacher -> their students

// DOCUMENTS / FILES POLICY:
// - NO files uploaded directly to Firebase Storage
// - All documents/certificates/materials hosted externally, only the LINK is stored in Firestore
// - Keeps database light, avoids storage costs

// LOGIN / REGISTER:
// - ONE combined page: auth.html (toggle/tabs between Sign In and Create Account)
// - NOT two separate pages


/* ============================================================
   4. FIREBASE — TECHNICAL SETUP (confirmed live)
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyAl9A_gXDKTB3N6U1f_Bh5FWrOsySjCJGo",
  authDomain: "dovelingua-site.firebaseapp.com",
  projectId: "dovelingua-site",
  storageBucket: "dovelingua-site.firebasestorage.app",
  messagingSenderId: "271742052334",
  appId: "1:271742052334:web:bc736373d7ea50001b50ff",
  measurementId: "G-N8ELT8SMYM"
};

// Firestore Database: CREATED, region europe-west1
// Authentication: Email/Password + Google — ENABLED
// Security rules: WRITTEN and PASTED into console (see section 6 below)
// Admin accounts (hardcoded safety layer, plus role field in Firestore):
//   dovelingua78@gmail.com
//   englishdove78@gmail.com

// DECISION: single Firebase project (not split across multiple projects)
// Reason: Spark free tier = 50,000 reads/day, 20,000 writes/day — plenty for current scale.
// If ever exceeded, upgrade to Blaze plan (pay-as-you-go) rather than manage multiple projects.

// Collections planned (auto-created on first write, not manually created):
// users, applications, levelTests, testAttempts, grades, receipts,
// certificates, messages, documents, announcements, courses


/* ============================================================
   5. FULL PAGE BLUEPRINT
   ============================================================ */

// PUBLIC (no login):
// index.html, about.html, programme.html, contact.html, report.html, faq.html,
// donate.html, terms.html, support.html, announcements.html, evaluate.html,
// level-test.html (NEW), auth.html (NEW - combined login/register),
// verify-certificate.html (NEW), 404.html, unauthorized.html (NEW)

// APPLICANT (logged in, not yet student):
// application-status.html (replaces status.html), upload-documents.html (NEW)

// STUDENT:
// student-dashboard.html (NEW), grades.html (NEW), my-tests.html (NEW),
// certificate.html (NEW), receipts.html (NEW), messages.html (NEW), documents.html (NEW)

// TEACHER:
// teacher-dashboard.html (NEW), teacher-pauta.html (NEW), teacher-tests.html (NEW),
// teacher-messages.html (NEW), teacher-materials.html (NEW)

// STAFF:
// staff-payments.html (NEW), staff-documents.html (NEW)

// ADMIN:
// admin-dashboard.html (rebuild of admin.html), admin-users.html (NEW),
// admin-courses.html (NEW), admin-announcements.html (NEW), admin-documents.html (NEW),
// admin-level-test-editor.html (NEW)

// TECHNICAL (unchanged):
// CNAME, sitemap.xml, vercel.json, pay.js

// NOTES ON OLD FILES:
// enrol.backup.html — remove from live site (leftover backup, should not be deployed)
// report.html — keep, it's a "denúncia"/complaint page (different from contact.html)
// status.html — logic absorbed into application-status.html + student dashboard


/* ============================================================
   6. BRAND IDENTITY — CONFIRMED FINAL
   ============================================================ */

// Slogan (official): "Master English. Lead Your Future."
//   PT: "Domina o Inglês. Lidera o Teu Futuro."
// Future slogan (when other languages added): "Master Language. Lead Your Future."

// COLOUR PALETTE (locked primary system):
const brandColours = {
  navy:      "#0B2E73", // primary — headers, nav, footer, hero backgrounds
  gold:      "#C9971A", // secondary — accents, dividers, CTA highlights
  white:     "#FFFFFF", // backgrounds
  lightGrey: "#F4F4F4", // alternating sections
  navyTint:  "#E8EEF9", // card backgrounds
  teal:      "#0E8F7F"  // ACCENT ONLY — icons, tags. Never a full background.
};
// GREEN IS FULLY RETIRED from the site (was used before brand doc existed)
// Flexibility allowed: Teacher Dove approved using colours outside this list
// ONLY for small non-primary needs (e.g. hover states) — must be flagged when used, not silent

// TYPOGRAPHY:
// Headings/brand: Playfair Display
// Body/tagline backup: Montserrat
// Formal documents: Arial

// FAVICON: Version 14 "D Icon" (navy square, single D with dove+book)

// LOGO USAGE RULES (from official brand doc DVL-DOC-BRAND-001-S2):
// - Master Wordmark Colour = default, used everywhere formal/main site
// - classroom_login_logo_teal.png = EXCLUSIVELY classroom.dovelingua.com, never main site
// - DV+Actualizacoes_whatsapp_group_profile.png = EXCLUSIVELY that WhatsApp channel
// - Circular seals (gold/navy) = stamps/certificates ONLY, never as profile pictures
// - Never recolour, distort, stretch, or add effects to any logo version


/* ============================================================
   7. LIVE BRAND ASSET LINKS
   ============================================================ */
// All hosted at: https://download.dovelingua.com/website/

const brandAssets = {
  favicon:              "https://download.dovelingua.com/website/Favicon_32x32.png",
  wordmarkColour:       "https://download.dovelingua.com/website/Master_Wordmar_original.png",
  wordmarkNavyOnWhite:  "https://download.dovelingua.com/website/Master_Wordmark_navy_tex_white_background.png",
  wordmarkWhiteOnNavy:  "https://download.dovelingua.com/website/Master_Wordmark_white_tex_navy_background.png",
  wordmarkWhiteOnBlack: "https://download.dovelingua.com/website/Master_Wordmark_white_tex_black_background.png",
  dlStandaloneNavy:     "https://download.dovelingua.com/website/DVL_withou_text_navy.png", // watermark use, 10-15% opacity
  dlGoldOnBlack:        "https://download.dovelingua.com/website/DL_+_DoveLingua_gold_&_black.png", // premium/digital only
  classroomLogo:        "https://download.dovelingua.com/website/classroom_login_logo_teal.png", // classroom platform ONLY
  whatsappChannelLogo:  "https://download.dovelingua.com/website/DV+Actualizacoes_whatsapp_group_profile.png", // that channel ONLY
  circularGoldTransparent:    "https://download.dovelingua.com/website/Circular_Gold_seal_founded2026_transparent.png",
  circularGoldSolid:          "https://download.dovelingua.com/website/Circular_Gold_seal_founded2026_non_transparent.png",
  circularNavy:                "https://download.dovelingua.com/website/Circular_navy_&_white_non_transparent.png",
  flyerCourseA1A2:      "https://download.dovelingua.com/website/Course_Adverstiment_flyer_A1_&A2.png",
  flyerApp:             "https://download.dovelingua.com/website/English_App_flyer_app_adverstiment.jpg"
};


/* ============================================================
   8. KEY-LOCK SCRIPT
   ============================================================ */
// Teacher Dove already has this script from her app. Placement confirmed:
// Right before </body>, loaded LAST on every page (after shared JS):
//
// <script src="/key-lock.js"></script>
//
// NOTE: agreed this is NOT real anti-cheat protection (can be bypassed by
// disabling JS, browser menu, extensions) — included as one extra layer only,
// not the actual anti-cheating solution for the level test.


/* ============================================================
   9. WORKING AGREEMENTS
   ============================================================ */
// - All code delivered as plain text in chat, no files/artifacts for code
// - Documentation/reference files (like this one) ARE okay as downloadable files
// - No dangerous key-locking claims — realistic security only
// - Colours: navy/gold/white/grey/navy-tint locked; teal accent-only; green retired
// - Site must be fully responsive (mobile/tablet/desktop) and professional-looking
// - Nothing should look "AI-generated" — clean, deliberate, brand-consistent
// - Preserve what's already good in existing pages, don't discard working content
// - Teacher Dove reviews/decides; AI supervisor flags problems honestly, doesn't just agree


/* ============================================================
   10. STATUS AS OF THIS LOG
   ============================================================ */
// ✅ Firebase project, auth, Firestore, security rules — LIVE
// ✅ Brand identity fully defined and documented
// ✅ Full blueprint (roles, pages, data structure) — AGREED
// ✅ Shared nav/side-menu/footer/CSS/JS foundation — WRITTEN (with real logo links + responsive fixes)
// ⏳ NEXT: rebuild index.html fully on this foundation
// ⏳ THEN: about.html, auth.html, and outward from there