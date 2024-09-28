import { db } from '../lib/db/drizzle';
import { sites, postTypes, fields, posts } from '../lib/db/schema';

async function testMigrations() {
  try {
    // Insert a test site
    const [site] = await db.insert(sites).values({
      teamId: 1, // Assuming you have a team with ID 1
      name: 'Test Site',
      domain: 'test.com',
    }).returning();

    console.log('Inserted site:', site);

    // Insert a test post type
    const [postType] = await db.insert(postTypes).values({
      siteId: site.id,
      name: 'Test Post Type',
      slug: 'test-post-type',
      fields: [],
    }).returning();

    console.log('Inserted post type:', postType);

    // Insert a test field
    const [field] = await db.insert(fields).values({
      postTypeId: postType.id,
      name: 'Test Field',
      slug: 'test-field',
      type: 'text',
      order: 0,
    }).returning();

    console.log('Inserted field:', field);

    // Insert a test post
    const [post] = await db.insert(posts).values({
      postTypeId: postType.id,
      authorId: 1, // Assuming you have a user with ID 1
      title: 'Test Post',
      slug: 'test-post',
      content: {},
    }).returning();

    console.log('Inserted post:', post);

    // Retrieve and log all inserted data
    const allSites = await db.select().from(sites);
    const allPostTypes = await db.select().from(postTypes);
    const allFields = await db.select().from(fields);
    const allPosts = await db.select().from(posts);

    console.log('All sites:', allSites);
    console.log('All post types:', allPostTypes);
    console.log('All fields:', allFields);
    console.log('All posts:', allPosts);

  } catch (error) {
    console.error('Error testing migrations:', error);
  } finally {
    await db.end();
  }
}

testMigrations();
