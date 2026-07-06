/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-user-photo-upload.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectFileForUpload';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  upload: "avatar",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupselectfileforupload--ml-user-photo-upload

# Objective
Enable users to select a profile photo through click or drag-and-drop, enforce image-only validation and size/quantity limits, and present a thumbnail preview of the accepted image.

# Responsibilities
- Provide an interactive trigger area that initiates file selection when activated by click, touch, or keyboard.
- Support dragging files over the trigger area and visually signal when a drop is possible.
- Accept only image files; reject any non-image selections.
- Validate every dropped or selected file against the group contract limits for file size and total count.
- Hold the set of valid selected files as the current value.
- Notify when files are rejected, specifying whether the failure was due to file type, size, or count, without retaining the invalid files in the value.
- Generate and display a thumbnail preview representing the content of the accepted image file.
- When single-file mode is active, preview only the first valid file.
- Allow the user to remove a file from the current selection, updating the value accordingly.
- Ignore all selection attempts and drag-and-drop actions while disabled.
- Ignore all selection attempts and indicate a loading state while processing.
- Show an error message and treat the field as invalid whenever an error condition is present.
- Show helper information when no error is present and helper content is provided.
- Ensure the trigger area is reachable and operable via keyboard.

# Constraints
- Only image files may be accepted; all other file types must be rejected.
- Invalid files must never appear in the current value.
- The preview must represent the actual accepted image, not a generic placeholder.
- Selection and drag-and-drop must be non-interactive during disabled or loading states.
- Error messages must be presented instead of helper content when both are applicable.
- Keyboard interaction must open the file picker without breaking standard focus navigation.
- Drag state signaling must activate when files are dragged over the area and deactivate when they leave or are dropped.

# Notes
- Thumbnail generation depends on the successfully validated file content.
- Behavior and validation rules align with the groupSelectFileForUpload contract.`;

