-- CreateTable
CREATE TABLE "invoice_counters" (
    "id" SERIAL NOT NULL,
    "firmId" INTEGER NOT NULL,
    "invoiceType" "InvoiceType" NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_counters_firmId_invoiceType_year_key" ON "invoice_counters"("firmId", "invoiceType", "year");
