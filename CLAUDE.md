# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a documentation repository focused on research about the societal costs of debt problems (schuldenproblematiek) in the Netherlands. It does not contain source code or applications.

## Repository Contents

- **Onderzoeksrapport+De+maatschappelijke+kosten+van+schuldenproblematiek.pdf** - Main research report by Panteia, Hogeschool Utrecht, and Nibud commissioned by IBO (Interdepartementaal beleidsonderzoek) on problematic debts. Published June 10, 2024.

- **README.md** - Comprehensive summary of the research report including:
  - Key findings (€8.5 billion in quantifiable annual costs)
  - Cost domains (7 categories)
  - Main recommendations
  - Methodological limitations

- **Kleine schulden problematie - 20251104.pptx** - PowerPoint presentation about small debt problems

## Working with PDF Documents

To extract text from PDF files in this repository:

```bash
pdftotext "filename.pdf" -
```

To extract specific pages or sections:

```bash
pdftotext -f <first_page> -l <last_page> "filename.pdf" -
```

## Key Research Context

The research is part of the IBO (Interdepartementaal beleidsonderzoek) on problematic debts, which aims to:
1. Understand which debts and payment obligations have societal value
2. Prevent problematic debts
3. Signal and resolve problematic debts more quickly

The €8.5 billion figure represents only 19 of 43 identified cost items, making the actual societal costs significantly higher.
