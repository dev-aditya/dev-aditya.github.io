import markdown
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
import yaml
from html import escape, unescape
import re

# Configuration
BASE_DIR = Path(__file__).resolve().parent
MD_DIR = BASE_DIR / "md"
TEMPLATE_DIR = BASE_DIR / "templates"
OUTPUT_DIR = BASE_DIR


FIRST_H1_RE = re.compile(r"\s*<h1(?P<attrs>[^>]*)>(?P<title>.*?)</h1>\s*", re.DOTALL)
HTML_TAG_RE = re.compile(r"<[^>]+>")


def plain_text_from_html(html):
    """Extract plain text from a small rendered HTML fragment."""
    return unescape(HTML_TAG_RE.sub("", html)).strip()


def remove_first_h1(html_content):
    """Remove the leading content H1 so the template owns the post title."""
    match = FIRST_H1_RE.search(html_content)
    if not match:
        return html_content, None

    title = plain_text_from_html(match.group("title"))
    cleaned_content = html_content[:match.start()] + html_content[match.end():]
    return cleaned_content.lstrip(), title


def collect_toc_entries(tokens, min_level=2, max_level=4):
    """Collect Markdown TOC tokens in the heading range used for article nav."""
    entries = []

    for token in tokens:
        level = token.get("level", 0)
        children = collect_toc_entries(token.get("children", []), min_level, max_level)

        if min_level <= level <= max_level:
            entries.append((token, children))
        elif children:
            entries.extend(children)

    return entries


def render_toc_entries(entries):
    """Render collected TOC entries as a compact ordered list."""
    if not entries:
        return ""

    items = []
    for token, children in entries:
        name = escape(unescape(token.get("name", "")))
        anchor = escape(token.get("id", ""))
        child_html = render_toc_entries(children)
        items.append(f'<li><a href="#{anchor}">{name}</a>{child_html}</li>')

    return "<ol>\n" + "\n".join(items) + "\n</ol>"


def render_toc(tokens, min_level=2, max_level=4):
    """Render a compact table of contents from Markdown TOC tokens."""
    entries = collect_toc_entries(tokens, min_level, max_level)
    if not entries:
        return ""

    return render_toc_entries(entries)


def protect_math(md_content):
    """Replace LaTeX spans/blocks with placeholders before plain Markdown runs."""
    math_tokens = []

    def store(kind, value):
        token = f"@@MATH{len(math_tokens)}@@"
        math_tokens.append((token, kind, value.strip()))
        return token

    protected = re.sub(
        r"\$\$(.*?)\$\$",
        lambda match: store("display", match.group(1)),
        md_content,
        flags=re.DOTALL,
    )
    protected = re.sub(
        r"(?<!\\)\$([^\n$]+?)(?<!\\)\$",
        lambda match: store("inline", match.group(1)),
        protected,
    )

    return protected, math_tokens


def restore_math(html_content, math_tokens):
    """Restore placeholders as the same arithmatex markup pymdownx emits."""
    for token, kind, value in math_tokens:
        safe_value = escape(value)

        if kind == "display":
            if "\n" in value:
                rendered = f'<div class="arithmatex">\\[\n{safe_value}\n\\]</div>'
            else:
                rendered = f'<div class="arithmatex">\\[ {safe_value} \\]</div>'
            html_content = html_content.replace(f"<p>{token}</p>", rendered)
        else:
            rendered = f'<span class="arithmatex">\\({safe_value}\\)</span>'

        html_content = html_content.replace(token, rendered)

    return html_content

def parse_markdown(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse YAML frontmatter if exists
    frontmatter = {}
    md_content = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
                md_content = parts[2]
            except yaml.YAMLError:
                pass

    # Setup Markdown parser with extensions
    # pymdownx.arithmatex ensures math blocks ($$ and $) are passed cleanly to KaTeX
    extensions = [
        'meta', 
        'fenced_code', 
        'tables', 
        'toc',
        'pymdownx.arithmatex'
    ]
    
    # We need to configure arithmatex to output raw math for KaTeX auto-render
    extension_configs = {
        'pymdownx.arithmatex': {
            'generic': True
        }
    }

    try:
        md = markdown.Markdown(extensions=extensions, extension_configs=extension_configs)
        html_content = md.convert(md_content)
    except Exception as e:
        print(f"Warning: Failed to use pymdownx extensions ({e}). Falling back to standard markdown.")
        md_content, math_tokens = protect_math(md_content)
        md = markdown.Markdown(extensions=['meta', 'fenced_code', 'tables', 'toc'])
        html_content = md.convert(md_content)
        html_content = restore_math(html_content, math_tokens)

    html_content, content_title = remove_first_h1(html_content)
    toc_html = render_toc(getattr(md, "toc_tokens", []), min_level=2, max_level=4)

    return frontmatter, html_content, toc_html, content_title

def build_site():
    # Setup Jinja2 environment
    env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))
    post_template = env.get_template('post.html')

    # Read the specific post
    md_file = MD_DIR / "Blog-Higher Order frequency expansion of Floquet Hamiltonain.md"
    
    if not md_file.exists():
        print(f"Error: Could not find {md_file}")
        return

    print(f"Processing {md_file}...")
    frontmatter, html_content, toc_html, content_title = parse_markdown(md_file)
    
    # Extract metadata, fallback if not in frontmatter
    # The provided markdown has "Created: *2026-06-09, 23:04*" inside text, and title in "# 💡 Blog: ..."
    # Let's try to extract title from the first h1 if not in frontmatter
    title = frontmatter.get('title') or content_title or "Higher Order Frequency Expansion of the Floquet Hamiltonian"
    date = frontmatter.get('date', "2026-06-09")
    tags = frontmatter.get('tags', [])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(',')]
        
    # Render HTML
    final_html = post_template.render(
        title=title,
        date=date,
        tags=tags,
        toc=toc_html,
        content=html_content
    )

    # Output to blog directory
    output_filename = "floquet-expansion.html"
    output_path = OUTPUT_DIR / output_filename
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(final_html)
        
    print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    build_site()
