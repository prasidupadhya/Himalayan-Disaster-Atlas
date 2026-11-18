---
title: Digital Accessibility Checklist
id: digital-accessibility-checklist
tags:
- nepal-users
created: '2026-11-18T12:54:49.750888Z'
updated: '2026-11-18T12:55:24.322195Z'
source: https://www.prayatnanepal.org/wp-content/uploads/2026/06/Digital-Accessibility-Checklist_Comprehensive-final.pdf
source_domain: www.prayatnanepal.org
fetched_at: '2026-11-18T12:54:49.749834Z'
fetch_provider: builtin
status: draft
type: note
tier: institutional
content_type: paper
deprecated: false
summary: 'Prayatna Nepal 2026 Digital Accessibility Checklist: barriers by disability,
  guidance on writing Nepali text (Unicode), Word/Excel/PPT/PDF/social/website checklists,
  automated and manual testing guide.'
raw_file: raw/digital-accessibility-checklist.pdf
---

Digital Accessibility Checklist 
 
 
 
Prepared by 
 
Developed by  
 
Supported by 
 
 


---

ii 
 
 
 
Contents 
Contents .............................................................................................................................. ii 
Preface................................................................................................................................ iii 
Glossaries for Key Terms in Digital Accessibility ............................................................ vi 
Common Acronyms ........................................................................................................... ix 
Introduction to Digital Accessibility ................................................................................... 1 
Digital accessibility barriers by disability type ................................................................... 3 
Visual Disabilities ........................................................................................................... 3 
Hearing Disabilities ......................................................................................................... 4 
Motor Disabilities ............................................................................................................ 5 
Cognitive Disabilities ...................................................................................................... 6 
Language and literacy barriers ........................................................................................ 7 
Digital Accessibility Checklist ........................................................................................... 8 
Writing Nepali Texts ....................................................................................................... 8 
Microsoft Word Accessibility Checklist ......................................................................... 8 
Microsoft Excel Accessibility Checklist ....................................................................... 11 
Microsoft PowerPoint Accessibility Checklist ............................................................. 12 
PDF Accessibility Checklist.......................................................................................... 15 
Social media accessibility checklist .............................................................................. 17 
Website accessibility checklist ...................................................................................... 19 
Testing and Validation Guide ........................................................................................... 23 
Automated Testing ........................................................................................................ 23 
Manual Testing .............................................................................................................. 24 
User Testing .................................................................................................................. 25 
 
 
 


---

iii 
 
 
 
Preface 
Nepal’s Constitution, (2015) guarantees the right to information and equality for all citizens, 
including persons with disabilities. This aligns with international commitment concerning the 
United Nations Convention on the Rights of Persons with Disabilities (UNCRPD, 2006), which 
is ratified by Nepal in 2010. Article 9 of the UNCRPD specifically highlights the importance of 
accessibility to information and communication technologies (ICT) for persons with 
disabilities. Globally, countries like the United States (through the Americans with Disabilities 
Act and Section 508), the United Kingdom (under the Equality Act), and Canada (through the 
Accessible Canada Act) have enacted robust laws that mandate digital accessibility across 
public and private sectors. The Web Content Accessibility Guidelines (WCAG), an 
international standard, outline best practices to ensure that websites and digital services are 
accessible to everyone, especially persons with disabilities. 
In Nepal, this commitment to accessibility is reinforced through several key policies and laws. 
The Act Relating to the Rights of Persons with Disabilities 2017 ensures the inclusion of 
people with disabilities in all national development frameworks and specifically mentions 
making information accessible. Likewise, the National Policy and Plan of Action on 
Disability 2006 and the National Disability Policy 2023 address the need for accessible 
communication and ICT for persons with disabilities. These provisions aim to ensure equal 
access to social support, healthcare, education, employment, and rehabilitation services by 
making information systems inclusive and accessible. 
The 2021 Census shows that 2.2% of Nepal’s population lives with some form of disability. 
Among these group, physical disabilities account for 37.1%, while other common disabilities 
include low vision (17.1%), multiple disabilities (8.9%), and hard of hearing (8.0%). The 
lower reported prevalence in Nepal compared to global rates (16%) may be attributed to the 
focus on impairment in the Census data collection rather than functionality. More comprehensive 
data, such as the UNFPA Model Survey in Sudurpaschim province, estimates the disability 
prevalence at 10.1%, which aligns more closely with international estimates. 
While there is increasing recognition of the importance of accessibility on digital platforms in 
Nepal—such as websites, documents, and public online services remain largely inaccessible 
to persons with disabilities. Only a few organizations have actively adopted digital accessibility 


---

iv 
 
 
 
practices. One of the key challenges identified during our training sessions with stakeholders is 
that they do not have adequate knowledge and understanding about how to implement digital 
accessibility. 
Prayatna Nepal, a nonprofit organization has made commitment to promote the rights and 
opportunities of visually impaired people in Nepal, we have been working tirelessly to improve 
digital accessibility. Through training and awareness programs, we aim to build capacity among 
stakeholders and help them to create digital spaces that are inclusive and accessible to all. 
This checklist is our effort to bridge the knowledge gap and create widespread awareness about 
digital accessibility. By leveraging our experience and the internationally recognized WCAG 
standards, we hope this document will serve as a guide for stakeholders, government 
agencies, civil society organizations, and developers. This document plays great role to 
establish clear standards for digital accessibility in Nepal by creating a more inclusive digital 
environment where information and opportunities are equally available to all, regardless of 
ability. 
 
 


---

v 
 
 
 
