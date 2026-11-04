// Topic groups point at the sections of the concept notes that explain them. The link carries the exact heading text,
// so adding a section to a note never moves a link to a different section.
export function studyLinksFor(manifest, track, group, prefix = 'pages/') {
  const entries = manifest?.tracks?.[track]?.studyLinks?.[group] || [];
  const notes = manifest?.notes || [];
  return entries
    .map(({noteId, section}) => {
      const note = notes.find((n) => n.id === noteId);
      if (!note?.file) {
        return null;
      }
      return {
        label: note.title + ' · ' + section,
        short: section.split('.')[0],
        href: prefix + 'concepts.html?note=' + encodeURIComponent(noteId) + '&section=' + encodeURIComponent(section),
      };
    })
    .filter(Boolean);
}

// Finds the table-of-contents entry whose heading equals the requested section exactly.
export function findSectionId(toc, section) {
  return (section && toc.find((item) => item.text === section)?.id) || null;
}
