import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";

const md = markdownit();

export const experimental_ppr = true;

const StartupDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const [post, editorPostsData] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "new",
    }),
  ]);

  const editorPosts = editorPostsData?.select || [];

  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || "");
  return (
    <>
      <section className="pink_container !min-h-[230px] text-white">
        <p className="tag tag-tri">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <img src={post.image} alt="" className="w-full h-auto rounded-xl" />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <img
                src={post.author.image}
                alt="avatar"
                width={60}
                height={70}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="font-bold">{post.author.name}</p>
                <p className="font-normal  !text-gray-400">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag"> {post.category}</p>
          </div>
          <h3 className="font-bold text-3xl">Pitch Details</h3>

          {parsedContent ? (
            <article
              className="prose max-w-4xl font-worksans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        {editorPosts?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {editorPosts.map((post: StartupTypeCard, index: number) => (
                <StartupCard key={index} post={post} />
              ))}
            </ul>
          </div>
        )}
        <Skeleton className="view_skeleton">
          <View id={id} />
        </Skeleton>
      </section>
    </>
  );
};

export default StartupDetails;
