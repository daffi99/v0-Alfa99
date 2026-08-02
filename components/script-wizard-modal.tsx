"use client"

import React, { useState } from "react"
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, FileText, UserCheck, X } from "lucide-react"

export interface ScriptLine {
  id: string
  eps: string
  startTime?: string
  endTime?: string
  batchTime?: string
  character: string
  lineText: string
  status: "Inputted" | "Beluman"
}

export interface MasterArtistMapping {
  characterName: string
  finalArtist: string
  pitchSpeed?: string
}

export interface ScriptData {
  masterArtists: MasterArtistMapping[]
  lines: ScriptLine[]
  checkedCharacters?: Record<string, boolean>
  isConfigured?: boolean
}

interface ScriptWizardModalProps {
  isOpen: boolean
  onClose: () => void
  taskTitle: string
  initialData?: ScriptData
  onComplete: (data: ScriptData) => void
}

// Helper to sanitize Voice Actor Name and extract PS value
export function sanitizeVoiceActorAndPs(colA: string, colB: string, colC?: string) {
  const charName = colA.replace(/^["']|["']$/g, "").trim()
  const rawB = (colB || "").replace(/^["']|["']$/g, "").trim()
  const rawC = (colC || "").replace(/^["']|["']$/g, "").trim()

  let artist = ""
  let ps = ""

  // Case: colB is numeric PS (e.g. 0.97) and colC is Artist (e.g. "Andreas 0.97")
  if (rawB && !isNaN(Number(rawB)) && rawC) {
    ps = rawB
    artist = rawC
  }
  // Case: colB is Artist (e.g. Magda) and colC is PS (e.g. 0.97 or empty)
  else if (rawB) {
    artist = rawB
    ps = rawC
  } else {
    artist = "Unassigned"
  }

  // Strip trailing numbers/PS from artist name (e.g. "Andreas 0.97" -> "Andreas")
  const match = artist.match(/^(.+?)\s+([0-9]+(?:\.[0-9]+)?)$/)
  if (match) {
    artist = match[1].trim()
    if (!ps) {
      ps = match[2].trim()
    }
  }

  return { charName, artist: artist || "Unassigned", ps }
}

export function ScriptWizardModal({
  isOpen,
  onClose,
  taskTitle,
  initialData,
  onComplete,
}: ScriptWizardModalProps) {
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1 Raw & Parsed
  const [masterText, setMasterText] = useState("")
  const [parsedMaster, setParsedMaster] = useState<MasterArtistMapping[]>(
    initialData?.masterArtists || []
  )

  // Step 2 Raw & Parsed
  const [scriptText, setScriptText] = useState("")
  const [parsedLines, setParsedLines] = useState<ScriptLine[]>(
    initialData?.lines || []
  )

  if (!isOpen) return null

  // Helper to parse TSV Master Artist data
  const parseMasterArtists = (rawText: string) => {
    setMasterText(rawText)
    if (!rawText.trim()) return

    const rows = rawText.trim().split("\n")
    const results: MasterArtistMapping[] = []

    rows.forEach((rowStr) => {
      const cols = rowStr.split("\t").map((c) => c.trim())
      if (cols.length === 0) return

      const firstColLower = cols[0].toLowerCase()
      if (
        firstColLower.includes("character") ||
        firstColLower.includes("artist font") ||
        firstColLower === "check"
      ) {
        return
      }

      let charName = ""
      let artist = ""
      let ps = ""

      // Image 3 Format (6+ cols): Check | PS | Character | Count | Actor | Appear in
      if (
        cols.length >= 5 &&
        (cols[0] === "TRUE" ||
          cols[0] === "FALSE" ||
          cols[0] === "☑" ||
          cols[0] === "☐" ||
          !isNaN(Number(cols[1])) ||
          cols[1] === "")
      ) {
        charName = cols[2]
        const cleaned = sanitizeVoiceActorAndPs(charName, cols[4], cols[1])
        artist = cleaned.artist
        ps = cleaned.ps
      }
      // Image 4 / Flexible Format (1+ cols): Character | PS/Artist | Artist/PS
      else if (cols.length >= 1) {
        const cleaned = sanitizeVoiceActorAndPs(cols[0], cols[1] || "", cols[2])
        charName = cleaned.charName
        artist = cleaned.artist
        ps = cleaned.ps
      }

      if (
        charName &&
        charName.toLowerCase() !== "character name" &&
        charName.toLowerCase() !== "character"
      ) {
        results.push({
          characterName: charName,
          finalArtist: artist || "Unassigned",
          pitchSpeed: ps || undefined,
        })
      }
    })

    if (results.length > 0) {
      setParsedMaster(results)
    }
  }

  // Helper to parse TSV Script Lines data
  const parseScriptLines = (rawText: string) => {
    setScriptText(rawText)
    if (!rawText.trim()) return

    const rows = rawText.trim().split("\n")
    const results: ScriptLine[] = []

    rows.forEach((rowStr, index) => {
      const cols = rowStr.split("\t").map((c) => c.trim())
      if (cols.length < 2) return

      const col0Lower = cols[0].toLowerCase()
      if (
        col0Lower === "eps" ||
        col0Lower === "z" ||
        col0Lower.includes("start time") ||
        col0Lower.includes("character")
      ) {
        return
      }

      let eps = ""
      let startTime = ""
      let endTime = ""
      let batchTime = ""
      let character = ""
      let lineText = ""

      // Image 5 6-Column Format: Eps | Start Time | End Time | Batch tim | Character | Script file
      if (cols.length >= 6) {
        eps = cols[0]
        startTime = cols[1]
        endTime = cols[2]
        batchTime = cols[3]
        character = cols[4]
        lineText = cols[5]
      } else if (cols.length === 5) {
        eps = cols[0]
        startTime = cols[1]
        endTime = cols[2]
        character = cols[3]
        lineText = cols[4]
      } else if (cols.length === 4) {
        eps = cols[0]
        lineText = cols[1]
        character = cols[2]
      } else if (cols.length === 3) {
        eps = cols[0]
        character = cols[1]
        lineText = cols[2]
      }

      if (eps && character && lineText) {
        results.push({
          id: `line-${index}-${Date.now()}`,
          eps,
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          batchTime: batchTime || undefined,
          character,
          lineText,
          status: "Beluman",
        })
      }
    })

    if (results.length > 0) {
      setParsedLines(results)
    }
  }

  const handleFinish = () => {
    onComplete({
      masterArtists: parsedMaster,
      lines: parsedLines,
      isConfigured: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b flex items-start justify-between bg-card">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Script Setup Wizard
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {taskTitle}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {step === 1
                ? "Step 1 of 2: Copy & Paste Master Artist Mapping from Google Sheets"
                : "Step 2 of 2: Copy & Paste Script Lines from Google Sheets"}
            </p>
            {/* Step Progress bar */}
            <div className="flex items-center gap-2 pt-2">
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step >= 1 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-muted/40 p-3 rounded-lg border text-xs">
                <UserCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">
                    Copy Master Artist Table
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Select rows in Google Sheets (e.g. <b>Elton 0.97 &quot;Andreas 0.97&quot;</b> or <b>Character | Artist | PS</b>) and press <kbd className="px-1 py-0.5 bg-muted border rounded text-[10px]">Cmd+C</kbd> / <kbd className="px-1 py-0.5 bg-muted border rounded text-[10px]">Ctrl+C</kbd>, then paste below.
                  </p>
                </div>
              </div>

              <textarea
                placeholder={`Paste here...\n\nExample:\nElton\t0.97\t"Andreas 0.97"\nLeah\t1.04\t"Viola 1.04"\nDeanna\tMagda`}
                value={masterText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => parseMasterArtists(e.target.value)}
                className="w-full font-mono text-xs min-h-[140px] p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {parsedMaster.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Parsed {parsedMaster.length} Character Mappings
                    </span>
                  </div>
                  <div className="max-h-36 overflow-y-auto border rounded-md divide-y text-xs">
                    {parsedMaster.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-card">
                        <span className="font-medium text-foreground">{m.characterName}</span>
                        <div className="flex items-center gap-2">
                          {m.pitchSpeed && (
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                              PS: {m.pitchSpeed}
                            </span>
                          )}
                          <span className="text-muted-foreground font-semibold text-emerald-700">➡ {m.finalArtist}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-muted/40 p-3 rounded-lg border text-xs">
                <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">
                    Copy Raw Script Lines
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Copy columns from your boss&apos;s script sheet (supports Image 5 format <b>Eps | Start Time | End Time | Batch tim | Character | Script file</b> or Image 1 format) and paste below.
                  </p>
                </div>
              </div>

              <textarea
                placeholder={`Paste script lines here...\n\nExample (Image 5):\n11\t00:00:05\t00:00:06\t\tElton\tDeanna\n11\t00:00:06\t00:00:07\t\tElton\tich habe die Scheidung zurückgezogen.\n\nExample (Image 1):\n11\tDeanna\tElton\tInputted`}
                value={scriptText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => parseScriptLines(e.target.value)}
                className="w-full font-mono text-xs min-h-[140px] p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {parsedLines.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Parsed {parsedLines.length} Script Lines
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Default status: <b>Beluman</b>
                    </span>
                  </div>
                  <div className="max-h-36 overflow-y-auto border rounded-md divide-y text-xs">
                    {parsedLines.slice(0, 8).map((line, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-card gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary font-mono">
                            Ep {line.eps}
                          </span>
                          <span className="font-semibold text-xs min-w-[60px]">{line.character}:</span>
                          <span className="truncate text-muted-foreground">{line.lineText}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                          {line.status}
                        </span>
                      </div>
                    ))}
                    {parsedLines.length > 8 && (
                      <div className="p-1.5 text-center text-[11px] text-muted-foreground bg-muted/20">
                        + {parsedLines.length - 8} more lines...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-card flex items-center justify-between">
          {step === 1 ? (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 1
            </button>
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="px-4 py-1.5 text-xs bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1"
            >
              Next: Import Script Lines <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-1"
            >
              Finish Setup & Open Sheet <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
