-- AlterTable
ALTER TABLE "products" ADD COLUMN     "edited_at" TIMESTAMP(3),
ADD COLUMN     "popularity" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "products_popularity_idx" ON "products"("popularity");
