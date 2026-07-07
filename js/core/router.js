// ============================================================
// DOVELINGUA — DYNAMIC ROUTER
// Location: /js/core/router.js
// Purpose: ALL navigation paths in ONE file
// Usage in HTML: <script src="../js/core/router.js"></script>
// Usage in links: onclick="navigateTo('admin.dashboard')"
// ============================================================

const ROUTES = {

  // PUBLIC pages — no login required
  public: {
    home:               '../public/index.html',
    about:              '../public/about.html',
    programme:          '../public/programme.html',
    contact:            '../public/contact.html',
    report:             '../public/report.html',
    faq:                '../public/faq.html',
    donate:             '../public/donate.html',
    terms:              '../public/terms.html',
    support:            '../public/support.html',
    announcements:      '../public/announcements.html',
    evaluate:           '../public/evaluate.html',
    levelTest:          '../public/level-test.html',
    auth:               '../public/auth.html',
    verifyCertificate:  '../public/verify-certificate.html',
    notFound:           '../public/404.html',
    unauthorized:       '../public/unauthorized.html'
  },

  // APPLICANT pages
  applicant: {
    dashboard:          '../applicant/dashboard.html',
    uploadDocuments:    '../applicant/upload-documents.html'
  },

  // STUDENT pages
  students: {
    dashboard:          '../students/dashboard.html',
    grades:             '../students/grades.html',
    myTests:            '../students/my-tests.html',
    certificate:        '../students/certificate.html',
    receipts:           '../students/receipts.html',
    messages:           '../students/messages.html',
    documents:          '../students/documents.html'
  },

  // TEACHER pages
  teachers: {
    dashboard:          '../teachers/dashboard.html',
    pauta:              '../teachers/pauta.html',
    tests:              '../teachers/tests.html',
    messages:           '../teachers/messages.html',
    materials:          '../teachers/materials.html'
  },

  // STAFF pages
  staff: {
    dashboard:          '../staff/dashboard.html',
    payments:           '../staff/payments.html',
    documents:          '../staff/documents.html'
  },

  // ADMIN pages
  admin: {
    dashboard:          '../admin/dashboard.html',
    users:              '../admin/users.html',
    payments:           '../admin/payments.html',
    announcements:      '../admin/announcements.html',
    courses:            '../admin/courses.html',
    levelTestEditor:    '../admin/level-test-editor.html',
    documents:          '../admin/documents.html',
    settings:           '../admin/settings.html'
  }

};

// ============================================================
// NAVIGATE FUNCTION
// ============================================================
function navigateTo(route) {
  const parts = route.split('.');
  if (parts.length !== 2) {
    console.error('[Router] Invalid route format. Use "folder.page" — e.g. "admin.dashboard"');
    return;
  }
  const folder = parts[0];
  const page = parts[1];
  if (ROUTES[folder] && ROUTES[folder][page]) {
    window.location.href = ROUTES[folder][page];
  } else {
    console.error('[Router] Route not found:', route);
    console.info('[Router] Available routes:', Object.keys(ROUTES));
  }
}

// Make navigateTo available globally (called from onclick in HTML)
window.navigateTo = navigateTo;
window.ROUTES = ROUTES;

// ============================================================
// USAGE REMINDER (remove in production if desired)
// ============================================================
// <script src="../js/core/router.js"></script>
//
// Hybrid link example:
// <a href="../admin/users.html"
//    onclick="navigateTo('admin.users'); return false;">
//    Estudantes e Utilizadores
// </a>
//
// Programmatic navigation:
// navigateTo('admin.dashboard');
// navigateTo('public.auth');
// navigateTo('students.grades');
// ============================================================
