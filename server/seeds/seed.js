require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({ connectionString: process.env.DATABASE_URL });

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
}

const users = [
  { name: 'Marcus Rivera',  email: 'marcus@example.com', password: 'password123' },
  { name: 'Jenna Brooks',   email: 'jenna@example.com',  password: 'password123' },
  { name: 'Tom Kowalski',   email: 'tom@example.com',    password: 'password123' },
];

const postTemplates = [
  { title: 'Why Football Is the Ultimate Team Sport',         body: 'Football demands total coordination between eleven players on the field. Every position has a distinct role — from the goalkeeper reading the game to the striker making split-second decisions in the box. What separates great teams from good ones is not individual talent but chemistry built through hundreds of hours of training together.' },
  { title: 'The Mental Side of Marathon Running',             body: 'Running 42 kilometers is as much a psychological challenge as a physical one. Many runners hit the wall around kilometer 32, where the body screams to stop and the mind must take over. Elite marathoners train their mental resilience just as deliberately as their aerobic capacity, using visualization, mantras, and race-day routines.' },
  { title: 'Basketball Analytics: Beyond Points Per Game',    body: 'Modern basketball has been transformed by analytics. Metrics like player efficiency rating, true shooting percentage, and defensive rating tell a far richer story than raw points. Teams now scout opponents using advanced shot charts and lineup data, turning what was once gut-feel coaching into evidence-based decision making.' },
  { title: 'The Rise of Women\'s Football Globally',          body: 'Women\'s football has seen explosive growth over the past decade. Attendance records shattered at the 2023 World Cup, and broadcast deals have multiplied in value across Europe and North America. Young girls now have role models who are professional athletes, national heroes, and global icons all at once.' },
  { title: 'How Nutrition Fuels Elite Athletes',              body: 'Top athletes treat food as performance fuel. Carbohydrate periodization, protein timing, and hydration strategy are all carefully planned around training cycles. A sprinter\'s diet differs dramatically from a cyclist\'s because energy systems and recovery demands are completely different. Nutrition science has become a competitive edge.' },
  { title: 'Tennis: The Loneliest Sport on Earth',            body: 'In tennis you step onto the court completely alone. No teammates to rely on, no timeout to regroup with a coach, just you and the opponent across the net. The mental isolation forces players to develop an inner resilience that few other sports demand. That is why champions like Djokovic and Serena Wilson are studied as much for their psychology as their technique.' },
  { title: 'Why Swimming Builds the Best All-Round Fitness',  body: 'Swimming engages virtually every major muscle group while being completely low-impact on the joints. It builds cardiovascular endurance, muscular strength, and flexibility simultaneously. Many physiotherapists recommend swimming as the gold standard of cross-training for athletes recovering from injury or seeking full-body conditioning without the wear of land sports.' },
  { title: 'The Tactics Behind a Perfect Counterattack',      body: 'The counterattack is one of football\'s most thrilling plays. It requires defensive discipline to absorb pressure, lightning-fast transition when possession is won, and clinical finishing at the end. Teams like Atletico Madrid have built entire philosophies around it. A single misplaced touch can end the opportunity; execution must be instinctive.' },
  { title: 'Cycling\'s Grand Tours: A Race of Survival',      body: 'The Tour de France, Giro d\'Italia, and Vuelta a España are three weeks of sustained suffering spread across mountains, time trials, and flat sprint stages. Riders lose several kilograms of body weight over the course of the event. Team tactics, weather, and individual form can all swing the general classification in a single afternoon in the Alps.' },
  { title: 'MMA: Where Every Second Counts',                  body: 'Mixed martial arts is chess played at full speed. A fighter must be competent in striking, wrestling, and Brazilian jiu-jitsu — and be able to switch between them mid-exchange. One moment of hesitation can end a fight. Camps now employ coaches for every discipline plus analysts who study hours of opponent footage before each bout.' },
  { title: 'The Psychology of Penalty Kicks',                 body: 'The penalty shootout is designed to be fair but feels profoundly unfair. A goalkeeper guesses left or right, and a striker tries to ignore an entire stadium holding its breath. Research shows that kickers who wait longer before running up score at a lower rate, suggesting that thinking too much is the enemy. Confidence and routine are everything.' },
  { title: 'Youth Academies: Where Legends Are Made',         body: 'The best clubs in the world invest heavily in their youth academies knowing that a homegrown star is worth far more than a purchased one. La Masia, Clairefontaine, and Ajax\'s youth system have produced generations of world-class players. The debate is always how much to develop technical skill versus competitive mentality at a young age.' },
];

const commentTemplates = [
  'Great read! Totally agree with this perspective.',
  'Been following this sport for years and this nails it.',
  'Never thought about it this way — really eye-opening.',
  'My coach shared this with the whole team. Thanks!',
  'Could you write a follow-up on the defensive side of this?',
  'Watched the game last night and this article suddenly made sense.',
  'Solid points. The mental aspect is always underrated.',
  'This is exactly why I love this sport. Well said.',
  'Disagree slightly on the tactics part but the rest is spot on.',
  'Shared this with my training group. Great discussion starter.',
];

async function seed() {
  await client.connect();
  console.log('Connected to database');

  // Clear existing data
  await client.query('DELETE FROM comments');
  await client.query('DELETE FROM posts');
  await client.query('DELETE FROM users');
  console.log('Cleared existing data');

  // Create users
  const createdUsers = [];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    const now = Date.now();
    const res = await client.query(
      'INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $4) RETURNING id, name',
      [u.name, u.email, hash, now]
    );
    createdUsers.push(res.rows[0]);
    console.log('Created user:', res.rows[0].name);
  }

  // Create posts for users
  const createdPosts = [];
  for (let i = 0; i < postTemplates.length; i++) {
    const author = createdUsers[i % createdUsers.length];
    const now = Date.now() - (postTemplates.length - i) * 60000;
    const slug = slugify(postTemplates[i].title);
    const res = await client.query(
      'INSERT INTO posts (title, slug, body, "authorId", "deletedAt", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NULL, $5, $5) RETURNING id, title',
      [postTemplates[i].title, slug, postTemplates[i].body, author.id, now]
    );
    createdPosts.push({ ...res.rows[0], authorId: author.id });
    console.log('Created post:', res.rows[0].title.substring(0, 40));
  }

  // Create comments for each post
  for (const post of createdPosts) {
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const commenter = createdUsers[(post.id + i) % createdUsers.length];
      const body = commentTemplates[(post.id + i) % commentTemplates.length];
      const now = Date.now() - Math.floor(Math.random() * 3600000);
      await client.query(
        'INSERT INTO comments (body, "postId", "authorId", "authorName", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $5)',
        [body, post.id, commenter.id, commenter.name, now]
      );
    }
    console.log('Added comments to post:', post.id);
  }

  await client.end();
  console.log('\nSeeding complete!');
}

seed().catch(err => { console.error(err); process.exit(1); });
