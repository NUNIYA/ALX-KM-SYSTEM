require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('./models/Resource');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db');
    console.log('MongoDB Connected...');

    // Remove old sample resources
    await Resource.deleteMany({ uploadedBy: { $in: ['ALX Facilitator', 'mentor@gmail.com', 'Dr. Amanuel Bekele', 'Sara Tadesse', 'Yonas Girma', 'Liya Hailu'] } });

    const now = new Date();
    const samples = [
      // ── SOP ────────────────────────────────────────────────
      {
        title: 'Student Onboarding SOP',
        description: 'Standard Operating Procedure for welcoming new students, setting up access credentials, and completing the first-week checklist for the ALX Ethiopia programme.',
        category: 'SOP',
        uploadedBy: 'Dr. Amanuel Bekele',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 42,
        viewCount: 218,
        tags: ['onboarding', 'SOP', 'admin'],
        updatedAt: new Date(now - 2 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'Peer Review & Grading SOP',
        description: 'A structured guide on how facilitators must conduct peer reviews, assign scores, and document feedback using the ALX evaluation rubric. Includes escalation steps.',
        category: 'SOP',
        uploadedBy: 'Sara Tadesse',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 31,
        viewCount: 155,
        tags: ['grading', 'peer-review', 'SOP'],
        updatedAt: new Date(now - 5 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'Attendance & Accountability SOP',
        description: 'Defines expectations for physical and virtual attendance, how absences are recorded, and the three-strike accountability framework used across all ALX cohorts.',
        category: 'SOP',
        uploadedBy: 'Yonas Girma',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 28,
        viewCount: 134,
        tags: ['attendance', 'accountability'],
        updatedAt: new Date(now - 10 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },

      // ── CURRICULUM ─────────────────────────────────────────
      {
        title: 'Month 1–4 Software Engineering Curriculum',
        description: 'Full curriculum map for the Software Engineering track. Covers C programming, shell scripting, Python, data structures, and web fundamentals across 4 months.',
        category: 'Curriculum',
        uploadedBy: 'Dr. Amanuel Bekele',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 89,
        viewCount: 512,
        tags: ['curriculum', 'SWE', 'month-1', 'month-4'],
        updatedAt: new Date(now - 1 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'Data Analytics Track – Curriculum Overview',
        description: 'Comprehensive semester plan for the Data Analytics track. Includes Python for data, SQL, Tableau, Power BI, and capstone project milestones.',
        category: 'Curriculum',
        uploadedBy: 'Liya Hailu',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 67,
        viewCount: 389,
        tags: ['curriculum', 'data', 'analytics'],
        updatedAt: new Date(now - 3 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'AI & Machine Learning Curriculum',
        description: 'Structured learning path for the AI specialisation. Covers NLP, supervised learning, neural networks, model deployment, and ethics of AI in African contexts.',
        category: 'Curriculum',
        uploadedBy: 'Yonas Girma',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 54,
        viewCount: 276,
        tags: ['AI', 'ML', 'curriculum'],
        updatedAt: new Date(now - 7 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },

      // ── COACHING GUIDE ─────────────────────────────────────
      {
        title: 'Facilitator Coaching Playbook',
        description: 'A complete guide for facilitators on conducting 1-on-1 coaching sessions, identifying at-risk students early, building trust, and applying motivational interview techniques.',
        category: 'Coaching Guide',
        uploadedBy: 'Sara Tadesse',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 73,
        viewCount: 341,
        tags: ['coaching', 'mentorship', 'guide'],
        updatedAt: new Date(now - 4 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'Growth Mindset Coaching Guide',
        description: 'A session-by-session coaching guide to help students develop a growth mindset, overcome imposter syndrome, and build consistent study habits aligned with ALX values.',
        category: 'Coaching Guide',
        uploadedBy: 'Liya Hailu',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 61,
        viewCount: 295,
        tags: ['mindset', 'coaching', 'student-success'],
        updatedAt: new Date(now - 6 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'Technical Interview Coaching Guide',
        description: 'Prepares students for technical interviews with structured coaching templates, mock interview scripts, DSA problem-solving frameworks, and behavioural interview prep.',
        category: 'Coaching Guide',
        uploadedBy: 'Dr. Amanuel Bekele',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 95,
        viewCount: 473,
        tags: ['interview', 'technical', 'career'],
        updatedAt: new Date(now - 2 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },

      // ── PARTNERSHIPS ───────────────────────────────────────
      {
        title: 'Corporate Partner MOU Template',
        description: 'Official Memorandum of Understanding template for establishing corporate partnerships with ALX Ethiopia. Includes scope, obligations, reporting, and NDA clauses.',
        category: 'Partnerships',
        uploadedBy: 'Yonas Girma',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 19,
        viewCount: 88,
        tags: ['MOU', 'legal', 'partnership'],
        updatedAt: new Date(now - 14 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'University Collaboration Framework',
        description: 'Framework document outlining how ALX Ethiopia collaborates with Ethiopian universities for credit transfer, dual enrolment, joint research, and guest lecture programmes.',
        category: 'Partnerships',
        uploadedBy: 'Sara Tadesse',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 24,
        viewCount: 102,
        tags: ['university', 'collaboration', 'framework'],
        updatedAt: new Date(now - 9 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
      {
        title: 'NGO & Impact Partner Engagement Guide',
        description: 'Guidelines for engaging NGOs and impact-driven organisations as placement and sponsorship partners. Includes pitch deck templates and impact measurement criteria.',
        category: 'Partnerships',
        uploadedBy: 'Liya Hailu',
        authorRole: 'facilitator',
        status: 'published',
        visibility: 'public',
        helpfulVotes: 17,
        viewCount: 74,
        tags: ['NGO', 'impact', 'engagement'],
        updatedAt: new Date(now - 11 * 86400000),
        fileUrl: 'uploads/sample_guideline.txt',
      },
    ];

    await Resource.insertMany(samples);
    console.log(`\n✅ Inserted ${samples.length} sample resources across 4 categories.\n`);
    console.log('Categories: SOP · Curriculum · Coaching Guide · Partnerships');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
