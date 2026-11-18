---
title: Devanagari Gap Analysis
id: devanagari-gap-analysis
tags:
- nepal-users
created: '2026-11-18T12:54:46.175348Z'
updated: '2026-11-18T12:55:23.638963Z'
source: https://www.w3.org/TR/deva-gap
source_domain: www.w3.org
fetched_at: '2026-11-18T12:54:46.174423Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
summary: 'W3C Devanagari Gap Analysis: browser/OpenType gaps for Devanagari - conjunct/grapheme
  cluster handling, vowel signs (esp pre-base), line breaking, vertical text, fonts.
  Relevant to Nepali rendering in map labels, print reports.'
---

Devanagari Gap Analysis
Devanagari Gap Analysis
W3C Group Draft Note
31 May 2025
More details about this document
This version:
https://www.w3.org/TR/2025/DNOTE-deva-gap-20250531/
Latest published version:
https://www.w3.org/TR/deva-gap/
Latest editor's draft:
https://w3c.github.io/iip/gap-analysis/deva-gap
History:
https://www.w3.org/standards/history/deva-gap/
Commit history
Editor:
Richard Ishida
(
W3C
)
Feedback:
GitHub w3c/iip
(
pull requests
,
new issue
,
open issues
)
Copyright
©
    2018-2025
World Wide Web Consortium
.
W3C
®
liability
,
trademark
and
permissive document license
rules apply.
Abstract
This document describes and prioritises gaps for the support of the Devanagari script on the Web and in eBooks. In particular, it is concerned with text layout. It checks that needed features are supported in
W3C
specifications, such as HTML and CSS and those relating to digital publications. It also checks whether the features have been implemented in browsers and ereaders.
Status of This Document
This section describes the status of this
      document at the time of its publication. A list of current
W3C
publications and the latest revision of this technical report can be found
      in the
W3C
standards and drafts index
at
      https://www.w3.org/TR/.
This document describes and prioritises gaps for the support of the Devanagari script on the Web and in eBooks. In particular, it is concerned with text layout. It checks that needed features are supported in
W3C
specifications, in particular HTML and CSS and those relating to digital publications. It also checks whether the features have been implemented in browsers and ereaders.
It is linked to from the
language matrix
that tracks Web support for many languages.
The editor's draft of this document is being developed in the GitHub repository
Indian Language Enablement (ilreq)
, with contributors from the
W3C
Internationalization Interest Group
. It is published by the
Internationalization Working Group
. The end target for this document is a Working Group Note.
This document was published by the
Internationalization Working Group
as
    a Group Draft Note using the
Note track
.
Group Draft Notes are not endorsed by
W3C
nor its Members.
This is a draft document and may be updated, replaced, or obsoleted by other
    documents at any time. It is inappropriate to cite this document as other
    than work in progress.
The
W3C
Patent
          Policy
does not carry any licensing requirements or commitments on this
        document.
