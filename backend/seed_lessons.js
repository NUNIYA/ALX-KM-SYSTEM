require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');

const seedLessons = async () => {
  try {
    const mongoStr = process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db';
    await mongoose.connect(mongoStr);
    console.log('MongoDB Connected for Lessons...');

    await Lesson.deleteMany({}); // Wipe old sample data

    const now = new Date();
    const samples = [
      {
        title: 'Async API Rate Limiting Fallback',
        challenge: 'When deploying the student marketplace, the primary notification API hit rate limits and started dropping 40% of the active WebSockets during peak load (8 PM).',
        description: 'Observed that standard Axios retries were causing a thundering herd effect, overwhelming the microservice further instead of allowing it to recover.',
        recommendation: 'Implement exponential backoff with jitter on all client-side API requests. Replaced direct Axios retry with a customized interceptor that randomizes wait times.',
        category: 'Software Engineering',
        tags: ['API', 'React', 'Scaling', 'Axios'],
        author: 'Dr. Amanuel Bekele',
        upvotes: 84
      },
      {
        title: 'Cleaning Anomalous Cohort Data',
        challenge: 'The new cohort dataset contained messy formats for phone numbers and missing localized strings, leading to failed Tableau data joins.',
        description: 'Discovered that 15% of records had regional dialing codes mixed haphazardly with local formats, confusing the SQL parser.',
        recommendation: 'Created a standardized Python Pandas cleaning script using regex to force all phone strings into the international +251 format before SQL insertion. Saved 3 hours weekly.',
        category: 'Data Analytics',
        tags: ['Pandas', 'Python', 'Tableau', 'Data Cleaning'],
        author: 'Sara Tadesse',
        upvotes: 62
      },
      {
        title: 'Preventing Overfitting in NLP Models',
        challenge: 'The automated essay grading model was performing exceptionally well on training data but drastically failed when tested against student submissions from different campuses.',
        description: 'The model was memorizing specific prompt phrasing rather than learning semantic structures. The training data lacked dialectical diversity.',
        recommendation: 'Introduced targeted dropout layers and expanded the training corpus to include diverse student dialects. Decreased validation loss by 35%.',
        category: 'AI',
        tags: ['NLP', 'Machine Learning', 'Overfitting', 'PyTorch'],
        author: 'Yonas Girma',
        upvotes: 104
      },
      {
        title: 'De-escalating Imposter Syndrome in Month 1',
        challenge: 'During the first C programming sprint, 20% of the cohort showed signs of extreme burnout and expressed intent to drop out, citing "I am not smart enough."',
        description: 'By hosting anonymous feedback sessions, it became clear students were secretly comparing their pace to seniors who already had programming backgrounds.',
        recommendation: 'Introduced the "Growth vs Fixed Mindset" session strictly in week 2. Paired absolute beginners together so they pace organically without external pressure.',
        category: 'Soft Skills',
        tags: ['Psychology', 'Mentorship', 'Student Retention'],
        author: 'Liya Hailu',
        upvotes: 112
      },
      {
        title: 'Passing Technical Interviews Without React',
        challenge: 'Many students were failing frontline technical interviews because they relied entirely on React boilerplate and struggled with Vanilla JS algorithm whiteboard tests.',
        description: 'Found that students were memorizing component lifecycles rather than understanding actual DOM manipulation and prototype chains.',
        recommendation: 'Mandate a 2-week "Vanilla-Only" sprint where external frameworks are banned. Students must build an SPA using only HTML/CSS/JS before moving to React.',
        category: 'Career Development',
        tags: ['Interviews', 'Vanilla JS', 'Curriculum Design'],
        author: 'Dr. Amanuel Bekele',
        upvotes: 130
      }
    ];

    await Lesson.insertMany(samples);
    console.log(`✅ Inserted ${samples.length} sample lessons into the database.`);
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedLessons();
