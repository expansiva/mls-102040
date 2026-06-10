/// <mls fileReference="_102040_/l2/molecules/groupentertimeinterval/ml-time-interval.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupEnterTimeInterval';
export const skill = `# Metadata
- TagName: groupentertimeinterval--ml-time-interval

# Objective
A molecule that allows a user to view and edit a single time interval within a day, with support for 12-hour and 24-hour formats, optional seconds, overnight intervals, and various validation and visual states. It represents exactly one interval; multiple intervals in the same day are managed by orchestrating multiple instances.

# Responsibilities
- Display a single time interval composed of a start time and an end time
- In editing mode, present fields for start and end times in a single row, separated by a visual delimiter, with associated labels for each
- In viewing mode, display only the formatted interval text without editable controls, helper text, error messages, or time selectors
- Accept and display a general label above the field group when provided
- Display helper content only when no error is present and editing is active
- Format displayed times according to 12-hour (AM/PM) or 24-hour preferences, and include seconds when configured
- Indicate visually when the start time selector is open and when the end time selector is open
- Apply a distinct visual state when both start and end times are filled
- Show an overnight indicator alongside the end time when the interval crosses midnight and overnight intervals are permitted
- Show a placeholder em dash when both times are null in viewing mode, and show the start time followed by a placeholder when only the start time is set
- Respect minimum and maximum time boundaries, minute step increments, minimum and maximum duration limits, overnight allowance, and same-time allowance to permit or reject selections
- Signal when the start time is modified
- Signal when the end time is modified
- Signal when both start and end times are confirmed together
- Signal when the component receives focus and when it loses focus
- Present a loading state that blocks interaction and indicates activity
- Present a disabled state that blocks interaction and prevents value changes
- Present a readonly state that prevents editing while allowing text selection
- Treat both start and end times as mandatory when required
- Enter an error state and display the provided error message when an error is supplied
- Adapt visual presentation for dark mode environments

# Constraints
- Must not display input fields, selectors, helper text, error messages, or signal changes when not in editing mode
- Time values must be handled in 24-hour format, with display formatting applied according to user preferences
- Must display the overnight indicator only when overnight intervals are allowed and the end time is earlier than the start time
- Must suppress helper content whenever an error message is present
- Must not manage a collection of intervals or validate overlap between multiple intervals; overlap handling belongs to the consumer
- Must block all user actions when disabled or loading
- Must prevent value changes when disabled
- Must allow text selection but disable editing controls in readonly mode
- Must apply error styling and show the error message when an error is provided

# Notes
- This component manages exactly one time interval; supporting multiple intervals in a single day requires using multiple instances managed externally
- The consumer is responsible for calculating total daily hours and supplying that information as helper content if desired
- Validation of overlapping intervals across multiple instances is explicitly outside the scope of this component`;