This document is governed by the
03 November 2023
W3C
Process Document
.
1.
Contributors
The framework of this document was created by Richard Ishida. The text for most gap descriptions is automatically pulled from GitHub issues, and that text may have been written or contributed to by others.
The following people contributed information to the gap reports in this document (in alphabetic order): Akshat Joshi, Hai Liang, John Hudson, Vivek Pani.
See also the
GitHub contributors list
for the Indian Language Enablement project, and the
discussions related to the Devanagari script
.
2.
About this document
The
W3C
needs to make sure that the  needs of scripts and languages around the world are built in to technologies such as HTML, CSS, SVG, etc. so that Web pages and eBooks can look and behave as people expect around the world.
This page documents difficulties that people encounter when trying to use languages written in the Devanagari script on the Web.
Having identified an issue, it investigates the current status with regards to web specifications and implementations by user agents (browsers, e-readers, etc.), and attempts to prioritise the severity of the issue for web users.
2.1
Prioritization
This document not only describes gaps, it also attempts to prioritise them in terms of the impact on the local user. The prioritisation is indicated by colour.
Key:
It is important to note that these colours do not indicate to what extent a particular feature is broken. They indicate the impact of a broken or missing feature on the content author or end user.
A cell can be scored as OK if the feature in question is specified in an appropriate specification (including Candidate Recommendations), and is supported by at least two major browser engines.
Advanced level support includes features that one might expect to include in ebooks or other advanced typographic formats. If a feature of a script or language is not supported on the Web, but is not generally regarded as necessary (usually archaic or obscure features), even if the feature is described here, the status may be marked as OK. The decision as to what priority level is assigned to a described gap is down to the experts doing the gap analysis. It may not always be straightforward to decide.
If a given section in this document refers to more than one feature that is broken, each with different impacts on Web users, the priority for the section will be the lowest denominator.
2.2
Related documents
A summary of this report and others can be found as part of the
Language Matrix
.
Gap reports are brought to the attention of spec and browser implementers, and are tracked via the
Gap Analysis Pipeline
. Find the
Devanagari items
.
For more information about the Devanagari script, including requirements, tests, GitHub discussions, type samples, and more, see
Devanagari Script Resources
.
3.
Text direction
See also General page layout & progression for features such as column layout, page turning direction, etc. that are affected by text direction.
3.1
Writing mode
In what direction does text flow along a line and across a page? (If the basic direction is right-to-left see
3.2
Bidirectional text
.)  If the script uses vertically oriented text, what are the requirements? What about if you mix vertical text with scripts that are normally only horizontal? Do you need a switch to use different characters in vertical vs. horizontal text? Does the browser support short runs of horizontal text in vertical lines (tate-chu-yoko in Japanese) as expected? Is the orientation of characters and the directional ordering of characters supported as needed?
#70 Upright text in vertical lines doesn't segment correctly
GitHub issue #70
Languages:
hi bn ta gu pa
2
This issue is applicable to many Indian languages.
When upright characters appear in vertical lines of text, browsers need to tailor grapheme cluster rules so that full orthographic syllables represented as conjuncts, are kept together.
See requirements at:
Indic Layout Requirements
, but add to those the points made in
Typographic character units in complex scripts
.
The GAP
Gecko
appears to segment on grapheme clusters.
Blink
, and
Webkit
keep conjuncts together.  But all engines have problems with vowel-signs, especially but not only pre-base vowel-signs.
Priority
Marked as advanced, since vertical text is not a common use case.  In writing sytems like modern Tamil, it is even less common, since conjuncts are rarely used.
Tests
Interactive test
,
When devanagari characters are rendered upright in vertical text, orthographic syllables containing conjuncts are kept together
Action taken
Gecko
•
Blink
•
Webkit
Outcomes
All three major desktop browsers now keep the conjuncts together, however the vowel signs attached to those orthographic syllables are not kept with the rest of the syllable.
3.2
Bidirectional text
If the general inline direction is right-to-left, are there any issues when handling that? Where the inline direction of text is mixed, is this bidirectional text adequately supported? What about numbers and expressions? Do the Unicode bidi controls and HTML markup provide the support needed? Is isolation of directional runs problematic?
4.
Glyph shaping & positioning
4.1
Fonts & font styles
How are fonts grouped into recognisable writing styles? How is each writing style used? Do the standard fallback fonts used in browsers (eg. serif, sans-serif, cursive, etc.) match expectations? Or are additional generic font styles needed? Are special font or OpenType features needed for this script that are not available?  What other general, font-related issues arise? The font styles described here refer to alternative types of writing style, such as naskh vs nastaliq; for oblique, italic, and weights see instead
4.3
Letterform slopes, weights, & italics
.
4.2
Context-based shaping and positioning
If context-sensitive rendering support is needed to shape combinations of letters or position certain glyphs relative to others, is this adequately provided for? Does the script in question require additional user control features to support alterations to the position or shape of glyphs, for example adjusting the distance between the base text and diacritics, or changing the glyphs used in a systematic way? Do you need to be able to compose/decompose conjuncts or ligatures, or show characters that are otherwise hidden, etc? If text is cursive, see the separate section
4.4
Cursive text
.
4.3
Letterform slopes, weights, & italics
This covers ways of modifying the glyphs for a range of text, such as for italicisation, bolding, oblique, etc. Are italicisation, bolding, oblique, etc relevant? Do italic fonts lean in the right direction? Is synthesised italicisation or oblique problematic? Are there other problems relating to bolding or italicisation - perhaps relating to generalised assumptions of applicability? For alternative writing/font styles, see
4.1
Fonts & font styles
.
4.4
Cursive text
If this script is cursive (ie. letters are generally joined up, like in Arabic, N’Ko, Syriac, etc), are there problems or needed features related to the handling of cursive text? Do cursive links break if parts of a word are marked up or styled? Do Unicode joiner and non-joiner characters behave as expected?
#139 Text stroke cuts joining glyphs apart
GitHub issue #139
Languages:
hi bn pa
2
This issue is likely to apply to all cursive script text, but also to other scripts that have joins between letters.
When text stroke effects are applied to cursive text, they should not interrupt the cursive flow.  For example, the following is problematic.
For more details, see
this GitHub issue
, which is being used to track this gap. Please add any discussion there, and not to this issue.
4.5
Case & other character transforms
Does your script need special text transforms that are not supported? For example, do you need to to convert between half-width and full-width presentation forms? Does your script convert letters to uppercase, capitalised and lowercase alternatives according to your typographic needs? How about other transforms?
5.
Typographic units
5.1
Characters & encoding
Most languages are now supported by Unicode, but there are still occasional issues. In particular, there may be issues related to ordering of characters, or competing encodings (as in Myanmar), or standardisation of variation selectors or the encoding model (as in Mongolian). Are there any character repertoire issues preventing use of this script on the Web? Do variation selectors need attention? Are there any other encoding-related issues?
5.2
Grapheme/word segmentation & selection
This is about how text is divided into graphemes, words, sentences, etc., and behaviour associated with that. Are there special requirements for the following operations: forwards/backwards deletion, cursor movement & selection, character counts, searching & matching, text insertion, line-breaking, justification, case conversions, sorting? Are words separated by spaces, or other characters? Are there special requirements when double-clicking or triple-clicking on the text? Are words hyphenated?  (Some of the answers to these questions may be picked up in other sections, such as
7.1
Line breaking & hyphenation
, or
7.6
Styling initials
.)
#89 Spans around partial orthographic syllables can't be styled
GitHub issue #89
Languages:
hi bn ta gu pa
2
If you try to style part of a syllable by putting a span around the characters you want to style, the overall shape of the syllable is broken.

