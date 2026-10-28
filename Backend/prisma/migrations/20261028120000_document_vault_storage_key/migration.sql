-- AlterTable
ALTER TABLE "document_vaults" ADD COLUMN     "storageKey" TEXT,
ADD COLUMN     "uploadedByClientId" INTEGER,
ALTER COLUMN "uploadedBy" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "document_vaults" ADD CONSTRAINT "document_vaults_uploadedByClientId_fkey" FOREIGN KEY ("uploadedByClientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

