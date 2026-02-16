#!/usr/bin/env python3
"""Update SharedPreferences XML with key/value pairs."""

import sys
import xml.etree.ElementTree as ET


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: prefs-xml.py <xml-path> [--string key value] [--bool key true|false] ...", file=sys.stderr)
        return 2

    path = sys.argv[1]
    args = sys.argv[2:]

    try:
        tree = ET.parse(path)
        root = tree.getroot()
    except Exception:
        root = ET.Element("map")
        tree = ET.ElementTree(root)

    if root.tag != "map":
        root = ET.Element("map")
        tree = ET.ElementTree(root)

    def remove_existing(key: str) -> None:
        for el in list(root):
            if el.attrib.get("name") == key:
                root.remove(el)

    idx = 0
    while idx < len(args):
        flag = args[idx]
        if flag not in ("--string", "--bool"):
            print(f"unknown flag: {flag}", file=sys.stderr)
            return 2
        if idx + 2 >= len(args):
            print(f"{flag} requires key and value", file=sys.stderr)
            return 2
        key = args[idx + 1]
        val = args[idx + 2]
        idx += 3

        remove_existing(key)
        if flag == "--string":
            el = ET.SubElement(root, "string", {"name": key})
            el.text = val
        else:
            if val not in ("true", "false"):
                print(f"boolean must be true/false for {key}", file=sys.stderr)
                return 2
            ET.SubElement(root, "boolean", {"name": key, "value": val})

    if hasattr(ET, "indent"):
        ET.indent(tree, space="  ", level=0)

    with open(path, "wb") as f:
        tree.write(f, encoding="utf-8", xml_declaration=True)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