Here are a number of examples:
Devanagari. If you put a span around the first two characters of the 3-character syllable स्तिठड (eg. in order to color or otherwise style it), the i vowel-sign no longer appears at the start of the word, but looks like it modifies the next character (ठ).
Gujarati. If you put a span around the ન્ડ two characters of the 3-character syllable ન્ડિ in ઇન્ડિય (eg. in order to color or otherwise style it), the i vowel-sign no longer appears at the start of the word, but looks like it modifies the next character (ય).
Bengali. If you put a span around the ব first character of the two character syllable বি in বিভাগের (eg. in order to color or otherwise style it), the vowel-sign no longer appears at the start of the word, but looks like incorrect inputting at the wrong place.
Tamil. If you put a span around the ம first character of the two character syllable மொ in மொழி (eg. in order to color or otherwise style it), the half part of o vowel-sign no longer appears at the start of the word, but looks like incorrect inputting at the wrong place.
Apparently this requirement is a bit difficult to cater to as it requires the knowledge to be transferred by the font to the rendering engine about which part of the glyph is attributed to which code-point in storage. However, if it can be achieved, nothing like it.
#88 Dandas are wrapped alone to the beginning of a line
GitHub issue #88
Languages:
hi gu
1
When the Devanagari phrase separator । U+0964 DEVANAGARI DANDA (called purna viram in Hindi) or ॥ U+0965 DEVANAGARI DOUBLE DANDA (deergh viram in Hindi) are used, some browsers select them with the preceding word on double-click, while in other browsers they are selected separately.

