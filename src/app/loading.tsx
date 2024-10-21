export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white cursor-wait pointer-events-auto z-1000">
      <div className="loader-container fixed inset-0 flex flex-col h-full justify-center items-center z-100">
        <div className="gap-3 h-full flex flex-col justify-center">
          <div className="loading-text text-black font-medium mt-8 grid gap-4 px-3">
            <div className="loader border-[3px] border-primary text-primary border-t-transparent rounded-full w-6 h-6 animate-spin mx-auto mt-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
