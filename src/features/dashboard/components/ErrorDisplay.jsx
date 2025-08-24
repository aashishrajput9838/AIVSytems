export default function ErrorDisplay({ error, isLoading }) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading logs…</div>
  }

  if (error) {
    return (
      <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
        {error}
      </div>
    )
  }

  return null
}