The properties of purna viram and deergh viram should be the same as the properties of FullStop or other punctuation marks, and a new line should not begin with purna viram and deergh viram.
#87 Grapheme clusters fail to represent syllabic conjuncts in Bengali, Devanagari, and Gujarati — FIXED !
GitHub issue #87
Languages:
hi bn gu
3
This issue is applicable to most languages with conjunct forms that involve a virama.
Many scripts descended from Brahmi indicate clusters of consonant sounds by merging or stacking the glyphs of the consonants involved in one way or another.  These scripts are abugidas, and each consonant character represents a consonant sound and an inherent vowel sound.  The merging of glyphs indicates that the inherent vowel sound is dropped between the consonants.  In Unicode text, this merging is usually accomplished using a special character between the consonants, which is typically called a virama or 'vowel-killer'.
When operations such as line breaking, cursor movement, vertical text rendering, deletion, hyphenation, etc are applied to the text these conjuncts must not be split apart.  (Line-break opportunities in these scripts usually occur at inter-word spaces, but when a very long word doesn't entirely fit on a line or the CSS
`word-break`
property is set to
`break-all`
, or the CSS
`line-break`
property is set to
`anywhere`
, conjuncts should be kept together.)
A
grapheme
is a user-perceived unit of text. Text operations that use graphemes as a unit of text include line-breaking, forwards deletion, cursor movement & selection, character counts, text spacing, text insertion, justification, case conversions, and sorting. The Unicode Standard uses generalised rules to define '
grapheme clusters
', which approximate the likely grapheme boundaries in a writing system.
More:
Bengali graphemes
Devanagari graphemes
The GAP
The Unicode concept of grapheme cluster up to Unicode 15.0 fails to represent syllabic conjuncts (plus vowels, etc) in scripts like Bengali, Devanagari, Gujarati, etc. This means that various editing operations, line breaking algorithms, vertical text, etc. are likely to break text at the wrong point.
The reason conjuncts are not kept together is that segmentation rules in Unicode start a new grapheme cluster after the virama.
CSS uses the concept of
'typographic character unit'
, rather than grapheme cluster, in its specs, with the explanation that these cases are beyond the scope of the grapheme cluster concept and that implementations should provide appropriate support.
More:
Typographic character units in complex scripts
Priority
The impact of incorrectly segmenting text containing conjuncts is significant, affecting the correct handling of editing operations, line breaking algorithms, vertical text, etc.  This is an issue with the priority of Basic.
Tests
Selectors 3, first-letter > Conjuncts & orthographic syllables
line-break:anywhere should not break conjuncts
Extending highlighted text should not split conjuncts
Action taken
Discussions took place in the Unicode Script Ad Hoc committee, and an initial proposal was made by Norbert Lindenberg that would form the basis for gradual deployment of changes for a number of scripts.
Unicode 15.1 introduced an initial set of changes to
Unicode® Standard Annex #29, Unicode Text Segmentation
that recognised consonants after a virama as a continuation of the grapheme cluster for certain scripts.  The scripts affected by this change are those with
Indic_Conjunct_Break (InCB)=Linker
. Those scripts are currently  Bengali, Devanagari, Gujarati, Oriya, Telugu, and Malayalam. (The problem remains for several other scripts, and more will be addressed for Unicode 17).
As long as applications support the latest rules for grapheme clusters, those scripts should keep conjuncts together.
Outcomes
The latest versions of the
Gecko
,
Blink
, and
Webkit
engines support the new rules for grapheme clusters for Bengali, Devanagari, and Gujarati.
6.
Punctuation & inline features
6.1
Phrase & section boundaries
What characters are used to indicate the boundaries of phrases, sentences, and sections? What about other punctuation, such as dashes, connectors, separators, etc? Are there specific problems related to punctuation or the interaction of the text with punctuation (for example, punctuation that is separated from preceding text but must not be wrapped alone to the next line)? Are there problems related to bracketing information or demarcating things such as proper nouns, etc? Some of these topics have their own sections; see also
6.2
Quotations & citations
, and
6.4
Abbreviation, ellipsis & repetition
.
6.2
Quotations & citations
This is a subtopic of phrase & section boundaries that is worth handling separately. What characters are used to indicate quotations? Do quotations within quotations use different characters? What characters are used to indicate dialogue? Are the same mechanisms used to cite words, or for scare quotes, etc? What about citing book or article names? Are there any issues when dealing with quotations marks, especially when nested? Should block quotes be indented or handled specially? Do quotation marks take text direction into account appropriately?
6.3
Emphasis & highlighting
How are emphasis and highlighting achieved? If lines or marks are drawn alongside, over or through the text, do they need to be a special distance from the text itself? Is it important to skip characters when underlining, etc? How do things change for vertically set text?
6.4
Abbreviation, ellipsis & repetition
What characters or other methods are used to indicate abbreviation, ellipsis & repetition? Are there problems?
6.5
Inline notes & annotations
What mechanisms, if any, are used to create *inline* notes and annotations?  Are the appropriate methods for inline annotations supported for this script? The ruby spec currently specifies an initial subset of requirements for fine-tuning the typography of phonetic and semantic annotations of East Asian text, including furigana, pinyin and zhuyin fuhao systems.  Is is adequate for what it sets out to do?  What other controls will be needed in the future? What about other types of inline annotation, such as warichu? This section deals with
inline
annotation approaches. For annotation methods where a marker in the text points out to another part of the document see
8.3
Footnotes, endnotes, etc.
.
6.6
Text decoration & other inline features
This section is a catch-all for inline features that don't fit under the previous sections.  It can also be used to describe in one place a set of general requirements related to inline features when those features appear in more than one of the sections above. It covers characters or methods (eg. text decoration) that are used to convey information about a range of text. Are all needed forms of highlighting or marking of text available, such as wavy underlining, numeric overbars, etc.  If lines are drawn alongside, over or through the text, do they need to be a special distance from the text itself? Is it important to skip characters when underlining, etc? How do things change for vertically set text? Are there other punctuation marks that were not covered in preceding sections? Are lines correctly drawn relative to vertical text?
#90 Underline and overline need to clear glyph ascenders and descenders
GitHub issue #90
Languages:
hi bn ta gu pa
1
Indian language text has some signs called as Matras which sometimes join above the shirorekha or below the normal baseline.

