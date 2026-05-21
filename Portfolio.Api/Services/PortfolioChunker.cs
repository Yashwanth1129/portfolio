using System.Text;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

public class PortfolioChunker
{
    public static List<TextChunk> Chunk(PortfolioData data)
    {
        var chunks = new List<TextChunk>();

        chunks.Add(new TextChunk
        {
            Id = "profile",
            Section = "profile",
            Text = $"""
                Name: {data.Profile.Name}
                Title: {data.Profile.Title}
                Email: {data.Profile.Email}
                Phone: {data.Profile.Phone}
                Bio: {data.Profile.Bio}
                """
        });

        foreach (var edu in data.Education)
        {
            chunks.Add(new TextChunk
            {
                Id = $"education-{edu.Id}",
                Section = "education",
                Text = $"""
                    Education at {edu.University}
                    Degree: {edu.Degree} in {edu.Major}
                    Period: {edu.StartDate} to {edu.EndDate}
                    Graduation: {edu.GraduationDate}
                    GPA: {edu.Gpa}
                    """
            });
        }

        if (data.Certifications.Count > 0)
        {
            var certSummary = new StringBuilder();
            certSummary.AppendLine("Microsoft Azure certifications held by Yashwanth Anantha:");
            foreach (var cert in data.Certifications)
            {
                certSummary.AppendLine($"- {cert.Issuer} {cert.Code}: {cert.Name}");
            }

            chunks.Add(new TextChunk
            {
                Id = "certifications-summary",
                Section = "certifications",
                Text = certSummary.ToString()
            });
        }

        foreach (var cert in data.Certifications)
        {
            chunks.Add(new TextChunk
            {
                Id = $"certification-{cert.Id}",
                Section = "certifications",
                Text = $"""
                    Certification: {cert.Issuer} {cert.Code} — {cert.Name}
                    Exam code: {cert.Code}
                    Issuer: {cert.Issuer}
                    Full title: Microsoft {cert.Code}: {cert.Name}
                    Credential document available on portfolio (PDF path: {cert.CredentialUrl})
                    """
            });
        }

        foreach (var exp in data.Experience)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Work experience: {exp.Title} at {exp.Company}");
            sb.AppendLine($"Location: {exp.Location}");
            sb.AppendLine($"Period: {exp.StartDate} to {exp.EndDate}");
            sb.AppendLine("Responsibilities:");
            foreach (var line in exp.Description)
            {
                sb.AppendLine($"- {line}");
            }

            chunks.Add(new TextChunk
            {
                Id = $"experience-{exp.Id}",
                Section = "experience",
                Text = sb.ToString()
            });
        }

        foreach (var project in data.Projects)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Project: {project.Name} ({project.Subtitle})");
            sb.AppendLine($"Year: {project.Year}");
            sb.AppendLine($"Summary: {project.Summary}");
            sb.AppendLine($"Technologies: {string.Join(", ", project.Technologies)}");
            sb.AppendLine("Description:");
            foreach (var line in project.Description)
            {
                sb.AppendLine($"- {line}");
            }
            sb.AppendLine("Challenges:");
            foreach (var line in project.Challenges)
            {
                sb.AppendLine($"- {line}");
            }
            sb.AppendLine("Outcomes:");
            foreach (var line in project.Outcomes)
            {
                sb.AppendLine($"- {line}");
            }

            chunks.Add(new TextChunk
            {
                Id = $"project-{project.Id}",
                Section = "projects",
                Text = sb.ToString()
            });
        }

        foreach (var (skill, index) in data.Skills.Select((s, i) => (s, i)))
        {
            chunks.Add(new TextChunk
            {
                Id = $"skills-{index}",
                Section = "skills",
                Text = $"Skills - {skill.Category}: {skill.Technologies}"
            });
        }

        return chunks;
    }
}
