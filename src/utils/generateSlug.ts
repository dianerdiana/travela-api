export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // Mengganti spasi dengan tanda hubung
    .replace(/[^\w-]+/g, "") // Menghapus karakter non-alphanumeric
    .replace(/--+/g, "-") // Mengganti tanda hubung berlebih
    .replace(/^-+/, "") // Menghapus tanda hubung di awal
    .replace(/-+$/, ""); // Menghapus tanda hubung di akhir
};