Applications should ensure that the underline and overline when getting rendered, should adaquetly be taken into consideration. Chrome browser seemed to be perfectly rendering the underline and overline feature by breaking the same where a matra occurs. Internet Explorer also handles it a bit differently by appropriately lowering or heightening the respective lines.
6.7
Data formats & numbers
Relevant here are formats related to number, currency, dates, personal names, addresses, and so forth. If the script has its own set of number digits, are there any issues in how they are used? Does the script or language use special format patterns that are problematic (eg. 12,34,000 in India)? What about date/time formats and selection - and are non-Gregorian calendars needed?  Do percent signs and other symbols associated with number work correctly, and do numbers need special decorations, (like in Ethiopic or Syriac)? How about the management of personal names, addresses, etc. in web pages: are there issues?
#91 Data formats need to be controllable by users
GitHub issue #91
Languages:
hi bn ta gu pa
2
Generally Latin Numerals are acceptable in Devanagari text. Most of the user community identifies with them. However, there could be cases where certain web-pages would prefer to have numerals in Devanagari to cater to mono-lingual (mono-script rather) readers. This is particularly required for input types number and date. It would be useful if the input type values are augmented with the script mnemonics e.g. number_deva or date_deva instead of changing it for entire page through some locale setting. There could be cases where a user may require both kinds of numbering in the same web-page.
7.
Line and paragraph layout
7.1
Line breaking & hyphenation
Does the browser capture the rules about the way text in your script wraps when it hits the end of a line? Does line-breaking wrap whole 'words' at a time, or characters, or something else (such as syllables in Tibetan and Javanese)?  What characters should not appear at the end or start of a line, and what should be done to prevent that? Is hyphenation used for your script, or something else? If hyphenation is used, does it work as expected? (Note, this is about line-end hyphenation when text is wrapped, rather than use of the hyphen and related characters as punctuation marks.)
#88 Dandas are wrapped alone to the beginning of a line
GitHub issue #88
Languages:
hi gu
1
When the Devanagari phrase separator । U+0964 DEVANAGARI DANDA (called purna viram in Hindi) or ॥ U+0965 DEVANAGARI DOUBLE DANDA (deergh viram in Hindi) are used, some browsers select them with the preceding word on double-click, while in other browsers they are selected separately.

The properties of purna viram and deergh viram should be the same as the properties of FullStop or other punctuation marks, and a new line should not begin with purna viram and deergh viram.
7.2
Text alignment & justification
When text in a paragraph needs to have flush lines down both sides, does it follow the rules for your script? Does the script need assistance to conform to a grid pattern? Does your script allow punctuation to hang outside the text box at the start or end of a line? Where adjustments are need to make a line flush, how is that done? Do you shrink/stretch space between words and/or letters? Are word baselines stretched, as in Arabic? What about paragraph indents, or the need for logical alignment keywords, such as start/end, rather than left/right? Does the script indent the first line of a paragraph?
7.3
Text spacing
This section is concerned with spacing that is adjusted around and between characters on a line in ways other than attempts to fit text to a given width (ie. justification). Some scripts create emphasis or other effects by spacing out the words, letters or syllables in a word. Are there requirements for this script/language that are unsupported? If spacing needs to be applied between letters and numbers, is that possible? What about space associated with punctuation, such as the gap before a colon in French? (For justification related spacing, see
7.2
Text alignment & justification
.)
#118 Browsers apply extraneous spaces when letter-spacing
GitHub issue #118
Languages:
hi bn ta gu pa
2
This issue applies to all languages that use letter-spacing.
Currently browsers that apply letter-spacing do so by adding a space after every letter in the text that is tracked.  This results in a superfluous space at the end of the range, which creates an inappropriate gap before the following text.  Letter spacing at the end of a line makes the line look misaligned in justified or right-justified text. It also has implications for text that has other styling, such as an outline or a coloured background, at the same time as being stretched.
For more details, see
this GitHub issue
, which is being used to track this gap. Please add any discussion there, and not to this issue.
#117 Letter-spacing splits conjuncts
GitHub issue #117
Languages:
hi bn ta gu
2
This issue is applicable to most languages that form conjuncts from consonant clusters using an invisible virama.
A consonant cluster that uses a conjunct (rather than visible virama) should not be split when letter-spacing is applied.
The GAP
Relying on grapheme clusters as the main segmentation approach fails for many Indic scripts because conjuncts are composed of multiple grapheme clusters, and should be kept together as a unit.

