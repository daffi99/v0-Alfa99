"use client"

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import React, { useState, useCallback, useRef, useEffect } from 'react'

// React component for the toggle list
const ToggleListComponent = ({ node, updateAttributes }: any) => {
    const [isOpen, setIsOpen] = useState(node.attrs.open ?? true)
    const [contentText, setContentText] = useState(node.attrs.content || '')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Sync with node attrs when they change externally
    useEffect(() => {
        if (node.attrs.content !== contentText) {
            setContentText(node.attrs.content || '')
        }
    }, [node.attrs.content])

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const newState = !isOpen
        setIsOpen(newState)
        updateAttributes({ open: newState })
    }, [isOpen, updateAttributes])

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        setContentText(text)
        updateAttributes({ content: text })
    }, [updateAttributes])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
        }
    }, [contentText, isOpen])

    return (
        <NodeViewWrapper className="toggle-list-wrapper" data-open={isOpen}>
            <div className="toggle-list-header">
                <span
                    className={`toggle-list-arrow ${isOpen ? 'open' : ''}`}
                    onClick={handleToggle}
                    contentEditable={false}
                    role="button"
                    tabIndex={0}
                >
                    ▶
                </span>
                <NodeViewContent className="toggle-list-title" />
            </div>
            {isOpen && (
                <div className="toggle-list-content-wrapper" contentEditable={false}>
                    <textarea
                        ref={textareaRef}
                        className="toggle-list-textarea"
                        value={contentText}
                        onChange={handleContentChange}
                        placeholder="Type content here..."
                        rows={1}
                    />
                </div>
            )}
        </NodeViewWrapper>
    )
}

// Declare the command type with unique name
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        collapsibleBlock: {
            insertCollapsibleBlock: () => ReturnType
        }
    }
}

// Custom Toggle List Extension
export const ToggleList = Node.create({
    name: 'collapsibleBlock',

    group: 'block',

    content: 'inline*',

    defining: true,

    addAttributes() {
        return {
            open: {
                default: true,
                parseHTML: element => element.getAttribute('data-open') === 'true',
                renderHTML: attributes => ({
                    'data-open': attributes.open ? 'true' : 'false',
                }),
            },
            content: {
                default: '',
                parseHTML: element => element.getAttribute('data-content') || '',
                renderHTML: attributes => ({
                    'data-content': attributes.content || '',
                }),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="collapsibleBlock"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'collapsibleBlock' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ToggleListComponent)
    },

    addCommands() {
        return {
            insertCollapsibleBlock: () => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    content: [{ type: 'text', text: 'Toggle title' }],
                    attrs: { open: true, content: '' },
                })
            },
        }
    },
})
