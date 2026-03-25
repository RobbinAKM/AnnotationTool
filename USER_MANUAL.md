# Operator User Manual
**Secure Telemetry & Annotation Workspace**

Welcome to Annotation Workspace. This tool is designed for security analysts and operators to securely load surveillance media, accurately tag entities, and export mathematically precise telemetry data for machine learning pipelines.

---

## 1. Initializing the Workspace (Media Loading)
The workspace runs entirely in your local browser environment to ensure zero data leakage. 
* **Drag and Drop:** Simply drag a secure video file (`.mp4`) or image (`.jpg`, `.png`) from your local machine and drop it directly onto the upload dropzone.
* **Browse Files:** Click the **"Browse Files"** button to open your system's file explorer.
* **Playback Controls:** If a video is loaded, use the Play/Pause controls at the bottom of the feed. All annotations will remain anchored to their relative coordinates during playback.

---

## 2. Deployment Tools
Select tools from the left-hand control panel to deploy tracking nodes onto the media feed. 

* 🖱️ **Select / Drag (Cursor):** The default state. Use this to select, move, scale, and rotate existing nodes.
* 🔤 **Text Label:** Click anywhere on the feed to drop a text label. **Double-click** the text to open the secure input overlay and type your custom label (e.g., license plates, timestamps). Press `Enter` or click away to save.
* 〰️ **Freehand Draw (Pen):** Click and drag to draw organic paths. Useful for circling irregular objects or tracing suspect movement paths.
* 🔲 **Rectangle Box:** Click the feed to deploy a standard bounding box.
* ⭕ **Ellipse Radius:** Click the feed to deploy a radial bounding shape.
* ↗️ **Directional Arrow:** Deploy a vector line to indicate the direction of travel or camera field-of-view (FOV).
* 📷 **Camera Node:** Tag the location of secondary surveillance hardware.
* 🚗 **Vehicle Node:** Tag suspect or civilian vehicles.
* 👤 **Person Node:** Tag individuals of interest.
* 🍃 **Environment Node:** Tag environmental blockers (trees, bushes) obscuring the feed.

*Note: All shapes automatically scale dynamically. They will maintain their perfect relative percentage size whether the operator is using a 4K monitor or a standard laptop screen.*

---

## 3. Node Manipulation & Grouping
The workspace supports advanced manipulation for rapid telemetry tagging. Ensure the **Select / Drag** tool is active.

* **Move:** Click and drag any node to reposition it.
* **Resize:** Click a node, then drag any of the cyan anchor boxes on the bounding box to scale it.
* **Rotate:** Click a node, then drag the top rotation anchor handle to spin the node to the precise angle.
* **Multi-Select (Marquee):** Click and drag on an empty area of the feed to create a translucent blue selection box. Any node that touches the box will be selected.
* **Multi-Select (Shift):** Hold `Shift` on your keyboard and click individual nodes to add or remove them from your active selection.
* **Group Dragging:** Once multiple nodes are selected, clicking and dragging *any* of them will perfectly move the entire group in unison.

---

## 4. Node State Designation
Operators can assign threat-level states to any selected node. These states are color-coded for rapid visual identification.

1. Select one or more nodes on the canvas.
2. Click a state from the **Node State** panel:
   * 🟢 **Status: Active:** (Emerald Green) Standard tracking state.
   * 🔴 **Status: Warning:** (Rose Red) High-priority or threat-level designation.
   * ⚪ **Status: Offline:** (Slate Gray) Inactive, cleared, or nullified targets.

---

## 5. Pro-Operator Keyboard Shortcuts
For maximum efficiency, operators should utilize the global keyboard shortcuts:

In high-volume security environments, reducing mouse travel time directly impacts team throughput.

Each shape and icon has shortcut keys associated with it.

To play and pause the video, the user can also use the space bar 

| Action | Shortcut (Mac) | Shortcut (Windows) |
| :--- | :--- | :--- |
| **Select All Nodes** | `Cmd + A` | `Ctrl + A` |
| **Purge (Delete) Selected** | `Backspace` or `Delete` | `Backspace` or `Delete` |
| **Undo Last Action** | `Cmd + Z` | `Ctrl + Z` |
| **Redo Last Action** | `Cmd + Shift + Z` | `Ctrl + Y` |

*Note: The Undo/Redo history stack tracks every placement, color change, rotation, and group drag dynamically.*

---

## 6. Exporting Telemetry Data
Once the feed is fully annotated, the data must be extracted for the backend or Machine Learning teams.

2. Click **Export Telemetry Data** in the bottom left corner.
3. A `.json` file will securely download to your local machine.

**The Payload Includes:**
* `telemetryData`: The array of nodes, containing perfect percentage-based `x`, `y`, `width`, and `height` coordinates, ensuring the data remains accurate regardless of the resolution it is trained on.

***