For these situations it is necessary to tailor the segmentation algorithm, so that it recognises the whole consonant cluster plus any attached vowel-signs or combining characters as a single unit.

For examples  see
Typographic character units in complex scripts
.

See also notes on segmentation for the following orthographies relevant to this project:
Hindi
,
Bangla
,
Punjabi
,
Tamil
.
css-text-3
CSS uses the concept of
'typographic character unit'
, rather than grapheme cluster, in its specs with the explanation that the cases just described go beyond the scope of the grapheme cluster concept and that implementations should provide appropriate support. The spec doesn't provide details about the support needed for each language.

The Unicode Consortium made some attempts to address this issue, but it has so far not yielded results.  CLDR now flags up a few scripts for which conjuncts are common.
Priority
Keeping conjuncts together is a pretty basic requirement.  It is not possible to work around this problem.

That said, letter-spacing is not relied on for essential content authoring, therefore the priority was set to advanced.
Tests & results
Interactive test
,
When letter-spacing is applied to Devanagari the browser will not split conjuncts
Interactive test
,
When letter-spacing is applied to Bengali the browser will not split conjuncts
Gecko:
❌  Most of the half-form conjuncts (which is the large majority of all conjuncts) have space inserted between the glyphs that make up the conjunct (ie. not split into consonants with visible viramas). Vertically-combined glyphs tend not to be split.
Blink:
❌  Same as Gecko.
Webkit:
❌  Same as Gecko.
Action taken
tbd
Outcomes
tbd
#92 Text units for letter-spacing are incorrect
GitHub issue #92
Languages:
hi
1
For various reasons wherever a word needs to be broken in constituent characters in case of Latin script, Indian language words can and should be broken based on Akshara as given here 

 As the
W3C
specification points to Unicode Text Segmentation (TR 29), it is observed that some of the browsers support it (e.g. Chrome and Firefox) whereas Microsoft Edge and Interner Explorer seems to break the words in individual characters. 

 It has been marked as basic as the Unicode Text Segmentation rules themselves need to be matured enough to cater to nuances of many languages that get written using Devanagari script. Some of the languages like Santali, require some special Nukta rules. 

 Also, in cases where there is wrong Akshara formation e.g. Consonant+Matra+Matra, the breaking seems to stack ill formed akshara into one set instead of clearly breaking it separate. This breaking behaviour needs to improve.
7.4
Baselines, line-height, etc
Does the browser support requirements for baseline alignment between mixed scripts and in general? Are there issues related to line height or inter-line spacing, etc.? Are the requirements for baseline or line height in vertical text covered?
#96 Differences in physical size for fonts affects baseline alignment
GitHub issue #96
Languages:
hi bn gu pa
2
This issue is especially applicable to northern Indic scripts with a head line.
By and large, Indian scripts in browsers are rendered with default fonts provided by back-end Operating Systems. If there are major differences in physical size for a particular font size, which most of the times are, it shows the mixed-script text in an un-organized way. This obviously affects all the base-line attributes.

