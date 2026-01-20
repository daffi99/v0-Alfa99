"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface BillingMonthPickerProps {
    value: string // Format: "Month Year" e.g. "December 2025"
    onChange: (value: string) => void
    className?: string
    buttonClassName?: string
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export function BillingMonthPicker({
    value,
    onChange,
    className = "",
    buttonClassName = "",
}: BillingMonthPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
    const popupRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Parse initial value
    const parseValue = (val: string) => {
        const parts = val.split(" ")
        const monthStr = parts[0]
        const yearStr = parts[1] || new Date().getFullYear().toString()

        let monthIndex = MONTHS.indexOf(monthStr)
        if (monthIndex === -1) monthIndex = new Date().getMonth() // Default to current month if invalid

        const year = parseInt(yearStr) || new Date().getFullYear()

        return { monthIndex, year }
    }

    const [localValue, setLocalValue] = useState(parseValue(value))

    useEffect(() => {
        setLocalValue(parseValue(value))
    }, [value])

    const updateValue = (newMonthIndex: number, newYear: number) => {
        const newVal = { monthIndex: newMonthIndex, year: newYear }
        setLocalValue(newVal)

        // Defer onChange to next tick to avoid render loops if parent updates state immediately
        setTimeout(() => {
            onChange(`${MONTHS[newMonthIndex]} ${newYear}`)
        }, 0)
    }

    const handleIncrementMonth = () => {
        let nextIndex = localValue.monthIndex + 1
        if (nextIndex > 11) nextIndex = 0
        updateValue(nextIndex, localValue.year)
    }

    const handleDecrementMonth = () => {
        let prevIndex = localValue.monthIndex - 1
        if (prevIndex < 0) prevIndex = 11
        updateValue(prevIndex, localValue.year)
    }

    const handleIncrementYear = () => {
        updateValue(localValue.monthIndex, localValue.year + 1)
    }

    const handleDecrementYear = () => {
        updateValue(localValue.monthIndex, localValue.year - 1)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const updatePopupPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPopupPosition({
                top: rect.bottom + 4,
                left: rect.left,
            })
        }
    }

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isOpen) {
            updatePopupPosition()
        }
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (!isOpen) return
        const updatePosition = () => updatePopupPosition()
        window.addEventListener("scroll", updatePosition, true)
        window.addEventListener("resize", updatePosition)
        return () => {
            window.removeEventListener("scroll", updatePosition, true)
            window.removeEventListener("resize", updatePosition)
        }
    }, [isOpen])

    return (
        <div className={`relative ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`w-full px-3 py-2 border border-border rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background transition-colors text-left flex items-center justify-between ${buttonClassName}`}
            >
                <span>{MONTHS[localValue.monthIndex]} {localValue.year}</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
            </button>

            {isOpen && (
                <div
                    ref={popupRef}
                    className="fixed z-[9999] bg-white border border-border rounded-lg shadow-xl p-4 flex gap-4"
                    style={{
                        top: `${popupPosition.top}px`,
                        left: `${popupPosition.left}px`,
                        animation: "fadeInScale 0.15s ease-out",
                    }}
                >
                    {/* Month Column */}
                    <div className="flex flex-col items-center w-32">
                        <button
                            type="button"
                            onClick={handleIncrementMonth}
                            className="p-1 hover:bg-muted rounded transition-colors"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <div className="text-base font-semibold py-2 text-center w-full">
                            {MONTHS[localValue.monthIndex]}
                        </div>
                        <button
                            type="button"
                            onClick={handleDecrementMonth}
                            className="p-1 hover:bg-muted rounded transition-colors"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="text-xs text-muted-foreground mt-1">Month</div>
                    </div>

                    <div className="w-px bg-border my-2"></div>

                    {/* Year Column */}
                    <div className="flex flex-col items-center w-20">
                        <button
                            type="button"
                            onClick={handleIncrementYear}
                            className="p-1 hover:bg-muted rounded transition-colors"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <div className="text-base font-semibold py-2">
                            {localValue.year}
                        </div>
                        <button
                            type="button"
                            onClick={handleDecrementYear}
                            className="p-1 hover:bg-muted rounded transition-colors"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="text-xs text-muted-foreground mt-1">Year</div>
                    </div>
                </div>
            )}
        </div>
    )
}
