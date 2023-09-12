export const slugify = (str) => {
  return str?.length > 0 ? str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') : '';
}
