"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FilePreviewProps {
  emails: string[]
  fileName?: string | null
}

export function FilePreview({ emails, fileName }: FilePreviewProps) {
  if (!emails.length) return null

  // Simular dados de preview com colunas
  const previewData = emails.slice(0, 5).map((email, index) => ({
    id: index + 1,
    name: `Usuário ${index + 1}`,
    email: email,
    age: Math.floor(Math.random() * 50) + 20
  }))

  const totalEmails = emails.length
  const showingCount = Math.min(5, totalEmails)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pré-visualização do Arquivo</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Coluna A</TableHead>
              <TableHead className="font-medium">Coluna B (E-mail)</TableHead>
              <TableHead>Coluna C</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-muted-foreground">
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell className="font-mono text-sm">
                  {row.email}
                </TableCell>
                <TableCell>{row.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

        {/* Footer Info */}
        <div className="mt-3 space-y-1">
          <p className="text-sm text-muted-foreground">
            ... mais {totalEmails - showingCount > 0 ? totalEmails - showingCount : 0} linhas
          </p>
          <p className="text-xs text-muted-foreground">
            A coluna de e-mail foi detectada automaticamente. Apenas as 5 primeiras linhas são mostradas.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}