import {
  FrameMetadata,
  frameMetadataToHtmlText,
  getFrameMessageFromRequestBody,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";
import { HOST, framePostUrl, ogImage } from "../../constants";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const untrustedMessage = getFrameMessageFromRequestBody(body);

  if (untrustedMessage.data?.frameActionBody?.buttonIndex === 2) {
    return Response.redirect(`${HOST}/redirect`, 302);
  }

  const result = await validateFrameMessage(body);
  const { isValid, message } = result;
  if (!isValid) {
    return new Response("Invalid message", { status: 400 });
  }

  const randomInt = Math.floor(Math.random() * 100);

  const frame: FrameMetadata = {
    version: "vNext",
    image: `https://picsum.photos/seed/${randomInt}/1146/600`,
    buttons: [
      {
        label: `Next (pressed by ${message?.data.fid})`,
      },
      {
        label: "Visit frames.js",
        action: "post_redirect",
      },
    ],
    ogImage: ogImage,
    postUrl: framePostUrl,
  };

  const html = frameMetadataToHtmlText(frame);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}