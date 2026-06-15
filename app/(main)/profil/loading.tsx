export default function ProfilLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-100" />
          <div className="space-y-2">
            <div className="h-6 bg-primary-100 rounded w-40" />
            <div className="h-4 bg-primary-50 rounded w-28" />
          </div>
        </div>
        <div className="h-24 bg-primary-50 rounded-2xl" />
        <div className="h-48 bg-primary-50 rounded-2xl" />
      </div>
    </div>
  )
}
