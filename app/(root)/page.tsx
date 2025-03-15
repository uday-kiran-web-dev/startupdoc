import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const session = await auth();
  console.log(session?.id);

  // const posts = await client.fetch(STARTUPS_QUERY);

  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params });
  //console.log(JSON.stringify(posts, null, 2));

  return (
    <>
      <section className="pink_container !pattern">
        <h1 className="heading">
          Pitch Your StartUp, <br /> Connect with Enterpreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches and Get Notified
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-2xl font-bold">
          {query ? `Search results for "${query}"` : "All startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No start ups found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
