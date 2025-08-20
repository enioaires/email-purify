import { FilterIcon } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FilterIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                EmailPurify
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Validação instantânea de listas de e-mail
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}