export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
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
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          ページが見つかりません
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>
          指定されたページは存在しないか、移動しました。
        </p>
        <a
          href="/"
          style={{
            padding: "10px 16px",
            borderRadius: 9999,
            background: "#2dd4bf",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
}
