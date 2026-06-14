import os
import markdown
from jinja2 import Environment, FileSystemLoader
import yaml

# Configuration
MD_DIR = "md"
TEMPLATE_DIR = "templates"
OUTPUT_DIR = "."

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
                frontmatter = yaml.safe_load(parts[1])
                md_content = parts[2]
            except yaml.YAMLError:
                pass

    # Setup Markdown parser with extensions
    # pymdownx.arithmatex ensures math blocks ($$ and $) are passed cleanly to KaTeX
    extensions = [
        'meta', 
        'fenced_code', 
        'tables', 
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
        md = markdown.Markdown(extensions=['meta', 'fenced_code', 'tables'])
        html_content = md.convert(md_content)
        
    return frontmatter, html_content

def build_site():
    # Setup Jinja2 environment
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    post_template = env.get_template('post.html')

    # Read the specific post
    md_file = os.path.join(MD_DIR, "Blog-Higher Order frequency expansion of Floquet Hamiltonain.md")
    
    if not os.path.exists(md_file):
        print(f"Error: Could not find {md_file}")
        return

    print(f"Processing {md_file}...")
    frontmatter, html_content = parse_markdown(md_file)
    
    # Extract metadata, fallback if not in frontmatter
    # The provided markdown has "Created: *2026-06-09, 23:04*" inside text, and title in "# 💡 Blog: ..."
    # Let's try to extract title from the first h1 if not in frontmatter
    title = frontmatter.get('title', "Higher Order Frequency Expansion of the Floquet Hamiltonian")
    date = frontmatter.get('date', "2026-06-09")
    tags = frontmatter.get('tags', [])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(',')]
        
    # Render HTML
    final_html = post_template.render(
        title=title,
        date=date,
        tags=tags,
        content=html_content
    )

    # Output to blog directory
    output_filename = "floquet-expansion.html"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(final_html)
        
    print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    build_site()