Acknowledgement 
I extend my sincere gratitude to Lead Consulting Firm Diverse pattern with special appreciation 
to Mr. Sagar Prasai, for his invaluable contributions to this initiative. I also express my heartfelt 
thanks to Ms. Neera Adhikari, Under Secretary of the Nepal Government, for her support and 
expertise in finalizing this work, as well as for her role in the peer review process. 
As an organization actively engaged in promoting digital accessibility, we recognize the 
significance of developing a comprehensive digital accessibility checklist. This initiative aims to 
foster a shared understanding of accessibility standards, ensuring that digital platforms are 
inclusive and equitable for all. 
I would also like to acknowledge the dedicated efforts of National federation of disabled Nepal, 
Nepal Association of the Blind, Access Planet, Koshish, Autism Care Society Nepal, Blind 
Women Association Nepal, CIL Kathmandu, Deafblind Parents Association, Digital Inclusion 
Experts, and other disability rights organizations. Their continuous input and validation have 
been instrumental in ensuring the accuracy, relevance, and inclusiveness of this work. 
Furthermore, my sincere appreciation goes to the executive board members, general members, 
and staff of Prayatna Nepal for their invaluable contributions in shaping and refining this work. 
Their dedication has been crucial in strengthening its impact. 
Finally, I extend my gratitude to the Canada Fund for Local Initiatives for their generous funding 
support, which made this endeavor possible. 
 
Sarita Lamichhane 
Chairperson 
Prayatna Nepal  
 
 


---

vi 
 
 
 
Glossaries for Key Terms in Digital Accessibility 
Accessibility 
The quality of being easily reached, entered, or used by everyone, including people with 
disabilities. In digital context, it means creating content and technologies that all users can access 
and use effectively. 
Accessibility Statement 
A document that outlines how accessible a website or application is, what barriers might exist, 
and how users can get accessible alternatives if needed. 
Alternative Formats 
Different ways of presenting the same information to meet various accessibility needs (e.g., large 
print, audio, braille, electronic text). 
Alternative Text (Alt Text) 
A textual description of images, graphics, and visual elements that screen readers can read to 
users who cannot see the content. Good alt text conveys both the content and function of the 
image. 
Assistive Technology 
Hardware or software used by peop 
le with disabilities to access and use digital content (e.g., screen readers, speech recognition, 
switches, eye tracking devices). 
Audio Description 
Narration added to video content to describe important visual details that cannot be understood 
from the main soundtrack alone. 
Captions 
Text version of speech and other significant sounds in video content, synchronized with the 
audio. Includes speaker identification and sound effects. Can be: 
• Closed Captions: Can be turned on/off. 
• Open Captions: Permanently visible 


---

vii 
 
 
 
Color Contrast 
The difference in light between foreground (text) and background colors. WCAG 2.2 requires a 
minimum ratio of: 
• 4.5:1 for normal text 
• 3:1 for large text 
Color Vision Deficiency 
A condition that affects the ability to distinguish between certain colors, commonly known as 
color blindness. It affects approximately 8% of males and 0.5% of females. 
Digital Accessibility 
The practice of ensuring digital content and technologies (websites, documents, applications) can 
be used by people with various disabilities. 
Focus Indicator 
A visual indication showing which element on a screen currently has keyboard focus is essential 
for keyboard navigation. 
Heading Structure 
Hierarchical organization of content using heading levels (H1-H6) to create a logical document 
outline and enable efficient navigation. 
Keyboard Accessibility 
The ability to access all functionality of digital content using only a keyboard is crucial for users 
who cannot use a mouse. 
Reading Order 
The logical sequence in which content should be read by screen readers is particularly important 
in documents, slides, and complex layouts. 
Responsive Design 
Design approach ensuring content adapts to different screen sizes and devices while maintaining 
accessibility. 


---

viii 
 
 
 
Screen Reader 
Software that converts digital text into synthesized speech or braille output is essential for users 
who are blind or have visual impairments. 
Section 508  
Federal law requiring U.S. federal agencies to make their electronic and information technology 
accessible to people with disabilities, serving as a widely adopted standard for digital 
accessibility compliance. 
Speech to Text 
Technology that converts spoken words into written text is helpful for users with motor 
disabilities or learning differences. 
Subtitles 
Text version of dialogue in video content, primarily for viewers who can hear but don't 
understand the spoken language. 
Tagged PDF 
A PDF document with proper structural markup that enables screen readers to present content in 
a logical order. 
Text to Speech 
Technology that converts written text into spoken words is beneficial for users with visual or 
learning disabilities. 
Transcripts 
Text versions of audio or video content, including both spoken words and important sound 
effects. 
Unicode  
A universal character encoding standard that ensures proper display of text across different 
platforms and languages, critical for accessibility as it enables correct reading of content by 
screen readers and assistive technologies. 


---

ix 
 
 
 
Web Accessibility 
The inclusive practice of ensuring websites and web applications is designed and developed so 
that people with disabilities can use them. 
WCAG 
Web Content Accessibility Guidelines: international standards for making web content 
accessible to people with disabilities. 
Common Acronyms 
• ADA: Americans with Disabilities Act 
• ARIA: Accessible Rich Internet Applications 
• ATAG: Authoring Tool Accessibility Guidelines 
• CART: Communication Access Realtime Translation 
• ICT: Information and Communications Technology 
• JAWS: Job Access With Speech (screen reader) 
• NVDA: Non-Visual Desktop Access (screen reader) 
• OCR: Optical Character Recognition 
• PDF/UA: PDF Universal Accessibility 
• POUR: Perceivable, Operable, Understandable, Robust 
• TTS : Text to Speech 
• VPAT: Voluntary Product Accessibility Template 
• VRS : Video Relay Service 
• W3C: World Wide Web Consortium 
• WAI: Web Accessibility Initiative 
• WCAG: Web Content Accessibility Guideline


---

1 
 
 
 
