/**
 * Tweaks Eleventy's markdown-it so that pages render the way they did under Jekyll (kramdown + rouge),
 * keeping existing anchor links and CSS working:
 *   - headings get GitHub-style ids ("How do I use Alpaca?" -> "how-do-i-use-alpaca")
 *   - code blocks / inline code get rouge's wrapper markup and classes
 *   - block-level HTML is passed through untouched up to its closing tag
 */
const slugify = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}_\- ]/gu, "").replace(/ /g, "-");

function headingIds(md)
{
    md.core.ruler.push("heading_ids", (state) => {
        const seen = {};
        const tokens = state.tokens;
        for (let i = 0; i < tokens.length; i++)
        {
            if (tokens[i].type !== "heading_open" || tokens[i].attrGet("id")) {
                continue;
            }
            const text = tokens[i + 1].children.filter((t) => t.type === "text" || t.type === "code_inline").map((t) => t.content).join("");
            let id = slugify(text) || "section";
            if (seen[id] !== undefined) {
                id = `${id}-${++seen[id]}`;
            } else {
                seen[id] = 0;
            }
            tokens[i].attrSet("id", id);
        }
    });
}

function rougeCode(md)
{
    const escape = md.utils.escapeHtml;
    const block = (tokens, idx) => {
        const token = tokens[idx];
        const lang = (token.info || "").trim().split(/\s+/)[0] || "plaintext";
        return `<div class="language-${escape(lang)} highlighter-rouge"><div class="highlight"><pre class="highlight"><code>${escape(token.content)}</code></pre></div></div>\n`;
    };
    md.renderer.rules.fence = block;
    md.renderer.rules.code_block = block;
    md.renderer.rules.code_inline = (tokens, idx) => `<code class="language-plaintext highlighter-rouge">${escape(tokens[idx].content)}</code>`;
}

// Like kramdown, treat a block-level HTML element as raw HTML all the way to its matching closing tag
// (CommonMark ends HTML blocks at the first blank line, which mangles the site's indented, multi-paragraph HTML).
const BLOCK_TAGS = "address|article|aside|blockquote|center|dd|details|div|dl|dt|fieldset|figure|footer|form|h[1-6]|header|nav|ol|p|pre|section|table|ul";

function htmlBlocks(md)
{
    const OPEN = new RegExp(`^<(${BLOCK_TAGS})(?=[\\s>/])`, "i");

    md.block.ruler.before("html_block", "kramdown_html_block", (state, startLine, endLine, silent) => {
        const lineText = (n) => state.src.slice(state.bMarks[n] + state.tShift[n], state.eMarks[n]);
        if (state.sCount[startLine] - state.blkIndent >= 4) {
            return false;
        }
        const match = OPEN.exec(lineText(startLine));
        if (!match) {
            return false;
        }

        const tag = match[1].toLowerCase();
        const opens = new RegExp(`<${tag}(?=[\\s>])`, "gi");
        const closes = new RegExp(`</${tag}\\s*>`, "gi");

        let depth = 0;
        let line = startLine;
        for (; line < endLine; line++)
        {
            const text = lineText(line);
            depth += (text.match(opens) || []).length - (text.match(closes) || []).length;
            if (depth <= 0) {
                break;
            }
        }
        if (depth > 0) {
            // no matching close tag - let the standard rules deal with it
            return false;
        }
        if (silent) {
            return true;
        }

        state.line = line + 1;
        const token = state.push("html_block", "", 0);
        token.map = [startLine, state.line];
        token.content = state.getLines(startLine, state.line, state.blkIndent, true);
        return true;
    }, { alt: ["paragraph", "reference", "blockquote"] });
}

export default function jekyllMarkdown(md)
{
    // Eleventy disables indented code blocks by default; kramdown supports them
    md.enable("code");
    md.use(htmlBlocks);
    md.use(headingIds);
    md.use(rougeCode);
}
