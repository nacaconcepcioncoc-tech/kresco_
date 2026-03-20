"""
Build script: Converts Django templates to pure static HTML for GitHub Pages deployment.
Creates a docs/ folder with all static assets ready to serve.
"""
import os
import re
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')
DOCS_DIR = os.path.join(BASE_DIR, 'docs')

# Mapping: Django URL name -> static HTML filename
URL_MAP = {
    'dashboard': 'index.html',
    'about': 'about.html',
    'blooms': 'blooms.html',
    'shop': 'shop.html',
    'reviews': 'reviews.html',
    'contact': 'contact.html',
    'chatbox': 'chatbox.html',
    'cart': 'shop.html',  # cart redirects to shop
}

# Mapping: template filename -> output filename
FILE_MAP = {
    'dashboard.html': 'index.html',
    'about.html': 'about.html',
    'blooms.html': 'blooms.html',
    'shop.html': 'shop.html',
    'reviews.html': 'reviews.html',
    'contact.html': 'contact.html',
    'chatbox.html': 'chatbox.html',
}


def convert_template(content):
    """Replace Django template tags with plain HTML paths."""
    # Remove {% load static %}
    content = re.sub(r'\{%\s*load\s+static\s*%\}\n?', '', content)

    # Replace {% static 'path' %} and {% static "path" %}
    content = re.sub(
        r'\{%\s*static\s+["\']([^"\']+)["\']\s*%\}',
        r'static/\1',
        content
    )

    # Replace {% url 'name' %} with mapped HTML file
    def url_replacer(match):
        url_name = match.group(1)
        return URL_MAP.get(url_name, f'{url_name}.html')

    content = re.sub(
        r'\{%\s*url\s+["\']([^"\']+)["\']\s*%\}',
        url_replacer,
        content
    )

    return content


def build():
    """Build the static docs/ folder."""
    # Save CNAME file if it exists
    cname_path = os.path.join(DOCS_DIR, 'CNAME')
    cname_content = None
    if os.path.exists(cname_path):
        with open(cname_path, 'r', encoding='utf-8') as f:
            cname_content = f.read()
    
    # Clean and recreate docs/
    if os.path.exists(DOCS_DIR):
        shutil.rmtree(DOCS_DIR)
    os.makedirs(DOCS_DIR)
    
    # Restore CNAME file
    if cname_content:
        with open(cname_path, 'w', encoding='utf-8') as f:
            f.write(cname_content)
        print("  Preserved: docs/CNAME")

    # Convert and copy HTML templates
    for template_name, output_name in FILE_MAP.items():
        template_path = os.path.join(TEMPLATES_DIR, template_name)
        if not os.path.exists(template_path):
            print(f"  WARNING: {template_name} not found, skipping")
            continue

        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()

        converted = convert_template(content)

        output_path = os.path.join(DOCS_DIR, output_name)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(converted)

        print(f"  Converted: {template_name} -> docs/{output_name}")

    # Copy static assets (images, css, js)
    docs_static = os.path.join(DOCS_DIR, 'static')
    if os.path.exists(STATIC_DIR):
        shutil.copytree(STATIC_DIR, docs_static)
        print(f"  Copied: static/ -> docs/static/")
    else:
        print("  WARNING: static/ folder not found")

    print("\nBuild complete! docs/ folder is ready for GitHub Pages.")


if __name__ == '__main__':
    print("Building static site for GitHub Pages...\n")
    build()
