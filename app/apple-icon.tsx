import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff8ef",
          color: "#8d5a15",
          border: "12px solid #d39c3f",
          borderRadius: 36,
          fontSize: 64,
          fontWeight: 700,
          fontFamily: "Arial",
        }}
      >
        C$
      </div>
    ),
    size,
  );
}
