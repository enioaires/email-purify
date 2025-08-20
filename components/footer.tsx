import { FilterIcon, HeartIcon, ShieldIcon, LockIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <FilterIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">EmailPurify</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ferramenta gratuita para limpeza e validação instantânea de listas de e-mail. 
              100% client-side, sem upload para servidores.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LockIcon className="w-3 h-3" />
              <span>Seus dados nunca saem do navegador</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Validação de formato</li>
              <li>• Remoção de duplicados</li>
              <li>• Filtro de domínios temporários</li>
              <li>• Análise de domínios</li>
              <li>• Exportação em CSV</li>
            </ul>
          </div>

          {/* Privacy & Security */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Privacidade</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldIcon className="w-3 h-3" />
                <span>100% Client-side</span>
              </li>
              <li>• Sem registro necessário</li>
              <li>• Dados não armazenados</li>
              <li>• GDPR Compliant</li>
              <li>• Open Source</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Formatos: CSV, TXT, XLSX</li>
              <li>• Até 100k+ e-mails</li>
              <li>• Processamento rápido</li>
              <li>• Suporte mobile</li>
              <li>• Totalmente gratuito</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 EmailPurify</span>
            <Separator orientation="vertical" className="h-4" />
            <a 
              href="#termos" 
              className="hover:text-foreground transition-colors"
            >
              Termos de Serviço
            </a>
            <a 
              href="#privacidade" 
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidade
            </a>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Feito com</span>
            <HeartIcon className="w-4 h-4 text-red-500 fill-current" />
            <span>para equipes de marketing</span>
          </div>
        </div>
      </div>
    </footer>
  )
}