namespace Portfolio.Api.Models;

public class PortfolioData
{
    public Profile Profile { get; set; } = new();
    public List<Education> Education { get; set; } = [];
    public List<Experience> Experience { get; set; } = [];
    public List<Project> Projects { get; set; } = [];
    public List<SkillCategory> Skills { get; set; } = [];
}

public class Profile
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Github { get; set; } = string.Empty;
    public string Linkedin { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
}

public class Education
{
    public int Id { get; set; }
    public string University { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public string GraduationDate { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string Gpa { get; set; } = string.Empty;
}

public class Experience
{
    public int Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public List<string> Description { get; set; } = [];
}

public class Project
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public List<string> Technologies { get; set; } = [];
    public string Summary { get; set; } = string.Empty;
    public List<string> Description { get; set; } = [];
    public List<string> Challenges { get; set; } = [];
    public List<string> Outcomes { get; set; } = [];
    public string Year { get; set; } = string.Empty;
}

public class SkillCategory
{
    public string Category { get; set; } = string.Empty;
    public string Technologies { get; set; } = string.Empty;
}

public class TextChunk
{
    public required string Id { get; set; }
    public required string Section { get; set; }
    public required string Text { get; set; }
}

public record ChatRequest(string Message, List<ChatMessageDto>? History);
public record ChatMessageDto(string Role, string Content);
public record ChatResponse(string Reply, List<string> Sources);

public record ContactRequest(string Name, string Email, string Subject, string Message);
public record ContactResponse(bool Success, string Message);
