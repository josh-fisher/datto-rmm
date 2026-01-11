// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.datto-rmm.local', // Update for production
  integrations: [
    starlight({
      title: 'Datto RMM Docs',
      description: 'Documentation for Datto RMM tooling monorepo',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/josh-fisher/datto-rmm', // Update with actual repo
        },
      ],
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'Project Structure', slug: 'getting-started/project-structure' },
          ],
        },
        {
          label: 'Architecture',
          autogenerate: { directory: 'architecture' },
        },
        {
          label: 'Development',
          autogenerate: { directory: 'development' },
        },
        {
          label: 'API Reference',
          items: [
            { label: 'TypeScript Client', slug: 'api/typescript-client' },
            { label: 'MCP Server', slug: 'api/mcp-server' },
            { label: 'Rust Client', slug: 'api/rust-client' },
          ],
        },
        {
          label: 'Operations',
          autogenerate: { directory: 'operations' },
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/josh-fisher/datto-rmm/edit/main/apps/docs/',
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      lastUpdated: true,
    }),
  ],
});
