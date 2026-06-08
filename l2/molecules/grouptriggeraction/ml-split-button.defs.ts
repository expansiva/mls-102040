/// <mls fileReference="_102040_/l2/molecules/grouptriggeraction/ml-split-button.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupTriggerAction';
export const skill = `# Metadata
- TagName: grouptriggeraction--ml-split-button

# Objective
Provide a split button that presents a primary action together with a dropdown of secondary actions, allowing users to execute the main action or select an alternative from the related options within the groupTriggerAction group.

# Responsibilities
- Render two adjacent interactive regions: a primary action area and a chevron trigger that reveals secondary options.
- Display the provided label content in the primary action area.
- Display an optional icon in the primary action area, positioned either before or after the label according to configuration.
- Always present a chevron indicator on the secondary options trigger.
- Derive secondary options from provided items that carry a value identifier; treat all other supplied content as the primary label.
- Each secondary option must expose a value and may indicate that it is unavailable.
- When the primary action area is activated, dispatch an action notification including the primary value, preferring an explicit value identifier when present, otherwise falling back to the label text.
- When the chevron trigger is activated, toggle the visibility of the secondary options list, provided the component is interactive.
- When an available secondary option is chosen, dispatch an action notification including that option's value and hide the secondary options list.
- Prevent unavailable secondary options from being chosen, dispatching notifications, or closing the list.
- Support a type setting that defines the primary action behavior as button, submit, or reset.
- Support a size setting that applies consistently to both the primary action area and the chevron trigger to maintain unified proportions.

# Constraints
- When the component is disabled, both the primary action area and the chevron trigger must be non-interactive and must not dispatch action notifications.
- When the component is loading, both the primary action area and the chevron trigger must be non-interactive and must not dispatch action notifications.
- The secondary options list must open below the control and align its edge with the chevron trigger.
- The secondary options list must be at least as wide as the combined width of the primary action area and chevron trigger.
- Secondary options must be stacked vertically with clear separation and adequate space for selection.
- The primary action area and chevron trigger must share equal height and aligned baselines.
- The chevron trigger must be narrower than the primary action area and separated by a visible divider.
- Both regions must show visible hover, active, and focused states.
- Available secondary options must show a visible highlight when hovered.
- Disabled states must reduce visual prominence and suppress hover and active feedback for both regions and unavailable options.
- The loading state must display a loading indicator in the primary action area and indicate that the chevron trigger is inactive.
- All color treatments for surfaces, text, borders, hover, focus, disabled, and loading states must support dark mode.
- Keyboard focus must be visibly indicated with a focus ring on the currently focused region.

# Notes
- Designed for enterprise applications such as ERP, CRM, logistics, financial, and HR systems where a primary action is commonly accompanied by related alternatives.
- Representative use cases include save variations, send options, print formats, approval workflows, and publishing destinations.`;

