/**
 * Deferred upload helper (client side)
 *
 * আগে: ছবি select করলেই cloud + database এ save হয়ে যেত, form submit না করলেও থেকে যেত।
 * এখন: select করলে শুধু browser এ preview (blob URL) থাকে। Form submit এর সময়
 *       ছবিগুলো upload হয়, তারপর data save হয়। Save fail করলে upload হওয়া ছবি মুছে ফেলা হয়।
 */
import { deleteMediaAction, uploadMediaAction } from "./actions";
import type { MediaModelName } from "./types";

/** Backend এ যে shape এ যায় */
export type SavedImage = { id: number; url: string };

/**
 * Form এর ভিতরে থাকা একটা ছবি।
 * - Server এ আছে: { id, url }
 * - এখনো upload হয়নি: { id (negative temp), url (blob preview), file }
 */
export type ImageItem = SavedImage & { file?: File };

let tempSeq = 0;

/** File select এর পর form এ বসানোর জন্য। id negative, যাতে server id এর সাথে না মেলে */
export function createPendingImage(file: File): ImageItem {
  tempSeq += 1;
  return { id: -tempSeq, url: URL.createObjectURL(file), file };
}

export const isPendingImage = (img?: ImageItem | null): boolean => !!img?.file;

/** Pending ছবির blob URL মুক্ত করে (server এর ছবির উপর কিছু করে না) */
export function revokePendingImage(img?: ImageItem | null) {
  if (img?.file) URL.revokeObjectURL(img.url);
}

type UploadContext = {
  modelName: MediaModelName;
  modelId?: number;
  folder?: string;
};

/**
 * একটা submit এর upload গুলো এক জায়গায় ধরে রাখে,
 * যাতে save fail করলে সব একসাথে rollback করা যায়।
 */
export function createUploadSession(ctx: UploadContext) {
  const uploadedIds: number[] = [];

  async function uploadOne(item: ImageItem): Promise<SavedImage> {
    // আগে থেকেই server এ আছে, আবার upload লাগবে না
    if (!item.file) return { id: item.id, url: item.url };

    const fd = new FormData();
    fd.append("file", item.file);
    fd.append("model_name", ctx.modelName);
    if (ctx.modelId != null) fd.append("model_id", String(ctx.modelId));
    if (ctx.folder) fd.append("folder", ctx.folder);

    const res = await uploadMediaAction(fd);
    if (!res.success || !res.media) {
      throw new Error(`${item.file.name}: ${res.message || "Upload failed"}`);
    }
    uploadedIds.push(res.media.id);
    return { id: res.media.id, url: res.media.public_url };
  }

  return {
    /**
     * সব ছবি upload করে, একই order এ { id, url } ফেরত দেয়।
     * একটাও fail করলে বাকি চলতে থাকা upload শেষ হওয়ার পর error throw করে
     * (তখন rollback() ডাকলে সব মুছে যাবে)।
     */
    async resolveMany(items: ImageItem[]): Promise<SavedImage[]> {
      const results = await Promise.allSettled(items.map(uploadOne));
      const failed = results.find((r): r is PromiseRejectedResult => r.status === "rejected");
      if (failed) {
        throw failed.reason instanceof Error ? failed.reason : new Error("Image upload failed");
      }
      return results.map((r) => (r as PromiseFulfilledResult<SavedImage>).value);
    },

    /** এই session এ যা upload হয়েছে সব মুছে ফেলে (save fail হলে) */
    async rollback() {
      const ids = uploadedIds.splice(0);
      await Promise.allSettled(ids.map((id) => deleteMediaAction(id)));
    },
  };
}

/**
 * Edit এ save সফল হওয়ার পর, যে পুরনো ছবি আর ব্যবহার হচ্ছে না সেগুলো server থেকে মুছে।
 * Best effort: না মুছলেও save এর result বদলায় না।
 */
export async function deleteRemovedMedia(originalIds: number[], finalIds: number[]) {
  const keep = new Set(finalIds);
  const removed = originalIds.filter((id) => id > 0 && !keep.has(id));
  await Promise.allSettled(removed.map((id) => deleteMediaAction(id)));
}

/* ------------------------------------------------------------------ */
/* Helpers: সব form এ একই pattern যাতে বারবার না লিখতে হয়            */
/* ------------------------------------------------------------------ */

export type UploadSession = ReturnType<typeof createUploadSession>;

/** Server এ থাকা ছবির { url, id } থেকে form item বানায়। url না থাকলে null (মানে ছবি নেই)। */
export function toImageItem(url?: string | null, id?: number | null): ImageItem | null {
  return url ? { id: id ?? 0, url } : null;
}

/** Form বন্ধ হলে upload না হওয়া সব ছবির blob URL মুক্ত করে */
export function revokePendingImages(items: Array<ImageItem | null | undefined>) {
  items.forEach((img) => {
    if (isPendingImage(img)) revokePendingImage(img);
  });
}

/** Server এ সত্যিই আছে (id > 0) এমন ছবির id গুলো */
export function savedIds(items: Array<{ id: number } | null | undefined>): number[] {
  return items.map((i) => i?.id).filter((id): id is number => typeof id === "number" && id > 0);
}

/**
 * ছবি upload + save একসাথে:
 *   run() এর ভিতরে session.resolveMany() দিয়ে ছবি upload করো, তারপর save action ডাকো।
 *   - run() throw করলে, বা { success: false } ফেরত দিলে, এই session এর upload হওয়া সব ছবি মুছে যায়।
 *   - success হলে কিছু মুছে না (ছবিগুলো এখন record এ ব্যবহার হচ্ছে)।
 * Throw হলে error আবার throw করে, caller toast দেখাবে।
 */
export async function withUploadSession<R extends { success: boolean }>(
  ctx: UploadContext,
  run: (session: UploadSession) => Promise<R>,
): Promise<R> {
  const session = createUploadSession(ctx);
  try {
    const res = await run(session);
    if (!res.success) await session.rollback();
    return res;
  } catch (err) {
    await session.rollback();
    throw err;
  }
}
