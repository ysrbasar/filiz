export default function SeedDetailLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-4 bg-primary-100 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-primary-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-primary-100 rounded w-24" />
            <div className="h-10 bg-primary-100 rounded w-3/4" />
            <div className="h-4 bg-primary-50 rounded w-1/2" />
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-primary-50 rounded" />
              <div className="h-3 bg-primary-50 rounded w-5/6" />
              <div className="h-3 bg-primary-50 rounded w-4/6" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="h-20 bg-primary-50 rounded-2xl" />
              <div className="h-20 bg-primary-50 rounded-2xl" />
            </div>
            <div className="h-32 bg-primary-100 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
