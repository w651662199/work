import Command from './command'
import {
    mergeArray,
    getDescendantTextNodes,
    getAfterStartDescendantTextNodes,
    getBeforeEndDescendantTextNodes,
    getParentBlockNode,
    isInlineElement
} from './util'

// for IE 11
if (!Text.prototype.contains) {
    Text.prototype.contains = function contains(otherNode) {
        return this === otherNode
    }
}


/**
 * Created by peak on 2017/2/14.
 */
export default class RangeHandler {
    /**
     * build range handler
     * @param {Range} range
     */
    constructor(range) {
        if (!range || !(range instanceof Range)) {
            throw new TypeError('cant\'t resolve range')
        }
        this.range = range
    }


    /**
     * find all the text nodes in range
     */
    getAllTextNodesInRange() {
        const startContainer = this.range.startContainer
        const endContainer = this.range.endContainer
        const rootEl = this.range.commonAncestorContainer
        const textNodes = []

        if (startContainer === endContainer) {
            if (startContainer.nodeType === Node.TEXT_NODE) {
                return [startContainer]
            }
            const childNodes = startContainer.childNodes
            for (let i = this.range.startOffset; i < this.range.endOffset; i++) {
                mergeArray(textNodes, getDescendantTextNodes(childNodes[i]))
            }
            return textNodes
        }

        let startIndex = 0
        let endIndex = 0
        for (let i = 0; i < rootEl.childNodes.length; i++) {
            const node = rootEl.childNodes[i]
            if (node.contains(startContainer)) {
                startIndex = i
            }
            if (node.contains(endContainer)) {
                endIndex = i
            }
        }

        for (let i = startIndex; i <= endIndex; i++) {
            const node = rootEl.childNodes[i]
            if (i === startIndex) {
                if (node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node)
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // textNodes.push(node)
                    mergeArray(textNodes, getAfterStartDescendantTextNodes(node, startContainer))
                }
            } else if (i === endIndex) {
                if (node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node)
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // textNodes.push(node)
                    mergeArray(textNodes, getBeforeEndDescendantTextNodes(node, endContainer))
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // textNodes.push(node)
                mergeArray(textNodes, getDescendantTextNodes(node))
            }
        }
        return textNodes
    }

    /**
     * execute edit command
     * @param {String} command
     * @param arg
     */
    execCommand(command, arg) {
        document.execCommand('styleWithCSS', false, true);
        switch (command) {

            case Command.JUSTIFY_LEFT: {
                document.execCommand(Command.JUSTIFY_LEFT, false, arg)
                break
            }

            case Command.JUSTIFY_RIGHT: {
                document.execCommand(Command.JUSTIFY_RIGHT, false, arg)
                break
            }

            case Command.JUSTIFY_CENTER: {
                document.execCommand(Command.JUSTIFY_CENTER, false, arg)
                break
            }

            case Command.FORE_COLOR: {
                document.execCommand(Command.FORE_COLOR, false, arg)
                break
            }
            case Command.BACK_COLOR: {
                document.execCommand(Command.BACK_COLOR, false, arg)
                break
            }
            case Command.REMOVE_FORMAT: {
                document.execCommand(Command.REMOVE_FORMAT, false, arg)
                break
            }
            case Command.FONT_NAME: {
                document.execCommand(Command.FONT_NAME, false, arg)
                break
            }
            case Command.FONT_SIZE: {
                document.execCommand(Command.FONT_SIZE, false, arg)
                break
            }
            case Command.FORMAT_BLOCK: {
                if (document.execCommand(Command.FORMAT_BLOCK, false, arg)) {
                    break
                }
                // hack
                const element = document.createElement(arg)
                this.range.surroundContents(element)
                break
            }
            case Command.LINE_HEIGHT: {
                const textNodes = this.getAllTextNodesInRange()
                textNodes.forEach((textNode) => {
                    const parentBlock = getParentBlockNode(textNode)
                    if (parentBlock) {
                        parentBlock.style.lineHeight = arg
                    }
                })
                break
            }
            case Command.INSERT_HORIZONTAL_RULE: {
                document.execCommand(Command.INSERT_HORIZONTAL_RULE, false)
                break
            }
            case Command.INSERT_IMAGE: {
                document.execCommand(Command.INSERT_IMAGE, false, arg)
                break
            }
            case Command.CREATE_LINK: {
                document.execCommand(Command.CREATE_LINK, false, arg)
                break
            }
            case Command.INSERT_ORDERED_LIST: {
                document.execCommand(Command.INSERT_ORDERED_LIST, false, arg)
                break
            }
            case Command.INSERT_UNORDERED_LIST: {
                document.execCommand(Command.INSERT_UNORDERED_LIST, false, arg)
                break
            }
            case Command.INSERT_HTML: {
                if (document.execCommand(Command.INSERT_HTML, false, arg)) {
                    break
                }
                // hack
                const fragment = document.createDocumentFragment()
                const div = document.createElement('div')
                div.innerHTML = arg
                if (div.hasChildNodes()) {
                    for (let i = 0; i < div.childNodes.length; i++) {
                        fragment.appendChild(div.childNodes[i].cloneNode(true))
                    }
                }
                this.range.deleteContents()
                this.range.insertNode(fragment)
                break
            }
            case Command.BOLD: {
                document.execCommand(Command.BOLD, false, arg)
                break
            }
            case Command.ITALIC: {
                document.execCommand(Command.ITALIC, false)
                break
            }
            case Command.UNDERLINE: {
                document.execCommand(Command.UNDERLINE, false)
                break
            }
            case Command.STRIKE_THROUGH: {
                document.execCommand(Command.STRIKE_THROUGH, false)
                break
            }
            case Command.SUBSCRIPT: {
                document.execCommand(Command.SUBSCRIPT, false)
                break
            }
            case Command.SUPERSCRIPT: {
                document.execCommand(Command.SUPERSCRIPT, false)
                break
            }
            case Command.UNDO: {
                document.execCommand(Command.UNDO, false)
                break
            }
            case Command.UNLINK: {
                document.execCommand(Command.UNLINK, false)
                break
            }
            default: {
                document.execCommand(command, false, arg)
                break
            }
        }
    }
}