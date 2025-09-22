import ProfileCard from "@/components/ProfileCard";
import { Root } from "@/utils/LanyardTypes";
import { LANYARD_API_URL } from "@/utils/env";
import { extractSearchParams } from "@/utils/extractSearchParams";
import { fetchUserImages } from "@/utils/fetchUserImages";
import { isSnowflake } from "@/utils/snowflake";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ReactDOMServer = (await import("react-dom/server")).default;
  const { searchParams } = new URL(request.url);
  const { id: userId } = await params;

  if (!userId)
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

  if (!isSnowflake(userId))
    return Response.json(
      {
        data: {
          error: "The user ID you provided is not a valid snowflake.",
        },
        success: false,
      },
      {
        status: 400,
      }
    );

  const lanyardData = await fetch(
    `${LANYARD_API_URL}/users/${userId}`,
    {
      cache: "no-store",
    }
  ).then(async (res) => (await res.json()) as Root & { error?: string });

  if ("error" in lanyardData || !lanyardData.success) {
    return Response.json(
      {
        data: lanyardData.error as string,
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  const settings = await extractSearchParams(
    Object.fromEntries(searchParams.entries()),
    lanyardData.data
  );

  // Generate SVG
  try {
    const images = await fetchUserImages(lanyardData.data, settings);

    // Render React SVG component to string
    const svgString = ReactDOMServer.renderToStaticMarkup(
      await ProfileCard({
        data: lanyardData.data,
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
