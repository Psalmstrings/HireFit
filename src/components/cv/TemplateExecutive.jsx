import React from 'react';

const TemplateExecutive = ({ data }) => {
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

  const hasTechStack = techStack && (
    (techStack.languages && techStack.languages.length > 0) ||
    (techStack.frontend && techStack.frontend.length > 0) ||
    (techStack.backend && techStack.backend.length > 0) ||
    (techStack.database && techStack.database.length > 0)
  );

  return (
    <div className="cv-sheet template-executive">
      <div className="cv-header">
        <h1 className="cv-name">{personalInfo.fullName || 'Candidate Name'}</h1>
        {titleToDisplay && (
          <div className="cv-title-tag">{titleToDisplay}</div>
        )}
        <div className="cv-contact-row">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
      </div>

      {professionalSummary && (
        <div className="cv-section">
          <div className="cv-section-title">Executive Summary</div>
          <p style={{ fontSize: '14px', lineHeight: 1.65 }}>{professionalSummary}</p>
        </div>
      )}

      {careerObjective && careerObjective !== professionalSummary && (
        <div className="cv-section">
          <div className="cv-section-title">Career Objective</div>
          <p style={{ fontSize: '14px', lineHeight: 1.65 }}>{careerObjective}</p>
        </div>
      )}

      {/* Tech Stack */}
      {hasTechStack && (
        <div className="cv-section">
          <div className="cv-section-title">Technical Expertise & Stack</div>
          {techStack.languages?.length > 0 && (
            <p style={{ margin: '3px 0' }}><strong>Languages:</strong> {techStack.languages.join(', ')}</p>
          )}
          {techStack.frontend?.length > 0 && (
            <p style={{ margin: '3px 0' }}><strong>Frontend:</strong> {techStack.frontend.join(', ')}</p>
          )}
          {techStack.backend?.length > 0 && (
            <p style={{ margin: '3px 0' }}><strong>Backend:</strong> {techStack.backend.join(', ')}</p>
          )}
          {techStack.database?.length > 0 && (
            <p style={{ margin: '3px 0' }}><strong>Databases:</strong> {techStack.database.join(', ')}</p>
          )}
        </div>
      )}

      {/* Core Competencies */}
      {(skills.technical?.length > 0 || skills.soft?.length > 0) && (
        <div className="cv-section">
          <div className="cv-section-title">Core Competencies & Capabilities</div>
          <p>
            {[...(skills.technical || []), ...(skills.soft || [])].join(' • ')}
          </p>
        </div>
      )}

      {/* Project Experience */}
      {displayProjects.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Key Projects & Deliverables</div>
          {displayProjects.map((proj, idx) => (
            <div key={idx} className="cv-item" style={{ marginBottom: 10 }}>
              <div className="cv-item-header">
                <span><strong>{proj.name}</strong>{proj.role ? ` — ${proj.role}` : ''}</span>
                {proj.technologies?.length > 0 && (
                  <span style={{ fontSize: '11.5px', color: '#4F46E5' }}>{proj.technologies.join(', ')}</span>
                )}
              </div>
              {proj.description && <p style={{ margin: '2px 0 4px 0', fontSize: '13px' }}>{proj.description}</p>}
              {proj.achievements?.length > 0 && (
                <ul className="cv-bullet-list">
                  {proj.achievements.map((ach, aIdx) => (
                    <li key={`epa-${aIdx}`} style={{ fontSize: '13px' }}>{ach}</li>
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
          <div className="cv-section-title">Career Experience</div>
          {workExperience.map((job, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span><strong>{job.jobTitle}</strong></span>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>
                  {job.startDate} – {job.current ? 'Present' : (job.endDate || 'Present')}
                </span>
              </div>
              <div className="cv-item-sub">
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{job.company}</span>
                <span>{job.location}</span>
              </div>
              <ul className="cv-bullet-list">
                {(job.responsibilities || []).map((resp, rIdx) => (
                  <li key={`r-${rIdx}`}>{resp}</li>
                ))}
                {(job.achievements || []).map((ach, aIdx) => (
                  <li key={`a-${aIdx}`} style={{ fontWeight: 600 }}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education & Credentials */}
      {education.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Education & Credentials</div>
          {education.map((edu, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span><strong>{edu.institution}</strong></span>
                <span style={{ fontSize: '12px' }}>{edu.endDate}</span>
              </div>
              <div className="cv-item-sub">
                <span>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Certifications</div>
          <ul className="cv-bullet-list">
            {certifications.map((cert, idx) => (
              <li key={idx}>{typeof cert === 'string' ? cert : (cert.name || cert.title || JSON.stringify(cert))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Spoken Languages */}
      {languages.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Languages</div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {languages.map(l => typeof l === 'string' ? l : `${l.language || l.name} (${l.proficiency || 'Fluent'})`).join(' • ')}
          </p>
        </div>
      )}

      {/* Additional Sections */}
      {additionalSections.length > 0 && additionalSections.map((sec, idx) => (
        <div key={`asec-${idx}`} className="cv-section">
          <div className="cv-section-title">{sec.sectionTitle || 'Additional Information'}</div>
          <p style={{ whiteSpace: 'pre-line', margin: 0, lineHeight: 1.6 }}>{sec.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TemplateExecutive;
