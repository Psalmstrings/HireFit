import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

const TemplateModern = ({ data }) => {
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
    achievements = [],
    volunteerExperience = [],
    publications = [],
    training = [],
    courses = [],
    languages = [],
    references = [],
    additionalSections = []
  } = data;

  const displayProjects = (projectExperience && projectExperience.length > 0) ? projectExperience : (projects || []);
  const titleToDisplay = professionalTitle || (targetRoles.length > 0 ? targetRoles.join(' • ') : '');

  // Detect if structured tech stack is present
  const hasTechStack = techStack && (
    (techStack.languages && techStack.languages.length > 0) ||
    (techStack.frontend && techStack.frontend.length > 0) ||
    (techStack.backend && techStack.backend.length > 0) ||
    (techStack.database && techStack.database.length > 0) ||
    (techStack.versionControl && techStack.versionControl.length > 0) ||
    (techStack.other && techStack.other.length > 0)
  );

  // Detect if structured core skills are present
  const hasCoreSkills = coreSkills && (
    (coreSkills.frontendDevelopment && coreSkills.frontendDevelopment.length > 0) ||
    (coreSkills.backendDevelopment && coreSkills.backendDevelopment.length > 0) ||
    (coreSkills.databases && coreSkills.databases.length > 0) ||
    (coreSkills.toolsAndTechnologies && coreSkills.toolsAndTechnologies.length > 0)
  );

  return (
    <div className="cv-sheet template-modern">
      {/* Header */}
      <div className="cv-header">
        <h1 className="cv-name">{personalInfo.fullName || 'Candidate Name'}</h1>
        {titleToDisplay && (
          <div className="cv-title-tag">{titleToDisplay}</div>
        )}
        <div className="cv-contact-row">
          {personalInfo.email && (
            <span className="cv-contact-item"><Mail size={12} /> {personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="cv-contact-item"><Phone size={12} /> {personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="cv-contact-item"><MapPin size={12} /> {personalInfo.location}</span>
          )}
          {personalInfo.linkedin && (
            <span className="cv-contact-item"><Linkedin size={12} /> {personalInfo.linkedin}</span>
          )}
          {personalInfo.github && (
            <span className="cv-contact-item"><Github size={12} /> {personalInfo.github}</span>
          )}
          {personalInfo.portfolio && (
            <span className="cv-contact-item"><Globe size={12} /> {personalInfo.portfolio}</span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {professionalSummary && (
        <div className="cv-section">
          <div className="cv-section-title">Professional Summary</div>
          <p style={{ color: '#334155', lineHeight: 1.6, margin: 0 }}>{professionalSummary}</p>
        </div>
      )}

      {/* Career Objective (if distinct from summary) */}
      {careerObjective && careerObjective !== professionalSummary && (
        <div className="cv-section">
          <div className="cv-section-title">Career Objective</div>
          <p style={{ color: '#334155', lineHeight: 1.6, margin: 0 }}>{careerObjective}</p>
        </div>
      )}

      {/* Tech Stack (if distinct section exists) */}
      {hasTechStack && (
        <div className="cv-section">
          <div className="cv-section-title">Tech Stack</div>
          {techStack.languages?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Languages: </span>
              <span style={{ color: '#334155' }}>{techStack.languages.join(', ')}</span>
            </div>
          )}
          {techStack.frontend?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Frontend: </span>
              <span style={{ color: '#334155' }}>{techStack.frontend.join(', ')}</span>
            </div>
          )}
          {techStack.backend?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Backend: </span>
              <span style={{ color: '#334155' }}>{techStack.backend.join(', ')}</span>
            </div>
          )}
          {techStack.database?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Databases: </span>
              <span style={{ color: '#334155' }}>{techStack.database.join(', ')}</span>
            </div>
          )}
          {techStack.versionControl?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Version Control & Tools: </span>
              <span style={{ color: '#334155' }}>{techStack.versionControl.join(', ')}</span>
            </div>
          )}
          {techStack.other?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Other Technologies: </span>
              <span style={{ color: '#334155' }}>{techStack.other.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Core Competencies & Skills */}
      {(hasCoreSkills || skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0) && (
        <div className="cv-section">
          <div className="cv-section-title">Core Skills & Competencies</div>
          {coreSkills.frontendDevelopment?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Frontend Development: </span>
              <span style={{ color: '#334155' }}>{coreSkills.frontendDevelopment.join(', ')}</span>
            </div>
          )}
          {coreSkills.backendDevelopment?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Backend Development: </span>
              <span style={{ color: '#334155' }}>{coreSkills.backendDevelopment.join(', ')}</span>
            </div>
          )}
          {coreSkills.databases?.length > 0 && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Databases: </span>
              <span style={{ color: '#334155' }}>{coreSkills.databases.join(', ')}</span>
            </div>
          )}
          {skills.technical?.length > 0 && !hasCoreSkills && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Technical Skills: </span>
              <span style={{ color: '#334155' }}>{skills.technical.join(', ')}</span>
            </div>
          )}
          {(coreSkills.toolsAndTechnologies?.length > 0 || skills.tools?.length > 0) && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Tools & Technologies: </span>
              <span style={{ color: '#334155' }}>
                {(coreSkills.toolsAndTechnologies?.length > 0 ? coreSkills.toolsAndTechnologies : skills.tools).join(', ')}
              </span>
            </div>
          )}
          {(coreSkills.softSkills?.length > 0 || skills.soft?.length > 0) && (
            <div className="cv-skill-group">
              <span className="cv-skill-group-title">Soft Skills & Leadership: </span>
              <span style={{ color: '#334155' }}>
                {(coreSkills.softSkills?.length > 0 ? coreSkills.softSkills : skills.soft).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Project Experience */}
      {displayProjects.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Project Experience</div>
          {displayProjects.map((proj, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span>
                  <strong>{proj.name}</strong>
                  {proj.role ? ` — ${proj.role}` : ''}
                </span>
                {proj.technologies?.length > 0 && (
                  <span style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 600 }}>
                    {proj.technologies.join(', ')}
                  </span>
                )}
              </div>
              {proj.description && (
                <p style={{ color: '#334155', marginTop: 2, marginBottom: 4 }}>{proj.description}</p>
              )}
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
          <div className="cv-section-title">Work Experience</div>
          {workExperience.map((job, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span><strong>{job.jobTitle || 'Role'}</strong></span>
                <span style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {job.startDate} – {job.current ? 'Present' : (job.endDate || 'Present')}
                </span>
              </div>
              <div className="cv-item-sub">
                <span>{job.company}{job.location ? ` | ${job.location}` : ''}</span>
              </div>
              <ul className="cv-bullet-list">
                {(job.responsibilities || []).map((resp, rIdx) => (
                  <li key={`r-${rIdx}`}>{resp}</li>
                ))}
                {(job.achievements || []).map((ach, aIdx) => (
                  <li key={`a-${aIdx}`} style={{ fontWeight: 500 }}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Education</div>
          {education.map((edu, idx) => (
            <div key={idx} className="cv-item">
              <div className="cv-item-header">
                <span><strong>{edu.institution}</strong></span>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate}
                </span>
              </div>
              <div className="cv-item-sub">
                <span>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
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

      {/* Awards & Honors */}
      {awards.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Awards & Honors</div>
          <ul className="cv-bullet-list">
            {awards.map((award, idx) => (
              <li key={idx}>{typeof award === 'string' ? award : (award.title || award.name || JSON.stringify(award))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Volunteer Experience */}
      {volunteerExperience.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Volunteer & Community</div>
          <ul className="cv-bullet-list">
            {volunteerExperience.map((vol, idx) => (
              <li key={idx}>{typeof vol === 'string' ? vol : (vol.role ? `${vol.role} at ${vol.organization}` : JSON.stringify(vol))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Publications</div>
          <ul className="cv-bullet-list">
            {publications.map((pub, idx) => (
              <li key={idx}>{typeof pub === 'string' ? pub : (pub.title || JSON.stringify(pub))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Training & Courses */}
      {(training.length > 0 || courses.length > 0) && (
        <div className="cv-section">
          <div className="cv-section-title">Training & Courses</div>
          <ul className="cv-bullet-list">
            {[...(training || []), ...(courses || [])].map((item, idx) => (
              <li key={idx}>{typeof item === 'string' ? item : (item.name || item.title || JSON.stringify(item))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages (STRICTLY HUMAN SPOKEN LANGUAGES) */}
      {languages.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">Languages</div>
          <p style={{ color: '#334155', margin: 0, fontWeight: 500 }}>
            {languages.map(l => typeof l === 'string' ? l : `${l.language || l.name} (${l.proficiency || 'Fluent'})`).join(' • ')}
          </p>
        </div>
      )}

      {/* References */}
      {references.length > 0 && (
        <div className="cv-section">
          <div className="cv-section-title">References</div>
          <ul className="cv-bullet-list">
            {references.map((ref, idx) => (
              <li key={idx}>{typeof ref === 'string' ? ref : (ref.name ? `${ref.name} (${ref.title || 'Reference'})` : JSON.stringify(ref))}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional / Custom Sections (Part 20) */}
      {additionalSections.length > 0 && additionalSections.map((sec, idx) => (
        <div key={`sec-${idx}`} className="cv-section">
          <div className="cv-section-title">{sec.sectionTitle || 'Additional Information'}</div>
          <p style={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>{sec.content}</p>
        </div>
      ))}
    </div>
  );
};

export default TemplateModern;
