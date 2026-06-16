export default function AkademiLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="h-6 w-32 bg-white/20 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-64 bg-white/20 rounded-xl mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden mb-12 border border-primary-100">
          <div className="aspect-video bg-gray-200 animate-pulse" />
          <div className="bg-white p-8 space-y-3">
            <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-filiz animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-full bg-gray-200 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
