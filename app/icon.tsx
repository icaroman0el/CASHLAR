import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f2bb5b, #18794e)",
          color: "#1f1a16",
          fontSize: 180,
          fontWeight: 700,
          borderRadius: 112,
          fontFamily: "Arial",
        }}
      >
        C$
      </div>
    ),
    size,
  );
}
