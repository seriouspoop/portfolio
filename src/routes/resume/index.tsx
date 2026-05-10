import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { portfolioData } from 'virtual:portfolio-data';
import { isTimelineSection, isGridSection, isSkillGridSection } from '../../types/components';

export default component$(() => {
  // Extract sections
  const experienceSection = portfolioData.sections.find(s => s.id === 'experience');
  const projectsSection = portfolioData.sections.find(s => s.id === 'projects');
  const skillsSection = portfolioData.sections.find(s => s.id === 'skills');

  // Filter content for resume
  const resumeExperience = experienceSection && isTimelineSection(experienceSection)
    ? experienceSection.items.filter(job => job.include_in_resume !== false)
    : [];

  const resumeProjects = projectsSection && isGridSection(projectsSection)
    ? projectsSection.items
        .filter(p => p.include_in_resume === true)
        .sort((a, b) => (a.resume_priority || 99) - (b.resume_priority || 99))
        .slice(0, 3) // Max 3 projects
    : [];

  return (
    <div class="min-h-screen bg-white text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Print-specific styles - embedded for portability */}
      <style dangerouslySetInnerHTML={`
        /* Print-specific settings that are hard to do with Tailwind */
        @media print {
          @page {
            size: letter;
            margin: 0; /* Forces browser to drop headers/footers */
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }

        /* Typography fallbacks or very specific units if needed */
      `} />

      <div class="max-w-[8.5in] mx-auto py-6 px-8 bg-white text-[10pt] leading-[1.3] print:text-[9.5pt] print:leading-[1.25] print:max-w-full print:py-0 print:px-[0.6in] print:m-0">
        
        {/* Print Instructions Banner (hidden when printing) */}
        <div class="print:hidden bg-emerald-50 border border-emerald-100 p-4 sm:py-2.5 sm:px-4 mb-8 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4 text-left">
            <div class="w-12 h-12 sm:w-13 sm:h-13 bg-emerald-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-200">
              <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <div class="flex flex-col gap-0.5 sm:gap-1">
              <p class="font-bold text-gray-900 text-sm sm:text-base">Print to PDF</p>
              <p class="text-xs sm:text-ms text-gray-600 leading-tight">
                Press <kbd class="inline-block px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.6rem] sm:text-[0.65rem] font-mono font-bold">Ctrl</kbd>+<kbd class="inline-block px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.6rem] sm:text-[0.65rem] font-mono font-bold">P</kbd> or <kbd class="inline-block px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.6rem] sm:text-[0.65rem] font-mono font-bold">⌘</kbd>+<kbd class="inline-block px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.6rem] sm:text-[0.65rem] font-mono font-bold">P</kbd> and select <strong>"Save as PDF"</strong>.
              </p>
            </div>
          </div>
          <a href="/" class="whitespace-nowrap text-ms font-bold text-emerald-600 hover:text-emerald-700 bg-white px-5 py-3 rounded-lg border border-emerald-100 shadow-sm transition-all hover:shadow-md text-center">
            Back to Portfolio
          </a>
        </div>

        {/* --- START OF TABLE HACK FOR PRINT MARGINS --- */}
        <table class="w-full border-collapse border-0 border-spacing-0">
          {/* 1. Repeating Top Margin */}
          <thead class="hidden print:table-header-group">
            <tr><td class="p-0"><div class="h-[0.4in]"></div></td></tr>
          </thead>
          
          {/* 2. Main Content Body */}
          <tbody>
            <tr>
              <td class="p-0 align-top">
                
                {/* Header Section */}
                <header class="border-b-2 border-emerald-500 pb-1.5 mb-2.5">
                  <div class="grid grid-cols-2 gap-4 items-start print:gap-3">
                    {/* Left Column */}
                    <div class="flex flex-col">
                      <h1 class="text-[1.8rem] font-bold text-gray-900 mb-0.5 tracking-tight leading-[1.1] print:text-[1.6rem] break-after-avoid">
                        {portfolioData.profile.name}
                      </h1>
                      <div class="text-[0.9rem] font-semibold text-emerald-500 tracking-widest print:text-[0.85rem]">
                        {portfolioData.profile.role}
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div class="flex flex-col items-end gap-1 text-right">
                      <div class="flex flex-col items-end gap-0.5">
                        {portfolioData.profile.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[0.8rem] text-emerald-500 no-underline leading-[1.3] hover:underline print:text-[0.75rem] print:text-emerald-600"
                          >
                            {link.type === 'email' 
                              ? link.url.replace('mailto:', '')
                              : link.url.replace('https://', '').replace('www.', '')}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div class="col-span-2 text-ms text-gray-500 leading-[1.3] mt-1 print:text-[0.75rem]">
                        {portfolioData.profile.tagline}
                    </div>
                  </div>
                </header>

                {/* Experience Section */}
                {resumeExperience.length > 0 && (
                  <section class="mb-8 print:mb-4">
                    <h2 class="text-[0.9rem] print:text-[0.8rem] font-bold text-gray-900 border-b border-gray-200 pb-0.5 mt-3 mb-1.5 tracking-widest uppercase print:mt-1 print:mb-1 break-after-avoid">
                      Professional Experience
                    </h2>
                    <div class="space-y-6 print:space-y-3">
                      {resumeExperience.map((job, idx) => (
                        <div key={idx} class="mb-4 print:mb-1.5 break-inside-avoid">
                          {/* Job Title and Period */}
                          <div class="flex justify-between items-baseline mb-0.5 gap-4">
                            <h3 class="text-[1.05rem] print:text-[0.9rem] font-bold text-gray-900 leading-tight">
                              {job.role}
                            </h3>
                            <span class="text-sm print:text-[0.75rem] text-gray-500 whitespace-nowrap font-bold">
                              {job.period}
                            </span>
                          </div>
                          
                          {/* Company */}
                          <div class="flex items-center gap-2 mb-2 print:mb-1 text-sm print:text-[0.75rem]">
                            {job.company_url ? (
                              <a
                                href={job.company_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-emerald-600 font-bold hover:underline"
                              >
                                {job.company}
                              </a>
                            ) : (
                              <span class="text-gray-800 font-bold">
                                {job.company}
                              </span>
                            )}
                            {job.location && (
                              <span class="text-gray-400 font-medium ml-1 flex items-center gap-1">
                                • {job.location}
                              </span>
                            )}
                          </div>
                          
                          {/* Summary/Highlights */}
                          {job.resume_highlights ? (
                            <ul class="list-none space-y-1 print:space-y-0.5 mb-2 print:mb-1.5 text-[0.875rem] print:text-[0.75rem] text-gray-600">
                              {job.resume_highlights.map((highlight, hIdx) => (
                                <li key={hIdx} class="flex items-start gap-2.5 print:gap-1.5">
                                  <span class="text-emerald-500 font-black mt-1 print:mt-0.5 text-[10px] print:text-[7px]">▶</span>
                                  <span class="leading-relaxed">{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p class="text-[0.925rem] print:text-[0.75rem] text-gray-700 mb-2 print:mb-1.5 leading-relaxed font-medium">
                              {job.resume_summary || job.summary}
                            </p>
                          )}
                          
                          {/* Technologies */}
                          <div class="flex flex-wrap gap-1.5 print:gap-1">
                            {job.tech.slice(0, 6).map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                class="px-2 py-0.5 print:px-1.5 print:py-[1px] bg-gray-50 text-gray-600 text-[10px] print:text-[7px] font-bold uppercase tracking-wider rounded border border-gray-100 print:border-gray-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects Section */}
                {resumeProjects.length > 0 && (
                  <section class="mb-8 print:mb-4">
                    <h2 class="text-[0.9rem] print:text-[0.8rem] font-bold text-gray-900 border-b border-gray-200 pb-0.5 mt-3 mb-1.5 tracking-widest uppercase print:mt-1 print:mb-1 break-after-avoid">
                      Key Projects
                    </h2>
                    <div class="grid grid-cols-1 gap-3 print:gap-2">
                      {resumeProjects.map((project, idx) => (
                        <div key={idx} class="break-inside-avoid">
                          <div class="flex justify-between items-baseline mb-1 print:mb-0.5">
                            <h3 class="text-base print:text-[0.9rem] font-bold text-gray-900">
                              {project.name}
                            </h3>
                            <div class="flex gap-3 print:gap-1.5 text-ms print:text-[0.75rem] font-bold uppercase tracking-tighter">
                              {project.links?.map((link, lIdx) => (
                                <a
                                  key={lIdx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="text-emerald-600 hover:underline"
                                >
                                  {link.type}
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <p class="text-sm print:text-[0.75rem] text-gray-700 mb-2 print:mb-1 leading-relaxed">
                            <span class="font-bold text-gray-900 mr-1">{project.tagline}:</span>
                            {project.summary}
                          </p>
                          
                          <div class="flex flex-wrap gap-1.5 print:gap-1">
                            {project.tech.slice(0, 6).map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                class="px-2 py-0.5 print:px-1.5 print:py-[1px] bg-emerald-50 text-emerald-700 text-[10px] print:text-[7px] font-bold uppercase tracking-wider rounded border border-emerald-100 print:border-emerald-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills Section */}
                {skillsSection && isSkillGridSection(skillsSection) && (
                  <section class="mb-8 print:mb-4">
                    <h2 class="text-[0.9rem] print:text-[0.8rem] font-bold text-gray-900 border-b border-gray-200 pb-0.5 mt-3 mb-1.5 tracking-widest uppercase print:mt-1 print:mb-1 break-after-avoid">
                      Technical Skills
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-12 print:gap-x-8 gap-y-3 print:gap-y-1.5">
                      {skillsSection.items.map((category, idx) => (
                        <div key={idx} class="flex flex-col gap-1 print:gap-0 break-inside-avoid">
                          <span class="text-xs print:text-[0.65rem] font-black text-emerald-600 uppercase tracking-widest">
                            {category.category}
                          </span>
                          <span class="text-sm print:text-[0.75rem] text-gray-700 leading-relaxed font-medium">
                            {category.items
                              .filter(s => s.level === 'expert' || s.level === 'advanced' || s.level === 'adept' )
                              .map(s => s.name)
                              .join(' • ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Footer */}
                <footer class="mt-12 pt-6 border-t border-gray-100 text-center text-[10px] text-gray-400 print:hidden flex justify-between items-center">
                  <p>Generated from portfolio.yaml</p>
                  <p>© {new Date().getFullYear()} {portfolioData.profile.name}</p>
                  <p>System Online</p>
                </footer>

              </td>
            </tr>
          </tbody>

          {/* 3. Repeating Bottom Margin */}
          <tfoot class="hidden print:table-footer-group">
            <tr><td class="p-0"><div class="h-[0.4in]"></div></td></tr>
          </tfoot>
        </table>
        {/* --- END OF TABLE HACK --- */}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: `${portfolioData.profile.name} - Resume`,
  meta: [
    {
      name: "description",
      content: `Professional resume of ${portfolioData.profile.name} - ${portfolioData.profile.role}`,
    },
    {
      name: "robots",
      content: "noindex, nofollow",

    },
  ],
  links: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2310b981'/%3E%3C/svg%3E",
    },
  ],
};