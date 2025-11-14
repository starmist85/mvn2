import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  releases: router({
    getAll: publicProcedure.query(async () => {
      const { getAllReleases } = await import("./db");
      return await getAllReleases();
    }),
    getLatest: publicProcedure.input(z.number().optional()).query(async ({ input }) => {
      const { getLatestReleases } = await import("./db");
      return await getLatestReleases(input || 5);
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      const { getReleaseById } = await import("./db");
      return await getReleaseById(input);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        artist: z.string(),
        releaseDate: z.date(),
        description: z.string().optional(),
        format: z.enum(["Digital Album", "Digital Single", "Digital USB Stick", "CD Single", "CD Album", "Vinyl Album", "Vinyl Single", "Cassette"]),
        imageUrl: z.string().optional(),
        audioPreviewUrl: z.string().optional(),
        youtubeLink: z.string().optional(),
        spotifyLink: z.string().optional(),
        appleMusicLink: z.string().optional(),
        storeLink: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { createRelease } = await import("./db");
        return await createRelease(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        artist: z.string().optional(),
        releaseDate: z.date().optional(),
        description: z.string().optional(),
        format: z.enum(["Digital Album", "Digital Single", "Digital USB Stick", "CD Single", "CD Album", "Vinyl Album", "Vinyl Single", "Cassette"]).optional(),
        imageUrl: z.string().optional(),
        audioPreviewUrl: z.string().optional(),
        youtubeLink: z.string().optional(),
        spotifyLink: z.string().optional(),
        appleMusicLink: z.string().optional(),
        storeLink: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { id, ...data } = input;
        const { updateRelease } = await import("./db");
        await updateRelease(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { deleteRelease } = await import("./db");
        await deleteRelease(input);
        return { success: true };
      }),
  }),

  tracks: router({
    getByReleaseId: publicProcedure.input(z.number()).query(async ({ input }) => {
      const { getTracksByReleaseId } = await import("./db");
      return await getTracksByReleaseId(input);
    }),
    create: protectedProcedure
      .input(z.object({
        releaseId: z.number(),
        trackNumber: z.number(),
        artist: z.string(),
        title: z.string(),
        length: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { createTrack } = await import("./db");
        return await createTrack(input);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { deleteTrack } = await import("./db");
        await deleteTrack(input);
        return { success: true };
      }),
  }),

  news: router({
    getAll: publicProcedure.query(async () => {
      const { getAllNews } = await import("./db");
      return await getAllNews();
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input }) => {
      const { getNewsById } = await import("./db");
      return await getNewsById(input);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        imageUrl: z.string().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { createNews } = await import("./db");
        return await createNews(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { id, ...data } = input;
        const { updateNews } = await import("./db");
        await updateNews(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        const { deleteNews } = await import("./db");
        await deleteNews(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
