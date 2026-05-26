import { describe, it, expect } from "vitest";
import { getPosts, getPostBySlug } from "./posts";

describe("getPosts", () => {
  it("returns all posts", () => {
    const posts = getPosts();
    expect(posts.length).toBeGreaterThanOrEqual(3);
    expect(posts[0]).toHaveProperty("slug");
    expect(posts[0]).toHaveProperty("title");
    expect(posts[0]).toHaveProperty("body");
  });
});

describe("getPostBySlug", () => {
  it("returns post for valid slug", () => {
    const post = getPostBySlug("how-to-buy-fresh-coffee");
    expect(post).not.toBeNull();
    expect(post!.slug).toBe("how-to-buy-fresh-coffee");
  });

  it("returns null for invalid slug", () => {
    expect(getPostBySlug("nonexistent")).toBeNull();
  });
});
