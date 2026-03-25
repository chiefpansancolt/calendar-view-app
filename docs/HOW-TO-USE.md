# How To Use — Meeting Calendar

A guide to managing your recurring meeting schedule at [calendar-view-app.vercel.app](https://calendar-view-app.vercel.app).

---

## Table of Contents

1. [Overview](#1-overview)
2. [Creating Your First Client](#2-creating-your-first-client)
3. [Setting Up Categories](#3-setting-up-categories)
4. [Adding People](#4-adding-people)
5. [Adding Meetings](#5-adding-meetings)
6. [Viewing the Calendar](#6-viewing-the-calendar)
7. [Filtering by Attendee](#7-filtering-by-attendee)
8. [Editing and Deleting Meetings](#8-editing-and-deleting-meetings)
9. [Managing Clients](#9-managing-clients)
10. [Exporting and Importing Data](#10-exporting-and-importing-data)
11. [Printing and Saving as PDF](#11-printing-and-saving-as-pdf)

---

## 1. Overview

Meeting Calendar is a recurring meeting schedule viewer. You can track who attends what, when, and how often — then view everything on a clean weekly calendar.

Visit the app at: **[https://calendar-view-app.vercel.app](https://calendar-view-app.vercel.app)**

The app has two pages:

| Page                | What it's for                                   |
| ------------------- | ----------------------------------------------- |
| **Calendar** (home) | See your weekly schedule at a glance            |
| **Editor**          | Add and manage meetings, categories, and people |

Use the **Edit Meetings** button (top-right on the calendar) to go to the editor, and **View Calendar** to come back.

> Your data is saved automatically in your browser. Nothing is uploaded to a server — it stays on your device.

---

## 2. Creating Your First Client

Everything in the app is organized by **client**. A client is just a named workspace — it could be a company, a project, or a team. Each client has its own meetings, categories, and people.

1. Go to the **Editor** page.
2. Click the client dropdown in the top bar (it will say "No clients" if none exist yet).
3. Click **+ New Client**.
4. Type a name (e.g., `Acme Corp`) and click **OK**.

The new client is created and selected automatically. You can have as many clients as you like and switch between them at any time.

---

## 3. Setting Up Categories

Categories let you color-code your meetings so they're easy to tell apart at a glance (e.g., "Standup", "Planning", "1:1").

1. In the editor, find the **Categories** section.
2. Type a category name.
3. Pick a color using the color picker, or hit the randomize button to get a suggestion.
4. Click **Add**.

The category appears as a colored chip. To remove a category, click the **x** on it. If any meetings are using that category, you'll be asked to confirm before it's removed.

---

## 4. Adding People

The **People** section lets you build a roster of attendees. Once added, they appear as options when you create a meeting.

1. In the editor, find the **People** section.
2. Enter a name and an optional role (e.g., `Jane Smith` / `Product Manager`).
3. Click **Add**.

To remove someone, click the **x** on their chip. This only removes them from the roster — it does not update any meetings they're already listed on.

---

## 5. Adding Meetings

1. In the editor, scroll to the **Add / Edit Meeting** form.
2. Fill in the details:

| Field                | What to enter                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Title**            | The name of the meeting (required)                                                                |
| **Days**             | Click the day chips (Mon–Fri) to choose which days it occurs; click **M–F** to select all at once |
| **Cadence**          | How often it repeats: Weekly, Bi-Weekly, Monthly, or One-Time                                     |
| **Category**         | Choose a color-coded category (optional)                                                          |
| **Start / End Time** | The time slot shown on the calendar                                                               |
| **Attendees**        | Pick from your people roster, or type a name and press Enter to add someone on the fly            |
| **Meeting Link**     | A video call URL (optional)                                                                       |
| **Notes**            | Any extra context, agenda items, or details (optional)                                            |

3. Click **Save Meeting**.

The meeting is saved instantly and will appear in the calendar view.

---

## 6. Viewing the Calendar

From the **Calendar** page you'll see a weekly Mon–Fri grid running from 9 AM to 5 PM. Each meeting appears as a color-coded block at its scheduled time. If two meetings overlap on the same day, they're shown side by side.

Below the calendar:

- **Legend** — a color key for your categories, plus a key for cadence types (Weekly, Bi-Weekly, Monthly, One-Time).
- **All Meetings table** — a full list of every meeting with the day, time, title, category, cadence, attendees, and notes.

---

## 7. Filtering by Attendee

You can focus the calendar on a single person to see only their meetings.

1. On the calendar page, click **Filter by attendee** in the top bar.
2. Select a name from the list.

The calendar grid and the meetings table both update immediately to show only meetings that include that person. A label appears in the meetings table to remind you the filter is active.

To clear the filter, open the dropdown again and select the same name to toggle it off.

---

## 8. Editing and Deleting Meetings

### Edit a meeting

1. In the editor, find the meeting in the **Meetings** table.
2. Click the pencil (edit) icon on that row.
3. The form at the top of the page fills in with the meeting's current details.
4. Make your changes and click **Save Meeting**.

### Delete a meeting

1. Click the trash (delete) icon on the meeting's row.
2. Confirm when prompted.

---

## 9. Managing Clients

You can create and manage multiple clients from the client dropdown in the editor's top bar.

| Action                | How to do it                                                       |
| --------------------- | ------------------------------------------------------------------ |
| **Switch client**     | Open the dropdown and click a client name                          |
| **Create new client** | Click **+ New Client** and enter a name                            |
| **Rename a client**   | Hover over a client name in the dropdown and click the pencil icon |
| **Delete a client**   | Hover over a client name and click the trash icon, then confirm    |

Deleting a client removes all of its meetings, categories, and people permanently.

On the **Calendar** page, you can switch between clients but cannot create or edit them — go to the editor for that.

---

## 10. Exporting and Importing Data

Since data is stored in your browser, use export and import to back it up, share it with someone else, or load it into a different browser.

### Export your data

1. In the editor, click the **Data** button in the top bar.
2. Click **Export JSON**.

A file is downloaded to your device containing all meetings, categories, and people for the active client.

### Import data

1. Click **Data** → **Import JSON**.
2. Choose a `.json` file from your device.
3. You'll be asked which client to import into (the name from the file is suggested by default).
4. If that client already has meetings, you'll be asked:
   - **Replace** — wipes the existing data and loads the file's data in.
   - **Merge** — keeps your existing data and adds anything from the file that isn't already there.

### Clear all data

1. Click **Data** → **Clear Data**.
2. Confirm when prompted.

This deletes all meetings, categories, and people for the active client. The client itself remains.

---

## 11. Printing and Saving as PDF

1. On the calendar page, click **Print / PDF** in the top bar.
2. Your browser's print dialog will open.

The toolbar is automatically hidden when printing. The calendar grid prints on the first page (landscape) and the full meetings table follows on the next page.

To save as a PDF instead of printing, choose **Save as PDF** (or **Microsoft Print to PDF**) from your printer list in the dialog.
