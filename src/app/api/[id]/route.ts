import ProfileCard from "@/components/ProfileCard";
import { isSnowflake } from "@/utils/snowflake";
import { Root, Data } from "@/utils/LanyardTypes";
import { extractSearchParams } from "@/utils/extractSearchParams";
import { fetchUserImages } from "@/utils/fetchUserImages";

// defaults to the public instance so existing badges for everyone else keep
// working; pass ?source=self to try the self-hosted larpyard first, falling
// back to public for any ID larpyard isn't monitoring (e.g. an alt account
// that's only in the public Lanyard support server, not larpyard's guild)
const LANYARD_HOSTS = {
  public: "https://api.lanyard.rest",
  self: "https://larpyard.arshnah.in",
};

async function fetchFrom(id: string, host: string): Promise<Data | null> {
  try {
    const json = (await fetch(`${host}/v1/users/${id}`, {
      cache: "no-store",
    }).then((res) => res.json())) as Root & { error?: string };
    if (!json.success || "error" in json) return null;
    return json.data;
  } catch {
    return null;
  }
}

async function fetchLanyard(
  id: string,
  source: keyof typeof LANYARD_HOSTS
): Promise<Data | null> {
  const primary = await fetchFrom(id, LANYARD_HOSTS[source]);
  if (primary) return primary;
  if (source === "self") return fetchFrom(id, LANYARD_HOSTS.public);
  return null;
}

// Picks the first linked account (in the order given) that isn't offline,
// so e.g. /api/mainId,altId shows whichever account is actually active.
// Falls back to the first account's data if every linked account is offline.
function pickPresence(results: Array<Data | null>): Data | null {
  const valid = results.filter((r): r is Data => r !== null);
  if (valid.length === 0) return null;
  return valid.find((d) => d.discord_status !== "offline") ?? valid[0];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ReactDOMServer = (await import("react-dom/server")).default;
  const { searchParams } = new URL(request.url);
  const { id: rawId } = await params;

  if (!rawId)
    return Response.json(
      {
        data: {
          error: "No user ID provided.",
        },
        success: false,
      },
      {
        status: 400,
      }
    );

  // supports a comma-separated list of snowflakes, e.g. /api/123,456, to
  // merge multiple Discord accounts into a single badge
  const ids = rawId
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const invalidId = ids.find((id) => !isSnowflake(id));
  if (invalidId)
    return Response.json(
      {
        data: {
          error: `"${invalidId}" is not a valid snowflake.`,
        },
        success: false,
      },
      {
        status: 400,
      }
    );

  const source = searchParams.get("source") === "self" ? "self" : "public";
  const data = pickPresence(
    await Promise.all(ids.map((id) => fetchLanyard(id, source)))
  );

  if (!data)
    return Response.json(
      {
        data: {
          error: "None of the provided user IDs could be found via Lanyard.",
        },
        success: false,
      },
      {
        status: 400,
      }
    );

  const settings = await extractSearchParams(
    Object.fromEntries(searchParams.entries()),
    data
  );

  // Generate SVG
  try {
    const images = await fetchUserImages(data, settings);

    // Render React SVG component to string
    const svgString = ReactDOMServer.renderToStaticMarkup(
      await ProfileCard({
        data: data,
        settings: settings,
        images: images,
      })
    );

    // Return SVG with appropriate headers
    return new Response(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("Error generating SVG:", error);
    return new Response("Error generating SVG", { status: 500 });
  }
}
