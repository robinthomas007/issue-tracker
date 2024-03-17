/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attachment_url_key" ON "Attachment"("url");
