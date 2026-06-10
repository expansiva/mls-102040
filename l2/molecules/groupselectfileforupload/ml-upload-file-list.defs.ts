/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-upload-file-list.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupSelectFileForUpload';
export const skill = `# Metadata
- TagName: groupselectfileforupload--ml-upload-file-list

# Objective
Present a list of files intended for upload, enabling users to inspect file details, monitor upload progress, discard unwanted files, and add files through browsing or drag-and-drop, while enforcing validation rules and responding to states that prevent interaction, restrict editing, indicate loading, or signal errors.

# Responsibilities
- Display a label when one is provided.
- Display helper text when available and no error is active.
- Offer a target area for file selection and drag-and-drop operations, with visual feedback during drag interactions.
- List every file currently in the selection.
- For each file, show its name and size in a human-readable format.
- For each file, show an indicator representing its file type.
- For each file, show a progress indicator that reflects whether the upload is ongoing or finished.
- Allow users to remove individual files when interaction is permitted and the component is not restricted to read-only.
- Update the displayed list to exclude any removed file.
- Prevent file removal and ignore drag-and-drop input when interaction is blocked.
- Show an error message and apply an error appearance when an error condition is supplied.
- Show helper text instead of the error message when no error condition exists.
- Evaluate newly selected or dropped files against acceptance criteria for type, size limit, and quantity limit.
- Communicate the reason when files are rejected based on validation criteria.
- Visually emphasize the drop target while files are being dragged over it.

# Constraints
- Behavior must remain within the defined functional contract.
- Progress indicators must collectively reflect the global upload state.
- Removal must not affect the list when interaction is blocked.
- Error messages must override helper text.
- File type indicators must derive from the file's format or extension.
- File sizes must be presented in readable units.
- Read-only restriction must suppress removal options without altering the list content.

# Notes
- The component maintains synchronization between the displayed list and the underlying file collection.
- Validation and drag-and-drop behavior follow the standards of the group contract.`;

