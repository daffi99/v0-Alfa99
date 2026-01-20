module.exports = [
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DurationInput",
    ()=>DurationInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
// Format duration for display (no leading zeros on hours)
function formatDurationForDisplay(duration) {
    if (!duration) return "0:00:00";
    const parts = duration.split(":");
    if (parts.length === 3) {
        const h = parseInt(parts[0]?.trim() || "0", 10).toString();
        const m = parts[1]?.trim().padStart(2, "0") || "00";
        const s = parts[2]?.trim().padStart(2, "0") || "00";
        return `${h}:${m}:${s}`;
    }
    if (parts.length === 2) {
        const m = parts[0]?.trim().padStart(2, "0") || "00";
        const s = parts[1]?.trim().padStart(2, "0") || "00";
        return `0:${m}:${s}`;
    }
    return duration;
}
// Parse duration string to hours, minutes, seconds
function parseDuration(duration) {
    if (!duration) return {
        hours: 0,
        minutes: 0,
        seconds: 0
    };
    const parts = duration.split(":").map((p)=>parseInt(p.trim() || "0", 10));
    if (parts.length === 3) {
        return {
            hours: parts[0] || 0,
            minutes: parts[1] || 0,
            seconds: parts[2] || 0
        };
    }
    if (parts.length === 2) {
        return {
            hours: 0,
            minutes: parts[0] || 0,
            seconds: parts[1] || 0
        };
    }
    return {
        hours: 0,
        minutes: 0,
        seconds: 0
    };
}
function DurationInput({ value, onChange, onBlur, className = "", buttonClassName = "" }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localValue, setLocalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(parseDuration(value));
    const [popupPosition, setPopupPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isInitialMount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        setLocalValue(parseDuration(value));
    }, [
        value
    ]);
    const updateValue = (newValue)=>{
        setLocalValue(newValue);
        const formatted = `${newValue.hours}:${String(newValue.minutes).padStart(2, "0")}:${String(newValue.seconds).padStart(2, "0")}`;
        // Use setTimeout to defer onChange call and avoid setState during render
        setTimeout(()=>onChange(formatted), 0);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (popupRef.current && !popupRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsOpen(false);
                const formatted = `${localValue.hours}:${String(localValue.minutes).padStart(2, "0")}:${String(localValue.seconds).padStart(2, "0")}`;
                onBlur(formatted);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return ()=>document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [
        isOpen,
        localValue,
        onBlur
    ]);
    const handleInputChange = (type, inputValue)=>{
        const numValue = parseInt(inputValue.replace(/\D/g, "") || "0", 10);
        const newValue = {
            ...localValue
        };
        if (type === "hours") {
            newValue.hours = Math.min(99, Math.max(0, numValue));
        } else if (type === "minutes") {
            newValue.minutes = Math.min(59, Math.max(0, numValue));
        } else {
            newValue.seconds = Math.min(59, Math.max(0, numValue));
        }
        updateValue(newValue);
    };
    const handleIncrement = (type)=>{
        const newValue = {
            ...localValue
        };
        if (type === "hours") {
            newValue.hours = Math.min(99, newValue.hours + 1);
        } else if (type === "minutes") {
            newValue.minutes = newValue.minutes >= 59 ? 0 : newValue.minutes + 1;
        } else {
            newValue.seconds = newValue.seconds >= 59 ? 0 : newValue.seconds + 1;
        }
        updateValue(newValue);
    };
    const handleDecrement = (type)=>{
        const newValue = {
            ...localValue
        };
        if (type === "hours") {
            newValue.hours = Math.max(0, newValue.hours - 1);
        } else if (type === "minutes") {
            newValue.minutes = newValue.minutes <= 0 ? 59 : newValue.minutes - 1;
        } else {
            newValue.seconds = newValue.seconds <= 0 ? 59 : newValue.seconds - 1;
        }
        updateValue(newValue);
    };
    const displayValue = formatDurationForDisplay(value);
    const updatePopupPosition = ()=>{
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // For fixed positioning, use viewport coordinates (no scroll offset needed)
            setPopupPosition({
                top: rect.bottom + 4,
                left: rect.left
            });
        }
    };
    const handleToggle = (e)=>{
        e.stopPropagation();
        if (!isOpen) {
            updatePopupPosition();
        }
        setIsOpen(!isOpen);
    };
    // Update popup position on scroll and resize when open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        const updatePosition = ()=>{
            updatePopupPosition();
        };
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return ()=>{
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: buttonRef,
                type: "button",
                onClick: handleToggle,
                onMouseDown: (e)=>{
                    e.stopPropagation();
                },
                onDragStart: (e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                },
                className: `w-28 px-3 py-1.5 border border-border rounded-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-background transition-colors text-left ${buttonClassName}`,
                children: displayValue || "0:00:00"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: popupRef,
                className: "fixed z-[9999] bg-white border border-border rounded-lg shadow-xl p-4",
                style: {
                    top: `${popupPosition.top}px`,
                    left: `${popupPosition.left}px`,
                    animation: "fadeInScale 0.15s ease-out"
                },
                onMouseDown: (e)=>{
                    e.stopPropagation();
                },
                onDragStart: (e)=>{
                    e.stopPropagation();
                    e.preventDefault();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIncrement("hours"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M5 15l7-7 7 7"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 211,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: localValue.hours,
                                    onChange: (e)=>handleInputChange("hours", e.target.value),
                                    className: "w-12 text-center text-lg font-semibold py-2 border border-transparent rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent",
                                    style: {
                                        fontSize: "1.125rem"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleDecrement("hours"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M19 9l-7 7-7-7"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                            lineNumber: 233,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                        lineNumber: 232,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Hours"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 236,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 210,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-lg font-semibold",
                            children: ":"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 239,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIncrement("minutes"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M5 15l7-7 7 7"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                            lineNumber: 249,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                        lineNumber: 248,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 243,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: String(localValue.minutes).padStart(2, "0"),
                                    onChange: (e)=>handleInputChange("minutes", e.target.value),
                                    className: "w-12 text-center text-lg font-semibold py-2 border border-transparent rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent",
                                    style: {
                                        fontSize: "1.125rem"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleDecrement("minutes"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M19 9l-7 7-7-7"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                            lineNumber: 265,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                        lineNumber: 264,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 259,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Minutes"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 268,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 242,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-lg font-semibold",
                            children: ":"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIncrement("seconds"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M5 15l7-7 7 7"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                            lineNumber: 281,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                        lineNumber: 280,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 275,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: String(localValue.seconds).padStart(2, "0"),
                                    onChange: (e)=>handleInputChange("seconds", e.target.value),
                                    className: "w-12 text-center text-lg font-semibold py-2 border border-transparent rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-transparent",
                                    style: {
                                        fontSize: "1.125rem"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleDecrement("seconds"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M19 9l-7 7-7-7"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                            lineNumber: 297,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                        lineNumber: 296,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Seconds"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                                    lineNumber: 300,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 274,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                    lineNumber: 208,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                lineNumber: 192,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BillingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$duration$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-ssr] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
"use client";
;
;
;
;
;
function parseDurationToSeconds(time) {
    if (!time) return 0;
    const parts = time.split(":").map((p)=>Number(p.trim()));
    if (parts.length === 3) {
        const [h, m, s] = parts;
        if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) return 0;
        return h * 3600 + m * 60 + s;
    }
    if (parts.length === 2) {
        const [m, s] = parts;
        if (Number.isNaN(m) || Number.isNaN(s)) return 0;
        return m * 60 + s;
    }
    return 0;
}
function getRate(category, title) {
    // Default rates
    const defaultCaptionRate = 1_400_000;
    const defaultNonCaptionRate = 1_000_000;
    // Special rates only apply to titles starting with "Bahasa"
    const isBahasa = title && title.trim().toLowerCase().startsWith("bahasa");
    if (isBahasa) {
        // If title starts with "Bahasa": Caption = 1.300.000, non-Caption = 750.000
        return category === "Caption" ? 1_300_000 : 750_000;
    }
    // For non-Bahasa tasks, use default rates
    return category === "Caption" ? defaultCaptionRate : defaultNonCaptionRate;
}
function calculateAmount(duration, category, title) {
    const seconds = parseDurationToSeconds(duration);
    const hours = seconds / 3600;
    const rate = getRate(category, title);
    return Math.round(hours * rate);
}
function formatRupiah(amount) {
    return "Rp" + amount.toLocaleString("id-ID");
}
// Generate month + year options for dropdown
function getMonthYearOptions() {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const currentYear = new Date().getFullYear();
    const years = [
        currentYear - 1,
        currentYear,
        currentYear + 1
    ];
    const options = [];
    years.forEach((year)=>{
        months.forEach((month)=>{
            options.push(`${month} ${year}`);
        });
    });
    return options;
}
// Normalize billing month format (convert old "December" to "December YYYY")
function normalizeBillingMonth(month) {
    const currentYear = new Date().getFullYear();
    if (!month) return `December ${currentYear}`;
    // If it already has a year, return as is
    if (/\d{4}/.test(month)) {
        return month;
    }
    // If it's just a month name, add current year
    return `${month} ${currentYear}`;
}
function BillingPage() {
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [grouped, setGrouped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [checked, setChecked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingDuration, setEditingDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingBillingMonth, setEditingBillingMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [expandedMonths, setExpandedMonths] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // Filters
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedYear, setSelectedYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    // Get current month/year string
    const getCurrentMonthYear = ()=>{
        const now = new Date();
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        const currentYear = new Date().getFullYear();
        return `${monthNames[now.getMonth()]} ${currentYear}`;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const load = async ()=>{
            try {
                const res = await fetch("/api/tasks");
                if (!res.ok) {
                    setIsLoading(false);
                    return;
                }
                const raw = await res.json();
                const mapped = raw.filter((t)=>t.title?.toLowerCase() !== "today task").map((task)=>({
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        episodeRanges: task.episode_ranges ? task.episode_ranges.split(",") : [],
                        category: task.category,
                        status: task.status,
                        stage: task.stage || "Backlog",
                        notes: task.notes || "",
                        created_at: task.created_at || task.createdAt || null,
                        duration: task.duration || "00:10:00",
                        billingMonth: task.billing_month || `December ${new Date().getFullYear()}`,
                        episodes: [],
                        subtasks: [],
                        attachments: []
                    }));
                setTasks(mapped);
                // Initialize editing durations and billing months with current values
                const initialEditingDuration = {};
                const initialEditingBillingMonth = {};
                mapped.forEach((task)=>{
                    initialEditingDuration[task.id] = task.duration || "00:10:00";
                    initialEditingBillingMonth[task.id] = normalizeBillingMonth(task.billingMonth);
                });
                setEditingDuration(initialEditingDuration);
                setEditingBillingMonth(initialEditingBillingMonth);
                const byMonth = {};
                mapped.forEach((task)=>{
                    const month = normalizeBillingMonth(task.billingMonth);
                    const amount = calculateAmount(task.duration, task.category, task.title);
                    if (!byMonth[month]) byMonth[month] = [];
                    byMonth[month].push({
                        task,
                        amount
                    });
                });
                setGrouped(byMonth);
                // Initialize expanded months: current month expanded, others collapsed
                const currentMonthYear = getCurrentMonthYear();
                const initialExpanded = {};
                Object.keys(byMonth).forEach((month)=>{
                    initialExpanded[month] = month === currentMonthYear;
                });
                setExpandedMonths(initialExpanded);
            } finally{
                setIsLoading(false);
            }
        };
        void load();
    }, []);
    const toggleMonth = (month)=>{
        setExpandedMonths((prev)=>({
                ...prev,
                [month]: !prev[month]
            }));
    };
    // Recalculate grouped data when tasks or editing states change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (tasks.length === 0) return;
        const updated = {};
        tasks.forEach((task)=>{
            const month = normalizeBillingMonth(editingBillingMonth[task.id] ?? task.billingMonth);
            const duration = editingDuration[task.id] ?? task.duration ?? "00:10:00";
            const amount = calculateAmount(duration, task.category, task.title);
            // Apply Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = task.title.toLowerCase().includes(query);
                const matchesRanges = task.episodeRanges.some((r)=>r.includes(query));
                if (!matchesTitle && !matchesRanges) return;
            }
            if (!updated[month]) updated[month] = [];
            updated[month].push({
                task,
                amount
            });
        });
        setGrouped(updated);
    }, [
        tasks,
        editingBillingMonth,
        editingDuration,
        searchQuery
    ]);
    const handleDurationChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (taskId, newDuration)=>{
        // Don't update if duration hasn't changed
        const currentTask = tasks.find((t)=>t.id === taskId);
        if (currentTask && currentTask.duration === newDuration) {
            return;
        }
        // Update local state immediately
        setEditingDuration((prev)=>({
                ...prev,
                [taskId]: newDuration
            }));
        // Update task in database
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    duration: newDuration
                })
            });
            if (!response.ok) {
                throw new Error("Failed to update duration");
            }
            // Update local tasks state (grouped data will recalculate via useEffect)
            setTasks((prevTasks)=>prevTasks.map((task)=>task.id === taskId ? {
                        ...task,
                        duration: newDuration
                    } : task));
        } catch (error) {
            console.error("Failed to update duration:", error);
            // Revert on error
            setTasks((prevTasks)=>{
                const task = prevTasks.find((t)=>t.id === taskId);
                setEditingDuration((prev)=>({
                        ...prev,
                        [taskId]: task?.duration || "00:10:00"
                    }));
                return prevTasks;
            });
            alert("Failed to save duration. Please try again.");
        }
    }, [
        tasks
    ]);
    const handleBillingMonthChange = async (taskId, newBillingMonth)=>{
        // Update local state immediately
        setEditingBillingMonth((prev)=>({
                ...prev,
                [taskId]: newBillingMonth
            }));
        // Update task in database
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    billingMonth: newBillingMonth
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to update billing month: ${response.statusText}`);
            }
            const updatedTask = await response.json();
            // Update local tasks state (grouped data will recalculate via useEffect)
            setTasks((prevTasks)=>prevTasks.map((task)=>task.id === taskId ? {
                        ...task,
                        billingMonth: updatedTask.billing_month || newBillingMonth
                    } : task));
        } catch (error) {
            console.error("Failed to update billing month:", error);
            // Revert on error
            setTasks((prevTasks)=>{
                const task = prevTasks.find((t)=>t.id === taskId);
                setEditingBillingMonth((prev)=>({
                        ...prev,
                        [taskId]: normalizeBillingMonth(task?.billingMonth)
                    }));
                return prevTasks;
            });
            const errorMessage = error instanceof Error ? error.message : "Failed to save billing month. Please try again.";
            alert(errorMessage);
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8",
            children: "Loading billing data..."
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
            lineNumber: 314,
            columnNumber: 12
        }, this);
    }
    // Filter and Sort keys
    const months = Object.keys(grouped).filter((month)=>{
        const parts = month.split(" ");
        if (parts.length !== 2) return false;
        const mName = parts[0];
        const yNum = parseInt(parts[1]) || 0;
        if (yNum !== selectedYear) return false;
        if (selectedMonth !== "All" && mName !== selectedMonth) return false;
        return true;
    }).sort((a, b)=>{
        // Parse "Month Year" format
        const parseMonthYear = (str)=>{
            const parts = str.split(" ");
            if (parts.length !== 2) return {
                month: 0,
                year: 0
            };
            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            const month = monthNames.indexOf(parts[0]);
            const year = parseInt(parts[1]) || 0;
            return {
                month,
                year
            };
        };
        const aParsed = parseMonthYear(a);
        const bParsed = parseMonthYear(b);
        // Sort by year descending, then by month descending
        if (bParsed.year !== aParsed.year) {
            return bParsed.year - aParsed.year;
        }
        return bParsed.month - aParsed.month;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-semibold",
                                children: "Billing Summary"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M4 6h16M4 12h16M4 18h16"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                            lineNumber: 365,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 364,
                                        columnNumber: 13
                                    }, this),
                                    "Kanban Board"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                lineNumber: 360,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                        lineNumber: 358,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg border border-border shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 374,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search tasks...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-full pl-9 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                lineNumber: 373,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 w-full sm:w-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedMonth,
                                        onChange: (e)=>setSelectedMonth(e.target.value),
                                        className: "flex-1 sm:w-[140px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "All",
                                                children: "All Months"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                lineNumber: 390,
                                                columnNumber: 15
                                            }, this),
                                            [
                                                "January",
                                                "February",
                                                "March",
                                                "April",
                                                "May",
                                                "June",
                                                "July",
                                                "August",
                                                "September",
                                                "October",
                                                "November",
                                                "December"
                                            ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: m,
                                                    children: m
                                                }, m, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 395,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedYear,
                                        onChange: (e)=>setSelectedYear(Number(e.target.value)),
                                        className: "flex-1 sm:w-[100px] px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        children: [
                                            new Date().getFullYear() - 1,
                                            new Date().getFullYear(),
                                            new Date().getFullYear() + 1
                                        ].map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: y,
                                                children: y
                                            }, y, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                lineNumber: 409,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 399,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                        lineNumber: 372,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            months.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: "No tasks found."
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                lineNumber: 416,
                columnNumber: 31
            }, this),
            months.map((month)=>{
                const rows = grouped[month] || [];
                const total = rows.reduce((sum, r)=>{
                    const currentDuration = editingDuration[r.task.id] ?? r.task.duration ?? "00:10:00";
                    return sum + calculateAmount(currentDuration, r.task.category, r.task.title);
                }, 0);
                const currentMonthYear = getCurrentMonthYear();
                const isCurrentMonth = month === currentMonthYear;
                const isExpanded = expandedMonths[month] ?? isCurrentMonth;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "bg-white rounded-xl shadow-sm border border-border p-4 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        !isCurrentMonth && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>toggleMonth(month),
                                            className: "p-1 hover:bg-muted rounded transition-colors",
                                            "aria-label": isExpanded ? "Collapse" : "Expand",
                                            children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                className: "w-5 h-5 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                lineNumber: 440,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "w-5 h-5 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                lineNumber: 442,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                            lineNumber: 434,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-semibold",
                                            children: month
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                            lineNumber: 446,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                    lineNumber: 432,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium text-emerald-700",
                                    children: [
                                        "Total: ",
                                        formatRupiah(total)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                    lineNumber: 448,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                            lineNumber: 431,
                            columnNumber: 13
                        }, this),
                        isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "min-w-full text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b border-border text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Done"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Series"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Billing Month"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Duration"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 461,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Category"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Rate"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 463,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "py-2 pr-4",
                                                    children: "Amount"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                    lineNumber: 464,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                            lineNumber: 457,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 456,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: rows.map(({ task, amount })=>{
                                            const currentDuration = editingDuration[task.id] ?? task.duration ?? "00:10:00";
                                            const currentBillingMonth = normalizeBillingMonth(editingBillingMonth[task.id] ?? task.billingMonth);
                                            const displayAmount = calculateAmount(currentDuration, task.category, task.title);
                                            const monthYearOptions = getMonthYearOptions();
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b border-border last:border-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: !!checked[task.id],
                                                            onChange: (e)=>setChecked((prev)=>({
                                                                        ...prev,
                                                                        [task.id]: e.target.checked
                                                                    }))
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                            lineNumber: 479,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-medium",
                                                                children: task.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                                lineNumber: 491,
                                                                columnNumber: 29
                                                            }, this),
                                                            task.episodeRanges.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-muted-foreground",
                                                                children: task.episodeRanges.join(", ")
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                                lineNumber: 493,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: currentBillingMonth.split(" ")[0],
                                                                    onChange: (e)=>{
                                                                        const newMonth = e.target.value;
                                                                        const currentYear = currentBillingMonth.split(" ")[1] || new Date().getFullYear();
                                                                        const newBillingMonth = `${newMonth} ${currentYear}`;
                                                                        setEditingBillingMonth((prev)=>({
                                                                                ...prev,
                                                                                [task.id]: newBillingMonth
                                                                            }));
                                                                        handleBillingMonthChange(task.id, newBillingMonth);
                                                                    },
                                                                    className: "w-24 px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm",
                                                                    children: [
                                                                        "January",
                                                                        "February",
                                                                        "March",
                                                                        "April",
                                                                        "May",
                                                                        "June",
                                                                        "July",
                                                                        "August",
                                                                        "September",
                                                                        "October",
                                                                        "November",
                                                                        "December"
                                                                    ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: m,
                                                                            children: m
                                                                        }, m, false, {
                                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                                            lineNumber: 513,
                                                                            columnNumber: 35
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                                    lineNumber: 498,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: currentBillingMonth.split(" ")[1] || new Date().getFullYear(),
                                                                    onChange: (e)=>{
                                                                        const newYear = e.target.value;
                                                                        const currentMonth = currentBillingMonth.split(" ")[0] || "December";
                                                                        const newBillingMonth = `${currentMonth} ${newYear}`;
                                                                        setEditingBillingMonth((prev)=>({
                                                                                ...prev,
                                                                                [task.id]: newBillingMonth
                                                                            }));
                                                                        handleBillingMonthChange(task.id, newBillingMonth);
                                                                    },
                                                                    className: "w-20 px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm",
                                                                    children: [
                                                                        new Date().getFullYear() - 1,
                                                                        new Date().getFullYear(),
                                                                        new Date().getFullYear() + 1
                                                                    ].map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: y,
                                                                            children: y
                                                                        }, y, false, {
                                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                                            lineNumber: 532,
                                                                            columnNumber: 35
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                                    lineNumber: 516,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                            lineNumber: 497,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$duration$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DurationInput"], {
                                                            value: currentDuration,
                                                            onChange: (value)=>{
                                                                setEditingDuration((prev)=>({
                                                                        ...prev,
                                                                        [task.id]: value
                                                                    }));
                                                            },
                                                            onBlur: (value)=>{
                                                                const newDuration = value || "00:10:00";
                                                                // Always save on blur to ensure changes are persisted
                                                                handleDurationChange(task.id, newDuration);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4",
                                                        children: task.category || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 550,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4 text-muted-foreground",
                                                        children: [
                                                            formatRupiah(getRate(task.category, task.title)),
                                                            "/hour"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 551,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "py-2 pr-4 font-medium",
                                                        children: formatRupiah(displayAmount)
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                        lineNumber: 554,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, task.id, true, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                                lineNumber: 477,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                        lineNumber: 467,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                                lineNumber: 455,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                            lineNumber: 454,
                            columnNumber: 15
                        }, this)
                    ]
                }, month, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
                    lineNumber: 430,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/billing/page.tsx",
        lineNumber: 356,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=OneDrive_Desktop_v0-Alfa99-master_b74639f5._.js.map