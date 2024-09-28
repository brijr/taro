import { db, client } from "./drizzle";
import { users, teams, sites, postTypes, posts, fields } from "./schema";
import { hashPassword } from "@/lib/auth/session";

async function seed() {
  try {
    console.log("Starting seed process...");

    // Create a user
    const hashedPassword = await hashPassword("password123");
    const [user] = await db
      .insert(users)
      .values({
        name: "Test User",
        email: "test@example.com",
        passwordHash: hashedPassword,
        role: "admin",
      })
      .returning();
    console.log("Created user:", user);

    // Create a team
    const [team] = await db
      .insert(teams)
      .values({
        name: "Test Team",
      })
      .returning();
    console.log("Created team:", team);

    // Create a site
    const [site] = await db
      .insert(sites)
      .values({
        teamId: team.id,
        name: "Test Site",
        domain: "test.com",
        isActive: true,
      })
      .returning();
    console.log("Created site:", site);

    // Create a post type
    const [postType] = await db
      .insert(postTypes)
      .values({
        siteId: site.id,
        name: "Blog Post",
        slug: "blog-post",
        description: "A standard blog post",
        fields: [],
        isActive: true,
      })
      .returning();
    console.log("Created post type:", postType);

    // Create fields for the post type
    const fieldData = [
      {
        name: "Title",
        slug: "title",
        type: "text",
        isRequired: true,
        order: 0,
      },
      {
        name: "Content",
        slug: "content",
        type: "text",
        isRequired: true,
        order: 1,
      },
      {
        name: "Featured Image",
        slug: "featured-image",
        type: "text",
        isRequired: false,
        order: 2,
      },
    ];

    for (const field of fieldData) {
      const [createdField] = await db
        .insert(fields)
        .values({
          postTypeId: postType.id,
          ...field,
        })
        .returning();
      console.log("Created field:", createdField);
    }

    // Create a post
    const [post] = await db
      .insert(posts)
      .values({
        postTypeId: postType.id,
        authorId: user.id,
        title: "First Blog Post",
        slug: "first-blog-post",
        content: JSON.stringify({
          title: "First Blog Post",
          content: "This is the content of the first blog post.",
          "featured-image": "https://example.com/image.jpg",
        }),
        status: "published",
        isPublished: true,
      })
      .returning();
    console.log("Created post:", post);

    console.log("Seed process completed successfully.");
  } catch (error) {
    console.error("Error during seed process:", error);
  } finally {
    await client.end();
  }
}

seed();