Introduction to Digital Accessibility 
What is digital accessibility? 
Digital accessibility refers to the practice of creating and maintaining digital content and 
technologies that people with disabilities can use independently. This includes websites, 
documents, multimedia content, social media posts, mobile applications, and other digital 
platforms. Accessible content must be compatible with assistive technologies and provide 
equivalent alternatives for all users. 
Evolution of Digital Accessibility Standards 
The World Wide Web Consortium (W3C) introduced the Web Content Accessibility Guidelines 
(WCAG) 1.0 in 1999 as the first major step toward standardizing digital accessibility. These 
guidelines established basic principles for making web content accessible to people with 
disabilities. 
WCAG 2.0, released in 2008, marked a significant advancement by introducing technology-
neutral principles that could adapt to evolving technologies. WCAG 2.1 (2018) expanded these 
guidelines to address mobile accessibility, low vision requirements, and cognitive disabilities. 
The current version, WCAG 2.2 (2023), further builds these standards to address additional user 
needs and emerging technologies. 
Core Principles of Digital Accessibility 
The WCAG framework establishes four fundamental principles that form the foundation of 
digital accessibility: 
1. Perceivable 
Information and user interface components must be presentable in ways that users can recognize. 
Content must be available to users' senses of sight, hearing, and touch. Creating flexible layouts, 
offering options for both visual and audio content, and making sure the content is identifiable are 
all parts of it. 
 
 


---

2 
 
 
 
2. Operable 
All users must be able to use the user interface components and navigation. This includes more 
than just mouse operation; it also involves keyboard accessibility, sufficient interaction time, and 
navigation features that assist users in locating content and determining their location within 
websites. 
3. Understandable 
Information and interface operation must be understandable to all users. Users must be able to 
understand both the content and how to interact with it. This includes readable text, predictable 
functionality, and help with avoiding and correcting mistakes. Avoiding jargon and excessively 
technical terms is another aspect of it. 
4. Robust 
Content must be compatible with current and future assistive technologies and be reliable across 
platforms. This requires following web standards and guarantees that the content can be 
interpreted accurately by a variety of assistive technologies. 
 
Technical Standards 
The WCAG guidelines provide three conformance levels that build upon each other: 
• Level A represents the minimum level of accessibility, addressing the most basic and 
critical accessibility features. 
• Level AA builds upon Level A and represents the standard most organizations should 
aim to achieve. It addresses major accessibility barriers while remaining technically 
feasible. 
• Level AAA offers the highest level of accessibility; however, it may not be feasible to 
achieve full Level AAA conformance for all content, particularly interactive 3D 
elements. 
 
 


---

3 
 
 
 
Methodology for Implementation 
From multimedia resources and mobile applications to documents and websites, digital 
accessibility covers a wide range of content types. While following the fundamental accessibility 
principles, each category needs specific considerations. 
Organizations should approach the implementation of accessibility methodologically, starting 
with fundamental features and gradually improving accessibility. 
Digital accessibility barriers by disability type 
Visual Disabilities 
Type of 
Disability 
Barriers 
Why These Are Barriers 
Blindness 
Images without alternative text 
(description) 
Users can't understand the content or 
purpose of images when screen readers 
have no text to read 
 
PDFs that aren't properly tagged for 
elements like images, headings, etc. 
Screen readers can't interpret the 
document structure or read content in the 
correct order 
 
Complex data tables 
The relationships between data cells and 
headers are not conveyed by screen 
readers. 
 
Lack of headings/structure 
Difficult to scan and understand content 
organization 
 
CAPTCHAs that are purely visual 
Users can't complete basic authentication 
steps to access services or submit the 
form. 


---

4 
 
 
 
 
Mouse dependent interactions 
Users can't use mouse or traditional 
pointing devices. 
 
Information presented only using 
colors 
Information conveyed only through color 
is completely missed 
 
Videos without audio description 
Actions in videos are missed 
 
Scanned Text 
Text becomes unreadable without OCR 
process. 
Low Vision 
Small text size 
Text becomes unreadable or causes eye 
strain 
 
Poor color contrast 
Text and interface elements blend, 
making them hard to differentiate. 
 
Text in images 
Can't be enlarged by browser tools or 
screen magnifiers 
 
Website is not designed for mobile. 
Content becomes unusable when 
magnified or using zoom. 
Color 
Blindness 
Color-only error indicators 
Error messages or required fields aren't 
noticeable 
 
Charts/graphs using only color to 
differentiate 
Data visualization becomes meaningless 
 
Hearing Disabilities 
Type of 
Disability 
Barriers 
Why These Are Barriers 
Deafness 
Videos without captions and sign 
language 
Cannot access audio content in videos 


---

5 
 
 
 
 
Audio content without 
transcripts 
Cannot access podcasts, audio messages, 
or recordings 
 
Sign language videos without 
text alternatives 
Cannot access content if they use a 
different sign language 
 
Audio CAPTCHA only 
Cannot complete audio-based security 
verification 
Hard of 
Hearing 
Poor quality captions 
Difficult to understand or follow content 
 
Background music drowning 
speech 
Makes it harder to understand spoken 
content 
 
Audio-only feedback (like error 
beeps) 
Miss important system notifications or 
alerts 
 
Motor Disabilities 
Type of 
Disability 
Barriers 
Why These Are Barriers 
Limited Hand 
Control 
Small clickable areas or button size 
Difficult to accurately click or tap 
on small elements 
 
Short timeouts on forms 
Can't complete forms or tasks 
within time limits 
 
Complex keyboard shortcuts 
Difficult to press multiple keys 
simultaneously 
 
Hover-only interactions (For example 
Dropdown Menus) 
Cannot access dropdown menus 
or tooltips 
Tremors 
Double-click requirements 
Challenging to perform precise 
clicking actions 
 
Drag-and-drop interfaces 
Hard to maintain steady cursor 
movement 


---

6 
 
 
 
 
Small form elements 
Difficult to select or click 
accurately 
Paralysis 
Mouse-dependent navigation 
Cannot use traditional pointing 
devices 
 
Lack of keyboard shortcuts 
Unable to access all features 
without mouse 
 
Automatic carousels/slideshows 
Cannot control content timing or 
navigation 
 
Cognitive Disabilities 
Type of 
Disability 
Barriers 
Why These Are Barriers 
Reading 
Difficulties, 
Learning 
Difficulties, 
Autism 
Complex language 
Content becomes hard to 
understand 
 
Large blocks of text 
Overwhelming amount of 
information 
 
