export const slugify = (str: string) => {
  return str?.length > 0 ? str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') : '';
}

export const numToRevArray = (num: number) => {
  return Array(num).fill(0).map((x,i)=>i).reverse();
}
