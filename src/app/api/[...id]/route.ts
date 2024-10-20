import redis from "@/utils/redis";
import renderCard, { Parameters } from "@/utils/renderCard";
import { isSnowflake } from "@/utils/snowflake";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  options: { params: { id: string[] } },
) {
  const userId = options.params.id.join("/");

  if (!userId)
    return Response.json(
      {
        data: {
          error: "No ID provided.",
        },
        success: false,
      },
      {
        status: 400,
      },
    );

  if (!isSnowflake(userId))
    return Response.json(
      {
        data: {
          error: "The ID you provide is not a valid snowflake.",
        },
        success: false,
      },
      {
        status: 400,
      },
    );

  let getUser: any = {};

  getUser.data = await fetch(
    `https://api.lanyard.rest/v1/users/${userId}`,
  ).then(async (res) => {
    const data = await res.json();

    if (!data.success) {
      getUser.error = data.error;
    }

    return data;
  });

  if (getUser.error) {
    return Response.json(
      {
        data: getUser.error,
        success: false,
      },
      {
        status: 400,
      },
    );
  }

  const params: Parameters = Object.fromEntries(
    req.nextUrl.searchParams.entries(),
  );

  try {
    let user = await redis.hget("users", userId);
    if (!user) await redis.hset("users", userId, "true");
  } catch {
    null;
  }

  return new Response(await renderCard(getUser.data, params), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "content-security-policy":
        "default-src 'none'; img-src * data:; style-src 'unsafe-inline'",
    },
    status: 200,
  });
}
