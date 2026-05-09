import type { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'yaml';

export function portfolioYamlPlugin(): Plugin {
  const virtualModuleId = 'virtual:portfolio-data';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-portfolio-yaml',

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        try {
          const yamlPath = resolve(process.cwd(), 'portfolio.yaml');
          const yamlContent = readFileSync(yamlPath, 'utf-8');
          const parsedData = parse(yamlContent);

          if (!parsedData.meta || !parsedData.profile || !parsedData.sections) {
            throw new Error('Invalid portfolio.yaml: missing required fields (meta, profile, or sections)');
          }

          const validComponents = [
            'hero', 'timeline', 'grid', 'experience_card',
            'project_card', 'skill_grid', 'contact_section'
          ];

          const validateComponent = (item: any, path: string) => {
            if (item.component && !validComponents.includes(item.component)) {
              throw new Error(
                `Invalid component type "${item.component}" at ${path}. ` +
                `Valid types: ${validComponents.join(', ')}`
              );
            }
          };

          validateComponent(parsedData.profile, 'profile');

          parsedData.sections.forEach((section: any, sectionIndex: number) => {
            validateComponent(section, `sections[${sectionIndex}]`);
            if (section.items && Array.isArray(section.items)) {
              section.items.forEach((item: any, itemIndex: number) => {
                validateComponent(item, `sections[${sectionIndex}].items[${itemIndex}]`);
              });
            }
          });

          return `export const portfolioData = ${JSON.stringify(parsedData, null, 2)};`;
        } catch (error: any) {
          this.error(`Failed to load portfolio.yaml: ${error.message}`);
        }
      }
    },

    configureServer(server) {
      const yamlPath = resolve(process.cwd(), 'portfolio.yaml');

      server.watcher.add(yamlPath);

      server.watcher.on('change', (path) => {
        if (path === yamlPath) {
          const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
          if (module) {
            server.moduleGraph.invalidateModule(module);
            server.ws.send({ type: 'full-reload', path: '*' });
          }
        }
      });
    }
  };
}
