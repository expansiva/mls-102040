/// <mls fileReference="_102040_/l2/molecules/groupselectfileforupload/ml-file-upload-preview.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code.

export const group = 'groupSelectFileForUpload';
// Design-system axes this molecule candidates for (matched by the DS agent).
export const layoutConfig = {
  upload: "dropzone",
  labelPlacement: "top",
  validation: "inline-below"
};

export const skill = `# Metadata
- TagName: groupselectfileforupload--ml-file-upload-preview

# Objective
Allow the user to select one or more files for upload through a clickable drop zone or drag-and-drop, then display a visual preview grid of the accepted files. Image files are shown as thumbnail previews; non-image files display a "no preview" placeholder. The component validates files against type, size, and count constraints and manages object URLs for image thumbnails.

# Responsibilities
- Open the native file picker when the trigger zone is clicked or activated with Enter or Space.
- Accept files dragged and dropped onto the zone and process them identically to picker-selected files.
- Validate each incoming file against the accept pattern, the maxSizeKb limit, and the maxFiles count limit before accepting it.
- Dispatch a "reject" custom event for each group of rejected files, including the files and the rejection reason ("type", "size", or "count").
- In single-file mode (multiple = false), keep only the first valid incoming file; in multi-file mode append valid files up to the maxFiles limit.
- Create and cache an object URL for each accepted image file and display it as a thumbnail; revoke the URL when the corresponding file is removed or the component is disconnected.
- Display accepted files in a grid with a thumbnail (or "no preview" text), file name, formatted file size, and a remove button per entry.
- Show the trigger zone label as "Add more files" in multi-file mode or "Replace file" in single-file mode once at least one file has been accepted.
- Render an overlay loading spinner on the trigger zone while loading = true.
- Show an error message from the error property or a helper text from the Helper slot below the zone.
- Support Label, Helper, and Trigger slots for custom labelling, hints, and trigger zone content.

# Constraints
- All interaction (click, keyboard, drag-and-drop, remove) must be blocked when disabled = true or loading = true.
- Files that fail type, size, or count validation must never be added to value.
- Object URLs must be revoked for any file that is removed from value and for all files when the component is disconnected from the DOM.
- In single-file mode, value must never contain more than one file.
- The error message takes precedence over the helper text; both must not appear simultaneously.
- The custom Trigger slot content is only shown when value is empty; once files are present the default trigger label is used instead.
- File size comparison uses the raw byte size against maxSizeKb * 1024; a maxSizeKb of 0 means no size limit.
- A maxFiles of 0 means no file count limit in multi-file mode.`;