Lack of headings/structure 
Difficult to scan and 
understand content 
organization 
 
Moving or flashing content 
Distracting and can make 
reading impossible 
 
Auto-playing media 
Creates unwanted distractions 
 
Multiple pop-ups 
Interrupts focus and task 
completion 
 
Lack of consistent layouts 
Have to relearn navigation on 
different pages 


---

7 
 
 
 
 
No visual supports 
Text-only content is harder to 
understand 
 
Difficult instructions 
Difficult to follow multi-step 
processes 
Language and literacy barriers 
Type of 
Barrier 
Barriers 
Why These Are Barriers 
Limited 
Literacy 
Technical jargon and difficult 
terminologies 
Cannot understand sophisticated 
terminology 
 
Text-heavy content 
Difficult to process large amounts of 
text 
 
Lack of visual aids 
No alternative ways to understand 
content 
Language 
Barriers 
Content in single language 
Cannot access information in preferred 
language 
 
Culturally specific references 
May misunderstand content or context 
Digital 
Literacy 
Complex interfaces 
Difficulty understanding how to use 
digital tools 
 
Technical terminology 
Cannot understand system messages or 
instructions 
 
Lack of help documentation 
No way to learn how to use features 
 
General Notes 
• Many users may experience multiple types of barriers simultaneously. 
• Barriers can vary in severity depending on individual circumstances. 
• Environmental factors (like poor lighting or noisy surroundings) can increase these 
barriers. 
• Technology access and internet connectivity in Nepal may create additional challenges. 


---

8 
 
 
 
• Cultural and linguistic considerations specific to Nepal should be taken into account 
when addressing these barriers. 
Digital Accessibility Checklist 
Writing Nepali Texts 
Accessibility 
feature 
Why this is a barrier? 
How to implement it? 
Nepali Font 
Nepali text written using Nepali 
fonts like "Preeti" "Kantipur" etc. 
are not accessible because they 
are just graphic representation of 
Nepali text. 
Always use Unicode Nepali system 
to write Nepali text. It can be either 
downloaded or used online in sites 
like "Easy Nepali Typing" or 
Google transliteration 
Nepali PDF 
The PDF document in Nepali 
language is not accessible to 
screen readers even if they are 
written in Unicode. 
Accessible version of Nepali 
document should only be circulated 
in text format like word or rtf. 
 
Microsoft Word Accessibility Checklist 
Accessibility 
feature 
Why this is a barrier? 
How to Implement it? 
Document 
Title 
Without a proper title, screen reader 
users cannot quickly identify or 
find the document. 
Open File > Info > Properties. Enter a 
descriptive title that clearly identifies 
the document's purpose. 
Document 
Language 
When language is not specified, 
screen readers may use incorrect 
pronunciation and syntax rules. 
Select Review tab > Language > Set 
Proofing Language. Select the primary 
language of your document. 


---

9 
 
 
 
