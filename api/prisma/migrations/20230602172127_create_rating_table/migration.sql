-- CreateTable
CREATE TABLE "Rating" (
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("productId","userId")
);

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
