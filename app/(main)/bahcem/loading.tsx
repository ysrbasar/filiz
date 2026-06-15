export default function BahcemLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="h-8 bg-primary-100 rounded w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-primary-50 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
