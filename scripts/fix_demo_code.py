import re
import html
from pathlib import Path

root = Path('packages/playground/src/pages/components')
files = sorted(root.glob('*ComponentPage.vue'))

# Match code="..." respecting escaped quotes (\") inside the value.
pattern = re.compile(r'(<demo-block\s+[^>]*?)code="((?:[^"\\]|\\.)*)"')

for f in files:
    text = f.read_text(encoding='utf-8')
    matches = list(pattern.finditer(text))
    if not matches:
        continue

    var_defs = []
    new_text = text
    offset = 0
    for i, m in enumerate(matches):
        prefix = m.group(1)
        encoded = m.group(2)
        decoded = html.unescape(encoded)
        stem = f.stem.replace('ComponentPage', '').replace('-', '_')
        var_name = f'{stem}Code{i+1}'
        # Escape for a JS template literal
        escaped = decoded.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        var_defs.append(f'const {var_name} = `{escaped}`')
        replacement = f'{prefix}:code="{var_name}"'
        start = m.start() + offset
        end = m.end() + offset
        new_text = new_text[:start] + replacement + new_text[end:]
        offset += len(replacement) - len(m.group(0))

    if var_defs:
        script_start = new_text.find('<script setup lang="ts">')
        script_end = new_text.find('</script>', script_start)
        if script_start == -1 or script_end == -1:
            print(f'Skip {f.name}: no script setup')
            continue
        insert = '\n' + '\n'.join(var_defs) + '\n'
        new_text = new_text[:script_end] + insert + new_text[script_end:]
        f.write_text(new_text, encoding='utf-8')
        print(f'Fixed {f.name}: {len(var_defs)} code attrs')
