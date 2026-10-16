/**
 * Mengubah URL video (Google Drive, YouTube, dll.) menjadi URL embed siap pakai untuk <iframe>
 * Mendukung format share link Google Drive, preview link, dan link YouTube biasa/pendek.
 */
export function formatVideoEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const cleanUrl = url.trim();

  // 1. Google Drive Sharing Link
  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Format 2: https://drive.google.com/file/d/FILE_ID/preview
  const gDriveMatch1 = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch1 && gDriveMatch1[1]) {
    return `https://drive.google.com/file/d/${gDriveMatch1[1]}/preview`;
  }

  // Format 3: https://drive.google.com/open?id=FILE_ID
  const gDriveMatch2 = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (cleanUrl.includes('drive.google.com') && gDriveMatch2 && gDriveMatch2[1]) {
    return `https://drive.google.com/file/d/${gDriveMatch2[1]}/preview`;
  }

  // 2. YouTube Link
  // Format: https://www.youtube.com/watch?v=VIDEO_ID atau https://youtu.be/VIDEO_ID
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  return cleanUrl;
}

