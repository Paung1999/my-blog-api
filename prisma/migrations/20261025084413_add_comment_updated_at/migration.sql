-- AlterTable
ALTER TABLE "Comment" ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "Comment" SET "updatedAt" = "createdAt";

ALTER TABLE "Comment" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "updatedAt" DROP DEFAULT;