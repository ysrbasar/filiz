export default function MainLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 pt-12 space-y-6">
        <div className="h-8 bg-primary-100 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-primary-50 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
