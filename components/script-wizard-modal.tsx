"use client"

import React, { useState } from "react"
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, FileText, UserCheck, X } from "lucide-react"

export type ScriptLineStatus =
  | "Beluman"
  | "Inputted"
  | "Missing"
  | "Broken"
  | "VO Error"
  | "Need Pauses"
  | "Wrong Cast"
  | "Too Short"
  | "Too Long"
  | "Missing Onomatopoeia"
  | "Onomatopoeia"

export interface ScriptLine {
  id: string
  eps: string
  startTime?: string
  endTime?: string
  batchTime?: string
  character: string
  correctCharacter?: string
  lineText: string
  voErrorNote?: string
  status: ScriptLineStatus
  previousStatus?: ScriptLineStatus
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
  episodeRanges?: string[] | string
  initialData?: ScriptData
  onComplete: (data: ScriptData) => void
}

// Preprocessor: Merge multiline quoted cells exported from Google Sheets
export function normalizeMultilinesInQuotes(rawText: string): string[] {
  const lines = rawText.replace(/\r\n/g, "\n").split("\n")
  const merged: string[] = []
  let currentLine = ""
  let insideQuotes = false

  for (const line of lines) {
    const quoteCount = (line.match(/"/g) || []).length

    if (!insideQuotes) {
      currentLine = line
      if (quoteCount % 2 === 1) {
        insideQuotes = true
      } else {
        merged.push(currentLine)
        currentLine = ""
      }
    } else {
      currentLine += " " + line
      if (quoteCount % 2 === 1) {
        insideQuotes = false
        merged.push(currentLine)
        currentLine = ""
      }
    }
  }

  if (currentLine) {
    merged.push(currentLine)
  }

  return merged
}

// Helper to check if a token represents a PS (Pitch Shift / audio modifier) value
export function isPsToken(token: string): boolean {
  if (!token) return false
  const trimmed = token.trim()
  if (!trimmed) return false

  // 1. Keyword match (Treble, Pitch, PS, Bass, Shift, Semitone, Speed, Tempo, Gain)
  if (/\b(?:treble|pitch|ps|bass|shift|semitone|speed|tempo|gain)\b/i.test(trimmed)) {
    return true
  }

  // 2. Numeric value (e.g. "0.97", "1.04", "-2", "+4", "0.9")
  if (!isNaN(Number(trimmed))) {
    return true
  }

  // 3. Signed number (e.g. "+4", "-2", "+3.5")
  if (/^[+-]\d+(?:\.\d+)?$/.test(trimmed)) {
    return true
  }

  // 4. Dual number / combined PS values (e.g. "0.97 1.04", "+4 0.97", "0.97 / +4", "0.97, +4")
  if (/^[+-]?\d+(?:\.\d+)?[\s,/]+[+-]?\d+(?:\.\d+)?$/.test(trimmed)) {
    return true
  }

  return false
}

// Helper to sanitize Voice Actor Name and extract PS value handling empty TSV columns (e.g. Sal\t\t\tRekha)
export function sanitizeVoiceActorAndPsTokens(cols: string[]) {
  const nonEmpty = cols.map((c) => c.replace(/^["']|["']$/g, "").trim()).filter(Boolean)

  if (nonEmpty.length === 0) return null

  let charName = nonEmpty[0]
  let artist = "Unassigned"
  let ps = ""

  const rest = nonEmpty.slice(1)

  if (rest.length === 1) {
    const token = rest[0]
    if (isPsToken(token)) {
      ps = token
    } else {
      artist = token
    }
  } else if (rest.length >= 2) {
    // Find if any token is a PS token
    const psIdx = rest.findIndex((t) => isPsToken(t))
    if (psIdx !== -1) {
      ps = rest[psIdx]
      const artistTokens = rest.filter((_, idx) => idx !== psIdx)
      artist = artistTokens.join(" ")
    } else {
      // Fallback: artist is rest[0]
      artist = rest[0]
      if (rest[1]) {
        ps = rest[1]
      }
    }
  }

  // Strip trailing PS from artist name if any (e.g. "Fred 0.97" or "Fred Treble +4")
  if (artist && artist !== "Unassigned") {
    // 1. Check trailing PS pattern with keyword like "Fred Treble +4" or "Fred PS: 0.97"
    const kwMatch = artist.match(/^(.+?)\s+((?:\b(?:treble|pitch|ps|bass|shift|semitone|speed)\b.*|[+-]?\d+(?:\.\d+)?.*))$/i)
    if (kwMatch && isPsToken(kwMatch[2])) {
      artist = kwMatch[1].trim()
      if (!ps) {
        ps = kwMatch[2].trim()
      }
    } else {
      // 2. Check trailing pure number pattern like "Fred 0.97"
      const match = artist.match(/^(.+?)\s+([0-9]+(?:\.[0-9]+)?)$/)
      if (match) {
        artist = match[1].trim()
        if (!ps) {
          ps = match[2].trim()
        }
      }
    }
  }

  return { charName, artist: artist || "Unassigned", ps }
}

export function ScriptWizardModal({
  isOpen,
  onClose,
  taskTitle,
  episodeRanges,
  initialData,
  onComplete,
}: ScriptWizardModalProps) {
  const episodeRangeText = Array.isArray(episodeRanges)
    ? episodeRanges.join(", ")
    : episodeRanges || ""
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

    const rows = normalizeMultilinesInQuotes(rawText)
    const results: MasterArtistMapping[] = []

    rows.forEach((rowStr) => {
      const cols = rowStr.split("\t").map((c) => c.trim())
      if (cols.length === 0) return

      const firstColLower = cols[0].toLowerCase().replace(/^["']|["']$/g, "").trim()
      if (
        firstColLower.includes("character") ||
        firstColLower.includes("artist font") ||
        firstColLower === "check"
      ) {
        return
      }

      // Handle Image 3 Format (6+ cols with checkboxes): Check | PS | Character | Count | Actor | Appear in
      if (
        cols.length >= 5 &&
        (cols[0] === "TRUE" ||
          cols[0] === "FALSE" ||
          cols[0] === "☑" ||
          cols[0] === "☐" ||
          isPsToken(cols[1]) ||
          cols[1] === "")
      ) {
        const charName = cols[2]
        const actor = cols[4] || "Unassigned"
        const ps = cols[1] || ""

        const cleaned = sanitizeVoiceActorAndPsTokens([charName, actor, ps])
        if (
          cleaned &&
          cleaned.charName &&
          isNaN(Number(cleaned.charName.replace(/"/g, "")))
        ) {
          results.push({
            characterName: cleaned.charName,
            finalArtist: cleaned.artist,
            pitchSpeed: cleaned.ps || undefined,
          })
        }
      } else {
        // Standard / Flexible TSV format (e.g. Sal\t\t\tRekha or Elton\t0.97\t"Andreas 0.97" or Victor\tTreble +4\tFred)
        const cleaned = sanitizeVoiceActorAndPsTokens(cols)
        if (
          cleaned &&
          cleaned.charName &&
          cleaned.charName.toLowerCase() !== "character name" &&
          cleaned.charName.toLowerCase() !== "character" &&
          // Ignore purely numeric or quote-fragment character names like "0.97"
          isNaN(Number(cleaned.charName.replace(/"/g, "")))
        ) {
          results.push({
            characterName: cleaned.charName,
            finalArtist: cleaned.artist,
            pitchSpeed: cleaned.ps || undefined,
          })
        }
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

    const rows = normalizeMultilinesInQuotes(rawText)
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
      let voErrorNote = ""

      // 7-Column Format: Eps | Start Time | End Time | Batch tim | Character | Script file | VO Error Note
      if (cols.length >= 7) {
        eps = cols[0]
        startTime = cols[1]
        endTime = cols[2]
        batchTime = cols[3]
        character = cols[4]
        lineText = cols[5]
        voErrorNote = cols[6]
      } else if (cols.length === 6) {
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
        const cleanLineText = lineText
          .replace(/\\N/gi, " ")
          .replace(/[\r\n]+/g, " ")
          .replace(/\s+/g, " ")
          .trim()

        const cleanVoNote = voErrorNote ? voErrorNote.trim() : undefined
        // Automatically set status to "VO Error" if voErrorNote is present!
        const lineStatus: ScriptLineStatus = cleanVoNote ? "VO Error" : "Beluman"

        results.push({
          id: `line-${index}-${Date.now()}`,
          eps,
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          batchTime: batchTime || undefined,
          character,
          lineText: cleanLineText,
          voErrorNote: cleanVoNote,
          status: lineStatus,
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
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary font-medium text-foreground inline-flex items-center gap-1.5 border border-border/50">
                <span>{taskTitle}</span>
                {episodeRangeText && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{episodeRangeText.startsWith("EP") ? episodeRangeText : `EP ${episodeRangeText}`}</span>
                  </>
                )}
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
                    Select rows in Google Sheets (e.g. <b>Elton 0.97 &quot;Andreas&#92;n0.97&quot;</b>) and press <kbd className="px-1 py-0.5 bg-muted border rounded text-[10px]">Cmd+C</kbd> / <kbd className="px-1 py-0.5 bg-muted border rounded text-[10px]">Ctrl+C</kbd>, then paste below.
                  </p>
                </div>
              </div>

              <textarea
                placeholder={`Paste here...\n\nExamples:\nElton\t0.97\t"Andreas\n0.97"\nSchatz\t0.97\t"Gabriel\n0.97"\nSal\t\t\tRekha`}
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
