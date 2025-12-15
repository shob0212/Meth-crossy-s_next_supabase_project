"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "#f3f4f6",
          }}
        >
          <div
            style={{
              maxWidth: 560,
              width: "100%",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
              エラーが発生しました
            </h2>
            <p style={{ color: "#6b7280", marginBottom: 16 }}>
              {error?.message || "不明なエラー"}
            </p>
            {error?.digest ? (
              <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 16 }}>
                digest: {error.digest}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "10px 16px",
                borderRadius: 9999,
                background: "#2dd4bf",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              再試行
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
