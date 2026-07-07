/*
  Warnings:

  - Added the required column `folder_id` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "links" ADD COLUMN     "folder_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "links_folder_id_idx" ON "links"("folder_id");

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
