export default function NotFoundSubscriber() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Oops, página não encontrada!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Desculpe, mas a página que você está procurando não existe. Volte para
          a página inicial e continue sua navegação.
        </p>
      </div>
    </div>
  )
}
