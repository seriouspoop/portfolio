# Portfolio.yaml User Guide

## Introduction

Welcome! This guide will teach you how to edit your portfolio content using the `portfolio.yaml` file. No coding experience required - if you can edit a text file, you can manage your portfolio.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [YAML Basics](#yaml-basics)
3. [File Structure](#file-structure)
4. [Editing Your Profile](#editing-your-profile)
5. [Managing Experience](#managing-experience)
6. [Managing Projects](#managing-projects)
7. [Managing Skills](#managing-skills)
8. [Advanced Features](#advanced-features)
9. [Common Tasks](#common-tasks)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is portfolio.yaml?

`portfolio.yaml` is a single file that contains all your portfolio content:
- Your name and bio
- Work experience
- Projects
- Skills
- Links

**Benefits:**
- Edit content without touching code
- See changes instantly (hot reload)
- Easy to understand structure
- Safe - your design never changes

### Where to Find It

The file is at the root of your project:

```
portfolio/
├── portfolio.yaml    ← This file!
├── src/
├── public/
└── ...
```

### How to Edit

1. Open `portfolio.yaml` in any text editor:
   - VS Code (recommended)
   - Sublime Text
   - Notepad++
   - Even plain Notepad works!

2. Make your changes

3. Save the file

4. If dev server is running (`bun dev`), the page updates automatically!

---

## YAML Basics

### What is YAML?

YAML is a simple format for structured data. It uses indentation (like Python) instead of brackets (like JSON).

### Key Rules

**1. Indentation Matters**

Use **2 spaces** (not tabs!) for each level:

```yaml
# ✅ CORRECT - 2 spaces
profile:
  name: Harshit Singh
  role: Engineer

# ❌ WRONG - tabs or 4 spaces
profile:
    name: Harshit Singh    # Too much indent
	role: Engineer          # Tab instead of spaces
```

**2. Colons Need Spaces**

```yaml
# ✅ CORRECT - space after colon
name: Harshit Singh

# ❌ WRONG - no space after colon
name:Harshit Singh
```

**3. Lists Use Dashes**

```yaml
# ✅ CORRECT - dash + space
tech:
  - Go
  - Redis
  - Docker

# Also correct - inline format
tech: [Go, Redis, Docker]
```

**4. Multi-line Text Uses `|`**

```yaml
# ✅ CORRECT - preserves line breaks
summary: |
  First line of text
  Second line of text
  Third line of text

# ❌ WRONG - creates one long line
summary: First line of text Second line of text
```

**5. Quotes Are Optional (Usually)**

```yaml
# All valid:
name: Harshit Singh          # No quotes
name: "Harshit Singh"        # Double quotes
name: 'Harshit Singh'        # Single quotes

# Use quotes when you have special characters:
summary: "I'm a developer"   # Quote needed for apostrophe
period: "2024-01-01"         # Quote needed for dates
```

---

## File Structure

### Overview

Your `portfolio.yaml` has three main sections:

```yaml
meta:           # Site information
profile:        # Your bio
sections:       # Your content
  - experience
  - projects
  - skills
```

### Complete Structure Map

```yaml
portfolio.yaml
│
├── meta
│   ├── name
│   ├── description
│   └── theme
│
├── profile
│   ├── name
│   ├── role
│   ├── tagline
│   └── links
│       ├── github
│       ├── linkedin
│       └── email
│
└── sections
    │
    ├── experience
    │   ├── title
    │   └── items
    │       ├── company
    │       ├── role
    │       ├── period
    │       ├── summary
    │       ├── tech
    │       └── details (optional)
    │
    ├── projects
    │   ├── title
    │   └── items
    │       ├── name
    │       ├── tagline
    │       ├── icon
    │       ├── summary
    │       └── tech
    │
    └── skills
        ├── title
        └── items
            ├── category
            └── items
                ├── name
                └── level
```

---

## Editing Your Profile

### Profile Section Location

Find this at the top of your file:

```yaml
profile:
  component: hero
  name: Harshit Singh
  role: Backend & Systems Engineer
  tagline: Architecting scalable distributed systems...
  links:
    - type: github
      url: https://github.com/seriouspoop
    - type: linkedin
      url: https://linkedin.com/in/harshit-me
    - type: email
      url: mailto:workmail.harshitsingh@gmail.com
```

### Change Your Name

```yaml
profile:
  name: Your Name Here    # ← Change this
```

### Change Your Role

```yaml
profile:
  role: Your Job Title    # ← Change this
```

### Change Your Tagline

The tagline is the descriptive text below your name:

```yaml
profile:
  tagline: Your personal tagline or mission statement.
```

**Tips:**
- Keep it under 120 characters
- Make it specific to what you do
- Avoid buzzwords

**Examples:**
```yaml
# Good:
tagline: Building high-performance distributed systems in Go

# Good:
tagline: Full-stack developer specializing in React and Node.js

# Avoid:
tagline: Passionate developer who loves to code
```

### Update Social Links

**Add a link:**

```yaml
links:
  - type: github
    url: https://github.com/yourusername
  - type: linkedin
    url: https://linkedin.com/in/yourname
  - type: email
    url: mailto:your.email@gmail.com
  - type: external              # Add new link
    url: https://yourwebsite.com
```

**Remove a link:**

Just delete the entire entry (both lines):

```yaml
links:
  - type: github
    url: https://github.com/yourusername
  # - type: linkedin           ← Delete these
  #   url: https://...         ← two lines
  - type: email
    url: mailto:your@email.com
```

**Valid link types:**
- `github`
- `linkedin`
- `email`
- `external`

---

## Managing Experience

### Experience Section Location

Find the experience section:

```yaml
sections:
  - id: experience
    title: Experience
    component: timeline
    layout: vertical
    items:
      - component: experience_card
        company: Piovation GmbH
        role: Software Engineer
        period: Dec 2024 - Aug 2025
        summary: What I did here...
        tech: [Go, gRPC, OpenTelemetry]
```

### Add New Job

Copy the entire job block and paste above or below existing jobs:

```yaml
items:
  - component: experience_card     # ← Copy from here
    company: New Company
    role: Your Role
    period: Jan 2026 - Present
    summary: |
      What you do or did at this company.
      Multiple lines are fine.
    tech: [Python, Django, PostgreSQL]
  # ← To here

  - component: experience_card     # Next job
    company: Old Company
    # ...
```

**Required Fields:**
- `component: experience_card` (don't change this)
- `company` - Company name
- `role` - Your job title
- `period` - Date range
- `summary` - Description
- `tech` - Technologies used (list)

**Optional Fields:**
- `details` - Bullet points (shown when clicked)
- `logo` - Path to company logo image
- `location` - Office location

### Update Job Details

**Change company:**
```yaml
company: New Company Name    # ← Just change the text
```

**Change role:**
```yaml
role: Senior Software Engineer    # ← Just change the text
```

**Change period:**
```yaml
period: Jan 2025 - Present    # ← Any format you like
```

**Update summary:**
```yaml
summary: |
  New description here.
  Can be multiple lines.
  Just keep the | symbol.
```

**Update tech stack:**
```yaml
# Option 1: Inline
tech: [Go, Rust, Kubernetes]

# Option 2: Multi-line
tech:
  - Go
  - Rust
  - Kubernetes
```

### Remove a Job

Delete the entire job block:

```yaml
items:
  # Delete from here ↓
  - component: experience_card
    company: Old Company
    role: Old Role
    period: 2020 - 2021
    summary: Old description
    tech: [PHP, MySQL]
  # To here ↑

  - component: experience_card     # Next job stays
    company: Current Company
```

### Reorder Jobs

Jobs appear in the order you write them. Most recent first:

```yaml
items:
  - company: Current Job (2026)     # Shows first
  - company: Previous Job (2025)    # Shows second
  - company: First Job (2024)       # Shows third
```

### Add Detailed Achievements

Add a `details` section for bullet points:

```yaml
- component: experience_card
  company: Company Name
  role: Engineer
  period: 2024 - 2025
  summary: Brief overview
  details:
    - "Reduced costs by 40% through optimization"
    - "Led team of 5 engineers"
    - "Shipped product to 10K users"
  tech: [Go, Redis]
```

**Tips:**
- Use quotes around each point
- Start with action verbs (Reduced, Led, Built, Implemented)
- Include numbers when possible
- Keep each point to one line

---

## Managing Projects

### Projects Section Location

Find the projects section:

```yaml
sections:
  - id: projects
    title: Engineering
    component: grid
    layout: grid
    columns: 2
    items:
      - component: project_card
        name: GoPush
        tagline: Command-line Git Manager
        icon: Terminal
        summary: Description here
        tech: [Go, CLI]
```

### Add New Project

Copy a project block and paste:

```yaml
items:
  - component: project_card      # ← Copy from here
    name: New Project
    tagline: Short description
    icon: Server
    summary: |
      Longer description of what this project does.
      Can be multiple sentences.
    tech: [Go, Docker, Kubernetes]
  # ← To here

  - component: project_card      # Next project
    name: Existing Project
```

**Required Fields:**
- `component: project_card` (don't change)
- `name` - Project name
- `tagline` - One-line description
- `icon` - Icon name (see list below)
- `summary` - Full description
- `tech` - Technologies used

**Optional Fields:**
- `details` - Bullet points of features
- `thumbnail` - Path to screenshot
- `links` - GitHub, demo, docs links
- `stats` - Key metrics (users, uptime, etc.)

### Available Icons

Use these icon names:

```yaml
icon: Terminal     # For CLI tools
icon: Server       # For backend/infrastructure
icon: Cpu          # For performance/algorithms
icon: Activity     # For monitoring/metrics
icon: Code         # For libraries/SDKs
icon: Container    # For Docker/containers
icon: Network      # For networking tools
icon: Database     # For database tools
```

### Add Project Links

```yaml
- component: project_card
  name: Cool Project
  tagline: Does cool things
  icon: Terminal
  summary: Description
  tech: [Go, Rust]
  links:                          # ← Add this
    - type: github
      url: https://github.com/you/project
    - type: live
      url: https://project.com
    - type: docs
      url: https://docs.project.com
```

**Valid link types:**
- `github` - GitHub repository
- `demo` - Demo/video
- `docs` - Documentation
- `live` - Live website

### Add Project Stats

```yaml
- component: project_card
  name: Popular Project
  summary: Description
  tech: [Go]
  stats:                          # ← Add this
    - label: Stars
      value: 1.2K
    - label: Downloads
      value: 50K
    - label: Users
      value: 5K
```

### Remove a Project

Delete the entire project block:

```yaml
items:
  # Delete from here ↓
  - component: project_card
    name: Old Project
    tagline: Not maintained
    icon: Server
    summary: Description
    tech: [PHP]
  # To here ↑

  - component: project_card      # Next project stays
    name: Current Project
```

### Reorder Projects

Projects show left-to-right, top-to-bottom:

```yaml
items:
  - name: Project 1    # Top-left
  - name: Project 2    # Top-right
  - name: Project 3    # Bottom-left
  - name: Project 4    # Bottom-right
```

---

## Managing Skills

### Skills Section Location

Find the skills section:

```yaml
sections:
  - id: skills
    title: Stack
    component: skill_grid
    layout: categorized
    items:
      - category: Languages
        icon: Code
        items:
          - name: Go
            level: expert
          - name: Rust
            level: advanced
```

### Add New Category

Copy a category block:

```yaml
items:
  - category: New Category Name    # ← Copy from here
    icon: Code
    items:
      - name: Skill 1
        level: expert
      - name: Skill 2
        level: advanced
  # ← To here

  - category: Existing Category    # Next category
    icon: Server
```

### Add Skill to Category

Just add a new entry in the items list:

```yaml
- category: Languages
  icon: Code
  items:
    - name: Go
      level: expert
    - name: Rust
      level: advanced
    - name: Python        # ← Add new skill
      level: intermediate
```

### Skill Levels

Use these exact values:

```yaml
level: expert        # 10+ years or mastery
level: advanced      # 5-10 years or very proficient
level: intermediate  # 2-5 years or comfortable
level: beginner      # < 2 years or learning
```

**What they mean:**
- **expert** - Could teach others, solve complex problems
- **advanced** - Use professionally, know edge cases
- **intermediate** - Use regularly, need help sometimes
- **beginner** - Learning, limited production experience

### Remove a Skill

Delete the two-line entry:

```yaml
items:
  - name: Go
    level: expert
  # - name: Ruby          ← Delete these
  #   level: beginner     ← two lines
  - name: Rust
    level: advanced
```

### Remove a Category

Delete the entire category block:

```yaml
items:
  - category: Languages
    icon: Code
    items:
      - name: Go
        level: expert

  # Delete from here ↓
  - category: Old Category
    icon: Server
    items:
      - name: Old Tech
        level: beginner
  # To here ↑

  - category: Databases    # Next category stays
```

### Reorder Categories

Categories show left-to-right, top-to-bottom (like projects):

```yaml
items:
  - category: Languages      # Top-left
  - category: Frameworks     # Top-right
  - category: Databases      # Bottom-left
  - category: Tools          # Bottom-right
```

### Reorder Skills Within Category

Skills show in the order you write them:

```yaml
items:
  - name: Go          # Shows first
    level: expert
  - name: Python      # Shows second
    level: advanced
  - name: JavaScript  # Shows third
    level: intermediate
```

---

## Advanced Features

### Interactive Cards (Optional)

You can make experience and project cards clickable to show more details.

**Currently disabled by default:**

```yaml
- component: experience_card
  clickable: false         # ← Currently false (not clickable)
  interaction: expand      # ← Doesn't do anything while false
```

**To enable:**

```yaml
- component: experience_card
  clickable: true          # ← Change to true
  interaction: expand      # ← Now this matters
  # ... rest of fields
  details:                 # ← These show when clicked
    - "Achievement 1"
    - "Achievement 2"
```

### Interaction Types

**expand** - Opens inline below the card:
```yaml
clickable: true
interaction: expand
```

Best for: 3-5 bullet points, quick details

**modal** - Opens centered overlay:
```yaml
clickable: true
interaction: modal
```

Best for: Long descriptions, images, links

**drawer** - Slides in from right:
```yaml
clickable: true
interaction: drawer
```

Best for: Documentation, lots of content

### Adding Company Logos

**1. Add logo image to your project:**

```
portfolio/
├── public/
│   └── images/
│       └── logos/
│           └── company.svg    ← Put image here
```

**2. Reference in YAML:**

```yaml
- component: experience_card
  company: Company Name
  logo: /images/logos/company.svg    # ← Add this line
  role: Engineer
```

**Supported formats:**
- SVG (recommended)
- PNG
- JPG

### Adding Project Screenshots

**1. Add screenshot to project:**

```
portfolio/
├── public/
│   └── images/
│       └── projects/
│           └── project-name.png    ← Put image here
```

**2. Reference in YAML:**

```yaml
- component: project_card
  name: Project Name
  thumbnail: /images/projects/project-name.png    # ← Add this
  tagline: Description
```

### Adding Metrics

Show impact numbers on experience cards:

```yaml
- component: experience_card
  company: Company
  role: Engineer
  summary: Description
  tech: [Go, Redis]
  metrics:                    # ← Add this
    - label: Performance Gain
      value: 115%
    - label: Cost Reduction
      value: $50K
    - label: Users Impacted
      value: 10K+
```

---

## Common Tasks

### Task: Update Your Current Role

```yaml
# 1. Find your profile section
profile:
  role: Backend & Systems Engineer    # ← Change this line

# 2. Save file
# 3. Page updates automatically!
```

### Task: Add a New Job

```yaml
sections:
  - id: experience
    items:
      - component: experience_card    # ← Add this entire block
        company: New Company
        role: Senior Engineer
        period: Jan 2026 - Present
        summary: What I do here
        tech: [Go, Kubernetes, AWS]

      - component: experience_card    # Existing job
        company: Previous Company
```

### Task: Remove Old Project

```yaml
- id: projects
  items:
    - component: project_card
      name: Current Project
      # ... keep this

    # DELETE THIS ENTIRE BLOCK ↓
    # - component: project_card
    #   name: Old Project
    #   tagline: Not maintained
    #   icon: Server
    #   summary: Description
    #   tech: [PHP]
    # DELETE THIS ENTIRE BLOCK ↑

    - component: project_card
      name: Another Project
      # ... keep this
```

### Task: Update Tech Skills

**Add new skill:**
```yaml
- category: Languages
  items:
    - name: Go
      level: expert
    - name: Python        # ← Add here
      level: advanced     # ← Add here
```

**Change skill level:**
```yaml
- name: Rust
  level: advanced    # ← Change from intermediate to advanced
```

**Remove skill:**
```yaml
items:
  - name: Go
    level: expert
  # - name: Ruby        ← Delete these
  #   level: beginner   ← two lines
```

### Task: Change Section Order

Sections appear in the order you write them:

```yaml
sections:
  # This order shows: Experience → Projects → Skills
  - id: experience
  - id: projects
  - id: skills

  # Want Projects first? Reorder like this:
  - id: projects       # Now shows first
  - id: experience     # Now shows second
  - id: skills         # Now shows third
```

### Task: Temporarily Hide Something

Use YAML comments (lines starting with `#`):

```yaml
# This job won't show (commented out):
# - component: experience_card
#   company: Old Company
#   role: Intern
#   period: 2020

# This job will show (not commented):
- component: experience_card
  company: Current Company
  role: Engineer
  period: 2024
```

---

## Best Practices

### 1. Keep Indentation Consistent

**Always 2 spaces per level:**

```yaml
# ✅ CORRECT
sections:
  - id: experience
    title: Experience
    items:
      - company: Company

# ❌ WRONG - inconsistent spacing
sections:
    - id: experience
       title: Experience
  items:
      - company: Company
```

**Pro tip:** Configure your editor:
- VS Code: Set "Tab Size" to 2, enable "Insert Spaces"
- Sublime: Set "tab_size": 2, "translate_tabs_to_spaces": true

### 2. Write Descriptive Summaries

**Good summary:**
```yaml
summary: |
  Built real-time data pipeline processing 100K events/sec.
  Reduced latency from 2s to 50ms through caching optimization.
  Led team of 3 engineers through successful production launch.
```

**Avoid vague summaries:**
```yaml
summary: |
  Worked on various projects.
  Helped the team with tasks.
  Improved system performance.
```

### 3. Use Action Verbs

Start descriptions with strong verbs:

**Good:**
- Built, Created, Developed
- Led, Managed, Coordinated
- Reduced, Increased, Improved
- Implemented, Deployed, Launched
- Optimized, Streamlined, Automated

**Avoid:**
- Worked on, Helped with
- Was responsible for
- Participated in

### 4. Include Numbers

Quantify impact when possible:

```yaml
# ✅ WITH numbers
- "Reduced API response time by 60% (2s → 800ms)"
- "Scaled system to handle 100K concurrent users"
- "Cut infrastructure costs by $50K annually"

# ❌ WITHOUT numbers
- "Made the API faster"
- "Improved system scalability"
- "Reduced costs"
```

### 5. Order by Relevance

**Experience:** Most recent first
```yaml
items:
  - company: Current Job (2026)
  - company: Previous Job (2024)
  - company: First Job (2022)
```

**Projects:** Most impressive first
```yaml
items:
  - name: Popular Open Source Project
  - name: Side Project With Users
  - name: Learning Project
```

**Skills:** Most proficient first within each category
```yaml
items:
  - name: Go           # expert
    level: expert
  - name: Python       # advanced
    level: advanced
  - name: JavaScript   # intermediate
    level: intermediate
```

### 6. Keep Tech Lists Focused

**Good - focused and relevant:**
```yaml
tech: [Go, PostgreSQL, Redis, Docker, Kubernetes]
```

**Avoid - too many or irrelevant:**
```yaml
tech: [Go, Python, JavaScript, Ruby, Java, C++, Rust, Elixir, Haskell, Scala]
```

### 7. Update Regularly

Set a reminder to update quarterly:
- [ ] Add new skills you've learned
- [ ] Update current job responsibilities
- [ ] Add new projects
- [ ] Remove outdated content
- [ ] Update skill levels

### 8. Test After Changes

After editing:

1. Save the file
2. Check browser for errors
3. Verify content looks correct
4. Check all links work
5. Test on mobile (if possible)

### 9. Commit Changes to Git

After successful changes:

```bash
git add portfolio.yaml
git commit -m "Update experience section"
git push
```

This creates a history you can revert to if needed.

---

## Troubleshooting

### Issue: Page Not Updating

**Cause:** Dev server not running or file not saved

**Fix:**
1. Check terminal - is `bun dev` running?
2. Save the file (`Ctrl+S` or `Cmd+S`)
3. Wait 2-3 seconds for hot reload
4. Hard refresh browser (`Ctrl+Shift+R`)

### Issue: Red Error Message

**Example error:**
```
Failed to load portfolio.yaml: Invalid YAML syntax at line 45
```

**Cause:** YAML syntax error

**Fix:**
1. Go to line mentioned in error (line 45)
2. Check common issues:
   - Missing space after colon
   - Wrong indentation
   - Unclosed quote
   - Tab instead of spaces
3. Use online validator: https://www.yamllint.com/
4. Copy-paste your YAML to find exact error

### Issue: Content Missing on Page

**Cause:** Required field missing or wrong field name

**Fix:**

Check required fields are present:

**Experience:**
```yaml
- component: experience_card    # Required
  company: Company Name         # Required
  role: Job Title               # Required
  period: Date Range            # Required
  summary: Description          # Required
  tech: [Go, Redis]             # Required
```

**Projects:**
```yaml
- component: project_card       # Required
  name: Project Name            # Required
  tagline: Short desc           # Required
  icon: Terminal                # Required
  summary: Long desc            # Required
  tech: [Go]                    # Required
```

### Issue: Section Not Showing

**Cause:** Section `id` doesn't match

**Fix:**

Check section IDs are exactly:
- `experience` (not `experiences` or `work`)
- `projects` (not `project` or `portfolio`)
- `skills` (not `skill` or `technologies`)

```yaml
sections:
  - id: experience    # ← Must be exactly "experience"
  - id: projects      # ← Must be exactly "projects"
  - id: skills        # ← Must be exactly "skills"
```

### Issue: Links Not Working

**Cause:** Missing `https://` or `mailto:`

**Fix:**

```yaml
# ✅ CORRECT
links:
  - type: github
    url: https://github.com/username    # Has https://
  - type: email
    url: mailto:you@email.com           # Has mailto:

# ❌ WRONG
links:
  - type: github
    url: github.com/username            # Missing https://
  - type: email
    url: you@email.com                  # Missing mailto:
```

### Issue: Images Not Showing

**Cause:** Wrong path or file doesn't exist

**Fix:**

1. Verify file exists:
```
portfolio/
├── public/
│   └── images/
│       └── logos/
│           └── company.svg    ← Check this exists
```

2. Check path in YAML:
```yaml
logo: /images/logos/company.svg    # Must start with /
```

3. Check file extension matches:
```yaml
logo: /images/logos/company.png    # If file is .png
logo: /images/logos/company.svg    # If file is .svg
```

### Issue: Special Characters Breaking

**Cause:** Unquoted strings with special characters

**Fix:**

Add quotes around strings with:
- Apostrophes: `I'm`, `don't`
- Colons: `Note: important`
- Dashes at start: `- something`
- Dates: `2024-01-15`

```yaml
# ✅ CORRECT
summary: "I'm building systems that don't fail"
period: "2024-01-15 - Present"
note: "Important: Read this"

# ❌ WRONG (will break)
summary: I'm building systems that don't fail
period: 2024-01-15 - Present
note: Important: Read this
```

### Issue: Tech Stack Not Showing

**Cause:** Wrong list format

**Fix:**

```yaml
# ✅ CORRECT - either format works
tech: [Go, Redis, Docker]

tech:
  - Go
  - Redis
  - Docker

# ❌ WRONG
tech: Go, Redis, Docker    # Missing brackets
```

### Getting Help

**Before asking for help:**
1. Check error message carefully
2. Verify YAML syntax at https://www.yamllint.com/
3. Compare with examples in this guide
4. Check you saved the file

**When asking for help, provide:**
1. The error message (screenshot or text)
2. The relevant section of your YAML
3. What you were trying to do
4. What happened instead

---

## Quick Reference

### Common Field Names

**Profile:**
- `name` - Your full name
- `role` - Job title
- `tagline` - One-line bio
- `links` - Social links

**Experience:**
- `company` - Company name
- `role` - Job title
- `period` - Date range
- `summary` - Description
- `tech` - Technologies
- `details` - Achievements (optional)

**Projects:**
- `name` - Project name
- `tagline` - Short description
- `icon` - Icon name
- `summary` - Full description
- `tech` - Technologies
- `links` - External links (optional)

**Skills:**
- `category` - Skill category name
- `icon` - Category icon
- `items` - List of skills
  - `name` - Skill name
  - `level` - Proficiency level

### Valid Values

**Link types:**
- `github`, `linkedin`, `email`, `external`, `demo`, `docs`, `live`

**Icons:**
- `Terminal`, `Server`, `Cpu`, `Activity`, `Code`, `Container`, `Network`, `Database`

**Skill levels:**
- `expert`, `advanced`, `intermediate`, `beginner`

**Interactions:**
- `expand`, `modal`, `drawer` (only when `clickable: true`)

### YAML Syntax Cheatsheet

```yaml
# Text
name: Simple text

# Text with special characters
name: "Text with: special, characters!"

# Multi-line text
summary: |
  First line
  Second line
  Third line

# List (inline)
tech: [Go, Redis, Docker]

# List (multi-line)
tech:
  - Go
  - Redis
  - Docker

# Nested structure
profile:
  name: Your Name
  role: Your Role

# Comments
# This line is ignored
name: Your Name    # This part is also ignored
```

---

## Examples

### Example 1: Complete Profile

```yaml
profile:
  component: hero
  name: Jane Developer
  role: Senior Full-Stack Engineer
  tagline: Building scalable web applications with React and Node.js
  links:
    - type: github
      url: https://github.com/janedev
    - type: linkedin
      url: https://linkedin.com/in/janedev
    - type: email
      url: mailto:jane@example.com
    - type: external
      url: https://janedeveloper.com
```

### Example 2: Complete Experience Entry

```yaml
- component: experience_card
  clickable: true
  interaction: expand
  company: TechCorp Inc
  role: Senior Backend Engineer
  period: Mar 2023 - Present
  location: San Francisco, CA
  logo: /images/logos/techcorp.svg
  summary: |
    Leading backend infrastructure team building microservices platform.
    Architected event-driven system processing 1M requests/day.
  details:
    - "Reduced infrastructure costs by 45% through optimization"
    - "Mentored team of 5 junior engineers"
    - "Implemented CI/CD pipeline with 95% test coverage"
    - "Migrated monolith to microservices with zero downtime"
  tech: [Go, PostgreSQL, Redis, Kubernetes, AWS, Terraform]
  metrics:
    - label: Cost Reduction
      value: 45%
    - label: Request Volume
      value: 1M/day
```

### Example 3: Complete Project Entry

```yaml
- component: project_card
  clickable: true
  interaction: modal
  name: TaskFlow
  tagline: Modern task management for distributed teams
  icon: Activity
  thumbnail: /images/projects/taskflow.png
  summary: |
    Open-source task management platform with real-time
    collaboration and advanced filtering capabilities.
  details:
    - "Built with modern React and GraphQL stack"
    - "Real-time updates via WebSocket connections"
    - "Advanced search with Elasticsearch"
    - "Mobile-responsive design with offline support"
  tech: [React, Node.js, GraphQL, PostgreSQL, Redis, Docker]
  links:
    - type: github
      url: https://github.com/janedev/taskflow
    - type: live
      url: https://taskflow.dev
    - type: docs
      url: https://docs.taskflow.dev
  stats:
    - label: GitHub Stars
      value: 2.5K
    - label: Active Users
      value: 10K+
    - label: Contributors
      value: 45
```

### Example 4: Complete Skills Section

```yaml
- id: skills
  title: Technical Skills
  component: skill_grid
  layout: categorized
  items:
    - category: Languages
      icon: Code
      items:
        - name: JavaScript
          level: expert
        - name: TypeScript
          level: expert
        - name: Python
          level: advanced
        - name: Go
          level: intermediate

    - category: Frontend
      icon: Container
      items:
        - name: React
          level: expert
        - name: Next.js
          level: advanced
        - name: Vue.js
          level: intermediate

    - category: Backend
      icon: Server
      items:
        - name: Node.js
          level: expert
        - name: Express
          level: expert
        - name: GraphQL
          level: advanced
        - name: REST APIs
          level: expert

    - category: Databases
      icon: Database
      items:
        - name: PostgreSQL
          level: expert
        - name: MongoDB
          level: advanced
        - name: Redis
          level: advanced
```

---

## Summary

### Key Takeaways

1. **YAML is simple** - Just text with indentation
2. **Indentation matters** - Always use 2 spaces
3. **Test changes** - Save and check browser
4. **Use quotes** - For special characters
5. **Keep it updated** - Review quarterly

### Getting Started Checklist

- [ ] Open `portfolio.yaml` in text editor
- [ ] Update your name in profile section
- [ ] Update your role and tagline
- [ ] Check all links work
- [ ] Update experience section
- [ ] Update projects section
- [ ] Update skills section
- [ ] Save file and check browser
- [ ] Commit to git

### Need More Help?

- Check examples in this guide
- Validate YAML: https://www.yamllint.com/
- Compare with working examples
- Read error messages carefully

---

**You're ready! Start editing your portfolio.yaml and watch your changes appear instantly.** 🚀