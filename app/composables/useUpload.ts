// Upload image files to the server and get back their stored URLs.
// Setting Content-Type to undefined lets the browser set the multipart boundary.
export const useUpload = () => {
  const { $axios } = useNuxtApp();

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await $axios.post("/upload-image", fd, {
      headers: { "Content-Type": undefined },
    });
    return res.data?.data?.url as string;
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));
    const res = await $axios.post("/upload-images", fd, {
      headers: { "Content-Type": undefined },
    });
    return (res.data?.data?.urls ?? []) as string[];
  };

  return { uploadImage, uploadImages };
};