Generally, Indian scripts that have joining line use the joining line as the baseline. Ideally, if a document contains both Devanagari and Gurmukhi text (such as
Mahan Khosh
), the text should be aligned at the joining line regardless of the script or font.
7.5
Lists, counters, etc.
Are there list or other counter styles in use? If so, what is the format used and can that be achieved? Are the correct separators available for use after list counters? Are there other aspects related to counters and lists that need to be addressed? Are list counters handled correctly in vertical text?
#93 Customised counter styles are unavailable — FIXED !
GitHub issue #93
Languages:
hi bn ta gu pa ks mr as mni
3
Customisable counters are needed for many languages.
Many orthographies use native digits or letters for counters, such as those used for list numbering or numbering chapter headings, etc.  It needs to be possible to use these local conventions for counters.
Users also need to be able to adapt counter styles for a given context or create new ones where the browser doesn't have baked-in support.  Often customisation needs are driven by the need to change the counter suffix for particular contexts, but in some cases the algorithms used for numbering can vary from author to author as well.
More:
Tamil counters
N'Ko counters
Thai counters
These are just a few examples out of many.
The GAP
The major browser engines support a number of hard-coded counter styles. But when this gap was first reported only Gecko supported user defined counter styling.  This meant that native counters were not available for a large number of languages, and the styles could not be tweaked by the author for special uses.
predefined-counter-styles
contains templates for counter styles that can be applied by users if the custom counter styles spec is supported.
css-counter-styles-3
explicitly defines a number of local styles, and the other counter styles can be defined by users if the Counter Styles spec's generic mechanism for defining counter styles was implemented.
Priority
The impact of the lack of support cited here is mitigated by the tendency to use western counters, so the impact could be marked as advanced. However native styles (at least the numeric) are widely used in non-Web content, and these features are likely to be widely used when implemented across all major browsers.  Therefore the priority is set to basic.
Tests & results
I18n test suite
,
Predefined styles
.
Contains tests for the styles that are explicitly defined in the Counter Styles spec.
Gecko
and
Blink
provide good coverage.
Webkit
covers most styles with some gaps, but fails for CJK and Ethiopic styles.
I18n test suite
,
Basic custom counter styles
.
The spec is essentially done, and
Gecko
and
Blink
have implemented it.  No support from
Webkit
.
Action taken
Blink
•
WebKit
Outcomes
Fixed !
Gecko
,
Blink
, and
Webkit
latest browser versions now all support custom counter styles.
See
Can I Use?
7.6
Styling initials
Does the browser or ereader correctly handle special styling of the initial letter of a line or paragraph, such as for drop caps or similar? How about  the size relationship between the large letter and the lines alongide? where does the large letter anchor relative to the lines alongside? is it normal to include initial quote marks in the large letter? is the large letter really a syllable? etc. Are all of these things working as expected?
#115 Consonant clusters with a visible virama should only have the first consonant+virama highlighted
GitHub issue #115
Languages:
hi bn
2
This issue is applicable to most languages that form conjuncts from consonant clusters using a visible virama.
When the start of a line contains a 2-consonant cluster that uses a
visible
virama, ::first-letter should highlight only the first consonant+virama.  This corresponds to a grapheme cluster, as defined by Unicode.
Specs:
css-text-3
CSS uses the concept of
'typographic character unit'
, which defaults to a grapheme cluster. The spec doesn't provide details about the support needed for each language.

The Unicode Consortium defines grapheme clusters to, by default, stop after the first virama in a cluster.
Tests & results:
Interactive test
,
When ::first-letter is applied to Devanagari the browser will NOT select a 2-consonant cluster as a unit if the virama is visible
Interactive test
,
When ::first-letter is applied to Bengali the browser will only select the first consonant+virama in a cluster if the virama is visible
Gecko
only highlights the initial character+virama.
Blink
, and
Webkit
select all clusters as a single unit, whether or not they are conjuncts or are rendered with a visible virama.
Browser bug reports:
Blink
•
WebKit
Priority:
This choice needs to be discussed.
If a cluster is rendered as a conjunct, it should be selected as a single unit. If, instead, the virama is displayed (ie. it is not a conjunct) then only the initial part of the cluster should be selected. Since the underlying code points are identical if a cluster is displayed as a conjunct or instead with visible viramas, it's not possible to distinguish one situation from another by working with the code points.  In the absence of a technical solution that examines what the font used does when rendering, this is a difficult problem to solve. This priority rating says that, in the absence of a perfect solution, it is better to select a whole non-conjunct cluster than to break a conjunct.  So it is labelled advanced, rather than basic.
#94 Conjuncts are not selected as a single unit when styling initials
GitHub issue #94
Languages:
hi bn mr as mni
1
This issue is applicable to most languages that form conjuncts from consonant clusters using an invisible virama.
When the start of a line contains a consonant cluster that uses a conjunct (rather than visible virama), ::first-letter should highlight the whole cluster.

