'use client'

import { useState } from 'react'

// 排版函数
function formatArticle(text: string): string {
    if (!text.trim()) return ''

    const lines = text.split('\n').filter(line => line.trim())
    let html = ''

    lines.forEach((line, index) => {
        const trimmedLine = line.trim()

        // 第一行作为标题
        if (index === 0) {
            html += `<h1 style="font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 20px; color: #333;">${trimmedLine}</h1>`
            html += `<div style="text-align: center; margin: 20px 0; color: #ccc;">···</div>`
            return
        }

        // 引用块
        if (/^[「【]/.test(trimmedLine) && /[」】]$/.test(trimmedLine)) {
            const content = trimmedLine.replace(/^[「【」】]/g, '')
            html += `<blockquote style="border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 20px 0; background: #f0f7ff; color: #666; border-radius: 0 8px 8px 0;">${content}</blockquote>`
            return
        }

        // 列表项
        if (/^\d+[.、]/.test(trimmedLine)) {
            html += `<p style="margin-bottom: 12px; padding-left: 20px; position: relative; line-height: 1.8; color: #333;"><span style="position: absolute; left: 0; color: #3b82f6;">●</span>${trimmedLine}</p>`
            return
        }

        // 重点文字
        if (/\*\*.*\*\*/.test(trimmedLine)) {
            const highlighted = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<span style="background: linear-gradient(to top, #fef08a 50%, transparent 50%); padding: 0 4px;">$1</span>')
            html += `<p style="margin-bottom: 16px; text-indent: 2em; line-height: 1.8; color: #333;">${highlighted}</p>`
            return
        }

        // 普通段落
        html += `<p style="margin-bottom: 16px; text-indent: 2em; line-height: 1.8; color: #333;">${trimmedLine}</p>`
    })

    return `<section style="padding: 20px 16px; font-size: 16px; max-width: 100%; word-wrap: break-word;">${html}</section>`
}

// 复制函数
function copyToClipboard(html: string) {
    if (!html) {
        alert('请先生成排版内容')
        return
    }

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    document.body.appendChild(tempDiv)

    const range = document.createRange()
    range.selectNodeContents(tempDiv)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    document.execCommand('copy')
    document.body.removeChild(tempDiv)

    alert('复制成功！现在可以粘贴到公众号编辑器了')
}

export default function Home() {
    const [inputText, setInputText] = useState('')
    const [outputHtml, setOutputHtml] = useState('')

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-center mb-8">
                公众号一键排版工具
            </h1>
            <button
                onClick={() => {
                    const sampleText = `这是一个示例标题

这是第一段正文内容，公众号文章通常需要排版美观，阅读体验才会好。

「这是一句引用的话，用来强调重要观点」

1. 这是第一个列表项
2. 这是第二个列表项

这是一段包含**重点内容**的文字。

最后是结尾段落。`
                    setInputText(sampleText)
                    setOutputHtml(formatArticle(sampleText))
                }}
                className="text-blue-500 underline text-sm mb-4"
            >
                加载示例文章
            </button>

            <div className="flex gap-4 max-w-6xl mx-auto">
                <div className="flex-1">
                    <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-sm text-gray-500 mb-2">粘贴原文</div>
                        <textarea
                            value={inputText}
                            onChange={(e) => {
                                const text = e.target.value
                                setInputText(text)
                                setOutputHtml(formatArticle(text))
                            }}
                            className="w-full h-96 border rounded p-3 resize-none"
                            placeholder="在这里粘贴你的文章..."
                        />
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-sm text-gray-500 mb-2">排版预览</div>
                        <div
                            className="w-full h-96 border rounded p-3 overflow-auto"
                            dangerouslySetInnerHTML={{ __html: outputHtml }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={() => setOutputHtml(formatArticle(inputText))}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    一键排版
                </button>
                <button
                    onClick={() => copyToClipboard(outputHtml)}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                    复制到公众号
                </button>
            </div>
        </main>
    )
}
