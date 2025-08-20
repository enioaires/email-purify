"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ValidationRules } from "@/lib/email-validation-functions"

interface ValidationSettingsProps {
  rules: ValidationRules
  onRulesChange: (rules: Partial<ValidationRules>) => void
  disabled?: boolean
}

export function ValidationSettings({ rules, onRulesChange, disabled = false }: ValidationSettingsProps) {
  const handleRuleChange = (rule: keyof ValidationRules, checked: boolean) => {
    onRulesChange({ [rule]: checked })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Avançadas</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-auto max-h-80">
          <div className="space-y-4 pr-4">
          {/* Validation Rules */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkFormat"
                checked={rules.checkFormat}
                onCheckedChange={(checked) => handleRuleChange('checkFormat', checked as boolean)}
                disabled={disabled}
              />
              <label 
                htmlFor="checkFormat" 
                className="text-sm cursor-pointer"
              >
                Validação de formato
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="removeDuplicates"
                checked={true}
                disabled={true}
              />
              <label 
                htmlFor="removeDuplicates" 
                className="text-sm"
              >
                Remoção de duplicados
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkDisposable"
                checked={rules.checkDisposable}
                onCheckedChange={(checked) => handleRuleChange('checkDisposable', checked as boolean)}
                disabled={disabled}
              />
              <label 
                htmlFor="checkDisposable" 
                className="text-sm cursor-pointer"
              >
                Domínios descartáveis
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkRoleBased"
                checked={rules.checkRoleBased}
                onCheckedChange={(checked) => handleRuleChange('checkRoleBased', checked as boolean)}
                disabled={disabled}
              />
              <label 
                htmlFor="checkRoleBased" 
                className="text-sm cursor-pointer"
              >
                E-mails baseados em função
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="domainValidation"
                checked={true}
                disabled={true}
              />
              <label 
                htmlFor="domainValidation" 
                className="text-sm"
              >
                Validação de domínio (MX)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="cleanSpaces"
                checked={true}
                disabled={true}
              />
              <label 
                htmlFor="cleanSpaces" 
                className="text-sm"
              >
                Limpeza de espaços em branco
              </label>
            </div>
          </div>

            {/* Additional Options */}
            <div className="pt-3">
              <Separator className="mb-3" />
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="preserveCase"
                  checked={false}
                  disabled={true}
                />
                <label 
                  htmlFor="preserveCase" 
                  className="text-sm text-muted-foreground"
                >
                  Preservar maiúsculas/minúsculas
                </label>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}