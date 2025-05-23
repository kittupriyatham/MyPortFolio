import os
import sys
try:
    import PyPDF2
except ImportError:
    print("PyPDF2 is not installed. Installing it now...")
    os.system(f"{sys.executable} -m pip install PyPDF2")
    import PyPDF2

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def format_as_markdown(text):
    """Format the extracted text as Markdown."""
    lines = text.split('\n')
    markdown_text = ""

    # Extract name, contact information, and personal statement
    name = "Potluri Krishna Priyatham"  # Hardcoded name since we know it
    contact_info = []
    personal_statement = ""

    # Look for contact info and personal statement
    for i in range(len(lines)):
        line = lines[i].strip()
        if any(keyword in line for keyword in ["Phone", "Email", "LinkedIn", "GitHub", "Portfolio", "Resume", "Coding Profiles"]):
            contact_info.append(line)
        # Look for the personal statement which is a longer line near the end
        if "Neophilia" in line and "problem-solving" in line and len(line) > 100:
            personal_statement = line

    # Add name as the title
    markdown_text += f"# {name}\n\n"

    # Add personal statement if found
    if personal_statement:
        markdown_text += f"{personal_statement}\n\n"

    # Add contact information
    markdown_text += "## Contact Information\n\n"
    for info in contact_info:
        markdown_text += f"{info}\n"
    markdown_text += "\n"

    # Process the main content
    section_headers = ["SKILLS", "WORK EXPERIENCE", "EDUCATION", "Projects", "Certifications", "Hobbies"]
    current_section = ""

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Skip lines we've already processed
        if line in contact_info or line == personal_statement or name in line:
            continue

        # Check if this line is a section header
        is_section_header = False
        for header in section_headers:
            if header.lower() in line.lower() and len(line) < 50:
                if current_section:
                    markdown_text += "\n"
                markdown_text += f"## {line}\n\n"
                current_section = header
                is_section_header = True
                break

        if not is_section_header:
            # Format bullet points
            if line.startswith("•"):
                markdown_text += f"{line}\n"
            # Format project titles or other subheadings
            elif line.endswith("[GitHub]") or line.endswith("[GitHub ]"):
                markdown_text += f"### {line}\n"
            # Regular content line
            else:
                markdown_text += f"{line}\n"

    return markdown_text

def main():
    pdf_path = "./static/pdfs/potlurikrishnapriyatham.pdf"
    output_path = "resume.md"

    print(f"Extracting text from {pdf_path}...")
    text = extract_text_from_pdf(pdf_path)

    print("Formatting text as Markdown...")
    markdown_text = format_as_markdown(text)

    print(f"Saving to {output_path}...")
    with open(output_path, 'w') as file:
        file.write(markdown_text)

    print("Done!")

if __name__ == "__main__":
    main()
