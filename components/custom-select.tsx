"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: string[]
    placeholder?: string
    className?: string
    buttonClassName?: string
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    className = "",
    buttonClassName = "",
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0, width: 0 })
    const popupRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

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
                width: rect.width,
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

    const handleSelect = (option: string) => {
        onChange(option)
        setIsOpen(false)
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
                <span className={!value ? "text-muted-foreground" : ""}>{value || placeholder}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
            </button>

            {isOpen && (
                <div
                    ref={popupRef}
                    className="fixed z-[9999] bg-white border border-border rounded-lg shadow-xl py-1 max-h-60 overflow-auto"
                    style={{
                        top: `${popupPosition.top}px`,
                        left: `${popupPosition.left}px`,
                        width: `${popupPosition.width}px`,
                        animation: "fadeInScale 0.15s ease-out",
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full px-3 py-2 text-left hover:bg-muted transition-colors ${value === option ? "bg-muted font-medium" : ""
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
