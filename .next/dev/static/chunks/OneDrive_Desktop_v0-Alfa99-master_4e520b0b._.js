(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockNoteNote",
    ()=>BlockNoteNote,
    "BlockNoteViewer",
    ()=>BlockNoteViewer,
    "renderBlockNoteContent",
    ()=>renderBlockNoteContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/@blocknote/react/dist/blocknote-react.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$mantine$2f$dist$2f$blocknote$2d$mantine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/@blocknote/mantine/dist/blocknote-mantine.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
// Helper function to convert old formats to BlockNote format
function convertToBlockNoteContent(data) {
    if (!data || !data.trim()) return undefined;
    try {
        const parsed = JSON.parse(data);
        // Check if it's already BlockNote format (array of blocks with type)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
            return parsed;
        }
        // Convert TipTap format to BlockNote
        if (parsed.type === "doc" && parsed.content) {
            const blocks = [];
            for (const node of parsed.content){
                if (node.type === "paragraph") {
                    const textContent = node.content?.map((c)=>{
                        if (c.type === "text") {
                            // Handle marks (bold, italic, etc.)
                            let styles = {};
                            if (c.marks) {
                                for (const mark of c.marks){
                                    if (mark.type === "bold") styles.bold = true;
                                    if (mark.type === "italic") styles.italic = true;
                                    if (mark.type === "strike") styles.strike = true;
                                    if (mark.type === "code") styles.code = true;
                                    if (mark.type === "highlight") {
                                        styles.backgroundColor = mark.attrs?.color || "yellow";
                                    }
                                }
                            }
                            return {
                                type: "text",
                                text: c.text,
                                styles
                            };
                        }
                        return null;
                    }).filter(Boolean) || [];
                    blocks.push({
                        type: "paragraph",
                        content: textContent.length > 0 ? textContent : undefined
                    });
                } else if (node.type === "heading") {
                    const level = node.attrs?.level || 1;
                    const textContent = node.content?.map((c)=>c.text).join("") || "";
                    blocks.push({
                        type: "heading",
                        props: {
                            level: Math.min(level, 3)
                        },
                        content: [
                            {
                                type: "text",
                                text: textContent,
                                styles: {}
                            }
                        ]
                    });
                } else if (node.type === "bulletList") {
                    for (const item of node.content || []){
                        const textContent = item.content?.[0]?.content?.map((c)=>c.text).join("") || "";
                        blocks.push({
                            type: "bulletListItem",
                            content: [
                                {
                                    type: "text",
                                    text: textContent,
                                    styles: {}
                                }
                            ]
                        });
                    }
                } else if (node.type === "orderedList") {
                    for (const item of node.content || []){
                        const textContent = item.content?.[0]?.content?.map((c)=>c.text).join("") || "";
                        blocks.push({
                            type: "numberedListItem",
                            content: [
                                {
                                    type: "text",
                                    text: textContent,
                                    styles: {}
                                }
                            ]
                        });
                    }
                } else if (node.type === "taskList") {
                    for (const item of node.content || []){
                        const textContent = item.content?.[0]?.content?.map((c)=>c.text).join("") || "";
                        const checked = item.attrs?.checked || false;
                        blocks.push({
                            type: "checkListItem",
                            props: {
                                checked
                            },
                            content: [
                                {
                                    type: "text",
                                    text: textContent,
                                    styles: {}
                                }
                            ]
                        });
                    }
                } else if (node.type === "blockquote") {
                    const textContent = node.content?.[0]?.content?.map((c)=>c.text).join("") || "";
                    blocks.push({
                        type: "paragraph",
                        props: {
                            textColor: "gray"
                        },
                        content: [
                            {
                                type: "text",
                                text: `"${textContent}"`,
                                styles: {
                                    italic: true
                                }
                            }
                        ]
                    });
                } else if (node.type === "codeBlock") {
                    const textContent = node.content?.map((c)=>c.text).join("") || "";
                    blocks.push({
                        type: "codeBlock",
                        props: {
                            language: node.attrs?.language || ""
                        },
                        content: textContent
                    });
                }
            }
            return blocks.length > 0 ? blocks : undefined;
        }
        // Convert Editor.js format
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
            const blocks = [];
            for (const block of parsed.blocks){
                if (block.type === "paragraph") {
                    blocks.push({
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: block.data?.text || "",
                                styles: {}
                            }
                        ]
                    });
                } else if (block.type === "header") {
                    blocks.push({
                        type: "heading",
                        props: {
                            level: Math.min(block.data?.level || 1, 3)
                        },
                        content: [
                            {
                                type: "text",
                                text: block.data?.text || "",
                                styles: {}
                            }
                        ]
                    });
                } else if (block.type === "list") {
                    const items = block.data?.items || [];
                    const isOrdered = block.data?.style === "ordered";
                    for (const item of items){
                        blocks.push({
                            type: isOrdered ? "numberedListItem" : "bulletListItem",
                            content: [
                                {
                                    type: "text",
                                    text: item,
                                    styles: {}
                                }
                            ]
                        });
                    }
                }
            }
            return blocks.length > 0 ? blocks : undefined;
        }
    } catch  {
        // Not JSON, treat as plain text
        if (data.trim()) {
            return [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: data.trim(),
                            styles: {}
                        }
                    ]
                }
            ];
        }
    }
    return undefined;
}
function BlockNoteViewer({ content }) {
    _s();
    const initialContent = convertToBlockNoteContent(content);
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateBlockNote"])({
        initialContent: initialContent || [
            {
                type: "paragraph",
                content: ""
            }
        ]
    });
    if (!content || !content.trim()) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "blocknote-viewer-wrapper",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$mantine$2f$dist$2f$blocknote$2d$mantine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockNoteView"], {
            editor: editor,
            theme: "light",
            editable: false
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
            lineNumber: 171,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
        lineNumber: 170,
        columnNumber: 9
    }, this);
}
_s(BlockNoteViewer, "MXDVPmaldlkyMCRUFMD7+0H5xj8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateBlockNote"]
    ];
});
_c = BlockNoteViewer;
function renderBlockNoteContent(content) {
    if (!content) return "";
    try {
        const parsed = JSON.parse(content);
        // BlockNote format (array of blocks)
        if (Array.isArray(parsed)) {
            return parsed.map((block)=>{
                if (block.content) {
                    if (Array.isArray(block.content)) {
                        return block.content.map((c)=>c.text || "").join("");
                    }
                    return block.content;
                }
                return "";
            }).join("\n");
        }
        // TipTap format
        if (parsed.type === "doc" && parsed.content) {
            return parsed.content.map((node)=>{
                if (node.content) {
                    return node.content.map((c)=>c.text || "").join("");
                }
                return "";
            }).join("\n");
        }
        // Editor.js format
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
            return parsed.blocks.map((block)=>block.data?.text || "").join("\n");
        }
    } catch  {
        return content;
    }
    return content;
}
function BlockNoteNote({ initialData, onSave, onCancel, placeholder = "Add a note...", isEditing, onEditChange }) {
    _s1();
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveError, setSaveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initialContent = convertToBlockNoteContent(initialData);
    const editor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateBlockNote"])({
        initialContent: initialContent || [
            {
                type: "paragraph",
                content: placeholder
            }
        ]
    });
    // Manual save function
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BlockNoteNote.useCallback[handleSave]": async ()=>{
            if (!editor) return;
            setIsSaving(true);
            setSaveError(null);
            try {
                const blocks = editor.document;
                // Check if content is empty
                const isEmpty = blocks.length === 0 || blocks.length === 1 && blocks[0].type === "paragraph" && (!blocks[0].content || Array.isArray(blocks[0].content) && blocks[0].content.length === 0 || Array.isArray(blocks[0].content) && blocks[0].content.every({
                    "BlockNoteNote.useCallback[handleSave]": (c)=>!c.text || c.text.trim() === ""
                }["BlockNoteNote.useCallback[handleSave]"]));
                const content = isEmpty ? "" : JSON.stringify(blocks);
                await onSave(content);
                onEditChange(false);
            } catch (error) {
                console.error("Failed to save note:", error);
                setSaveError(error.message || "Failed to save");
            } finally{
                setIsSaving(false);
            }
        }
    }["BlockNoteNote.useCallback[handleSave]"], [
        editor,
        onSave,
        onEditChange
    ]);
    // Handle click outside to save
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlockNoteNote.useEffect": ()=>{
            const handleClickOutside = {
                "BlockNoteNote.useEffect.handleClickOutside": (event)=>{
                    if (containerRef.current && !containerRef.current.contains(event.target)) {
                        handleSave();
                    }
                }
            }["BlockNoteNote.useEffect.handleClickOutside"];
            if (isEditing) {
                // Small delay to prevent immediate trigger
                const timer = setTimeout({
                    "BlockNoteNote.useEffect.timer": ()=>{
                        document.addEventListener("mousedown", handleClickOutside);
                    }
                }["BlockNoteNote.useEffect.timer"], 100);
                return ({
                    "BlockNoteNote.useEffect": ()=>{
                        clearTimeout(timer);
                        document.removeEventListener("mousedown", handleClickOutside);
                    }
                })["BlockNoteNote.useEffect"];
            }
        }
    }["BlockNoteNote.useEffect"], [
        isEditing,
        handleSave
    ]);
    // Handle keyboard shortcuts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BlockNoteNote.useEffect": ()=>{
            const handleKeyDown = {
                "BlockNoteNote.useEffect.handleKeyDown": (e)=>{
                    if (!isEditing) return;
                    // Don't interfere with Tab - let BlockNote handle it natively
                    // This matches the sidebar popup behavior
                    if (e.key === "Tab") return;
                    // Ctrl/Cmd + S to save
                    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                        e.preventDefault();
                        handleSave();
                    }
                    // Escape to cancel
                    if (e.key === "Escape") {
                        onCancel();
                    }
                }
            }["BlockNoteNote.useEffect.handleKeyDown"];
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "BlockNoteNote.useEffect": ()=>document.removeEventListener("keydown", handleKeyDown)
            })["BlockNoteNote.useEffect"];
        }
    }["BlockNoteNote.useEffect"], [
        isEditing,
        handleSave,
        onCancel
    ]);
    if (!isEditing) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "blocknote-note-wrapper",
        onDragStart: (e)=>{
            e.preventDefault();
            e.stopPropagation();
        },
        draggable: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "blocknote-note-editor",
                onMouseDown: (e)=>{
                    // Only stop propagation for non-editor clicks to prevent card drag
                    // Let BlockNote handle clicks internally
                    e.stopPropagation();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$mantine$2f$dist$2f$blocknote$2d$mantine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockNoteView"], {
                    editor: editor,
                    theme: "light"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                    lineNumber: 336,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                lineNumber: 327,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mt-2 pt-2 border-t border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: saveError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[10px] text-red-500",
                            children: saveError
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                            lineNumber: 346,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                        lineNumber: 344,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCancel,
                                className: "text-[10px] px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-1",
                                disabled: isSaving,
                                tabIndex: -1,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                                        lineNumber: 356,
                                        columnNumber: 25
                                    }, this),
                                    "Cancel"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                                lineNumber: 350,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                disabled: isSaving,
                                className: "text-[10px] px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors flex items-center gap-1 disabled:opacity-50",
                                tabIndex: -1,
                                children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                                            lineNumber: 367,
                                            columnNumber: 33
                                        }, this),
                                        "Saving..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                                            lineNumber: 372,
                                            columnNumber: 33
                                        }, this),
                                        "Save"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                                lineNumber: 359,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                        lineNumber: 349,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
                lineNumber: 343,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx",
        lineNumber: 317,
        columnNumber: 9
    }, this);
}
_s1(BlockNoteNote, "hFYpNfZmWHRudXfsbr1LfZ2rka0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$blocknote$2f$react$2f$dist$2f$blocknote$2d$react$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateBlockNote"]
    ];
});
_c1 = BlockNoteNote;
var _c, _c1;
__turbopack_context__.k.register(_c, "BlockNoteViewer");
__turbopack_context__.k.register(_c1, "BlockNoteNote");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaskCard",
    ()=>TaskCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$blocknote$2d$note$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx [app-client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Dynamic imports with SSR disabled to avoid "window is not defined" error
const BlockNoteNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.BlockNoteNote), {
    loadableGenerated: {
        modules: [
            "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = BlockNoteNote;
const BlockNoteViewer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.BlockNoteViewer), {
    loadableGenerated: {
        modules: [
            "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-note.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = BlockNoteViewer;
function TaskCard({ task, columnId, onToggleEpisode, onToggleSubtask, onEditTask, onUpdateNote, onUpdateStatus }) {
    _s();
    const completedEpisodes = task.episodes.filter((ep)=>ep.completed).length;
    const percentComplete = Math.round(completedEpisodes / task.episodes.length * 100) || 0;
    const [localNotes, setLocalNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task.notes || "");
    const [isNoteExpanded, setIsNoteExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditingNote, setIsEditingNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localProgress, setLocalProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(task.progress || {});
    const noteTextareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const hasNotes = (()=>{
        // Prefer localNotes as it's updated immediately on save
        const notes = localNotes || task.notes;
        if (!notes || !notes.trim()) return false;
        // Check for empty TipTap doc
        if (notes === '{"type":"doc","content":[{"type":"paragraph"}]}') return false;
        if (notes === '{"type":"doc","content":[]}') return false;
        // Check for empty BlockNote format
        if (notes === '[]') return false;
        if (notes === '[{"type":"paragraph","content":""}]') return false;
        try {
            const parsed = JSON.parse(notes);
            // Check for BlockNote format (array of blocks)
            if (Array.isArray(parsed)) {
                if (parsed.length === 0) return false;
                // Check if all blocks are empty paragraphs
                const hasContent = parsed.some((block)=>{
                    if (block.type === "paragraph") {
                        if (!block.content) return false;
                        if (Array.isArray(block.content)) {
                            return block.content.some((c)=>c.text && c.text.trim().length > 0);
                        }
                        return typeof block.content === "string" && block.content.trim().length > 0;
                    }
                    return true // non-paragraph blocks count as content
                    ;
                });
                return hasContent;
            }
            // Check for TipTap format (type: "doc")
            if (parsed.type === "doc") {
                // Empty doc check
                if (!parsed.content || parsed.content.length === 0) return false;
                // Single empty paragraph check
                if (parsed.content.length === 1 && parsed.content[0].type === "paragraph" && (!parsed.content[0].content || parsed.content[0].content.length === 0)) {
                    return false;
                }
                return true;
            }
            // Check for Editor.js format (blocks array)
            if (parsed.blocks && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
                return true;
            }
            return false;
        } catch  {
            // Not JSON, treat as plain text
            return notes.trim().length > 0;
        }
    })();
    const isFinished = task.status === "Finished";
    const isTodayTask = task.title.trim().toLowerCase() === "today task";
    const shouldCollapse = isFinished && !isExpanded;
    // Update local progress when task changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskCard.useEffect": ()=>{
            setLocalProgress(task.progress || {});
        }
    }["TaskCard.useEffect"], [
        task.progress
    ]);
    // Update local notes when task changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskCard.useEffect": ()=>{
            setLocalNotes(task.notes || "");
            setIsEditingNote(false);
        }
    }["TaskCard.useEffect"], [
        task.notes
    ]);
    // Auto-resize textarea based on content
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskCard.useEffect": ()=>{
            if (noteTextareaRef.current && isEditingNote) {
                noteTextareaRef.current.style.height = "auto";
                noteTextareaRef.current.style.height = `${noteTextareaRef.current.scrollHeight}px`;
            }
        }
    }["TaskCard.useEffect"], [
        localNotes,
        isEditingNote
    ]);
    const handleNoteSubmit = async (content)=>{
        try {
            if (content !== (task.notes || "")) {
                await onUpdateNote(columnId, task.id, content);
            }
            setLocalNotes(content);
            // Check if content is empty (handle BlockNote, TipTap and Editor.js empty formats)
            let isEmpty = !content.trim() || content === "{}" || content === '{"blocks":[]}' || content === "[]";
            if (!isEmpty) {
                try {
                    const parsed = JSON.parse(content);
                    // Check BlockNote empty array or empty paragraph blocks
                    if (Array.isArray(parsed)) {
                        isEmpty = parsed.length === 0 || parsed.every((block)=>block.type === "paragraph" && (!block.content || Array.isArray(block.content) && block.content.every((c)=>!c.text || !c.text.trim())));
                    } else if (parsed.type === "doc" && (!parsed.content || parsed.content.length === 0)) {
                        isEmpty = true;
                    } else if (parsed.type === "doc" && parsed.content?.length === 1 && parsed.content[0].type === "paragraph" && !parsed.content[0].content) {
                        isEmpty = true;
                    }
                } catch  {
                // Not JSON
                }
            }
            if (isEmpty) {
                setIsNoteExpanded(false);
            } else {
                setIsNoteExpanded(true); // Keep expanded if there's content
            }
        } catch (error) {
            throw error // Re-throw to show error in component
            ;
        }
    };
    const handleNoteCancel = ()=>{
        setLocalNotes(task.notes || "");
        setIsEditingNote(false);
        if (!hasNotes) {
            setIsNoteExpanded(false);
        }
    };
    const handleNoteKeyDown = (e)=>{
        if (e.key === "Escape") {
            handleNoteCancel();
        }
    };
    const getCategoryColor = (category)=>{
        switch(category){
            case "Caption":
                return "bg-emerald-100 text-emerald-700";
            case "No caption":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case "Not started":
                return "bg-gray-100 text-gray-700";
            case "In progress":
                return "bg-blue-100 text-blue-700";
            case "Wait VO":
                return "bg-yellow-100 text-yellow-700";
            case "Finished":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    // Format duration as MM:SS for display
    const formatDurationMMSS = (duration)=>{
        if (!duration) return "";
        const parts = duration.split(":");
        if (parts.length === 3) {
            const hours = parseInt(parts[0] || "0", 10);
            const minutes = parseInt(parts[1] || "0", 10);
            const seconds = parseInt(parts[2] || "0", 10);
            const totalMinutes = hours * 60 + minutes;
            return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }
        if (parts.length === 2) {
            return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
        }
        return duration;
    };
    const statusOptions = [
        "Not started",
        "In progress",
        "Wait VO",
        "Finished",
        null
    ];
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const statusDropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaskCard.useEffect": ()=>{
            const handleClickOutside = {
                "TaskCard.useEffect.handleClickOutside": (event)=>{
                    if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                        setIsStatusDropdownOpen(false);
                    }
                }
            }["TaskCard.useEffect.handleClickOutside"];
            if (isStatusDropdownOpen) {
                document.addEventListener("mousedown", handleClickOutside);
            }
            return ({
                "TaskCard.useEffect": ()=>{
                    document.removeEventListener("mousedown", handleClickOutside);
                }
            })["TaskCard.useEffect"];
        }
    }["TaskCard.useEffect"], [
        isStatusDropdownOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-white rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow group relative ${task.loading ? "opacity-60" : ""} ${isEditingNote ? "overflow-visible z-[100]" : ""}`,
        "data-editing-note": isEditingNote,
        onDragStart: (e)=>{
            if (isEditingNote) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },
        children: [
            task.loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "w-5 h-5 text-blue-500 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                    lineNumber: 255,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 254,
                columnNumber: 9
            }, this),
            !isFinished && !isTodayTask && task.episodes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3",
                children: [
                    !shouldCollapse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium text-muted-foreground",
                                children: [
                                    completedEpisodes,
                                    " of ",
                                    task.episodes.length,
                                    " episodes completed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 264,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-semibold text-emerald-600",
                                children: [
                                    percentComplete,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 267,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 263,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full bg-gray-200 rounded-full h-1.5 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-emerald-500 h-full rounded-full transition-all duration-300",
                            style: {
                                width: `${percentComplete}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 261,
                columnNumber: 9
            }, this),
            !isTodayTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1.5 flex-1",
                        children: [
                            task.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${getCategoryColor(task.category)}`,
                                children: task.category
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                ref: statusDropdownRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setIsStatusDropdownOpen(!isStatusDropdownOpen);
                                        },
                                        onMouseDown: (e)=>{
                                            e.stopPropagation();
                                        },
                                        onDragStart: (e)=>{
                                            e.stopPropagation();
                                            e.preventDefault();
                                        },
                                        className: `text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 ${getStatusColor(task.status)} hover:opacity-80 transition-opacity cursor-pointer`,
                                        children: [
                                            task.status || "Not started",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                                lineNumber: 306,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this),
                                    isStatusDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-full left-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 min-w-[120px]",
                                        onMouseDown: (e)=>{
                                            e.stopPropagation();
                                        },
                                        onDragStart: (e)=>{
                                            e.stopPropagation();
                                            e.preventDefault();
                                        },
                                        children: statusOptions.map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    onUpdateStatus(columnId, task.id, status);
                                                    setIsStatusDropdownOpen(false);
                                                    // If status is Finished, expand the card
                                                    if (status === "Finished") {
                                                        setIsExpanded(true);
                                                    }
                                                },
                                                onMouseDown: (e)=>{
                                                    e.stopPropagation();
                                                },
                                                className: `w-full text-left text-[10px] px-2 py-1.5 hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md ${task.status === status || task.status === null && status === null ? "bg-blue-50" : ""}`,
                                                children: status || "Not started"
                                            }, status || "none", false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            isFinished && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                },
                                onMouseDown: (e)=>{
                                    e.stopPropagation();
                                },
                                onDragStart: (e)=>{
                                    e.stopPropagation();
                                    e.preventDefault();
                                },
                                className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded flex-shrink-0",
                                title: isExpanded ? "Collapse" : "Expand",
                                children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                    className: "w-4 h-4 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 362,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-4 h-4 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 364,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 346,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onEditTask(task, columnId),
                                className: "opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded flex-shrink-0",
                                disabled: task.loading,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                    className: "w-4 h-4 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 368,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold text-black text-lg ",
                        children: task.title
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 380,
                        columnNumber: 9
                    }, this),
                    !isTodayTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            task.episodeRanges.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-semibold text-black whitespace-nowrap",
                                children: [
                                    "EP ",
                                    task.episodeRanges.join(", ")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 384,
                                columnNumber: 15
                            }, this),
                            task.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-xs text-black whitespace-nowrap",
                                children: [
                                    "/ Duration ",
                                    formatDurationMMSS(task.duration)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 387,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this),
            !shouldCollapse && !isTodayTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 flex items-center gap-2 flex-wrap",
                children: [
                    {
                        label: "Check VO",
                        key: "checkVO"
                    },
                    {
                        label: "Pitch Shift",
                        key: "pitchShift"
                    },
                    {
                        label: "Mixing",
                        key: "mixing"
                    },
                    {
                        label: "Mixing SRT",
                        key: "mixingSRT"
                    },
                    {
                        label: "Completed",
                        key: "completed"
                    }
                ].filter((item)=>{
                    // Hide "Mixing SRT" (step 4) if category is "No caption"
                    if (item.key === "mixingSRT" && task.category === "No caption") {
                        return false;
                    }
                    return true;
                }).map((item, index)=>{
                    // For "No caption" tasks, renumber steps sequentially (1, 2, 3, 4)
                    // For "Caption" tasks, use original step numbers (1, 2, 3, 4, 5)
                    const stepNumber = task.category === "No caption" ? index + 1 : [
                        {
                            label: "Check VO",
                            key: "checkVO"
                        },
                        {
                            label: "Pitch Shift",
                            key: "pitchShift"
                        },
                        {
                            label: "Mixing",
                            key: "mixing"
                        },
                        {
                            label: "Mixing SRT",
                            key: "mixingSRT"
                        },
                        {
                            label: "Completed",
                            key: "completed"
                        }
                    ].findIndex((orig)=>orig.key === item.key) + 1;
                    const isCompleted = localProgress[item.key] === true;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: async (e)=>{
                            e.stopPropagation();
                            const newProgress = {
                                ...localProgress,
                                [item.key]: !isCompleted
                            };
                            setLocalProgress(newProgress); // Optimistic update
                            // If "Completed" step is checked, automatically set status to "Finished"
                            const willBeCompleted = item.key === "completed" && !isCompleted;
                            try {
                                const updateData = {
                                    progress: newProgress
                                };
                                if (willBeCompleted) {
                                    updateData.status = "Finished";
                                    // Update status in parent component immediately
                                    onUpdateStatus(columnId, task.id, "Finished");
                                }
                                const response = await fetch(`/api/tasks/${task.id}`, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(updateData)
                                });
                                if (!response.ok) {
                                    throw new Error("Failed to update progress");
                                }
                                const updatedTask = await response.json();
                                setLocalProgress(updatedTask.progress ? typeof updatedTask.progress === 'string' ? JSON.parse(updatedTask.progress) : updatedTask.progress : {});
                                // If status was updated to Finished, collapse the card
                                if (willBeCompleted && updatedTask.status === "Finished") {
                                    setIsExpanded(false);
                                }
                            } catch (error) {
                                console.error("Failed to update progress:", error);
                                setLocalProgress(task.progress || {}); // Revert on error
                                // Revert status if it was updated
                                if (willBeCompleted) {
                                    onUpdateStatus(columnId, task.id, task.status);
                                }
                            }
                        },
                        onMouseDown: (e)=>e.stopPropagation(),
                        className: "flex items-center gap-1 text-[10px] hover:bg-muted/50 rounded px-2 py-1 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground",
                                children: stepNumber
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 470,
                                columnNumber: 19
                            }, this),
                            isCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-3 h-3 text-emerald-500 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 472,
                                columnNumber: 21
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                className: "w-3 h-3 text-border flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 474,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: isCompleted ? "text-foreground font-medium" : "text-muted-foreground",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 476,
                                columnNumber: 19
                            }, this)
                        ]
                    }, item.key, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 425,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 397,
                columnNumber: 9
            }, this),
            !shouldCollapse && task.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-muted-foreground mb-3",
                children: task.description
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 486,
                columnNumber: 47
            }, this),
            !shouldCollapse && !isTodayTask && task.episodes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-5 gap-1",
                    children: task.episodes.map((episode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: (e)=>{
                                e.stopPropagation();
                                onToggleEpisode(columnId, task.id, episode.id);
                            },
                            className: "flex items-center justify-center cursor-pointer",
                            children: [
                                episode.completed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    className: "w-4 h-4 text-emerald-500 mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 502,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                    className: "w-4 h-4 text-border hover:text-muted-foreground mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 504,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] font-medium text-foreground min-w-fit",
                                    children: episode.number
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 506,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, episode.id, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                            lineNumber: 493,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                    lineNumber: 491,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 490,
                columnNumber: 9
            }, this),
            !shouldCollapse && !isTodayTask && task.subtasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-muted-foreground mb-2",
                        children: "Sub tasks"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 516,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: task.subtasks.map((subtask)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onToggleSubtask(columnId, task.id, subtask.id);
                                },
                                className: "flex items-center gap-2 cursor-pointer",
                                children: [
                                    subtask.completed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "w-4 h-4 text-emerald-500 flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                        lineNumber: 528,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                        className: "w-4 h-4 text-border flex-shrink-0 hover:text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                        lineNumber: 530,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-xs ${subtask.completed ? "line-through text-muted-foreground" : "text-foreground"}`,
                                        children: subtask.title
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, subtask.id, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 519,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 517,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 515,
                columnNumber: 9
            }, this),
            !shouldCollapse && task.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-3 rounded-md overflow-hidden bg-muted h-24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: task.image || "/placeholder.svg",
                    alt: task.title,
                    className: "w-full h-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                    lineNumber: 546,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 545,
                columnNumber: 9
            }, this),
            isFinished && !isTodayTask && task.episodes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${shouldCollapse ? "mt-2" : "mt-3 pt-3 border-t border-border"}`,
                children: [
                    !shouldCollapse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium text-muted-foreground",
                                children: [
                                    completedEpisodes,
                                    " of ",
                                    task.episodes.length,
                                    " episodes completed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 556,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-semibold text-emerald-600",
                                children: [
                                    percentComplete,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                lineNumber: 559,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 555,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full bg-gray-200 rounded-full h-1.5 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-emerald-500 h-full rounded-full transition-all duration-300",
                            style: {
                                width: `${percentComplete}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                            lineNumber: 563,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                        lineNumber: 562,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 553,
                columnNumber: 9
            }, this),
            !shouldCollapse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `mt-3 pt-3 border-t border-border group/note ${isEditingNote ? "overflow-visible" : ""}`,
                draggable: false,
                onDragStart: (e)=>{
                    e.preventDefault();
                    e.stopPropagation();
                },
                onMouseDown: (e)=>{
                    if (isEditingNote) {
                        e.stopPropagation();
                    }
                },
                children: !isNoteExpanded && !hasNotes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        setIsNoteExpanded(true);
                        setIsEditingNote(true);
                    },
                    className: "text-[10px] text-muted-foreground hover:text-foreground transition-colors",
                    children: "+ Add note"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                    lineNumber: 587,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mb-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-[10px] font-medium text-muted-foreground",
                                    children: "Note"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 599,
                                    columnNumber: 17
                                }, this),
                                !isEditingNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onUpdateNote(columnId, task.id, "");
                                        setLocalNotes("");
                                        setIsNoteExpanded(false);
                                    },
                                    className: "text-[10px] text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity",
                                    title: "Remove note",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                        lineNumber: 610,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 601,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                            lineNumber: 598,
                            columnNumber: 15
                        }, this),
                        isEditingNote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockNoteNote, {
                            initialData: task.notes,
                            onSave: handleNoteSubmit,
                            onCancel: handleNoteCancel,
                            placeholder: "Add a note about this series...",
                            isEditing: isEditingNote,
                            onEditChange: setIsEditingNote
                        }, `editor-${task.id}-${isEditingNote}`, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                            lineNumber: 615,
                            columnNumber: 17
                        }, this) : hasNotes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>{
                                setIsEditingNote(true);
                                setIsNoteExpanded(true);
                            },
                            className: "cursor-text",
                            children: (()=>{
                                // Prefer localNotes as it's updated immediately on save
                                const notesContent = localNotes || task.notes;
                                try {
                                    const data = typeof notesContent === "string" ? JSON.parse(notesContent) : notesContent;
                                    // Check for BlockNote format (array), TipTap format (type: "doc") or Editor.js format (blocks array)
                                    if (Array.isArray(data) || data.type === "doc" && data.content || data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockNoteViewer, {
                                            content: notesContent
                                        }, `viewer-${task.id}-${localNotes?.slice(0, 30)}`, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                            lineNumber: 639,
                                            columnNumber: 32
                                        }, this);
                                    }
                                } catch  {
                                // Not JSON, fall through to HTML rendering
                                }
                                // Fallback to plain text rendering
                                const fallbackText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$blocknote$2d$note$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderBlockNoteContent"])(notesContent);
                                if (!fallbackText) return null;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-foreground whitespace-pre-wrap",
                                    children: fallbackText
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                                    lineNumber: 648,
                                    columnNumber: 23
                                }, this);
                            })()
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                            lineNumber: 625,
                            columnNumber: 17
                        }, this) : null
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
                lineNumber: 573,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx",
        lineNumber: 242,
        columnNumber: 5
    }, this);
}
_s(TaskCard, "9rroXP/IWCDvdX1O7diJV0W/QIM=");
_c2 = TaskCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "BlockNoteNote");
__turbopack_context__.k.register(_c1, "BlockNoteViewer");
__turbopack_context__.k.register(_c2, "TaskCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KanbanColumn",
    ()=>KanbanColumn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function KanbanColumn({ column, onDragStart, onDragOver, onDrop, onDragEnd, onToggleEpisode, onToggleSubtask, onEditTask, onUpdateNote, onUpdateStatus }) {
    _s();
    const [hasEditingCard, setHasEditingCard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Detect if any card in this column is being edited
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KanbanColumn.useEffect": ()=>{
            const checkEditing = {
                "KanbanColumn.useEffect.checkEditing": ()=>{
                    const editingCard = document.querySelector(`[data-column-id="${column.id}"] [data-editing-note="true"]`);
                    setHasEditingCard(!!editingCard);
                }
            }["KanbanColumn.useEffect.checkEditing"];
            // Use MutationObserver to detect changes
            const observer = new MutationObserver(checkEditing);
            const columnEl = document.querySelector(`[data-column-id="${column.id}"]`);
            if (columnEl) {
                observer.observe(columnEl, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: [
                        'data-editing-note'
                    ]
                });
            }
            return ({
                "KanbanColumn.useEffect": ()=>observer.disconnect()
            })["KanbanColumn.useEffect"];
        }
    }["KanbanColumn.useEffect"], [
        column.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col bg-muted/30 rounded-lg p-4 min-h-96 ${hasEditingCard ? "overflow-visible" : ""}`,
        "data-column-id": column.id,
        onDragOver: onDragOver,
        onDrop: (e)=>onDrop(e, column.id),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4",
                children: column.title
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-1 space-y-3 pr-2 ${hasEditingCard ? "overflow-visible" : "overflow-y-auto"}`,
                children: [
                    column.tasks.map((task)=>{
                        // Check if this card is being edited by looking at the rendered element
                        const isEditing = false // Will be determined by the DOM
                        ;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            draggable: true,
                            onMouseDown: (e)=>{
                                // Check if card is in edit mode and prevent drag initiation
                                const cardElement = e.currentTarget.querySelector('[data-editing-note="true"]');
                                if (cardElement) {
                                    // Don't stop propagation for clicks, just prevent drag
                                    e.currentTarget.setAttribute('draggable', 'false');
                                    // Re-enable after a short delay
                                    setTimeout(()=>{
                                        e.currentTarget?.setAttribute('draggable', 'true');
                                    }, 100);
                                }
                            },
                            onDragStart: (e)=>{
                                // Only allow drag if not clicking on interactive elements
                                const target = e.target;
                                const wrapper = e.currentTarget;
                                const cardElement = wrapper.querySelector('[data-editing-note="true"]');
                                if (cardElement || target.closest('[data-editing-note="true"]') || target.closest("button") || target.closest("textarea") || target.closest("input") || target.closest("[role='button']") || target.closest(".editorjs-note-container") || target.closest(".codex-editor") || target.closest(".ce-block") || target.closest(".ce-toolbar") || target.closest(".ce-popover") || target.closest(".ce-inline-toolbar") || target.closest(".tiptap-note-editor") || target.closest(".ProseMirror") || target.closest(".blocknote-note-wrapper") || target.closest(".blocknote-note-editor") || target.closest(".group\\/note")) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return false;
                                }
                                onDragStart(task, column.id);
                            },
                            onDragEnd: onDragEnd,
                            onDragOver: (e)=>{
                                // Prevent cards from accepting drops
                                e.stopPropagation();
                            },
                            onDrop: (e)=>{
                                // Prevent cards from accepting drops
                                e.stopPropagation();
                                e.preventDefault();
                            },
                            className: "cursor-grab active:cursor-grabbing",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskCard"], {
                                task: task,
                                columnId: column.id,
                                onToggleEpisode: onToggleEpisode,
                                onToggleSubtask: onToggleSubtask,
                                onEditTask: onEditTask,
                                onUpdateNote: onUpdateNote,
                                onUpdateStatus: onUpdateStatus
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this)
                        }, task.id, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx",
                            lineNumber: 70,
                            columnNumber: 13
                        }, this);
                    }),
                    column.tasks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-20 text-muted-foreground text-sm",
                        children: "No tasks yet"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(KanbanColumn, "JSBnQSMj9A5Xf4jlMDWJHf/hVCQ=");
