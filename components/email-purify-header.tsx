"use client"

import { FilterIcon } from "lucide-react"

export function EmailPurifyHeader() {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <FilterIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">
          EmailPurify
        </h1>
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          Limpe sua Lista de E-mails Instantaneamente
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Faça o upload do seu arquivo e nós cuidamos do resto. Sem atrito, resultados transparentes.
        </p>
      </div>
    </div>
  )
}