export const site = {
  name: 'Knot Alone',
  tagline: 'Psychology, Simplified',
  url: 'https://knotalone.net',
  description:
    "Why do we overthink, cling, shut down, or replay the same conversation 20 times? Knot Alone decodes the psychology behind everyday behavior in short, science-based animated videos, free workbooks and articles. No diagnosing, no shaming. Your brain isn't broken. You're knot alone.",
  locale: 'en',
  // Fill these in when you have them (empty = hidden / "coming soon")
  youtube: 'https://www.youtube.com/channel/UCESxAifucBpS1cRyc96dUIA',
  amazon: {
    'marry-to-don': '',
    'left-at-the-altar': '',
  },
  gscVerification: '', // content of <meta name="google-site-verification">
  bingVerification: '',

  // Analytics. Fill ONE of these in and it starts working on the next deploy.
  //   ga4Id       — Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'
  //   plausible   — your domain on Plausible, e.g. 'knotalone.net' (cookieless)
  // Leave both empty and the site ships with no tracking at all.
  ga4Id: 'G-LWVR3QE8JS',
  plausible: '',

  // Gumroad store, e.g. 'https://knotalone.gumroad.com' (public store URL,
  // NOT the gumroad.com/products dashboard, which needs a login).
  gumroad: 'https://thoughtkindworkbook.gumroad.com',

  // Where the Readers' Line signup actually goes. Set = a real button that
  // opens it. Empty = the local placeholder form that stores nothing.
  // Swap this one line when you move to MailerLite or Kit.
  newsletterUrl: 'https://thoughtkindworkbook.gumroad.com/subscribe',
  gumroadToolkit: 'https://thoughtkindworkbook.gumroad.com/l/free-toolkit',
  social: {
    Instagram: 'https://instagram.com/knotalone.co',
    Pinterest: 'https://pinterest.com/knotaloneco',
    Facebook: 'https://facebook.com/profile.php?id=61596298298973',
  },
  // Amazon Associates tracking id, e.g. 'knotalone-20'. Set = every Amazon
  // link carries it (clicks + orders show in the Associates report) and the
  // affiliate disclosure appears. Empty = plain links, no disclosure.
  amazonTag: '',

  // The person behind the byline. A pen name is fine for E-E-A-T as long as
  // the background is real and stated plainly — never add a credential here
  // that is not true.
  author: {
    name: 'Erena Jabrial',
    slug: 'erena-jabrial',
    jobTitle: 'Writer, Knot Alone and Thoughtkind Press',
    short:
      'Pen name of the writer behind Knot Alone. MSc Psychology, University of Greenwich (London), diplomas in mental health and a background in biotechnology. Currently training at the Psychiatry & Addiction Clinic at Value Medical Clinic. Diagnosed with ADHD at thirty; author of the memoir I Blamed the Brain. Not a licensed therapist: every article is educational and cites its research.',
    bio: [
      'Erena Jabrial is the pen name of the writer behind Knot Alone and the Thoughtkind Press workbooks.',
      'She holds an MSc in Psychology from the University of Greenwich in London and diplomas in mental health, and comes from a background in biotechnology, which is where the habit of reading the study behind the headline comes from. She is currently training at the Psychiatry & Addiction Clinic at Value Medical Clinic. Every article on this site is built on published research, lists its sources, and says plainly where the evidence is thin or contested.',
      'She was diagnosed with ADHD at thirty. That story, and the workbook she needed as a child, became her memoir, I Blamed the Brain.',
      'She is not a licensed therapist or clinician, and nothing here is diagnosis or treatment. The point is to explain the mechanism in plain language, so the person living it can stop treating it as a character flaw.',
      'Under the same name she also writes closed-door romance, the novels on this site.',
    ],
    knowsAbout: ['ADHD', 'Attachment theory', 'Overthinking and rumination', 'Breakup recovery', 'Emotion regulation', 'Procrastination', 'Addiction recovery'],
    alumniOf: [{ name: 'University of Greenwich', url: 'https://www.gre.ac.uk/' }],
    credentials: [
      { name: 'MSc Psychology', category: 'degree', by: 'University of Greenwich' },
      { name: 'Diplomas in mental health', category: 'certificate' },
    ],
    sameAs: [],
  },
  updated: '2026-11-18',
};