Heading 
Structure 
Users cannot navigate the 
document structure or understand 
content hierarchy when headings 
are only visually formatted (using 
bold and bigger text size) 
Use Styles panel to apply proper 
heading levels (Heading 1, 2, 3). 
Maintain a logical hierarchy - don't 
skip levels. Use Heading 1 for 
document title, Heading 2 for major 
sections etc. 
Paragraph 
Spacing 
If spaces are created between 
paragraphs by pressing 'enter' 
multiple times or if new page is 
created that way, it might become 
inaccessible to screen reader 
because- it will read it as 'blank'. 
Spaces should always be created using 
paragraph spacing options. 
 
 
New pages should be added by insert 
menu or pressing CTRL + ALT 
Alternative 
Text for 
Images 
Users who cannot see images have 
no way to understand the image 
content or purpose. 
Right-click image > Edit Alt Text. 
Write clear, concise description (e.g., 
"Graph showing sales increase of 25% 
in 2023"). Don't start with "image of" 
or "picture of." 
Decorative 
Images 
Marking 
Unmarked decorative elements can 
cause screen readers to read 
unnecessary information, creating a 
confusing experience. 
Mark images as decorative in Word's 
accessibility checker. Use the 'Alt 
Text' field to indicate when elements 
are decorative by entering empty alt 
text. Remove unnecessary decorative 
elements that don't add value. 
Image 
Wrapping 
Images wrapped around text are not 
accessible for screen readers. Image 
should always be in line with text. 
Choose Right-click image > Wrap 
Text > In line with Text. 
Table 
Headers 
Without properly marked headers, 
screen reader users cannot 
understand data relationships or 
navigate tables effectively. 
Select the top row > Table Design tab 
> Select "Header Row." Use clear 
header text. Avoid merged cells. Keep 
tables simple and linear. 


---

10 
 
 
 
Table 
Captions 
Without captions, screen reader 
users cannot quickly understand the 
table's purpose or content context. 
Add clear, descriptive captions using 
Word's 'Insert Caption' feature. Place 
captions above tables. Include table 
numbers for easy reference. Write 
concise but informative descriptions. 
Table 
Structure 
Complex tables with split or 
merged cells create navigation 
difficulties for screen reader users 
and can break the logical reading 
order. 
Keep tables simple with clear row and 
column headers. Avoid merging cells 
where possible. Split complex tables 
into simpler ones. Use proper header 
markup for row/column headers. 
Table 
Purpose 
Using tables for layout rather than 
data presentation confuses screen 
readers and creates inconsistent 
reading patterns. 
Use tables only for presenting data 
relationships. For layout, use Word's 
built-in formatting tools like columns, 
sections, and paragraph spacing. 
Create proper data tables with clear 
headers and structure. 
Link Text 
The URL used as links are difficult 
to understand for people using 
screen readers. 
Always use hyperlink on text instead 
of URL. 
Meaningful 
Links 
Links like "click here" or "read 
more" provide no context about the 
destination when read by screen 
readers. 
Write descriptive link text that makes 
sense out of context (e.g., "Download 
2024 Annual Report" instead of 
"Download here"). Include the full 
context in the link text. 
Color 
Contrast 
Text that doesn't have sufficient 
contrast with its background is 
difficult or impossible to read for 
many users. 
Maintain minimum contrast ratio of 
4.5:1 for normal text and 3:1 for large 
text. Use the built-in Accessibility 
Checker to verify contrast. Never use 
color alone to convey meaning. 


---

11 
 
 
 
Bullets and 
Numbers 
Screen readers cannot identify lists 
that are manually formatted with 
hyphens or numbers. 
Use Word's built-in bullet or 
numbering tools. Select Home tab > 
Bullets or Numbering. Use numbered 
lists for sequential items and bullets 
for non-sequential items. 
Columns 
Using tabs or spaces to create 
columnar layout causes reading 
order problems for screen readers. 
Use Insert tab > Columns feature for 
multi-column text. Avoid using 
spaces, tabs, or text boxes to position 
text in columns. 
Font Selection Decorative or overly stylized fonts 
can be difficult to read for users 
with visual or cognitive disabilities. 
Use clear, sans-serif fonts like Arial or 
Calibri. Maintain minimum 11-point 
font size. Avoid using font formatting 
(like italics) for emphasis - use styles 
instead. 
Watermark 
Accessibility 
Inaccessible watermarks can be 
missed by screen readers, causing 
users to miss important document 
status information. 
Use Word's built-in watermark 
feature. Ensure watermark text has 
sufficient contrast. Include watermark 
information in document properties or 
header text. Consider alternative ways 
to convey document status. 
Microsoft Excel Accessibility Checklist 
Accessibility 
feature 
Why this is a barrier? 
How to implement it? 
Sheet Names 
Generic sheet names (Sheet1, 
Sheet2) provide no context for 
screen reader users about sheet 
contents. 
Rename sheets with descriptive names 
(e.g., "2024 Sales Data", "Employee 
List"). Right-click sheet tab > Rename. 
Use consistent naming conventions. 
Table 
Headers 
Without proper headers, screen 
reader users cannot understand 
Use Insert tab > Table. Select "My table 
has headers" option. Use clear, 


---

12 
 
 
 
data relationships or navigate 
between columns and rows. 
descriptive header text. Avoid blank 
header cells. 
Named 
Ranges 
Unnamed ranges make it 
difficult for screen reader users 
to understand data groupings 
and navigate large datasets. 
Select data range > Formulas tab > 
Define Name. Give meaningful names to 
important data ranges (e.g., "Q1Sales", 
"Regional Totals"). 
Hidden 
Content 
Hidden rows, columns, or 
sheets can confuse screen 
reader users and may be 
accidentally overlooked. 
Review all hidden content. Use filters 
instead of hiding rows/columns when 
possible. Document any necessarily 
hidden content in a notes sheet. 
Chart 
Accessibility 
Charts without alternative text 
and proper labeling exclude 
users who cannot see the visual 
representation. 
Add alt text to charts (right-click > Edit 
Alt Text). Include clear titles, axis labels, 
and legends. Add data labels where 
appropriate. Provide data table together 
with complex charts. 
Hyperlinks 
Unclear hyperlink text ("Click 
here", "Link") doesn't tell 
screen reader users where links 
lead. 
Use descriptive link text that makes sense 
out of context. Include the full URL in a 
notes column if needed. Test that links 
are keyboard accessible. 
Slicer 
Accessibility 
Inaccessible slicers in Excel or 
PowerPoint prevent users from 
filtering data independently 
using screen readers. 
Use built-in slicer features that support 
keyboard navigation. Provide clear labels 
for slicers. Ensure filter status is 
announced by screen readers. Maintain 
keyboard focus indicators. 
 
Microsoft PowerPoint Accessibility Checklist 
Accessibility 
Feature 
Why This is a Barrier? 
How to Implement it? 


---

13 
 
 
 
Slide Layouts 
Custom layouts using text 
boxes and manual 
positioning create illogical 
reading order and 
navigation problems for 
people using assistive 
technologies. 
Use built-in slide layouts (Home tab > 
Layout). Avoid floating text boxes. 
Maintain consistent layout throughout 
presentation. Modify slide master for 
custom layouts. 
Reading Order 
Incorrect reading order 
forces screen reader users 
to hear content in an 
illogical sequence. 
View tab > Selection Pane. Arrange 
elements from bottom (first read) to 
top (last read). Test with screen 
reader. Keep layouts simple and 
logical. 
Alternative Text 
Visual content without 
alternative text excludes 
users who cannot see 
images, charts, or graphics. 
Right-click visual > Edit Alt Text. 
Describe the purpose and content of 
the visual. Include data represented in 
charts. Don't repeat information 
already in slide text. 
Slide Titles 
Slides without unique titles 
make navigation difficult 
and provide no context for 
screen reader users. 
Give each slide a unique, descriptive 
title. Use title case consistently. Check 
View > Outline View to verify all 
slides have titles. 
Animations 
Transitions 
Complex animations and 
automatic transitions can 
create barriers for users 
with cognitive disabilities 
or motion sensitivity. 
Keep animations simple and 
purposeful. Set to start "On Click." 
Avoid automatic transitions. 
Speaker Notes 
Without speaker notes, 
users relying on screen 
readers may miss context 
and details presented 
verbally. 
Add notes explaining visual elements, 
if there are many contextual elements. 
Include spoken context not in slide 
text. Describe key points of complex 


---

14 
 
 
 
graphics. Use Notes View to verify 
completeness. 
Color and Contrast 
Poor contrast and color-
dependent information 
create barriers for users 
with visual impairments or 
color blindness. 
Maintain high contrast between text 
and background (minimum 4.5:1). 
Don't rely on color alone to convey 
meaning. Use labels with colors. Test 
with grayscale view. 
Multimedia Content Videos and audio without 
captions or transcripts 
exclude users with hearing 
disabilities. 
Add closed captions to videos. 
Provide transcripts for audio. Ensure 
media controls are keyboard 
accessible. Include descriptive 
narration of important visual content. 
Table Structure 
Complex tables with 
merged cells create 
navigation barriers. 
Keep tables simple. Avoid merged 
cells. Include clear headers. Consider 
breaking complex tables into simpler 
ones. Test table navigation with 
keyboard. 
Handout Format 
Inaccessible handouts 
create barriers when 
presentation materials are 
shared. 
Create accessible PDF or Word 
versions of handouts. Include all 
alternative text and descriptions. Test 
handout format with screen readers. 
Provide multiple format options. 
Text Box 
Accessibility 
Text boxes that aren't 
properly structured can be 
missed by screen readers or 
read out of order. 
Set proper reading order for text 
boxes. Use Word's built-in text box 
styles. Ensure text boxes are in the 
proper z-order. Link related text boxes 
if content flows between them. 
 


---

15 
 
 
 
PDF Accessibility Checklist 
Accessibility 
Feature 
Why This is a Barrier? 
How to Implement it? 
Tagged PDF 
Without proper tags, screen 
readers cannot understand 
document structure and read 
content in logical order. 
Enable "Create Tagged PDF" when 
converting documents from word. Use 
Acrobat's "Auto tag Document" feature. 
Review and fix tag structure in Tags 
panel. 
Document Title 
and Metadata 
Screen reader users cannot 
identify the document 
quickly if it lacks proper title 
and metadata. 
Set Document Title and other metadata in 
File > Properties. Include author, subject, 
and keywords. Don't rely only on 
filenames. Make title descriptive and 
meaningful. 
Reading Order 
Incorrect reading order 
forces users to hear content 
in illogical sequence, making 
document hard to understand. 
Use Reading Order tool in Acrobat. 
Ensure content flows logically. Check 
with Tags panel. Test with screen reader. 
Heading 
Structure 
Without proper heading 
hierarchy, users cannot 
navigate through document 
sections effectively. 
Use proper heading levels (H1, H2, H3). 
Don't skip levels. Match headings to 
visual formatting. Create logical 
document structure. 
Alternative 
Text 
Users who cannot see images 
have no way to understand 
visual content and diagrams. 
Add alt text through Properties > Tag 
panel. Describe image purpose and 
content. Mark decorative images as 
background. Include detailed descriptions 
for complex diagrams or charts. 
Table Structure Unstructured tables prevent 
screen readers from 
connecting headers with data 
cells. 
Use proper table tags. Mark header cells. 
Avoid complex merged cells. Ensure 
proper reading order within tables. Add 
table summary if needed. 


---

16 
 
 
 
Lists 
Unstructured lists make it 
difficult to understand 
content organization and 
relationships. 
Use proper list tags (L, LI, Lbl). Ensure 
nested lists are properly structured. 
Maintain consistent formatting. 
Form Fields 
Unlabeled form fields 
prevent users from 
understanding what 
information to enter. 
Add labels to all form fields. Set proper 
tab order. Mark required fields. Provide 
clear instructions. Include error messages 
and validation. 
Text 
Search/Select 
Scanned PDFs without OCR 
are just images of text, 
making them impossible to 
read with assistive 
technology. 
Run OCR on scanned documents. Verify 
text accuracy. Ensure text is selectable and 
searchable. Fix any recognition errors. 
Color Contrast 
Poor contrast between text 
and background creates 
reading barriers. 
Maintain sufficient color contrast (4.5:1 
ratio). Don't rely on color alone to convey 
meaning. Test with contrast checker. 
Provide alternative indicators. 
Document 
Language 
Unspecified language causes 
screen readers to use wrong 
pronunciation rules. 
Set primary document language in 
Properties. Mark language changes within 
content. 
Links 
Unclear or unlabeled links 
make navigation difficult for 
screen reader users. 
Use descriptive link text. Ensure links are 
properly tagged. Check that URLs are 
accessible. Verify link destinations are 
valid. 
Page Numbers 
Missing or inconsistent page 
numbers create navigation 
problems. 
Add logical page numbers. Ensure page 
labels match physical page numbers. Use 
page thumbnails effectively. 
Artifacts 
Improperly tagged decorative 
elements distract from main 
content. 
Mark decorative elements as artifacts. 
Remove unnecessary reading elements. 
Ensure background images are properly 
tagged. 


---

17 
 
 
 
Multimedia 
Elements 
Inaccessible multimedia 
content excludes users with 
disabilities. 
Provide captions for videos. Include audio 
descriptions. Ensure media controls are 
keyboard accessible. Provide transcripts. 
 
Social media accessibility checklist 
Accessibility 
Feature 
Why This is a Barrier? 
How to Implement it? 
Image 
Alternative Text 
Blind or low vision users 
cannot understand images 
without descriptive text. 
Write clear, concise alt text (Instagram: 
Use Alt Text feature, Twitter: Add Image 
Description, Facebook: Edit Alt Text 
while uploading image). Describe 
important visual elements and context. 
Text Readability 
Dense text blocks and 
unconventional typography 
make content hard to read 
for many users. 
Use clear fonts. Break text into short 
paragraphs. Avoid fancy fonts or 
excessive emojis. Leave spaces between 
paragraphs. Limit to 2-3 sentences per 
paragraph. 
CamelCase 
Hashtags 
Screen readers read 
hashtags as one word when 
words aren't separated. 
Use capital letters for each word in 
hashtags (#DigitalAccessibility instead of 
#digitalaccessibility). Keep hashtags at 
end of post. 
Video Captions 
Deaf or hard of hearing 
users cannot access video 
content without captions. 
Add closed captions to all videos. Use 
platform caption tools or create SRT files. 
Include speaker identification. Caption 
sound effects and music. 
Audio 
Transcripts 
Users who are deaf or in 
noisy environments cannot 
access audio content. 
Provide full transcripts for audio content 
like podcasts or voice messages. Include 
speaker names and relevant sound 
descriptions. 


---

18 
 
 
 
Emojis 
Screen readers read emoji 
descriptions, making 
content confusing when 
overused. 
Use emojis carefully. Place them at the 
end of text. Don't repeat emojis. Don't use 
emojis to convey critical information. 
Color Contrast 
Poor contrast makes text 
difficult to read, especially 
for low vision users. 
Ensure text is easily readable against 
background. Test contrast ratios. Don't use 
light gray text. Use solid backgrounds 
when possible. 
Content 
Warnings 
Unexpected sensitive 
content can be problematic 
for some users. 
Use content warnings for sensitive topics. 
Place warnings at the beginning. Allow 
users to opt-in to sensitive content. 
Animated GIFs 
Flashing content can 
trigger seizures or cause 
distraction. 
Avoid rapidly flashing GIFs. Use static 
images when possible. Warn about 
animated content. Limit animation 
duration. 
Image Text 
Text embedded in images 
is not accessible to screen 
readers. 
Put important text in post body, not 
images. If must use image text, repeat 
information in caption or alt text. 
Stories/Reels 
Format 
Temporary content can be 
difficult to access or 
understand. 
Keep text on screen longer. Use high 
contrast colors. Provide captions. Don't 
rely solely on sound. Include text 
descriptions. 
Live Streams 
Real-time content can 
exclude users who need 
captions or descriptions. 
Use live captioning. Provide summary or 
transcript after. Describe visual elements 
verbally. 
Image or Emoji 
as Fonts 
Using images or emojis as 
text/fonts prevents screen 
readers from accessing the 
content and makes it 
impossible for users to 
adjust text size or contrast. 
Use standard web fonts and Unicode 
characters instead of custom font images. 
If using emojis, ensure they have proper 
text alternatives. Provide actual text 
content that can be read by assistive 
technologies. 


---

19 
 
 
 
Animated GIF 
Accessibility 
GIFs can cause distraction, 
trigger seizures, and are 
often meaningless to screen 
reader users as they lack 
proper descriptions. 
Provide text alternatives describing the 
GIF content. Allow users to pause or stop 
animations. Consider using video with 
controls instead. Avoid auto-playing GIFs 
if possible. Include descriptive alt text that 
explains the content and purpose. 
Sign Language 
Placement 
Inconsistent placement of 
sign language interpreters 
in videos can make it 
difficult for deaf users to 
follow both the visual 
content and interpretation. 
Place sign language interpreter in a 
consistent, visible location. Ensure 
interpreter window is at least 1/4th in 
large screen and 1/3rd in small screen of 
the video height. Maintain good contrast 
between interpreter and background. 
Allow users to resize/reposition 
interpreter window. 
Complex Images 
Multiple elements or 
messages within a single 
image can overwhelm 
users and make it difficult 
for screen readers to 
provide meaningful 
descriptions. 
Break complex images into simpler 
components. Provide detailed alt text 
describing the relationship between 
elements. Consider using multiple images 
or a more structured layout. Include text 
descriptions for key information. 
 
Website accessibility checklist 
Accessibility 
Feature 
Why This is a Barrier? 
How to Implement it? 
Page Title 
Without clear page titles, 
screen reader users cannot 
quickly identify page 
content or browser tabs. 
Use unique, descriptive titles for each 
page. Format as: Page Name - Website 
Name. Keep titles concise but 
informative. 


---

20 
 
 
 
Semantic HTML 
Using generic divs instead 
of semantic elements 
makes it harder for 
assistive technologies to 
understand page structure. 
Use <nav> for navigation, <header> for 
page headers, <main> for main content, 
<footer> for page footer, <aside> for 
sidebar content, <article> for independent 
content and <section> for thematic 
grouping 
Keyboard 
Navigation 
Mouse-dependent 
interfaces exclude users 
who rely on keyboards or 
other input devices. 
Ensure all functions work with the 
keyboard. Make focus indicator visible. 
Maintain logical tab order. Provide skip 
links for navigation. All the menu items 
and drops downs should be accessible by 
keyboard only. 
Skip Links 
Users who navigate by 
keyboard must tab through 
all navigation items on 
every page before reaching 
main content 
Add "Skip to main content" as first 
focusable element on the website. Make 
skip link visible when focused. Provide 
skip links for long navigation menus. 
Consider multiple skip links for complex 
layouts (e.g., "Skip to navigation", "Skip 
to footer"). Ensure skip links work when 
activated 
Focus Indicator 
Without visible focus 
indicators, keyboard users 
can't track their position on 
the page 
Never remove focus outline. Make focus 
indicator high contrast (3:1 minimum) 
Ensure indicator is clearly visible against 
all backgrounds. Make focus indicator 
sufficiently large. 
Alternative Text 
Users who cannot see 
images miss important 
visual information. 
Add descriptive alt text to images. Use 
empty alt="" for decorative images. 
Color Contrast 
Poor contrast makes 
content hard to read for 
Maintain 4.5:1 contrast ratio for normal 
text. 3:1 for large text. Don't rely solely on 


---

21 
 
 
 
users with visual 
impairments. 
color to convey information. Test with 
contrast checker. 
Form Labels and 
Controls 
Unlabeled forms prevent 
users from understanding 
what information to input. 
Use proper label elements. Associate 
labels with controls. Provide clear 
instructions. Mark required fields. Show 
error messages clearly. 
Error Placement 
Poorly placed error 
messages can be missed or 
misunderstood. 
Show errors near the relevant field. 
Display a summary at the top of the form. 
Use clear, actionable error messages. 
Make errors visible without relying on 
color 
Link Text 
Generic links like "click 
here" don't tell users where 
they lead. 
Use descriptive link text. Make links work 
out of context. Indicate if links open new 
windows. Distinguish between navigation 
and content links. 
Tables 
Improperly structured 
tables make data 
relationships unclear for 
screen reader users. 
Use proper table markup. Include headers. 
Avoid merged cells. Add captions or 
summaries for complex tables. Use proper 
scope attributes. 
Multimedia 
Videos and audio without 
alternatives exclude users 
with hearing or visual 
disabilities. 
Provide captions for videos. Include audio 
descriptions. Offer transcripts. Ensure 
media players are keyboard accessible. 
Media Autoplay 
Unexpected audio or video 
playback can interfere with 
screen readers and disturb 
users. 
Disable autoplay by default. Provide clear 
play/pause controls. Allow users to 
control media playback. 
Dynamic Content 
Content that updates 
without user awareness 
creates confusion. 
Announce dynamic changes to screen 
readers. Use ARIA live regions 
appropriately. Allow users to control auto-
updating content. 


---

22 
 
 
 
Focus 
Management 
Poor focus management 
makes keyboard navigation 
difficult or impossible. 
Maintain visible focus indicator. Manage 
focus during interactions. Return focus 
after modal dialogs. Don't trap keyboard 
focus. 
Responsive 
Design 
Non-responsive designs 
create barriers on different 
devices and zoom levels. 
Design for different viewport sizes. 
Support zooms up to 200%. Maintain 
readability when zoomed. Test with 
different devices. 
Error 
Identification 
Unclear error messages 
prevent users from 
understanding and fixing 
problems. 
Clearly identify errors. Provide specific 
instructions to fix errors. Use multiple 
cues (color, icon, text). Position error 
messages logically. This is very important 
with forms. 
Time Outs 
Fixed time limits create 
barriers for users who need 
more time. 
Don’t use things that changes with times 
like slideshow etc. 
Page Language 
Incorrect language settings 
cause screen readers to use 
wrong pronunciation rules. 
Set page language in HTML. Mark 
language changes within content. Use 
proper language codes. 
ARIA Labels 
Interactive elements 
without proper labels are 
unusable with assistive 
technology. 
Use ARIA labels when needed. Don't 
duplicate information. Test with screen 
readers. Follow ARIA authoring practices. 
Navigation 
Inconsistent or complex 
navigation makes site 
exploration difficult. 
Provide consistent navigation. Include site 
search. Offer multiple ways to find 
content. Show current location. 
Resizable Text 
Fixed-size text creates 
barriers for users who need 
larger text. 
Allow text resizing without breaking 
layout. Support browser zoom. Use 
relative units (em, rem) for text. 
Responsive 
Design 
Non-responsive websites 
break layout on mobile 
Implement fluid grids, flexible images, 
and media queries. Test across different 


---

23 
 
 
 
devices, making content 
unreadable or requiring 
horizontal scrolling, which 
is particularly challenging 
for users with motor 
impairments. 
devices. Use relative units (em, rem) 
instead of fixed pixels. Ensure touch 
targets are at least 44x44px. Maintain 
readable text size across viewports. 
Content 
Structure 
Lack of logical structure 
makes it difficult for screen 
reader users to navigate 
and understand the 
relationship between 
different content elements. 
Use proper heading hierarchy (H1-H6). 
Group related content using semantic 
HTML. Implement ARIA landmarks 
where appropriate. Create clear visual 
hierarchy. Use consistent layout patterns. 
CAPTCHA 
Alternatives 
Traditional visual 
CAPTCHAs create 
insurmountable barriers for 
users with visual 
impairments. 
Provide multiple CAPTCHA options 
(audio, logic puzzles). Use modern 
alternatives like reCAPTCHA v3 or 
Captcha. Consider email verification or 
other accessible security measures. Ensure 
all CAPTCHA solutions have keyboard-
accessible controls. 
 
 
Testing and Validation Guide 
Automated Testing 
Document Testing 
Microsoft Office applications (Word, Excel, PowerPoint) include built-in accessibility checkers 
that identify common accessibility issues. These tools provide explanations of problems and 
suggest solutions for fixing them. Use these checkers throughout document creation and before 
finalizing any document. 


---

24 
 
 
 
Adobe Acrobat Pro's accessibility checker helps validate PDF documents for accessibility 
compliance. This tool performs a comprehensive check of various accessibility elements and 
generates detailed reports identifying areas needing improvement. 
Web Testing 
Several automated tools are available for testing website accessibility: 
• WAVE (Web Accessibility Evaluation Tool) identifies common web accessibility errors. 
• Axe Developer Tools helps developers identify and fix accessibility issues. 
• Color contrast analyzers verify text readability. 
• HTML validation tools ensure proper markup. 
While automated tools are helpful, they should not be the only method of testing, as they can 
detect only common accessibility issues directly related to associated codes. They are unable to 
detect any issues that require logical thinking. 
Manual Testing 
Manual testing is essential for a thorough accessibility evaluation. This involves: 
Document Review 
• Review document structure and navigation. 
• Verify proper heading hierarchy. 
• Check alternative text for images. 
• Test table structure and readability. 
• Verify color contrast and font usage. 
• Test with screen readers. 
• Review links and bookmarks. 
Website Review 
• Test keyboard navigation. 


---

25 
 
 
 
• Verify focus indicators. 
• Check form functionality. 
• Test screen reader compatibility. 
• Review multimedia content accessibility. 
• Check responsive design functionality. 
• Verify link descriptions and navigation. 
Common Focus Areas 
For all content types, manually verify: 
• Logical reading order 
• Clear headings and structure 
• Proper alternative text 
• Sufficient color contrast 
• Keyboard accessibility 
• Clear error messages 
• Consistent navigation 
User Testing 
User testing provides invaluable insights into real-world accessibility challenges. Consider these 
aspects when conducting user testing: 
Planning 
• Include users with different disabilities. 
• Test with various assistive technologies. 
• Consider different experience levels. 
• Include local language users. 


---

26 
 
 
 
Testing Areas 
Have users test: 
• Navigation and orientation 
• Content comprehension 
• Form completion 
• Multimedia interaction 
• Document usability 
• Overall user experience. 
“Remember that accessibility testing is an ongoing process, not a one-time activity. Regular 
testing helps maintain accessibility standards and ensures content remains accessible as it's 
updated or modified.  
