import os
import re
import sys
import base64
import io
from PIL import Image

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join([c*2 for c in hex_str])
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def recolor_svgs(assets_dir='assets', target_color='#777777'):
    rgb = hex_to_rgb(target_color)
    print(f"Recoloring all SVGs in '{assets_dir}' to {target_color} (RGB: {rgb})...")
    count = 0
    for root, _, files in os.walk(assets_dir):
        for fname in files:
            if not fname.endswith('.svg'):
                continue
            fpath = os.path.join(root, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Clean background rects
            content = re.sub(r'<rect[^>]*fill="#F5F5F5"[^>]*/>', '', content)
            content = re.sub(r'<rect[^>]*fill="white"[^>]*/>', '', content)

            # Replace stroke attributes except stroke="none" or stroke="url(...)"
            def stroke_repl(m):
                val = m.group(1)
                if val.lower() in ['none', 'transparent'] or val.startswith('url('):
                    return m.group(0)
                return f'stroke="{target_color}"'

            content = re.sub(r'stroke="([^"]+)"', stroke_repl, content)

            # Replace fill attributes except fill="none", fill="transparent", fill="url(...)"
            def fill_repl(m):
                val = m.group(1)
                if val.lower() in ['none', 'transparent'] or val.startswith('url('):
                    return m.group(0)
                return f'fill="{target_color}"'

            content = re.sub(r'fill="([^"]+)"', fill_repl, content)

            # Ensure fill-opacity="1"
            content = content.replace('fill-opacity="0.5"', 'fill-opacity="1"')

            # Handle embedded base64 PNG images
            m = re.search(r'data:image/png;base64,([^"]+)', content)
            if m:
                b64data = m.group(1)
                try:
                    img_bytes = base64.b64decode(b64data)
                    img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
                    datas = img.getdata()
                    new_data = [(rgb[0], rgb[1], rgb[2], a) if a > 0 else (0, 0, 0, 0) for (_, _, _, a) in datas]
                    img.putdata(new_data)
                    buf = io.BytesIO()
                    img.save(buf, format="PNG")
                    new_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                    content = content.replace(b64data, new_b64)
                except Exception as e:
                    print(f"  [!] Failed to recolor embedded image in {fpath}: {e}")

            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"  [✓] Processed {fpath}")

    print(f"Done! Successfully processed {count} SVG files.")

if __name__ == '__main__':
    color = sys.argv[1] if len(sys.argv) > 1 else '#777777'
    recolor_svgs(target_color=color)