_c = KanbanColumn;
var _c;
__turbopack_context__.k.register(_c, "KanbanColumn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DurationInput",
    ()=>DurationInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localValue, setLocalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(parseDuration(value));
    const [popupPosition, setPopupPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isInitialMount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DurationInput.useEffect": ()=>{
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }
            setLocalValue(parseDuration(value));
        }
    }["DurationInput.useEffect"], [
        value
    ]);
    const updateValue = (newValue)=>{
        setLocalValue(newValue);
        const formatted = `${newValue.hours}:${String(newValue.minutes).padStart(2, "0")}:${String(newValue.seconds).padStart(2, "0")}`;
        // Use setTimeout to defer onChange call and avoid setState during render
        setTimeout(()=>onChange(formatted), 0);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DurationInput.useEffect": ()=>{
            const handleClickOutside = {
                "DurationInput.useEffect.handleClickOutside": (event)=>{
                    if (popupRef.current && !popupRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                        setIsOpen(false);
                        const formatted = `${localValue.hours}:${String(localValue.minutes).padStart(2, "0")}:${String(localValue.seconds).padStart(2, "0")}`;
                        onBlur(formatted);
                    }
                }
            }["DurationInput.useEffect.handleClickOutside"];
            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
                return ({
                    "DurationInput.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
                })["DurationInput.useEffect"];
            }
        }
    }["DurationInput.useEffect"], [
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DurationInput.useEffect": ()=>{
            if (!isOpen) return;
            const updatePosition = {
                "DurationInput.useEffect.updatePosition": ()=>{
                    updatePopupPosition();
                }
            }["DurationInput.useEffect.updatePosition"];
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
            return ({
                "DurationInput.useEffect": ()=>{
                    window.removeEventListener("scroll", updatePosition, true);
                    window.removeEventListener("resize", updatePosition);
                }
            })["DurationInput.useEffect"];
        }
    }["DurationInput.useEffect"], [
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIncrement("hours"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleDecrement("hours"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-lg font-semibold",
                            children: ":"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 239,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIncrement("minutes"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleDecrement("minutes"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-lg font-semibold",
                            children: ":"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleIncrement("seconds"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleDecrement("seconds"),
                                    className: "w-8 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(DurationInput, "FT12aewnt13eyo1ZLykl0Q8qEl8=");
_c = DurationInput;
var _c;
__turbopack_context__.k.register(_c, "DurationInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EditTaskModal",
    ()=>EditTaskModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$duration$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function EditTaskModal({ task, onSave, onDelete, onClose }) {
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ...task,
        episodeRange: task.episodeRanges.join(", "),
        duration: task.duration || "00:10:00",
        billingMonth: task.billingMonth ? /\d{4}/.test(task.billingMonth) ? task.billingMonth : `${task.billingMonth} 2025` : "December 2025"
    });
    const handleSave = ()=>{
        // Convert episodeRange string back to array
        const episodeRanges = formData.episodeRange.split(",").map((range)=>range.trim()).filter((range)=>range.length > 0);
        onSave({
            ...formData,
            episodeRanges: episodeRanges.length > 0 ? episodeRanges : []
        });
    };
    const handleTitleChange = (e)=>{
        setFormData({
            ...formData,
            title: e.target.value
        });
    };
    const handleDescriptionChange = (e)=>{
        setFormData({
            ...formData,
            description: e.target.value
        });
    };
    const handleCategoryChange = (e)=>{
        const value = e.target.value;
        setFormData({
            ...formData,
            category: value || null
        });
    };
    const handleStatusChange = (e)=>{
        const value = e.target.value;
        setFormData({
            ...formData,
            status: value || null
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold",
                            children: "Edit Task"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-1 hover:bg-muted rounded",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Title"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: formData.title,
                                    onChange: handleTitleChange,
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Description"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: formData.description,
                                    onChange: handleDescriptionChange,
                                    rows: 1,
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Episode Range"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: formData.episodeRange || "",
                                    disabled: true,
                                    placeholder: "e.g., 051-060 or 051-060,066-070",
                                    className: "w-full px-3 py-2 border border-border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "Episode range cannot be changed after task creation"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground mb-1 block",
                                            children: "Duration (timecode)"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$duration$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DurationInput"], {
                                            value: formData.duration || "00:10:00",
                                            onChange: (value)=>setFormData({
                                                    ...formData,
                                                    duration: value
                                                }),
                                            onBlur: (value)=>setFormData({
                                                    ...formData,
                                                    duration: value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground mb-1 block",
                                            children: "Billing month"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: formData.billingMonth || "",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    billingMonth: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            children: (()=>{
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
                                                return years.flatMap((year)=>months.map((month)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: `${month} ${year}`,
                                                            children: [
                                                                month,
                                                                " ",
                                                                year
                                                            ]
                                                        }, `${month} ${year}`, true, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 23
                                                        }, this)));
                                            })()
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground mb-2 block",
                                            children: "Category"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: formData.category || "",
                                            onChange: handleCategoryChange,
                                            className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select category"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Caption",
                                                    children: "Caption"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "No caption",
                                                    children: "No caption"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground mb-2 block",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: formData.status || "",
                                            onChange: handleStatusChange,
                                            className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select status"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Not started",
                                                    children: "Not started"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "In progress",
                                                    children: "In progress"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Wait VO",
                                                    children: "Wait VO"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Finished",
                                                    children: "Finished"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 160,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 pt-4 border-t border-border",
                            children: [
                                onDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (confirm("Are you sure you want to delete this task?")) {
                                            onDelete(task.id);
                                            onClose();
                                        }
                                    },
                                    className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this),
                                        "Delete"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
                                    children: "Save"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(EditTaskModal, "/NJhtgGG8TK+OgAcoCsLYx7OQP8=");
_c = EditTaskModal;
var _c;
__turbopack_context__.k.register(_c, "EditTaskModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EpisodeRangePicker",
    ()=>EpisodeRangePicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function EpisodeRangePicker({ value, onChange }) {
    _s();
    const [ranges, setRanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "EpisodeRangePicker.useState": ()=>{
            if (value.length === 0) return [
                {
                    start: "",
                    end: ""
                }
            ];
            return value.map({
                "EpisodeRangePicker.useState": (range)=>{
                    const parts = range.split("-");
                    return {
                        start: parts[0]?.trim() || "",
                        end: parts[1]?.trim() || ""
                    };
                }
            }["EpisodeRangePicker.useState"]);
        }
    }["EpisodeRangePicker.useState"]);
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EpisodeRangePicker.useEffect": ()=>{
            const handleClickOutside = {
                "EpisodeRangePicker.useEffect.handleClickOutside": (event)=>{
                    if (popupRef.current && !popupRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                        setIsOpen(false);
                        // Format and save ranges when closing
                        const formatted = ranges.filter({
                            "EpisodeRangePicker.useEffect.handleClickOutside.formatted": (r)=>r.start && r.end
                        }["EpisodeRangePicker.useEffect.handleClickOutside.formatted"]).map({
                            "EpisodeRangePicker.useEffect.handleClickOutside.formatted": (r)=>`${r.start}-${r.end}`
                        }["EpisodeRangePicker.useEffect.handleClickOutside.formatted"]);
                        onChange(formatted);
                    }
                }
            }["EpisodeRangePicker.useEffect.handleClickOutside"];
            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
                return ({
                    "EpisodeRangePicker.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
                })["EpisodeRangePicker.useEffect"];
            }
        }
    }["EpisodeRangePicker.useEffect"], [
        isOpen,
        ranges,
        onChange
    ]);
    const updateRange = (index, field, newValue)=>{
        const numValue = newValue.replace(/\D/g, "") // Only numbers
        ;
        setRanges((prev)=>{
            const updated = [
                ...prev
            ];
            updated[index] = {
                ...updated[index],
                [field]: numValue
            };
            return updated;
        });
    };
    const addRange = ()=>{
        setRanges((prev)=>[
                ...prev,
                {
                    start: "",
                    end: ""
                }
            ]);
    };
    const removeRange = (index)=>{
        setRanges((prev)=>{
            const newRanges = prev.filter((_, i)=>i !== index);
            return newRanges.length === 0 ? [
                {
                    start: "",
                    end: ""
                }
            ] : newRanges;
        });
    };
    const formatDisplayValue = ()=>{
        const formatted = ranges.filter((r)=>r.start && r.end).map((r)=>`${r.start}-${r.end}`);
        return formatted.length > 0 ? formatted.join(", ") : "Add episode range";
    };
    const displayValue = formatDisplayValue();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: buttonRef,
                type: "button",
                onClick: ()=>setIsOpen(!isOpen),
                className: "w-full px-3 py-2 border border-border rounded-md hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-background transition-colors text-left",
                children: displayValue
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: popupRef,
                className: "absolute z-50 mt-1 bg-white border border-border rounded-lg shadow-xl p-4 min-w-[400px]",
                style: {
                    top: "100%",
                    left: 0,
                    animation: "fadeInScale 0.15s ease-out"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        ranges.map((range, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs text-muted-foreground mb-1",
                                                        children: "Start"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: range.start,
                                                        onChange: (e)=>updateRange(index, "start", e.target.value),
                                                        placeholder: "031",
                                                        className: "w-20 px-2 py-1.5 border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                lineNumber: 108,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-lg font-semibold mt-6",
                                                children: "-"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                lineNumber: 118,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs text-muted-foreground mb-1",
                                                        children: "End"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: range.end,
                                                        onChange: (e)=>updateRange(index, "end", e.target.value),
                                                        placeholder: "040",
                                                        className: "w-20 px-2 py-1.5 border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                                lineNumber: 119,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this),
                                    ranges.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>removeRange(index),
                                        className: "p-1 hover:bg-red-50 rounded text-red-500 transition-colors mt-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                            lineNumber: 136,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                        lineNumber: 131,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                lineNumber: 106,
                                columnNumber: 15
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: addRange,
                            className: "w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-border rounded hover:bg-muted transition-colors text-sm text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this),
                                "Add another range"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(EpisodeRangePicker, "nWdZzGSrSF4WS4GikiAD2ERmI+k=");
_c = EpisodeRangePicker;
var _c;
__turbopack_context__.k.register(_c, "EpisodeRangePicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BillingMonthPicker",
    ()=>BillingMonthPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const MONTHS = [
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
function BillingMonthPicker({ value, onChange, className = "", buttonClassName = "" }) {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [popupPosition, setPopupPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const popupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Parse initial value
    const parseValue = (val)=>{
        const parts = val.split(" ");
        const monthStr = parts[0];
        const yearStr = parts[1] || new Date().getFullYear().toString();
        let monthIndex = MONTHS.indexOf(monthStr);
        if (monthIndex === -1) monthIndex = new Date().getMonth(); // Default to current month if invalid
        const year = parseInt(yearStr) || new Date().getFullYear();
        return {
            monthIndex,
            year
        };
    };
    const [localValue, setLocalValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(parseValue(value));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BillingMonthPicker.useEffect": ()=>{
            setLocalValue(parseValue(value));
        }
    }["BillingMonthPicker.useEffect"], [
        value
    ]);
    const updateValue = (newMonthIndex, newYear)=>{
        const newVal = {
            monthIndex: newMonthIndex,
            year: newYear
        };
        setLocalValue(newVal);
        // Defer onChange to next tick to avoid render loops if parent updates state immediately
        setTimeout(()=>{
            onChange(`${MONTHS[newMonthIndex]} ${newYear}`);
        }, 0);
    };
    const handleIncrementMonth = ()=>{
        let nextIndex = localValue.monthIndex + 1;
        if (nextIndex > 11) nextIndex = 0;
        updateValue(nextIndex, localValue.year);
    };
    const handleDecrementMonth = ()=>{
        let prevIndex = localValue.monthIndex - 1;
        if (prevIndex < 0) prevIndex = 11;
        updateValue(prevIndex, localValue.year);
    };
    const handleIncrementYear = ()=>{
        updateValue(localValue.monthIndex, localValue.year + 1);
    };
    const handleDecrementYear = ()=>{
        updateValue(localValue.monthIndex, localValue.year - 1);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BillingMonthPicker.useEffect": ()=>{
            const handleClickOutside = {
                "BillingMonthPicker.useEffect.handleClickOutside": (event)=>{
                    if (popupRef.current && !popupRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
                        setIsOpen(false);
                    }
                }
            }["BillingMonthPicker.useEffect.handleClickOutside"];
            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside);
                return ({
                    "BillingMonthPicker.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
                })["BillingMonthPicker.useEffect"];
            }
        }
    }["BillingMonthPicker.useEffect"], [
        isOpen
    ]);
    const updatePopupPosition = ()=>{
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BillingMonthPicker.useEffect": ()=>{
            if (!isOpen) return;
            const updatePosition = {
                "BillingMonthPicker.useEffect.updatePosition": ()=>updatePopupPosition()
            }["BillingMonthPicker.useEffect.updatePosition"];
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
            return ({
                "BillingMonthPicker.useEffect": ()=>{
                    window.removeEventListener("scroll", updatePosition, true);
                    window.removeEventListener("resize", updatePosition);
                }
            })["BillingMonthPicker.useEffect"];
        }
    }["BillingMonthPicker.useEffect"], [
        isOpen
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: buttonRef,
                type: "button",
                onClick: handleToggle,
                className: `w-full px-3 py-2 border border-border rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background transition-colors text-left flex items-center justify-between ${buttonClassName}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            MONTHS[localValue.monthIndex],
                            " ",
                            localValue.year
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                        lineNumber: 135,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        className: "w-4 h-4 opacity-50"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                lineNumber: 129,
                columnNumber: 13
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: popupRef,
                className: "fixed z-[9999] bg-white border border-border rounded-lg shadow-xl p-4 flex gap-4",
                style: {
                    top: `${popupPosition.top}px`,
                    left: `${popupPosition.left}px`,
                    animation: "fadeInScale 0.15s ease-out"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center w-32",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleIncrementMonth,
                                className: "p-1 hover:bg-muted rounded transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                    lineNumber: 156,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 151,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-base font-semibold py-2 text-center w-full",
                                children: MONTHS[localValue.monthIndex]
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 158,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleDecrementMonth,
                                className: "p-1 hover:bg-muted rounded transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                    lineNumber: 166,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 161,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-muted-foreground mt-1",
                                children: "Month"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 168,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                        lineNumber: 150,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-px bg-border my-2"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                        lineNumber: 171,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center w-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleIncrementYear,
                                className: "p-1 hover:bg-muted rounded transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                    lineNumber: 180,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 175,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-base font-semibold py-2",
                                children: localValue.year
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 182,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleDecrementYear,
                                className: "p-1 hover:bg-muted rounded transition-colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                    lineNumber: 190,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 185,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-muted-foreground mt-1",
                                children: "Year"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                                lineNumber: 192,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                        lineNumber: 174,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
                lineNumber: 140,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx",
        lineNumber: 128,
        columnNumber: 9
    }, this);
}
_s(BillingMonthPicker, "IZc3UI4Y6le4cXnFc7PRx+aD64Y=");
_c = BillingMonthPicker;
var _c;
__turbopack_context__.k.register(_c, "BillingMonthPicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateTaskModal",
    ()=>CreateTaskModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$episode$2d$range$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/episode-range-picker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$duration$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/duration-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$billing$2d$month$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/billing-month-picker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CreateTaskModal({ onSave, onClose }) {
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        description: "",
        episodeRanges: [],
        category: "",
        status: "",
        stage: "Backlog",
        duration: "00:10:00",
        billingMonth: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "MMMM yyyy")
    });
    const handleSave = ()=>{
        if (!formData.title.trim()) {
            alert("Please enter a task title");
            return;
        }
        onSave({
            title: formData.title,
            description: formData.description,
            episodeRanges: formData.episodeRanges,
            category: formData.category || null,
            status: formData.status || null,
            stage: formData.stage,
            duration: formData.duration || "00:10:00",
            billingMonth: formData.billingMonth
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold",
                            children: "Create New Task"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-1 hover:bg-muted rounded",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: [
                                        "Title ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-red-500",
                                            children: "*"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 69,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: formData.title,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            title: e.target.value
                                        }),
                                    placeholder: "Enter task title",
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Description"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: formData.description,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            description: e.target.value
                                        }),
                                    rows: 3,
                                    placeholder: "Enter task description",
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Episode Range"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$episode$2d$range$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EpisodeRangePicker"], {
                                    value: formData.episodeRanges,
                                    onChange: (ranges)=>setFormData({
                                            ...formData,
                                            episodeRanges: ranges
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-2 block",
                                    children: "Category"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: formData.category,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            category: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select category"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Caption",
                                            children: "Caption"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "No caption",
                                            children: "No caption"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-2 block",
                                    children: "Status"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: formData.status,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            status: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select status"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Not started",
                                            children: "Not started"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "In progress",
                                            children: "In progress"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 132,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Wait VO",
                                            children: "Wait VO"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Finished",
                                            children: "Finished"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-2 block",
                                    children: "Stage"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: formData.stage,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            stage: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Backlog",
                                            children: "Backlog"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 146,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "In Progress",
                                            children: "In Progress"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Finished",
                                            children: "Finished"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 148,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Revision",
                                            children: "Revision"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 149,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Customer Revision",
                                            children: "Customer Revision"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 150,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "Done",
                                            children: "Done"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                            lineNumber: 151,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Duration (timecode)"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$duration$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DurationInput"], {
                                    value: formData.duration || "00:10:00",
                                    onChange: (value)=>setFormData({
                                            ...formData,
                                            duration: value
                                        }),
                                    onBlur: (value)=>setFormData({
                                            ...formData,
                                            duration: value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-sm font-medium text-foreground mb-1 block",
                                    children: "Billing month"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$billing$2d$month$2d$picker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BillingMonthPicker"], {
                                    value: formData.billingMonth,
                                    onChange: (newVal)=>setFormData({
                                            ...formData,
                                            billingMonth: newVal
                                        }),
                                    className: "w-full"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: "You can group tasks later by this month name."
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 pt-4 border-t border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors",
                                    children: "Create Task"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(CreateTaskModal, "5U/xIFc2+ja6vMyiHuHKjy+P1UU=");
_c = CreateTaskModal;
var _c;
__turbopack_context__.k.register(_c, "CreateTaskModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KanbanBoard",
    ()=>KanbanBoard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$kanban$2d$column$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-column.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$edit$2d$task$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/edit-task-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$create$2d$task$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/create-task-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/task-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const initialBoardData = [
    {
        id: "backlog",
        title: "Backlog",
        tasks: []
    },
    {
        id: "in-progress",
        title: "In Progress",
        tasks: []
    },
    {
        id: "finished",
        title: "Finished",
        tasks: []
    },
    {
        id: "revision",
        title: "Revision",
        tasks: []
    },
    {
        id: "customer-revision",
        title: "Customer Revision",
        tasks: []
    },
    {
        id: "done",
        title: "Done",
        tasks: []
    }
];
function KanbanBoard({ onCreateTaskTrigger, onCreateTaskHandled, searchQuery = "" }) {
    _s();
    const [board, setBoard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialBoardData);
    const [editingTask, setEditingTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [creatingTask, setCreatingTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draggedTask, setDraggedTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragSuccessful, setDragSuccessful] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Helper function to sort Finished column by created_at (newest first)
    const sortFinishedColumn = (boardData)=>{
        return boardData.map((column)=>{
            if (column.id === "finished") {
                const sortedTasks = [
                    ...column.tasks
                ].sort((a, b)=>{
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA // Newest first (descending)
                    ;
                });
                return {
                    ...column,
                    tasks: sortedTasks
                };
            }
            return column;
        });
    };
    const [isDoneExpanded, setIsDoneExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Handle external trigger to open create modal
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KanbanBoard.useEffect": ()=>{
            if (onCreateTaskTrigger) {
                setCreatingTask(true);
                onCreateTaskHandled?.();
            }
        }
    }["KanbanBoard.useEffect"], [
        onCreateTaskTrigger,
        onCreateTaskHandled
    ]);
    // Check if a string is a valid UUID
    const isValidUUID = (id)=>{
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    };
    // Create a task in the database if it doesn't exist (has non-UUID ID)
    const ensureTaskExists = async (task, stage)=>{
        if (isValidUUID(task.id)) {
            return task.id;
        }
        // Task doesn't exist in DB, create it
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    duration: task.duration || "00:10:00",
                    category: task.category,
                    status: task.status,
                    stage: stage,
                    episodeRanges: task.episodeRanges,
                    completedEpisodes: task.episodes.filter((ep)=>ep.completed).map((ep)=>ep.number),
                    billingMonth: task.billingMonth || "December 2025"
                })
            });
            if (!response.ok) {
                throw new Error(`Failed to create task: ${response.statusText}`);
            }
            const newTask = await response.json();
            return newTask.id;
        } catch (error) {
            console.error("[v0] Failed to create task:", error);
            throw error;
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KanbanBoard.useEffect": ()=>{
            const loadTasks = {
                "KanbanBoard.useEffect.loadTasks": async ()=>{
                    try {
                        const response = await fetch("/api/tasks");
                        if (!response.ok) {
                            console.log("[v0] Backend unavailable, using local data");
                            setBoard(initialBoardData);
                            return;
                        }
                        const tasks = await response.json();
                        if (!tasks || tasks.length === 0) {
                            console.log("[v0] No tasks from backend, using local data");
                            setBoard(initialBoardData);
                            return;
                        }
                        // Transform Supabase data to UI format
                        const transformedTasks = tasks.map({
                            "KanbanBoard.useEffect.loadTasks.transformedTasks": (task)=>({
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
                                    billingMonth: task.billing_month || "December",
                                    episodes: parseCompletedEpisodes(task.episode_ranges || "", task.completed_episodes || "[]"),
                                    subtasks: [],
                                    attachments: [],
                                    progress: task.progress ? typeof task.progress === 'string' ? JSON.parse(task.progress) : task.progress : {}
                                })
                        }["KanbanBoard.useEffect.loadTasks.transformedTasks"]);
                        // Group tasks by stage
                        const stageMap = {
                            Backlog: [],
                            "In Progress": [],
                            Finished: [],
                            Revision: [],
                            "Customer Revision": [],
                            Done: []
                        };
                        transformedTasks.forEach({
                            "KanbanBoard.useEffect.loadTasks": (task)=>{
                                const stage = task.stage || "Backlog";
                                stageMap[stage]?.push(task);
                            }
                        }["KanbanBoard.useEffect.loadTasks"]);
                        // Sort Finished tasks by created_at (newest first / descending)
                        const finishedTasks = stageMap["Finished"].sort({
                            "KanbanBoard.useEffect.loadTasks.finishedTasks": (a, b)=>{
                                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                                return dateB - dateA // Newest first (descending)
                                ;
                            }
                        }["KanbanBoard.useEffect.loadTasks.finishedTasks"]);
                        const transformedBoard = [
                            {
                                id: "backlog",
                                title: "Backlog",
                                tasks: stageMap["Backlog"]
                            },
                            {
                                id: "in-progress",
                                title: "In Progress",
                                tasks: stageMap["In Progress"]
                            },
                            {
                                id: "finished",
                                title: "Finished",
                                tasks: finishedTasks
                            },
                            {
                                id: "revision",
                                title: "Revision",
                                tasks: stageMap["Revision"]
                            },
                            {
                                id: "customer-revision",
                                title: "Customer Revision",
                                tasks: stageMap["Customer Revision"]
                            },
                            {
                                id: "done",
                                title: "Done",
                                tasks: stageMap["Done"]
                            }
                        ];
                        setBoard(transformedBoard);
                    } catch (error) {
                        console.error("[v0] Failed to load tasks:", error);
                        setBoard(initialBoardData);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["KanbanBoard.useEffect.loadTasks"];
            loadTasks();
        }
    }["KanbanBoard.useEffect"], []);
    // Filter tasks based on search query
    const filteredBoard = board.map((column)=>({
            ...column,
            tasks: column.tasks.filter((task)=>{
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                const matchesTitle = task.title.toLowerCase().includes(query);
                const matchesRanges = task.episodeRanges.some((r)=>r.includes(query));
                return matchesTitle || matchesRanges;
            })
        }));
    const parseCompletedEpisodes = (ranges, completedJson)=>{
        try {
            const completed = JSON.parse(completedJson || "[]");
            if (!ranges || ranges.trim() === "") {
                return [];
            }
            const rangeArray = ranges.split(",");
            const episodes = [];
            rangeArray.forEach((range)=>{
                const trimmed = range.trim();
                if (!trimmed) return;
                const [start, end] = trimmed.split("-").map(Number);
                if (isNaN(start) || isNaN(end)) return;
                for(let i = start; i <= end; i++){
                    const number = String(i).padStart(3, "0");
                    episodes.push({
                        id: `ep-${number}`,
                        number,
                        completed: completed.includes(number)
                    });
                }
            });
            return episodes;
        } catch (error) {
            console.error("[v0] Failed to parse episodes:", error);
            return [];
        }
    };
    const [originalBoardState, setOriginalBoardState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleDragStart = (task, columnId)=>{
        setDraggedTask({
            task,
            fromColumnId: columnId
        });
        setDragSuccessful(false);
        // Save the current board state before drag
        setOriginalBoardState(board);
    };
    const handleDragOver = (e)=>{
        e.preventDefault();
    };
    const handleDragEnd = ()=>{
        // If drag ended without successful drop, restore the original board state
        if (draggedTask && !dragSuccessful && originalBoardState) {
            setBoard(originalBoardState);
        }
        setDraggedTask(null);
        setDragSuccessful(false);
        setOriginalBoardState(null);
    };
    // Helper function to map split column IDs to actual board column IDs
    const mapColumnId = (columnId)=>{
        const columnIdMap = {
            "in-progress-1": "in-progress",
            "in-progress-2": "in-progress"
        };
        return columnIdMap[columnId] || columnId;
    };
    const handleDrop = (e, columnId)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!draggedTask) return;
        const stageMap = {
            backlog: "Backlog",
            "in-progress": "In Progress",
            "in-progress-1": "In Progress",
            "in-progress-2": "In Progress",
            finished: "Finished",
            revision: "Revision",
            "customer-revision": "Customer Revision",
            done: "Done"
        };
        const newStage = stageMap[columnId];
        if (!newStage) {
            // Invalid drop zone, restore state
            if (originalBoardState) {
                setBoard(originalBoardState);
            }
            setDraggedTask(null);
            setDragSuccessful(false);
            setOriginalBoardState(null);
            return;
        }
        const actualColumnId = mapColumnId(columnId);
        // Save current state for potential revert
        const previousBoard = board;
        // Optimistically update UI
        const newBoard = board.map((col)=>{
            // Map fromColumnId as well if needed
            const actualFromColumnId = mapColumnId(draggedTask.fromColumnId);
            // Same column - just update the stage without removing/adding
            if (col.id === actualFromColumnId && col.id === actualColumnId) {
                return {
                    ...col,
                    tasks: col.tasks.map((t)=>t.id === draggedTask.task.id ? {
                            ...t,
                            stage: newStage
                        } : t)
                };
            }
            // Remove from source column
            if (col.id === actualFromColumnId) {
                return {
                    ...col,
                    tasks: col.tasks.filter((t)=>t.id !== draggedTask.task.id)
                };
            }
            // Add to target column
            if (col.id === actualColumnId) {
                return {
                    ...col,
                    tasks: [
                        ...col.tasks,
                        {
                            ...draggedTask.task,
                            stage: newStage
                        }
                    ]
                };
            }
            return col;
        });
        setBoard(sortFinishedColumn(newBoard));
        setDragSuccessful(true);
        setDraggedTask(null);
        // Update backend - ensure task exists first if it has a non-UUID ID
        ensureTaskExists(draggedTask.task, newStage).then((taskId)=>{
            return fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    stage: newStage
                })
            });
        }).then((response)=>{
            if (!response.ok) {
                throw new Error(`Failed to update task: ${response.statusText}`);
            }
            return response.json();
        }).then((updatedTask)=>{
            // Update the task ID in the board if it was created
            if (!isValidUUID(draggedTask.task.id)) {
                setBoard((prevBoard)=>prevBoard.map((col)=>({
                            ...col,
                            tasks: col.tasks.map((t)=>t.id === draggedTask.task.id ? {
                                    ...t,
                                    id: updatedTask.id
                                } : t)
                        })));
            }
        }).catch((error)=>{
            console.error("[v0] Failed to update task stage:", error);
            // Revert the UI change on error
            setBoard(previousBoard);
            alert("Failed to save changes. Please try again.");
        });
    };
    const handleToggleEpisode = async (columnId, taskId, episodeId)=>{
        const actualColumnId = mapColumnId(columnId);
        // Set loading state immediately for UI feedback
        const newBoard = board.map((col)=>{
            if (col.id === actualColumnId) {
                return {
                    ...col,
                    tasks: col.tasks.map((task)=>{
                        if (task.id === taskId) {
                            return {
                                ...task,
                                loading: true
                            };
                        }
                        return task;
                    })
                };
            }
            return col;
        });
        setBoard(newBoard);
        // Find the episode and task
        const task = board.find((col)=>col.id === actualColumnId)?.tasks.find((t)=>t.id === taskId);
        if (!task) return;
        // Toggle episode locally
        const updatedTask = {
            ...task,
            episodes: task.episodes.map((ep)=>ep.id === episodeId ? {
                    ...ep,
                    completed: !ep.completed
                } : ep)
        };
        // Send to backend - ensure task exists first if it has a non-UUID ID
        try {
            const completedEpisodes = updatedTask.episodes.filter((ep)=>ep.completed).map((ep)=>ep.number);
            // Get the current stage for the task
            const currentColumn = board.find((col)=>col.id === actualColumnId);
            const currentTask = currentColumn?.tasks.find((t)=>t.id === taskId);
            const currentStage = currentTask?.stage || "Backlog";
            // Ensure task exists in database
            const dbTaskId = await ensureTaskExists(updatedTask, currentStage);
            const response = await fetch(`/api/tasks/${dbTaskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completedEpisodes
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to update: ${response.statusText}`);
            }
            const savedTask = await response.json();
            // Update UI with final state - update task ID if it was created
            const finalBoard = board.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === taskId ? {
                                ...updatedTask,
                                id: dbTaskId,
                                loading: false
                            } : t)
                    };
                }
                return col;
            });
            setBoard(finalBoard);
        } catch (error) {
            console.error("[v0] Failed to update episode:", error);
            // Revert on error
            setBoard(newBoard.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === taskId ? {
                                ...t,
                                loading: false
                            } : t)
                    };
                }
                return col;
            }));
            alert("Failed to save episode progress. Please try again.");
        }
    };
    const handleToggleSubtask = (columnId, taskId, subtaskId)=>{
        const newBoard = board.map((col)=>{
            if (col.id === columnId) {
                return {
                    ...col,
                    tasks: col.tasks.map((task)=>{
                        if (task.id === taskId) {
                            return {
                                ...task,
                                subtasks: task.subtasks.map((st)=>st.id === subtaskId ? {
                                        ...st,
                                        completed: !st.completed
                                    } : st)
                            };
                        }
                        return task;
                    })
                };
            }
            return col;
        });
        setBoard(newBoard);
    };
    const handleEditTask = (task, columnId)=>{
        setEditingTask({
            task,
            columnId
        });
    };
    const handleUpdateStatus = async (columnId, taskId, status)=>{
        const actualColumnId = mapColumnId(columnId);
        try {
            // Find the task to get its current stage
            const currentColumn = board.find((col)=>col.id === actualColumnId);
            const currentTask = currentColumn?.tasks.find((t)=>t.id === taskId);
            if (!currentTask) return;
            const currentStage = currentTask.stage || "Backlog";
            // Ensure task exists in database
            const dbTaskId = await ensureTaskExists(currentTask, currentStage);
            const response = await fetch(`/api/tasks/${dbTaskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to update status: ${response.statusText}`);
            }
            // Update UI
            const newBoard = board.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === taskId ? {
                                ...t,
                                status
                            } : t)
                    };
                }
                return col;
            });
            setBoard(newBoard);
        } catch (error) {
            console.error("[v0] Failed to update status:", error);
            // Revert the status change on error
            const currentColumn = board.find((col)=>col.id === actualColumnId);
            const currentTask = currentColumn?.tasks.find((t)=>t.id === taskId);
            const newBoard = board.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === taskId ? {
                                ...t,
                                status: currentTask?.status || null
                            } : t)
                    };
                }
                return col;
            });
            setBoard(newBoard);
        }
    };
    const handleUpdateNote = async (columnId, taskId, notes)=>{
        const actualColumnId = mapColumnId(columnId);
        try {
            // Find the task to get its current stage
            const currentColumn = board.find((col)=>col.id === actualColumnId);
            const currentTask = currentColumn?.tasks.find((t)=>t.id === taskId);
            if (!currentTask) return;
            const currentStage = currentTask.stage || "Backlog";
            // Ensure task exists in database
            const dbTaskId = await ensureTaskExists(currentTask, currentStage);
            const response = await fetch(`/api/tasks/${dbTaskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notes
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to update note: ${response.statusText}`);
            }
            // Update UI
            const newBoard = board.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === taskId ? {
                                ...t,
                                notes
                            } : t)
                    };
                }
                return col;
            });
            setBoard(newBoard);
        } catch (error) {
            console.error("[v0] Failed to update note:", error);
            // Revert the note change on error
            const currentColumn = board.find((col)=>col.id === actualColumnId);
            const currentTask = currentColumn?.tasks.find((t)=>t.id === taskId);
            const newBoard = board.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === taskId ? {
                                ...t,
                                notes: currentTask?.notes || ""
                            } : t)
                    };
                }
                return col;
            });
            setBoard(newBoard);
        }
    };
    const handleCreateTask = async (taskData)=>{
        try {
            // Create task in database
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: taskData.title,
                    description: taskData.description,
                    duration: taskData.duration || "00:10:00",
                    category: taskData.category,
                    status: taskData.status,
                    stage: taskData.stage,
                    episodeRanges: taskData.episodeRanges,
                    completedEpisodes: [],
                    billingMonth: taskData.billingMonth || "December"
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to create task: ${response.statusText}`);
            }
            const savedTask = await response.json();
            // Transform the saved task to UI format
            const newTask = {
                id: savedTask.id,
                title: savedTask.title,
                description: savedTask.description,
                episodeRanges: savedTask.episode_ranges ? savedTask.episode_ranges.split(",") : [],
                category: savedTask.category,
                status: savedTask.status,
                stage: savedTask.stage || "Backlog",
                notes: savedTask.notes || "",
                created_at: savedTask.created_at || savedTask.createdAt || null,
                duration: savedTask.duration || "00:10:00",
                billingMonth: savedTask.billing_month || "December",
                episodes: parseCompletedEpisodes(savedTask.episode_ranges || "", savedTask.completed_episodes || "[]"),
                subtasks: [],
                attachments: [],
                progress: savedTask.progress ? typeof savedTask.progress === 'string' ? JSON.parse(savedTask.progress) : savedTask.progress : {}
            };
            // Map stage to column ID
            const stageToColumnId = {
                Backlog: "backlog",
                "In Progress": "in-progress",
                Finished: "finished",
                Revision: "revision",
                "Customer Revision": "customer-revision",
                Done: "done"
            };
            const columnId = stageToColumnId[newTask.stage || "Backlog"] || "backlog";
            // Add task to the appropriate column
            const newBoard = board.map((col)=>{
                if (col.id === columnId) {
                    return {
                        ...col,
                        tasks: [
                            ...col.tasks,
                            newTask
                        ]
                    };
                }
                return col;
            });
            setBoard(sortFinishedColumn(newBoard));
            setCreatingTask(false);
        } catch (error) {
            console.error("[v0] Failed to create task:", error);
            alert("Failed to create task. Please try again.");
        }
    };
    const handleDeleteTask = async (taskId)=>{
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to delete task: ${response.statusText}`);
            }
            // Remove task from board
            const newBoard = board.map((col)=>({
                    ...col,
                    tasks: col.tasks.filter((t)=>t.id !== taskId)
                }));
            setBoard(newBoard);
            setEditingTask(null);
        } catch (error) {
            console.error("[v0] Failed to delete task:", error);
            alert("Failed to delete task. Please try again.");
        }
    };
    const handleSaveTask = async (updatedTask)=>{
        try {
            // Get the current stage for the task
            const actualColumnId = editingTask?.columnId ? mapColumnId(editingTask.columnId) : undefined;
            const currentColumn = actualColumnId ? board.find((col)=>col.id === actualColumnId) : undefined;
            const currentTask = currentColumn?.tasks.find((t)=>t.id === updatedTask.id);
            const currentStage = currentTask?.stage || updatedTask.stage || "Backlog";
            // Ensure task exists in database
            const dbTaskId = await ensureTaskExists(updatedTask, currentStage);
            const response = await fetch(`/api/tasks/${dbTaskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: updatedTask.title,
                    description: updatedTask.description,
                    category: updatedTask.category,
                    status: updatedTask.status,
                    episodeRanges: updatedTask.episodeRanges,
                    duration: updatedTask.duration,
                    billingMonth: updatedTask.billingMonth
                })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                throw new Error(errorData.error || `Failed to save: ${response.statusText}`);
            }
            const savedTask = await response.json();
            const newBoard = board.map((col)=>{
                if (col.id === actualColumnId) {
                    return {
                        ...col,
                        tasks: col.tasks.map((t)=>t.id === updatedTask.id ? {
                                ...updatedTask,
                                id: dbTaskId
                            } : t)
                    };
                }
                return col;
            });
            setBoard(sortFinishedColumn(newBoard));
            setEditingTask(null);
        } catch (error) {
            console.error("[v0] Failed to save task:", error);
            alert("Failed to save task changes. Please try again.");
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 text-center",
            children: "Loading tasks..."
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
            lineNumber: 814,
            columnNumber: 12
        }, this);
    }
    // Separate columns into rows
    const backlogColumn = filteredBoard.find((col)=>col.id === "backlog");
    const inProgressColumn = filteredBoard.find((col)=>col.id === "in-progress");
    const row2Columns = filteredBoard.filter((col)=>[
            "finished",
            "revision",
            "customer-revision"
        ].includes(col.id));
    const doneColumn = filteredBoard.find((col)=>col.id === "done");
    // Split In Progress tasks into 2 groups, distributing to emptier column first
    // Sort tasks by created_at (newest first)
    const inProgressTasks = [
        ...inProgressColumn?.tasks || []
    ].sort((a, b)=>{
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA // Newest first
        ;
    });
    const inProgressCol1 = [];
    const inProgressCol2 = [];
    // Distribute tasks to keep columns balanced (emptier column gets priority)
    inProgressTasks.forEach((task, index)=>{
        if (inProgressCol1.length <= inProgressCol2.length) {
            inProgressCol1.push(task);
        } else {
            inProgressCol2.push(task);
        }
    });
    // Split Done tasks into 3 groups, distributing to emptier column first
    // Sort tasks by created_at (newest first)
    const doneTasks = [
        ...doneColumn?.tasks || []
    ].sort((a, b)=>{
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA // Newest first
        ;
    });
    const doneCol1 = [];
    const doneCol2 = [];
    const doneCol3 = [];
    // Distribute tasks to keep columns balanced (emptier column gets priority)
    doneTasks.forEach((task, index)=>{
        if (doneCol1.length <= doneCol2.length && doneCol1.length <= doneCol3.length) {
            doneCol1.push(task);
        } else if (doneCol2.length <= doneCol3.length) {
            doneCol2.push(task);
        } else {
            doneCol3.push(task);
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-8 h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-6 h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-6",
                            children: [
                                backlogColumn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$kanban$2d$column$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KanbanColumn"], {
                                    column: backlogColumn,
                                    onDragStart: handleDragStart,
                                    onDragOver: handleDragOver,
                                    onDrop: (e, columnId)=>handleDrop(e, columnId),
                                    onDragEnd: handleDragEnd,
                                    onToggleEpisode: handleToggleEpisode,
                                    onToggleSubtask: handleToggleSubtask,
                                    onEditTask: handleEditTask,
                                    onUpdateNote: handleUpdateNote,
                                    onUpdateStatus: handleUpdateStatus
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                    lineNumber: 874,
                                    columnNumber: 15
                                }, this),
                                inProgressColumn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 flex flex-col bg-muted/30 rounded-lg p-4 min-h-96",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4",
                                            children: inProgressColumn.title
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                            lineNumber: 891,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 grid grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col space-y-3 overflow-y-auto pr-2",
                                                    onDragOver: handleDragOver,
                                                    onDrop: (e)=>{
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDrop(e, "in-progress");
                                                    },
                                                    children: [
                                                        inProgressCol1.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                draggable: true,
                                                                onMouseDown: (e)=>{
                                                                    const cardElement = e.currentTarget.querySelector('[data-editing-note="true"]');
                                                                    if (cardElement) {
                                                                        e.currentTarget.setAttribute('draggable', 'false');
                                                                        setTimeout(()=>{
                                                                            e.currentTarget?.setAttribute('draggable', 'true');
                                                                        }, 100);
                                                                    }
                                                                },
                                                                onDragStart: (e)=>{
                                                                    const target = e.target;
                                                                    const wrapper = e.currentTarget;
                                                                    const cardElement = wrapper.querySelector('[data-editing-note="true"]');
                                                                    if (cardElement || target.closest('[data-editing-note="true"]') || target.closest("button") || target.closest("textarea") || target.closest("input") || target.closest("[role='button']") || target.closest(".editorjs-note-container") || target.closest(".codex-editor") || target.closest(".ce-block") || target.closest(".ce-toolbar") || target.closest(".ce-popover") || target.closest(".ce-inline-toolbar") || target.closest(".tiptap-note-editor") || target.closest(".ProseMirror") || target.closest(".group\\/note")) {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        return false;
                                                                    }
                                                                    handleDragStart(task, "in-progress");
                                                                },
                                                                onDragEnd: handleDragEnd,
                                                                onDragOver: (e)=>{
                                                                    // Prevent cards from accepting drops
                                                                    e.stopPropagation();
                                                                },
                                                                onDrop: (e)=>{
                                                                    // Prevent cards from accepting drops
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                },
                                                                className: "cursor-grab active:cursor-grabbing",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskCard"], {
                                                                    task: task,
                                                                    columnId: "in-progress",
                                                                    onToggleEpisode: handleToggleEpisode,
                                                                    onToggleSubtask: handleToggleSubtask,
                                                                    onEditTask: handleEditTask,
                                                                    onUpdateNote: handleUpdateNote,
                                                                    onUpdateStatus: handleUpdateStatus
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                    lineNumber: 959,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, task.id, false, {
                                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                lineNumber: 907,
                                                                columnNumber: 23
                                                            }, this)),
                                                        inProgressCol1.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center h-20 text-muted-foreground text-sm",
                                                            children: "No tasks yet"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 971,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                    lineNumber: 897,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col space-y-3 overflow-y-auto pr-2",
                                                    onDragOver: handleDragOver,
                                                    onDrop: (e)=>{
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDrop(e, "in-progress");
                                                    },
                                                    children: [
                                                        inProgressCol2.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                draggable: true,
                                                                onMouseDown: (e)=>{
                                                                    const cardElement = e.currentTarget.querySelector('[data-editing-note="true"]');
                                                                    if (cardElement) {
                                                                        e.currentTarget.setAttribute('draggable', 'false');
                                                                        setTimeout(()=>{
                                                                            e.currentTarget?.setAttribute('draggable', 'true');
                                                                        }, 100);
                                                                    }
                                                                },
                                                                onDragStart: (e)=>{
                                                                    const target = e.target;
                                                                    const wrapper = e.currentTarget;
                                                                    const cardElement = wrapper.querySelector('[data-editing-note="true"]');
                                                                    if (cardElement || target.closest('[data-editing-note="true"]') || target.closest("button") || target.closest("textarea") || target.closest("input") || target.closest("[role='button']") || target.closest(".editorjs-note-container") || target.closest(".codex-editor") || target.closest(".ce-block") || target.closest(".ce-toolbar") || target.closest(".ce-popover") || target.closest(".ce-inline-toolbar") || target.closest(".tiptap-note-editor") || target.closest(".ProseMirror") || target.closest(".group\\/note")) {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        return false;
                                                                    }
                                                                    handleDragStart(task, "in-progress");
                                                                },
                                                                onDragEnd: handleDragEnd,
                                                                onDragOver: (e)=>{
                                                                    // Prevent cards from accepting drops
                                                                    e.stopPropagation();
                                                                },
                                                                onDrop: (e)=>{
                                                                    // Prevent cards from accepting drops
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                },
                                                                className: "cursor-grab active:cursor-grabbing",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskCard"], {
                                                                    task: task,
                                                                    columnId: "in-progress",
                                                                    onToggleEpisode: handleToggleEpisode,
                                                                    onToggleSubtask: handleToggleSubtask,
                                                                    onEditTask: handleEditTask,
                                                                    onUpdateNote: handleUpdateNote,
                                                                    onUpdateStatus: handleUpdateStatus
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                    lineNumber: 1037,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, task.id, false, {
                                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                lineNumber: 985,
                                                                columnNumber: 23
                                                            }, this)),
                                                        inProgressCol2.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center h-20 text-muted-foreground text-sm",
                                                            children: "No tasks yet"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1049,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                    lineNumber: 975,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                            lineNumber: 895,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                    lineNumber: 889,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                            lineNumber: 871,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-6",
                            children: row2Columns.map((column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$kanban$2d$column$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KanbanColumn"], {
                                    column: column,
                                    onDragStart: handleDragStart,
                                    onDragOver: handleDragOver,
                                    onDrop: (e, columnId)=>handleDrop(e, columnId),
                                    onDragEnd: handleDragEnd,
                                    onToggleEpisode: handleToggleEpisode,
                                    onToggleSubtask: handleToggleSubtask,
                                    onEditTask: handleEditTask,
                                    onUpdateNote: handleUpdateNote,
                                    onUpdateStatus: handleUpdateStatus
                                }, column.id, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                    lineNumber: 1060,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                            lineNumber: 1058,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-6",
                            children: doneColumn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-3 flex flex-col bg-muted/30 rounded-lg p-4 min-h-96",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide",
                                                children: doneColumn.title
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                lineNumber: 1082,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setIsDoneExpanded(!isDoneExpanded),
                                                className: "flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors",
                                                title: isDoneExpanded ? "Collapse" : "Expand",
                                                children: isDoneExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1092,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Collapse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1093,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1097,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Expand"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1098,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                lineNumber: 1085,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                        lineNumber: 1081,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex-1",
                                        style: {
                                            maxHeight: isDoneExpanded ? '600px' : '300px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `h-full pr-2 ${isDoneExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`,
                                                style: isDoneExpanded ? {
                                                    scrollbarWidth: 'thin',
                                                    scrollbarColor: '#cbd5e1 transparent'
                                                } : {},
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col space-y-3",
                                                            onDragOver: handleDragOver,
                                                            onDrop: (e)=>{
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDrop(e, "done");
                                                            },
                                                            children: [
                                                                doneCol1.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        draggable: true,
                                                                        onMouseDown: (e)=>{
                                                                            const cardElement = e.currentTarget.querySelector('[data-editing-note="true"]');
                                                                            if (cardElement) {
                                                                                e.currentTarget.setAttribute('draggable', 'false');
                                                                                setTimeout(()=>{
                                                                                    e.currentTarget?.setAttribute('draggable', 'true');
                                                                                }, 100);
                                                                            }
                                                                        },
                                                                        onDragStart: (e)=>{
                                                                            const target = e.target;
                                                                            const wrapper = e.currentTarget;
                                                                            const cardElement = wrapper.querySelector('[data-editing-note="true"]');
                                                                            if (cardElement || target.closest('[data-editing-note="true"]') || target.closest("button") || target.closest("textarea") || target.closest("input") || target.closest("[role='button']") || target.closest(".tiptap-note-editor") || target.closest(".ProseMirror") || target.closest(".group\\/note")) {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                return;
                                                                            }
                                                                            handleDragStart(task, "done");
                                                                        },
                                                                        onDragEnd: handleDragEnd,
                                                                        onDragOver: (e)=>{
                                                                            e.stopPropagation();
                                                                        },
                                                                        onDrop: (e)=>{
                                                                            e.stopPropagation();
                                                                            e.preventDefault();
                                                                        },
                                                                        className: "cursor-grab active:cursor-grabbing",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskCard"], {
                                                                            task: task,
                                                                            columnId: "done",
                                                                            onToggleEpisode: handleToggleEpisode,
                                                                            onToggleSubtask: handleToggleSubtask,
                                                                            onEditTask: handleEditTask,
                                                                            onUpdateNote: handleUpdateNote,
                                                                            onUpdateStatus: handleUpdateStatus
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                            lineNumber: 1168,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, task.id, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                        lineNumber: 1125,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                doneCol1.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-center h-20 text-muted-foreground text-sm",
                                                                    children: "No tasks yet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                    lineNumber: 1180,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1115,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col space-y-3",
                                                            onDragOver: handleDragOver,
                                                            onDrop: (e)=>{
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDrop(e, "done");
                                                            },
                                                            children: [
                                                                doneCol2.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        draggable: true,
                                                                        onMouseDown: (e)=>{
                                                                            const cardElement = e.currentTarget.querySelector('[data-editing-note="true"]');
                                                                            if (cardElement) {
                                                                                e.currentTarget.setAttribute('draggable', 'false');
                                                                                setTimeout(()=>{
                                                                                    e.currentTarget?.setAttribute('draggable', 'true');
                                                                                }, 100);
                                                                            }
                                                                        },
                                                                        onDragStart: (e)=>{
                                                                            const target = e.target;
                                                                            const wrapper = e.currentTarget;
                                                                            const cardElement = wrapper.querySelector('[data-editing-note="true"]');
                                                                            if (cardElement || target.closest('[data-editing-note="true"]') || target.closest("button") || target.closest("textarea") || target.closest("input") || target.closest("[role='button']") || target.closest(".tiptap-note-editor") || target.closest(".ProseMirror") || target.closest(".group\\/note")) {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                return;
                                                                            }
                                                                            handleDragStart(task, "done");
                                                                        },
                                                                        onDragEnd: handleDragEnd,
                                                                        onDragOver: (e)=>{
                                                                            e.stopPropagation();
                                                                        },
                                                                        onDrop: (e)=>{
                                                                            e.stopPropagation();
                                                                            e.preventDefault();
                                                                        },
                                                                        className: "cursor-grab active:cursor-grabbing",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskCard"], {
                                                                            task: task,
                                                                            columnId: "done",
                                                                            onToggleEpisode: handleToggleEpisode,
                                                                            onToggleSubtask: handleToggleSubtask,
                                                                            onEditTask: handleEditTask,
                                                                            onUpdateNote: handleUpdateNote,
                                                                            onUpdateStatus: handleUpdateStatus
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                            lineNumber: 1237,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, task.id, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                        lineNumber: 1194,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                doneCol2.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-center h-20 text-muted-foreground text-sm",
                                                                    children: "No tasks yet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                    lineNumber: 1249,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1184,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col space-y-3",
                                                            onDragOver: handleDragOver,
                                                            onDrop: (e)=>{
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDrop(e, "done");
                                                            },
                                                            children: [
                                                                doneCol3.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        draggable: true,
                                                                        onMouseDown: (e)=>{
                                                                            const cardElement = e.currentTarget.querySelector('[data-editing-note="true"]');
                                                                            if (cardElement) {
                                                                                e.currentTarget.setAttribute('draggable', 'false');
                                                                                setTimeout(()=>{
                                                                                    e.currentTarget?.setAttribute('draggable', 'true');
                                                                                }, 100);
                                                                            }
                                                                        },
                                                                        onDragStart: (e)=>{
                                                                            const target = e.target;
                                                                            const wrapper = e.currentTarget;
                                                                            const cardElement = wrapper.querySelector('[data-editing-note="true"]');
                                                                            if (cardElement || target.closest('[data-editing-note="true"]') || target.closest("button") || target.closest("textarea") || target.closest("input") || target.closest("[role='button']") || target.closest(".tiptap-note-editor") || target.closest(".ProseMirror") || target.closest(".group\\/note")) {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                return;
                                                                            }
                                                                            handleDragStart(task, "done");
                                                                        },
                                                                        onDragEnd: handleDragEnd,
                                                                        onDragOver: (e)=>{
                                                                            e.stopPropagation();
                                                                        },
                                                                        onDrop: (e)=>{
                                                                            e.stopPropagation();
                                                                            e.preventDefault();
                                                                        },
                                                                        className: "cursor-grab active:cursor-grabbing",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$task$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TaskCard"], {
                                                                            task: task,
                                                                            columnId: "done",
                                                                            onToggleEpisode: handleToggleEpisode,
                                                                            onToggleSubtask: handleToggleSubtask,
                                                                            onEditTask: handleEditTask,
                                                                            onUpdateNote: handleUpdateNote,
                                                                            onUpdateStatus: handleUpdateStatus
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                            lineNumber: 1306,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, task.id, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                        lineNumber: 1263,
                                                                        columnNumber: 27
                                                                    }, this)),
                                                                doneCol3.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-center h-20 text-muted-foreground text-sm",
                                                                    children: "No tasks yet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                                    lineNumber: 1318,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                            lineNumber: 1253,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                    lineNumber: 1113,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                lineNumber: 1105,
                                                columnNumber: 19
                                            }, this),
                                            isDoneExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                                lineNumber: 1325,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                        lineNumber: 1104,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                                lineNumber: 1079,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                            lineNumber: 1077,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                    lineNumber: 869,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                lineNumber: 868,
                columnNumber: 7
            }, this),
            editingTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$edit$2d$task$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditTaskModal"], {
                task: editingTask.task,
                onSave: handleSaveTask,
                onDelete: handleDeleteTask,
                onClose: ()=>setEditingTask(null)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                lineNumber: 1335,
                columnNumber: 9
            }, this),
            creatingTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$create$2d$task$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreateTaskModal"], {
                onSave: handleCreateTask,
                onClose: ()=>setCreatingTask(false)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx",
                lineNumber: 1344,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(KanbanBoard, "45gfdE6XOx1Nn+OXA31RmSctiXE=");
