import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"



export default function TalkAICard() {
      const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nuevo prompt:", prompt)
    setPrompt("")
  }

  {/* Talk to IA - Footer */}
    return (
        <div className="space-y-4">

       

          {/* Input para Nuevo Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consulta a la IA</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={prompt}
                  onChange={(e: { target: { value: React.SetStateAction<string> } }) => setPrompt(e.target.value)}
                  placeholder="Pregunta sobre riego, clima o optimización del sistema..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!prompt.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                Ejemplo: &quot;¿Cuál es el mejor momento para regar mañana?&quot; o &quot;¿Cómo puedo reducir el consumo de agua?&quot;
              </p>
            </CardContent>
          </Card>
        </div>
    )}