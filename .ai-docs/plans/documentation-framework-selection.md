# Documentation Framework Selection Plan

## Problem Statement

You need a documentation site for this datto-rmm monorepo similar to your `forge-docs-ui` implementation in the forge-monorepo. The key requirements are:

- MDX support for embedding interactive components in documentation
- Good developer experience
- Fast build times suitable for monorepo development
- Modern, maintainable stack for 2025 and beyond
- Capable of hosting "human" documentation (guides, architecture docs, API references)

The question is whether Docusaurus (which you've used before) is still the best choice, or if newer alternatives offer compelling advantages.

---

## Framework Comparison

### 1. Docusaurus (Meta) - Current Standard
**Your Previous Setup:** Using v3.7.0 with Mermaid diagrams, custom themes, MDX

| Aspect | Assessment |
|--------|------------|
| **MDX Support** | Full - Native MDX, React components embedded in docs |
| **Build Performance** | Good - Now supports Rspack bundler (v3.6+) for faster builds |
| **Ecosystem** | Excellent - Largest community, most plugins, battle-tested |
| **Learning Curve** | Low for you - Already familiar from forge-monorepo |
| **Active Development** | Yes - Regular releases, Meta backing |

**Pros:**
- You already have a working template in forge-monorepo to copy from
- Massive ecosystem of plugins and themes
- Versioning support built-in
- Blog functionality built-in
- Strong community support

**Cons:**
- Heavier bundle size than some alternatives
- React-only (not a con if you're using React)

---

### 2. Starlight (Astro) - Rising Star
**Status:** Production-ready (v0.37 as of Nov 2025)

| Aspect | Assessment |
|--------|------------|
| **MDX Support** | Full - Plus Markdown and Markdoc |
| **Build Performance** | Excellent - Astro's partial hydration = tiny JS bundles |
| **Ecosystem** | Good - Growing rapidly, Astro ecosystem |
| **Learning Curve** | Medium - New concepts if unfamiliar with Astro |
| **Active Development** | Yes - Very active, Cloudflare migrated 4500 pages to it |

**Pros:**
- Ships minimal JavaScript (Islands architecture)
- Framework agnostic (can use React, Vue, Svelte components)
- Built-in Pagefind search (instant, no external service)
- Beautiful default theme
- Excellent accessibility out of the box
- Fast build times

**Cons:**
- Newer (less mature than Docusaurus)
- Smaller plugin ecosystem
- Would require learning Astro patterns

---

### 3. Fumadocs - Next.js Native
**Status:** Production-ready (v16)

| Aspect | Assessment |
|--------|------------|
| **MDX Support** | Full - Deep Next.js integration |
| **Build Performance** | Excellent - RSC, minimal client JS |
| **Ecosystem** | Medium - Growing |
| **Learning Curve** | Low if using Next.js elsewhere |
| **Active Development** | Yes - Regular updates |

**Pros:**
- Native Next.js (if already in your stack)
- React Server Components support
- TypeScript Twoslash for type hints in code blocks
- OpenAPI playground built-in
- Very customizable

**Cons:**
- Smaller community than Docusaurus
- Tighter coupling to Next.js

---

### 4. Rspress - Performance Focused
**Status:** Production-ready

| Aspect | Assessment |
|--------|------------|
| **MDX Support** | Full - Uses mdx-rs for speed |
| **Build Performance** | Best - Rust-based toolchain |
| **Ecosystem** | Small - Newer project |
| **Learning Curve** | Low - Similar API to Docusaurus |
| **Active Development** | Yes - ByteDance backing |

**Pros:**
- Fastest build times (Rust toolchain)
- Simple configuration
- Built-in search
- Multi-version docs out of the box

**Cons:**
- Smallest ecosystem
- Less mature

---

## Recommendation

### For This Project: **Starlight** or **Docusaurus** (depending on your priorities)

#### Choose **Starlight** if:
- You want the lightest possible output (minimal JS shipped to browser)
- You're interested in using components from different frameworks
- You want built-in instant search without external services
- You're willing to learn Astro's patterns
- Performance and modern architecture are priorities

#### Choose **Docusaurus** if:
- You want to minimize setup time by copying from forge-monorepo
- You need the most robust plugin ecosystem
- You prefer battle-tested stability over cutting-edge
- You want to leverage your existing knowledge

### My Recommendation: **Starlight**

Given that this is a new project and you're already asking about better options for 2025/2026:

1. **Starlight has momentum** - Major companies like Cloudflare have migrated to it
2. **Better performance model** - Ships near-zero JavaScript by default
3. **Future-proof** - Built on Astro which continues to innovate
4. **Still supports MDX** - You don't lose any capability
5. **New project = fresh start** - No migration burden

---

## Implementation Plan

### Option A: Starlight Implementation

#### Phase 1: Setup (1-2 hours)
1. Create `apps/docs` directory
2. Initialize Starlight project: `pnpm create astro@latest -- --template starlight`
3. Configure for monorepo (pnpm workspace)
4. Set up TypeScript

#### Phase 2: Configuration
1. Configure `astro.config.mjs`:
   - Site metadata
   - Sidebar structure
   - Social links
   - Theme customization
2. Add MDX support and custom components
3. Configure Mermaid diagrams (if needed)

#### Phase 3: Content Migration/Creation
1. Create initial documentation structure:
   ```
   apps/docs/
   ├── src/
   │   ├── content/
   │   │   └── docs/
   │   │       ├── getting-started/
   │   │       ├── architecture/
   │   │       ├── development/
   │   │       ├── api/
   │   │       └── operations/
   │   └── components/  # Custom MDX components
   ├── astro.config.mjs
   └── package.json
   ```

#### Phase 4: Integration
1. Add to turbo.json pipeline
2. Configure dev/build scripts
3. Set up deployment configuration

---

### Option B: Docusaurus Implementation (Familiar Path)

#### Phase 1: Setup
1. Create `apps/docs` directory
2. Initialize Docusaurus: `pnpm create docusaurus@latest`
3. Copy configuration patterns from forge-docs-ui

#### Phase 2: Configuration
1. Adapt `docusaurus.config.ts` from forge-monorepo
2. Configure theme, navigation, footer
3. Add Mermaid support
4. Set up MDX components

#### Phase 3: Content Structure
1. Mirror structure from forge-docs-ui
2. Create initial documentation sections

#### Phase 4: Integration
1. Add to turbo.json pipeline
2. Configure scripts

---

## Files to Create/Modify

### For Starlight:
```
apps/docs/                          # New directory
├── astro.config.mjs               # Starlight configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── src/
│   ├── content/
│   │   ├── config.ts             # Content collections config
│   │   └── docs/                 # Documentation markdown/mdx
│   ├── components/               # Custom components
│   └── styles/                   # Custom CSS
└── public/                       # Static assets
```

### Monorepo Updates:
```
turbo.json                         # Add docs to pipeline
pnpm-workspace.yaml               # Already includes apps/*
```

---

## Testing Approach

1. **Local Development**: Run `pnpm dev` in docs app, verify hot reload works
2. **Build Verification**: Run `pnpm build`, check for errors
3. **Link Checking**: Use built-in broken link detection
4. **Search Testing**: Verify search indexes correctly
5. **Mobile Responsiveness**: Test on various screen sizes
6. **Accessibility**: Run Lighthouse audits

---

## Potential Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Starlight learning curve | Extensive official docs, similar patterns to what you know |
| Astro unfamiliarity | Can still write React components via islands |
| Plugin availability | Starlight covers 90% of use cases out of the box |
| Long-term support | Astro/Starlight is well-funded with growing adoption |

---

## Decision Required

Please confirm which approach you'd like to proceed with:

1. **Starlight** - Modern, lightweight, growing ecosystem
2. **Docusaurus** - Familiar, proven, extensive ecosystem
3. **Fumadocs** - If you plan to use Next.js heavily elsewhere
4. **Rspress** - If raw build speed is the top priority

Once you decide, I can proceed with the full implementation.

---

## Sources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Starlight Official Site](https://starlight.astro.build/)
- [Fumadocs](https://fumadocs.dev/)
- [Rspress Introduction](https://rspress.rs/guide/start/introduction)
- [Top 5 Open-Source Documentation Tools in 2025](https://hackmamba.io/technical-documentation/top-5-open-source-documentation-development-platforms-of-2024/)
- [Best Developer Documentation Tools in 2025](https://www.infrasity.com/blog/best-documentation-tools-for-developers)
- [Starlight vs. Docusaurus Comparison](https://blog.logrocket.com/starlight-vs-docusaurus-building-documentation/)
- [15 Best Documentation Tools 2025](https://dev.to/therealmrmumba/i-tried-15-of-the-best-documentation-tools-heres-what-actually-works-in-2025-dam)