_c = KanbanBoard;
var _c;
__turbopack_context__.k.register(_c, "KanbanBoard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// Dynamic import with SSR disabled to avoid "window is not defined" error
const BlockNotePopup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-popup.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.BlockNotePopup), {
    loadableGenerated: {
        modules: [
            "[project]/OneDrive/Desktop/v0-Alfa99-master/components/blocknote-popup.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = BlockNotePopup;
function Sidebar() {
    _s();
    const [showPresetPopup, setShowPresetPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEditorPopup, setShowEditorPopup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSaveNote = (data)=>{
        console.log("Note saved:", data);
        // You can handle the saved data here (e.g., send to API, store in state, etc.)
        alert(`Note "${data.title}" saved successfully! Check console for details.`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "w-20 bg-white border-r border-border flex flex-col items-center py-6 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg",
                        children: "S"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowPresetPopup(true),
                        className: "w-12 h-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group",
                        title: "Show Presets",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            className: "w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowEditorPopup(true),
                        className: "w-12 h-12 flex items-center justify-center rounded-lg hover:bg-muted transition-colors group",
                        title: "BlockNote Editor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            showPresetPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
                onClick: ()=>setShowPresetPopup(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold",
                                    children: "Presets"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowPresetPopup(false),
                                    className: "w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors",
                                    "aria-label": "Close",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-5 h-5 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                        lineNumber: 65,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                    lineNumber: 60,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-xl text-foreground",
                                            children: "DZ Preset"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pl-4 space-y-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "• NR SRT but Text Replacement is white Color 64/48"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                lineNumber: 75,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-xl text-foreground",
                                            children: "NR Preset"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pl-4 space-y-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: [
                                                    "• NR with ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-block w-4 h-4 rounded border border-border align-middle",
                                                        style: {
                                                            backgroundColor: '#fbf9da'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 31
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-foreground",
                                                        children: "#fbf9da"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 159
                                                    }, this),
                                                    " 64/48"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                lineNumber: 85,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-xl text-foreground",
                                            children: "JZ Preset"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                            lineNumber: 93,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pl-4 space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "• SUB Use preset with"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: [
                                                        "• Text Replacement JZ with ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-block w-4 h-4 rounded border border-border align-middle",
                                                            style: {
                                                                backgroundColor: '#E59B44'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                            lineNumber: 99,
                                                            columnNumber: 48
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-foreground",
                                                            children: "#E59B44"
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                            lineNumber: 99,
                                                            columnNumber: 176
                                                        }, this),
                                                        " 64/48"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                                    lineNumber: 98,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                            lineNumber: 94,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                            lineNumber: 70,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-t border-border bg-muted/30",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowPresetPopup(false),
                                className: "w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                    lineNumber: 53,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockNotePopup, {
                isOpen: showEditorPopup,
                onClose: ()=>setShowEditorPopup(false),
                onSave: handleSaveNote,
                title: "Quick Note"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Sidebar, "73IAY3hTRbZd5ud/OBzwAajW7D0=");
_c1 = Sidebar;
var _c, _c1;
__turbopack_context__.k.register(_c, "BlockNotePopup");
__turbopack_context__.k.register(_c1, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/date-fns/format.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Header({ onCreateTask, searchQuery = "", setSearchQuery }) {
    _s();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Your Task");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            setTitle(`Your Task in ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), "MMMM yyyy")}`);
        }
    }["Header.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-16 bg-white border-b border-border flex items-center justify-between px-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold text-foreground min-w-[200px]",
                children: title
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 max-w-xl mx-8 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Search tasks...",
                        value: searchQuery,
                        onChange: (e)=>setSearchQuery?.(e.target.value),
                        className: "w-full pl-9 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/billing",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this),
                                "Billing"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onCreateTask,
                        className: "bg-blue-500 hover:bg-blue-600 text-white",
                        children: "Add a task"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(Header, "g6Rb8jP/WlxZ9kYhoDqmwINBacI=");
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$kanban$2d$board$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/kanban-board.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/v0-Alfa99-master/components/header.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function Home() {
    _s();
    const [showCreateModal, setShowCreateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
                        onCreateTask: ()=>setShowCreateModal(true),
                        searchQuery: searchQuery,
                        setSearchQuery: setSearchQuery
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx",
                        lineNumber: 16,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$v0$2d$Alfa99$2d$master$2f$components$2f$kanban$2d$board$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KanbanBoard"], {
                            onCreateTaskTrigger: showCreateModal,
                            onCreateTaskHandled: ()=>setShowCreateModal(false),
                            searchQuery: searchQuery
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/v0-Alfa99-master/app/page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(Home, "fJsWUSfY11JWRMMarBZsV/siW5k=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_v0-Alfa99-master_4e520b0b._.js.map