#!/usr/bin/env python3
import re
import sys

# Read and convert the CSV file
input_file = '../cbs-data/Kenmerken.csv'
output_file = '../cbs-data/Kenmerken_fixed.csv'

print(f"Converting {input_file}...")
count = 0

with open(input_file, 'r', encoding='latin-1') as infile, \
     open(output_file, 'w', encoding='utf-8') as outfile:

    for line in infile:
        # Replace ALL comma decimal separators with dots - multiple passes for all cases
        # Case 1: ;123,45; or ;"123,45";
        line_fixed = re.sub(r';\"?(\d+),(\d+)\"?;', r';\1.\2;', line)
        # Case 2: ,123,45; (at end without leading semicolon caught by previous)
        line_fixed = re.sub(r',(\d+);', r'.\1;', line_fixed)
        # Case 3: Anywhere in quoted strings like "35.2% - 47,5%"
        line_fixed = re.sub(r'(\d+),(\d+)', r'\1.\2', line_fixed)
        # Case 4: Scientific notation like 2e+05 -> 200000
        def expand_scientific(match):
            return str(int(float(match.group(0))))
        line_fixed = re.sub(r'\d+e[+-]\d+', expand_scientific, line_fixed, flags=re.IGNORECASE)
        outfile.write(line_fixed)
        count += 1
        if count % 100000 == 0:
            print(f"Processed {count} lines...")

print(f"Done! Converted {count} lines")
