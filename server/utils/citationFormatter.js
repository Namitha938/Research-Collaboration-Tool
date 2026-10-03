const formatCitation = (metadata) => {
  const { authors, title, publicationYear, journal, conference, publisher, citationStyle } = metadata;

  // Basic formatter logic
  const authorStr = authors && authors.length > 0 ? authors.join(', ') : 'Unknown Author';
  const yearStr = publicationYear ? publicationYear.toString() : 'n.d.';
  const titleStr = title || 'Unknown Title';
  const venueStr = journal || conference || publisher || '';

  switch (citationStyle) {
    case 'APA': {
      // APA: Author, A. A. (2025). Title of paper. Journal Name.
      return `${authorStr}. (${yearStr}). ${titleStr}.${venueStr ? ' ' + venueStr + '.' : ''}`;
    }
    case 'MLA': {
      // MLA: Author. "Title of Paper." Journal Name, 2025.
      return `${authorStr}. "${titleStr}."${venueStr ? ' ' + venueStr + ',' : ''} ${yearStr}.`;
    }
    case 'IEEE': {
      // IEEE: A. Author, "Title of paper," Journal Name, 2025.
      return `${authorStr}, "${titleStr},"${venueStr ? ' ' + venueStr + ',' : ''} ${yearStr}.`;
    }
    case 'Chicago': {
      // Chicago: Author. "Title of Paper." Journal Name. 2025.
      return `${authorStr}. "${titleStr}."${venueStr ? ' ' + venueStr + '.' : ''} ${yearStr}.`;
    }
    default:
      // Fallback
      return `${authorStr}. (${yearStr}). ${titleStr}.${venueStr ? ' ' + venueStr + '.' : ''}`;
  }
};

module.exports = {
  formatCitation
};