Consonant clusters that form conjuncts using an invisible virama between the component letters need to be selected as a unit.  This doesn't work well if segmentation relies on Unicode grapheme clusters, since a conjunct with two consonants will be parsed as two grapheme clusters (the first ending after the virama, and the second starting with the second consonant and including any following vowel-signs or other combining characters).

For these situations it is necessary to tailor the segmentation algorithm, so that it recognises the whole consonant cluster plus any attached vowel-signs or combining characters as a single unit.

For examples  see
Typographic character units in complex scripts
.
Specs:
css-text-3
CSS uses the concept of
'typographic character unit'
, rather than grapheme cluster, in its specs with the explanation that the cases just described go beyond the scope of the grapheme cluster concept and that implementations should provide appropriate support. The spec doesn't provide details about the support needed for each language.

The Unicode Consortium made some attempts to address this issue, but it has so far not yielded results.  CLDR now flags up a few scripts for which conjuncts are common.
Tests & results:
Interactive test
,
When ::first-letter is applied to Devanagari the browser will select a 2-consonant conjunct as a unit
Interactive test
,
When ::first-letter is applied to Bengali the browser will select a conjunct as a unit, if the virama is hidden
Gecko:
✅❌  Most of the half-form conjuncts fail  (which is the large majority of all conjuncts in Devanagari), and are broken into an initial consonant with visible virama and a following consonant.
Blink:
✅  All conjuncts are fully selected.
Webkit:
✅  All conjuncts are fully selected.
I18n test suite
,
Devanagari text
Browser bug reports:
Gecko
Priority:
Keeping conjuncts together is a pretty basic requirement.  Without a fix for this, authors need to manually mark up text to apply initial letter styling, but that isn't a very useful workaround.
#84 initial-letter positioning is not widely available
GitHub issue #84
Languages:
hi bn ta gu pa
2
Having selected the correct text for highlighting, it is important to ensure proper alignment of the baseline and height of the initial letter highlight relative to the other lines of text. This doesn't work well without help from the dedicated CSS properties,
`initial-letters`
and the
`initial-letters-align`
. Unfortunately, only Safari supports the first property, and it requires the -webkit prefix, so this is still an immature feature.

Safari aligns the alphabetic baseline of the highlighted text with that on the specified number of lines. The relationship between the highlighted letters and the first line of the paragraph appears to be based on cap height, but is not clear. The requirements for that relationship are not yet really clear, despite the information in
Indian Layout Requirements
.

The impact here is advanced, since it is mainly needed for advanced layouts.
8.
Page & book layout
8.1
General page layout & progression
How are the main text area and ancilliary areas positioned and defined? Are there any special requirements here, such as dimensions in characters for the Japanese kihon hanmen? The book cover for scripts that are read right-to-left scripts is on the right of the spine, rather than the left. Is that provided for? When content can flow vertically and to the left or right, how do you specify the location of objects, text, etc. relative to the flow? For example, keywords 'left' and 'right' are likely to need to be reversed for pages written in English and page written in Arabic. Do tables and grid layouts work as expected? How do columns work in vertical text? Can you mix block of vertical and horizontal text correctly? Does text scroll in the expected direction? Other topics that belong here include any local requirements for things such as printer marks, tables of contents and indexes. See also
8.2
Grids & tables
.
8.2
Grids & tables
As a subtopic of page layout, does the script have special requirements for character grids or for tables?
8.3
Footnotes, endnotes, etc.
Does your script have special requirements for footnotes, endnotes or other necessary annotations of this kind in the way needed for your culture? (See
6.5
Inline notes & annotations
for purely inline annotations, such as ruby or warichu. This section is more about annotation systems that separate the reference marks and the content of the notes.)
8.4
Page headers, footers, etc.
Are there special conventions for page numbering, or the way that running headers and the like are handled?
8.5
Forms & user interaction
Are vertical form controls well supported? In right-to-left scripts, is it possible to set the base direction for a form field? Is the scroll bar on the correct side? etc. Are there other aspects related to user interaction that need to be addressed?
9.
Other
9.1
Culture-specific features
Sometimes a script or language does things that are not common outside of its sphere of influence. This is a loose bag of additional items that weren't previously mentioned. This section may also be relevant for observations related to locale formats (such as number, date, currency, format support).
9.2
What else?
There are many other CSS modules which may need review for script-specific requirements, not to mention the SVG, HTML, Speech, MathML and other specifications. What else is likely to cause problems for worldwide deployment of the Web, and what requirements need to be addressed to make the Web function well locally?
Show summary
↑