# TODO: Implement Enhancements to Add New Client Page

## Tasks to Complete:
- [x] Update Client interface in `bookme/src/types/index.ts` to add `videos: string[];`
- [x] In `bookme/src/app/admin/client/new/page.tsx`:
  - [x] Add `videos: string[];` to formData state
  - [x] Add handlers for adding, updating, and removing videos (addVideo, updateVideo, removeVideo)
  - [x] Update handleSubmit to include videos in client data
  - [x] Change section title from "Work Photos" to "How It’s Done"
  - [x] Add video upload subsection under "How It’s Done" with "Add Video" button and input fields for URL and file upload (accept="video/*")
  - [x] Keep existing photo upload feature intact
