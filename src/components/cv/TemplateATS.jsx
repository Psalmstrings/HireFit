import React from 'react';

const TemplateATS = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo = {},
    professionalTitle,
    professionalSummary,
    careerObjective,
    targetRoles = [],
    skills = {},
    coreSkills = {},
    techStack = {},
    workExperience = [],
    projectExperience = [],
    projects = [],
    education = [],
    certifications = [],
    awards = [],
    volunteerExperience = [],
    publications = [],
    training = [],
    courses = [],
    languages = [],
    references = [],
    additionalSections = []
  } = data;

  const displayProjects = (projectExperience && projectExperience.length > 0) ? projectExperience : (projects || []);
  const titleToDisplay = professionalTitle || (targetRoles.length > 0 ? targetRoles.join(' | ') : '');

  const contactPieces = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio
  ].filter(Boolean);

  const hasTechStack = techStack && (
    (techStack.languages && techStack.languages.length > 0) ||
    (techStack.frontend && techStack.frontend.length > 0) ||
    (techStack.backend && techStack.backend.length > 0) ||
    (techStack.database && techStack.database.length > 0) ||
    (techStack.versionControl && techStack.versionControl.length > 0)
  );

  return (
    <div className="cv-sheet template-minimal">
      {/* Header */}
      <div className="cv-header">
        <h1 className="cv-name">{personalInfo.fullName || 'Candidate Name'}</h1>
        {titleToDisplay && (
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: 2, marginBottom: 4 }}>
            {titleToDisplay}
          </div>
        )}
        <div className="cv-contact-row">
          {contactPieces.join(' | ')}
        </div>
      </div>

      {/* Summary */}
      {professionalSummary && (
        <div className="cv-section">
          <div className="cv-section-title">PROFESSIONAL SUMMARY</div>
          <p>{professionalSummary}</p>
        </div>
      )}

      {/* Career Objective */}
      {careerObjective && careerObjective !== professionalSummary && (
        <div className="cv-section">
          <div className="cv-section-title">CAREER OBJECTIVE</div>
          <p>{careerObjective}</p>
        </div>
      )}

      {/* Tech Stack */}
      {hasTechStack && (
        <div className="cv-section">
          <div className="cv-section-title">TECH STACK</div>
          {techStack.languages?.length > 0 && (
            <p><strong>Languages:</strong> {techStack.languages.join(', ')}</p>
          )}
          {techStack.frontend?.length > 0 && (
            <p><strong>Frontend:</strong> {techStack.frontend.join(', ')}</p>
          )}
          {techStack.backend?.length > 0 && (
            <p><strong>Backend:</strong> {techStack.backend.join(', ')}</p>
          )}
          {techStack.database?.length > 0 && (
            <p><strong>Databases:</strong> {techStack.database.join(', ')}</p>
          )}
          {techStack.versionControl?.length > 0 && (
            <p><strong>Version Control & Tools:</strong> {techStack.versionControl.join(', ')}</p>
          )}
        </div>
      )}

      {/* Technical Skills */}
      {(skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0) && (
        <div className="cv-section">
          <div className="cv-section-title">CORE SKILLS & COMPETENCIES</div>
          {skills.technical?.length > 0 && (
            <p><strong>Technical Competencies:</strong> {skills.technical.join(', ')}</p>
          )}
          {skills.tools?.length > 0 && (
            <p><strong>Tools & Platforms:</strong> {skills.tools.join(', ')}</p>
          )}
          {skills.soft?.length > 0 && (
            <p><strong>Professional Strengths:</strong> {skills.soft.join(', ')}</p>
          )}
        </div>
      )}

      {/* Project Experience */}
      {displayProjects.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">PROJECT EXPERIENCE</div>
          {displayProjects.map((proj, idx) => (
            <div key={idx} className="cv-item" style={{ marginBottom: 12 }}>
              <div className="cv-item-header">
                <span><strong>{proj.name}</strong>{proj.role ? ` (${proj.role})` : ''}</span>
                {proj.technologies?.length > 0 && (
                  <span style={{ fontSize: '11px', color: '#334155' }}>[{proj.technologies.join(', ')}]</span>
                )}
              </div>
              {proj.description && <p style={{ margin: '2px 0 4px 0' }}>{proj.description}</p>}
              {proj.achievements?.length > 0 && (
                <ul className="cv-bullet-list">
                  {proj.achievements.map((ach, aIdx) => (
                    <li key={`pa-${aIdx}`}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">PROFESSIONAL EXPERIENCE</div>
          {workExperience.map((job, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span><strong>{job.jobTitle}</strong></span>
                <span>{job.startDate} - {job.current ? 'Present' : (job.endDate || 'Present')}</span>
              </div>
              <div className="cv-item-sub">
                <span>{job.company}{job.location ? ` | ${job.location}` : ''}</span>
              </div>
              <ul className="cv-bullet-list">
                {(job.responsibilities || []).map((resp, rIdx) => (
                  <li key={`r-${rIdx}`}>{resp}</li>
                ))}
                {(job.achievements || []).map((ach, aIdx) => (
                  <li key={`a-${aIdx}`}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">EDUCATION</div>
          {education.map((edu, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span><strong>{edu.institution}</strong></span>
                <span>{edu.startDate ? `${edu.startDate} - ` : ''}{edu.endDate}</span>
              </div>
              <div className="cv-item-sub">
                <span>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">CERTIFICATIONS</div>
          <ul className="cv-bullet-list">
            {certifications.map((c, idx) => (
              <li key={idx}>{typeof c === 'string' ? c : (c.name || c.title || JSON.stringify(c))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <div className="ats-section">
          <div className="ats-section-title">AWARDS & HONORS</div>
          <ul>{awards.map((a, i) => <li key={i}>{typeof a === 'string' ? a : (a.title || a.name || JSON.stringify(a))}</li>)}</ul>
        </div>
      )}

      {/* Volunteer */}
      {volunteerExperience.length > 0 && (
        <div className="ats-section">
          <div className="ats-section-title">VOLUNTEER EXPERIENCE</div>
          <ul>{volunteerExperience.map((v, i) => <li key={i}>{typeof v === 'string' ? v : (v.role ? `${v.role} at ${v.organization}` : JSON.stringify(v))}</li>)}</ul>
        </div>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <div className="ats-section">
          <div className="ats-section-title">PUBLICATIONS</div>
          <ul>{publications.map((p, i) => <li key={i}>{typeof p === 'string' ? p : (p.title || JSON.stringify(p))}</li>)}</ul>
        </div>
      )}

      {/* Spoken Languages */}
      {languages.length > 0 && (
        <div className="ats-section">
          <div className="ats-section-title">LANGUAGES</div>
          <p>{languages.map(l => typeof l === 'string' ? l : `${l.language || l.name} (${l.proficiency || 'Fluent'})`).join(' • ')}</p>
        </div>
      )}

      {/* References */}
      {references.length > 0 && (
        <div className="ats-section">
          <div className="ats-section-title">REFERENCES</div>
          <ul>{references.map((r, i) => <li key={i}>{typeof r === 'string' ? r : (r.name ? `${r.name} (${r.title || 'Reference'})` : JSON.stringify(r))}</li>)}</ul>
        </div>
      )}

      {/* Additional Sections */}
      {additionalSections.length > 0 && additionalSections.map((sec, i) => (
        <div key={i} className="ats-section">
          <div className="ats-section-title">{(sec.sectionTitle || 'ADDITIONAL INFORMATION').toUpperCase()}</div>
          <p style={{ whiteSpace: 'pre-line' }}>{sec.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TemplateATS;
